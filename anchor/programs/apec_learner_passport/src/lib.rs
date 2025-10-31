use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{burn, mint_to, Burn, Mint, MintTo, Token, TokenAccount},
};

declare_id!("CTY5CyBk3JkGkqRLsAyqFp4V1RDdSabWTsT5uC1PANzw");

#[program]
pub mod apec_learner_passport {
    use super::*;

    /// Initialize the issuer registry with the authority
    pub fn initialize_issuer_registry(ctx: Context<InitializeIssuerRegistry>) -> Result<()> {
        let issuer_registry = &mut ctx.accounts.issuer_registry;
        issuer_registry.authority = ctx.accounts.authority.key();
        issuer_registry.verified_issuers = Vec::new();
        issuer_registry.bump = ctx.bumps.issuer_registry;

        msg!("Issuer registry initialized");
        Ok(())
    }

    /// Add a verified issuer to the registry (only authority can call)
    pub fn add_verified_issuer(ctx: Context<AddVerifiedIssuer>, issuer: Pubkey) -> Result<()> {
        let issuer_registry = &mut ctx.accounts.issuer_registry;

        require!(
            !issuer_registry.verified_issuers.contains(&issuer),
            ErrorCode::IssuerAlreadyExists
        );

        require!(
            issuer_registry.verified_issuers.len() < 10,
            ErrorCode::IssuerRegistryFull
        );

        issuer_registry.verified_issuers.push(issuer);

        msg!("Verified issuer added: {}", issuer);
        Ok(())
    }

    /// Remove a verified issuer from the registry (only authority can call)
    pub fn remove_verified_issuer(
        ctx: Context<RemoveVerifiedIssuer>,
        issuer: Pubkey,
    ) -> Result<()> {
        let issuer_registry = &mut ctx.accounts.issuer_registry;

        issuer_registry.verified_issuers.retain(|&x| x != issuer);

        msg!("Verified issuer removed: {}", issuer);
        Ok(())
    }

    /// Mint a credential NFT to a student's wallet
    pub fn mint_credential(
        ctx: Context<MintCredential>,
        credential_type: u8,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        // Verify the issuer is in the verified list
        let issuer_registry = &ctx.accounts.issuer_registry;
        require!(
            issuer_registry
                .verified_issuers
                .contains(&ctx.accounts.issuer.key()),
            ErrorCode::UnauthorizedIssuer
        );

        // Validate credential type
        require!(
            credential_type <= 2, // 0=Course, 1=Degree, 2=Skill Badge
            ErrorCode::InvalidCredentialType
        );

        // Validate string lengths
        require!(name.len() <= 32, ErrorCode::NameTooLong);
        require!(symbol.len() <= 10, ErrorCode::SymbolTooLong);
        require!(uri.len() <= 64, ErrorCode::UriTooLong);

        // Mint 1 token to the student's token account
        let credential_mint_key = ctx.accounts.credential_mint.key();
        let mint_seeds = &[b"mint", credential_mint_key.as_ref(), &[ctx.bumps.mint]];
        let signer = &[&mint_seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.mint.to_account_info(),
            },
            signer,
        );

        mint_to(cpi_context, 1)?;

        // Store credential information
        let credential_mint = &mut ctx.accounts.credential_mint;
        credential_mint.authority = issuer_registry.authority;
        credential_mint.student = ctx.accounts.student.key();
        credential_mint.mint = ctx.accounts.mint.key();
        credential_mint.credential_type = credential_type;
        credential_mint.issued_at = Clock::get()?.unix_timestamp;
        credential_mint.issuer = ctx.accounts.issuer.key();
        credential_mint.is_revoked = false;
        credential_mint.name = name;
        credential_mint.symbol = symbol;
        credential_mint.uri = uri;
        credential_mint.bump = ctx.bumps.credential_mint;

        msg!(
            "Credential minted to student: {} by issuer: {}",
            ctx.accounts.student.key(),
            ctx.accounts.issuer.key()
        );

        Ok(())
    }

    /// Revoke a credential (burn the NFT)
    pub fn revoke_credential(ctx: Context<RevokeCredential>) -> Result<()> {
        // Mark as revoked
        let credential_mint = &mut ctx.accounts.credential_mint;
        credential_mint.is_revoked = true;

        // Burn the token
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.student.to_account_info(),
            },
        );

        burn(cpi_context, 1)?;

        msg!("Credential revoked: {}", ctx.accounts.mint.key());
        Ok(())
    }
}

// ========================================
// Account Structures
// ========================================

#[derive(Accounts)]
pub struct InitializeIssuerRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + IssuerRegistry::INIT_SPACE,
        seeds = [b"issuer-registry"],
        bump
    )]
    pub issuer_registry: Account<'info, IssuerRegistry>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddVerifiedIssuer<'info> {
    #[account(
        mut,
        seeds = [b"issuer-registry"],
        bump = issuer_registry.bump,
        has_one = authority
    )]
    pub issuer_registry: Account<'info, IssuerRegistry>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RemoveVerifiedIssuer<'info> {
    #[account(
        mut,
        seeds = [b"issuer-registry"],
        bump = issuer_registry.bump,
        has_one = authority
    )]
    pub issuer_registry: Account<'info, IssuerRegistry>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct MintCredential<'info> {
    #[account(
        init,
        payer = issuer,
        space = 8 + CredentialMint::INIT_SPACE,
        seeds = [b"credential", issuer.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub credential_mint: Account<'info, CredentialMint>,

    #[account(
        seeds = [b"issuer-registry"],
        bump = issuer_registry.bump
    )]
    pub issuer_registry: Account<'info, IssuerRegistry>,

    #[account(
        init,
        payer = issuer,
        mint::decimals = 0,
        mint::authority = mint,
        seeds = [b"mint", credential_mint.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = issuer,
        associated_token::mint = mint,
        associated_token::authority = student,
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: Student wallet receiving the credential
    pub student: SystemAccount<'info>,

    #[account(mut)]
    pub issuer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct RevokeCredential<'info> {
    #[account(
        mut,
        seeds = [b"credential", issuer.key().as_ref(), student.key().as_ref()],
        bump = credential_mint.bump,
        has_one = issuer,
        has_one = mint,
        has_one = student
    )]
    pub credential_mint: Account<'info, CredentialMint>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,

    pub issuer: Signer<'info>,

    /// CHECK: Student account for validation
    pub student: SystemAccount<'info>,

    pub token_program: Program<'info, Token>,
}

// ========================================
// State Accounts
// ========================================

#[account]
#[derive(InitSpace)]
pub struct IssuerRegistry {
    pub authority: Pubkey,
    #[max_len(10)]
    pub verified_issuers: Vec<Pubkey>,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct CredentialMint {
    pub authority: Pubkey,
    pub student: Pubkey,
    pub mint: Pubkey,
    pub credential_type: u8,
    pub issued_at: i64,
    pub issuer: Pubkey,
    pub is_revoked: bool,
    #[max_len(32)]
    pub name: String,
    #[max_len(10)]
    pub symbol: String,
    #[max_len(64)]
    pub uri: String,
    pub bump: u8,
}

// ========================================
// Error Codes
// ========================================

#[error_code]
pub enum ErrorCode {
    #[msg("Issuer already exists in the registry")]
    IssuerAlreadyExists,

    #[msg("Unauthorized issuer - not in verified registry")]
    UnauthorizedIssuer,

    #[msg("Credential has been revoked")]
    CredentialRevoked,

    #[msg("Invalid credential type")]
    InvalidCredentialType,

    #[msg("Issuer registry is full (max 10 issuers)")]
    IssuerRegistryFull,

    #[msg("Name too long (max 32 characters)")]
    NameTooLong,

    #[msg("Symbol too long (max 10 characters)")]
    SymbolTooLong,

    #[msg("URI too long (max 64 characters)")]
    UriTooLong,
}

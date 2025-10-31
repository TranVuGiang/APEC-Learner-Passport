import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import fs from "fs";
import path from "path";
import IDL_JSON from "../src/lib/idl.json";

/**
 * Initialize the issuer registry (one-time setup)
 * This must be run before any credentials can be minted
 *
 * Usage: npx tsx scripts/initialize-registry.ts
 */

async function initializeRegistry() {
  try {
    // Load keypair from Solana CLI default location
    const keypairPath = path.join(
      process.env.HOME || "",
      ".config/solana/id.json"
    );

    if (!fs.existsSync(keypairPath)) {
      console.error("❌ Keypair not found at:", keypairPath);
      console.error("   Run: solana-keygen new");
      process.exit(1);
    }

    const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
    const authority = Keypair.fromSecretKey(new Uint8Array(keypairData));

    console.log("🔑 Authority wallet:", authority.publicKey.toString());

    // Connect to localnet
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8899";
    const connection = new Connection(rpcUrl, "confirmed");

    console.log("🌐 Connecting to:", rpcUrl);

    // Check balance
    const balance = await connection.getBalance(authority.publicKey);
    console.log(`💰 Balance: ${balance / 1e9} SOL`);

    if (balance === 0) {
      console.log("🚰 Requesting airdrop...");
      const sig = await connection.requestAirdrop(authority.publicKey, 10e9);
      await connection.confirmTransaction(sig);
      console.log("✅ Airdrop successful");
    }

    // Setup Anchor
    const wallet = new Wallet(authority);
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    const programId = new PublicKey(
      process.env.NEXT_PUBLIC_PROGRAM_ID ||
        "CTY5CyBk3JkGkqRLsAyqFp4V1RDdSabWTsT5uC1PANzw"
    );

    const program = new Program(IDL_JSON as any, provider);

    console.log("📋 Program ID:", programId.toString());

    // Derive issuer registry PDA
    const [issuerRegistryPDA, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("issuer-registry")],
      programId
    );

    console.log("📍 Issuer Registry PDA:", issuerRegistryPDA.toString());

    // Check if already initialized
    try {
      const registryAccount = await program.account.issuerRegistry.fetch(
        issuerRegistryPDA
      );
      console.log("✅ Registry already initialized!");
      console.log("   Authority:", registryAccount.authority.toString());
      console.log("   Verified Issuers:", registryAccount.verifiedIssuers.length);
      return;
    } catch (err) {
      console.log("📝 Registry not initialized yet. Initializing...");
    }

    // Initialize the registry
    const tx = await program.methods
      .initializeIssuerRegistry()
      .accounts({
        issuerRegistry: issuerRegistryPDA,
        authority: authority.publicKey,
        systemProgram: PublicKey.default,
      })
      .rpc();

    console.log("✅ Registry initialized successfully!");
    console.log("   Transaction:", tx);
    console.log("   Registry PDA:", issuerRegistryPDA.toString());
    console.log("\n📌 Next step: Add verified issuers using add-issuer.ts");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.logs) {
      console.error("Logs:", error.logs);
    }
    process.exit(1);
  }
}

initializeRegistry();

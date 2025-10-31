import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import fs from "fs";
import path from "path";
import IDL_JSON from "../src/lib/idl.json";

/**
 * Add a verified issuer to the registry
 * Only the registry authority can run this
 *
 * Usage: npx tsx scripts/add-issuer.ts <ISSUER_WALLET_ADDRESS>
 * Example: npx tsx scripts/add-issuer.ts 7xKzL8QFP...
 */

async function addIssuer() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Usage: npx tsx scripts/add-issuer.ts <ISSUER_WALLET_ADDRESS>");
    console.error("Example: npx tsx scripts/add-issuer.ts 7xKzL8QFP...");
    process.exit(1);
  }

  try {
    const issuerAddress = args[0];
    let issuerPubkey: PublicKey;

    try {
      issuerPubkey = new PublicKey(issuerAddress);
    } catch {
      console.error("❌ Invalid wallet address");
      process.exit(1);
    }

    // Load authority keypair
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
    console.log("➕ Adding issuer:", issuerPubkey.toString());

    // Connect
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8899";
    const connection = new Connection(rpcUrl, "confirmed");

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

    // Derive issuer registry PDA
    const [issuerRegistryPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("issuer-registry")],
      programId
    );

    console.log("📍 Issuer Registry PDA:", issuerRegistryPDA.toString());

    // Check current state
    try {
      const registryAccount = await program.account.issuerRegistry.fetch(
        issuerRegistryPDA
      );
      console.log("📋 Current verified issuers:", registryAccount.verifiedIssuers.length);

      // Check if already added
      const alreadyExists = registryAccount.verifiedIssuers.some((issuer: any) =>
        issuer.equals(issuerPubkey)
      );

      if (alreadyExists) {
        console.log("✅ Issuer already verified!");
        return;
      }
    } catch (err) {
      console.error("❌ Registry not initialized. Run initialize-registry.ts first");
      process.exit(1);
    }

    // Add issuer
    console.log("📝 Adding issuer to registry...");

    const tx = await program.methods
      .addVerifiedIssuer(issuerPubkey)
      .accounts({
        issuerRegistry: issuerRegistryPDA,
        authority: authority.publicKey,
      })
      .rpc();

    console.log("✅ Issuer added successfully!");
    console.log("   Transaction:", tx);
    console.log("   Issuer:", issuerPubkey.toString());
    console.log("\n🎉 This wallet can now mint credentials!");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.logs) {
      console.error("Logs:", error.logs);
    }
    process.exit(1);
  }
}

addIssuer();

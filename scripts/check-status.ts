import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import IDL_JSON from "../src/lib/idl.json";

/**
 * Check the status of the issuer registry
 * Usage: npx tsx scripts/check-status.ts
 */

async function checkStatus() {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8899";
    const connection = new Connection(rpcUrl, "confirmed");

    console.log("🌐 Network:", rpcUrl);

    // Create a dummy wallet for read-only operations
    const dummyKeypair = Keypair.generate();
    const wallet = new Wallet(dummyKeypair);
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
    const [issuerRegistryPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("issuer-registry")],
      programId
    );

    console.log("📍 Issuer Registry PDA:", issuerRegistryPDA.toString());
    console.log("");

    // Try to fetch registry
    try {
      const registryAccount = await program.account.issuerRegistry.fetch(
        issuerRegistryPDA
      );

      console.log("✅ Registry Status: INITIALIZED");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👤 Authority:", registryAccount.authority.toString());
      console.log("🔢 Bump:", registryAccount.bump);
      console.log("");
      console.log("👥 Verified Issuers:", registryAccount.verifiedIssuers.length);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      if (registryAccount.verifiedIssuers.length > 0) {
        registryAccount.verifiedIssuers.forEach((issuer: any, index: number) => {
          console.log(`   ${index + 1}. ${issuer.toString()}`);
        });
      } else {
        console.log("   (No issuers added yet)");
      }

      console.log("");
      console.log("💡 Next steps:");
      if (registryAccount.verifiedIssuers.length === 0) {
        console.log("   → Add issuers: npx tsx scripts/add-issuer.ts <WALLET_ADDRESS>");
      } else {
        console.log("   → You can now mint credentials from the website!");
      }
    } catch (err) {
      console.log("❌ Registry Status: NOT INITIALIZED");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("");
      console.log("💡 Next steps:");
      console.log("   1. Initialize registry: npx tsx scripts/initialize-registry.ts");
      console.log("   2. Add issuers: npx tsx scripts/add-issuer.ts <WALLET_ADDRESS>");
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkStatus();

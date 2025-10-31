import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

/**
 * Airdrop SOL to a wallet on localnet/devnet
 * Usage: npx tsx scripts/airdrop.ts <WALLET_ADDRESS> <AMOUNT>
 */

async function airdrop() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Usage: npx tsx scripts/airdrop.ts <WALLET_ADDRESS> [AMOUNT_SOL]");
    console.error("Example: npx tsx scripts/airdrop.ts 7xKzL... 10");
    process.exit(1);
  }

  const walletAddress = args[0];
  const amount = args[1] ? parseFloat(args[1]) : 10; // Default 10 SOL

  try {
    const publicKey = new PublicKey(walletAddress);
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8899";
    const connection = new Connection(rpcUrl, "confirmed");

    console.log(`🚰 Requesting airdrop of ${amount} SOL...`);
    console.log(`   To: ${publicKey.toString()}`);
    console.log(`   Network: ${rpcUrl}`);

    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );

    console.log(`⏳ Confirming transaction...`);
    await connection.confirmTransaction(signature);

    const balance = await connection.getBalance(publicKey);
    console.log(`✅ Airdrop successful!`);
    console.log(`   Transaction: ${signature}`);
    console.log(`   New balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  } catch (error: any) {
    console.error("❌ Airdrop failed:", error.message);
    process.exit(1);
  }
}

airdrop();

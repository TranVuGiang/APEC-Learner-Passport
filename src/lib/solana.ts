import { Connection, clusterApiUrl, Cluster } from "@solana/web3.js";

// Get the network from environment or default to devnet
const networkEnv = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
export const SOLANA_NETWORK = networkEnv === "localhost" ? "devnet" : (networkEnv as Cluster);

// Get custom RPC URL or use default cluster URL
export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ||
  (networkEnv === "localhost" ? "http://127.0.0.1:8899" : clusterApiUrl(SOLANA_NETWORK));

// Create connection instance
export const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// Program ID (placeholder - will be updated after deployment)
export const PROGRAM_ID =
  process.env.NEXT_PUBLIC_PROGRAM_ID ||
  "GZVHk1Uvxrmht59YRNUVsXph8b7iL8LbsGweP93dT9UX";

// Helper function to get Solana Explorer URL
export function getExplorerUrl(
  address: string,
  type: "address" | "tx" = "address"
): string {
  const baseUrl =
    SOLANA_NETWORK === "mainnet-beta"
      ? "https://explorer.solana.com"
      : `https://explorer.solana.com?cluster=${SOLANA_NETWORK}`;

  return type === "tx"
    ? `${baseUrl}/tx/${address}`
    : `${baseUrl}/address/${address}`;
}

// Helper function to truncate public key for display
export function truncatePublicKey(publicKey: string, chars = 4): string {
  return `${publicKey.slice(0, chars)}...${publicKey.slice(-chars)}`;
}

// Helper to confirm transaction
export async function confirmTransaction(signature: string): Promise<boolean> {
  try {
    const { value } = await connection.confirmTransaction(signature, "confirmed");
    if (value.err) {
      console.error("Transaction failed:", value.err);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error confirming transaction:", error);
    return false;
  }
}

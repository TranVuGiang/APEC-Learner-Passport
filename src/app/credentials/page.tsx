"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { connection } from "@/lib/solana";
import { getProgram, getCredentialMintPDA } from "@/lib/anchor-setup";
import { Credential } from "@/lib/types";
import { CredentialCard } from "@/components/CredentialCard";

export default function CredentialsPage() {
  const { connected, publicKey, wallet } = useWallet();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (connected && publicKey && wallet) {
      fetchCredentials();
    }
  }, [connected, publicKey, wallet]);

  const fetchCredentials = async () => {
    if (!publicKey || !wallet) return;

    setLoading(true);
    setError("");

    try {
      const program = getProgram(connection, wallet.adapter as any);

      // Fetch all credential accounts where student = publicKey
      // Note: This is a simplified approach. In production, you'd want to index these
      const allAccounts = await (program.account as any).credentialMint.all();

      const userCredentials: Credential[] = allAccounts
        .filter((account: any) => account.account.student.equals(publicKey))
        .map((account: any) => ({
          mint: account.account.mint,
          student: account.account.student,
          issuer: account.account.issuer,
          credentialType: account.account.credentialType,
          issuedAt: account.account.issuedAt.toNumber(),
          isRevoked: account.account.isRevoked,
          name: account.account.name,
          symbol: account.account.symbol,
          uri: account.account.uri,
        }));

      setCredentials(userCredentials);
      setError(""); // Clear any previous errors on success
    } catch (err: any) {
      console.error("Error fetching credentials:", err);

      // Provide more specific error messages
      if (err.message?.includes("failed to get account")) {
        setError(
          "Program not found. Make sure your localnet is running (anchor localnet) and the program is deployed."
        );
      } else if (err.message?.includes("Invalid params")) {
        setError(
          "Unable to connect to Solana network. Check your RPC URL configuration."
        );
      } else {
        setError(
          `Error fetching credentials: ${err.message || "Unknown error"}. Make sure the program is deployed and initialized.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            My Credentials
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Please connect your wallet to view your credentials
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="text-yellow-800 dark:text-yellow-200">
              Connect your wallet using the button in the navigation bar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              My Credentials
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View all credentials issued to your wallet
            </p>
          </div>
          <button
            onClick={fetchCredentials}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : credentials.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              No Credentials Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You haven't received any credentials yet. Once an institution issues a credential to your wallet, it will appear here.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> Share your wallet address with educational institutions to receive credentials
              </p>
              <div className="mt-3 p-2 bg-white dark:bg-gray-700 rounded border border-blue-200 dark:border-blue-700">
                <code className="text-xs break-all text-gray-800 dark:text-gray-200">
                  {publicKey?.toString()}
                </code>
              </div>
              <button
                onClick={() => {
                  if (publicKey) {
                    navigator.clipboard.writeText(publicKey.toString());
                    alert("Wallet address copied!");
                  }
                }}
                className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Copy Address
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600 dark:text-gray-300">
              Found {credentials.length} credential{credentials.length !== 1 ? "s" : ""}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credentials.map((credential, index) => (
                <CredentialCard key={index} credential={credential} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

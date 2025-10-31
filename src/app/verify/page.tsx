"use client";

import { useState, FormEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { connection, getExplorerUrl, truncatePublicKey } from "@/lib/solana";
import { getProgram } from "@/lib/anchor-setup";
import { CREDENTIAL_TYPE_LABELS, CredentialType } from "@/lib/types";

interface CredentialInfo {
  authority: PublicKey;
  student: PublicKey;
  mint: PublicKey;
  credentialType: number;
  issuedAt: number;
  issuer: PublicKey;
  isRevoked: boolean;
  name: string;
  symbol: string;
  uri: string;
}

export default function VerifyPage() {
  const { wallet } = useWallet();
  const [credentialAddress, setCredentialAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentialInfo, setCredentialInfo] = useState<CredentialInfo | null>(null);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setCredentialInfo(null);

    if (!credentialAddress.trim()) {
      setError("Please enter a credential address");
      return;
    }

    try {
      setLoading(true);

      // Validate address
      let credentialPubkey: PublicKey;
      try {
        credentialPubkey = new PublicKey(credentialAddress);
      } catch {
        setError("Invalid credential address");
        setLoading(false);
        return;
      }

      // Fetch credential data from blockchain
      // For now, we'll demonstrate by trying to fetch the account
      // In production with deployed program, this would work
      if (wallet) {
        const program = getProgram(connection, wallet.adapter as any);

        try {
          const credentialAccount = await (program.account as any).credentialMint.fetch(credentialPubkey);

          setCredentialInfo({
            authority: credentialAccount.authority,
            student: credentialAccount.student,
            mint: credentialAccount.mint,
            credentialType: credentialAccount.credentialType,
            issuedAt: credentialAccount.issuedAt.toNumber(),
            issuer: credentialAccount.issuer,
            isRevoked: credentialAccount.isRevoked,
            name: credentialAccount.name,
            symbol: credentialAccount.symbol,
            uri: credentialAccount.uri,
          });
        } catch (err) {
          setError("Credential not found. This address may not be a valid APEC Learner Passport credential.");
        }
      } else {
        setError("Please connect your wallet to verify credentials");
      }
    } catch (err: any) {
      console.error("Error verifying credential:", err);
      setError(err.message || "Failed to verify credential");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Verify Credential
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Enter a credential address to verify its authenticity on the blockchain
        </p>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Credential Address
              </label>
              <input
                type="text"
                value={credentialAddress}
                onChange={(e) => setCredentialAddress(e.target.value)}
                placeholder="Enter credential PDA address"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                This is the credential account address (PDA), not the NFT mint address
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Verifying..." : "Verify Credential"}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="text-3xl mr-4">❌</div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Verification Failed
                </h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Credential Information Display */}
        {credentialInfo && (
          <div className={`rounded-lg shadow-xl p-8 border-2 ${
            credentialInfo.isRevoked
              ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
              : "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
          }`}>
            <div className="flex items-start mb-6">
              <div className="text-5xl mr-4">
                {credentialInfo.isRevoked ? "⚠️" : "✅"}
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  credentialInfo.isRevoked
                    ? "text-red-800 dark:text-red-200"
                    : "text-green-800 dark:text-green-200"
                }`}>
                  {credentialInfo.isRevoked ? "Credential Revoked" : "Valid Credential"}
                </h3>
                <p className={
                  credentialInfo.isRevoked
                    ? "text-red-700 dark:text-red-300"
                    : "text-green-700 dark:text-green-300"
                }>
                  {credentialInfo.isRevoked
                    ? "This credential has been revoked by the issuer"
                    : "This credential is authentic and valid"}
                </p>
              </div>
            </div>

            {/* Credential Details */}
            <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg p-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Credential Name
                </h4>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {credentialInfo.name}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Type
                  </h4>
                  <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    {CREDENTIAL_TYPE_LABELS[credentialInfo.credentialType as CredentialType]}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Issued Date
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200">
                    {new Date(credentialInfo.issuedAt * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Student Wallet
                </h4>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                    {truncatePublicKey(credentialInfo.student.toString(), 8)}
                  </code>
                  <a
                    href={getExplorerUrl(credentialInfo.student.toString())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                  >
                    View →
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Issuer
                </h4>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                    {truncatePublicKey(credentialInfo.issuer.toString(), 8)}
                  </code>
                  <a
                    href={getExplorerUrl(credentialInfo.issuer.toString())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                  >
                    View →
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  NFT Mint Address
                </h4>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                    {truncatePublicKey(credentialInfo.mint.toString(), 8)}
                  </code>
                  <a
                    href={getExplorerUrl(credentialInfo.mint.toString())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                  >
                    View on Explorer →
                  </a>
                </div>
              </div>

              {credentialInfo.uri && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Metadata URI
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
                    {credentialInfo.uri.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>

            {/* Blockchain Proof */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>🔒 Blockchain Verified:</strong> This credential is stored on the Solana blockchain and cannot be forged or tampered with.
              </p>
            </div>
          </div>
        )}

        {/* How to Verify Section */}
        {!credentialInfo && !error && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              How to Verify a Credential
            </h3>
            <ol className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>Obtain the credential address from the credential holder or their credential card</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>Paste the address into the verification form above</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>Click "Verify Credential" to check the blockchain</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span>Review the credential details and verification status</span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

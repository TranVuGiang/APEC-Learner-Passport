"use client";

import { useState, FormEvent, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CredentialType, CREDENTIAL_TYPE_LABELS } from "@/lib/types";
import { connection, getExplorerUrl } from "@/lib/solana";
import { getProgram, getIssuerRegistryPDA, getCredentialMintPDA, getMintPDA } from "@/lib/anchor-setup";

export default function MintPage() {
  const { connected, publicKey, wallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [airdropping, setAirdropping] = useState(false);

  const [formData, setFormData] = useState({
    studentWallet: "",
    name: "",
    courseTitle: "",
    institution: "",
    completionDate: "",
    credentialType: CredentialType.Course,
    description: "",
  });

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (err) {
          console.error("Error fetching balance:", err);
        }
      }
    };
    fetchBalance();
  }, [publicKey, connected]);

  // Airdrop SOL (localnet/devnet only)
  const handleAirdrop = async () => {
    if (!publicKey) return;

    setAirdropping(true);
    setError("");

    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        10 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);

      // Refresh balance
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);

      console.log("Airdrop successful:", signature);
    } catch (err: any) {
      console.error("Airdrop failed:", err);
      setError("Airdrop failed. Make sure you're on localnet or devnet.");
    } finally {
      setAirdropping(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setTxSignature("");

    if (!connected || !publicKey || !wallet) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);

      // Validate student wallet address
      let studentPubkey: PublicKey;
      try {
        studentPubkey = new PublicKey(formData.studentWallet);
      } catch {
        setError("Invalid student wallet address");
        setLoading(false);
        return;
      }

      // Create metadata URI (max 64 characters)
      // In production, this would be uploaded to Arweave/IPFS and return a short URI
      // For now, use a placeholder that fits within the 64-character limit
      const timestamp = Date.now();
      const metadataUri = `ipfs://placeholder/${timestamp}`;

      // Get program instance
      const program = getProgram(connection, wallet.adapter as any);

      // Derive PDAs
      const [issuerRegistryPDA] = getIssuerRegistryPDA();
      const [credentialMintPDA] = getCredentialMintPDA(publicKey, studentPubkey);
      const [mintPDA] = getMintPDA(credentialMintPDA);

      // Get associated token account address
      const associatedTokenAddress = await PublicKey.findProgramAddress(
        [
          studentPubkey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintPDA.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Prepare transaction
      const symbol = formData.courseTitle.substring(0, 10).toUpperCase().replace(/\s/g, "");

      console.log("Minting credential...");
      console.log("Student:", studentPubkey.toString());
      console.log("Issuer:", publicKey.toString());
      console.log("Credential Mint PDA:", credentialMintPDA.toString());
      console.log("Mint PDA:", mintPDA.toString());

      // Call mint_credential instruction
      const tx = await program.methods
        .mintCredential(
          formData.credentialType,
          formData.courseTitle,
          symbol,
          metadataUri
        )
        .accounts({
          credentialMint: credentialMintPDA,
          issuerRegistry: issuerRegistryPDA,
          mint: mintPDA,
          tokenAccount: associatedTokenAddress[0],
          student: studentPubkey,
          issuer: publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();

      setTxSignature(tx);
      console.log("Transaction signature:", tx);

      // Refresh balance
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);

      // Reset form
      setFormData({
        studentWallet: "",
        name: "",
        courseTitle: "",
        institution: "",
        completionDate: "",
        credentialType: CredentialType.Course,
        description: "",
      });

    } catch (err: any) {
      console.error("Error minting credential:", err);

      // Detect specific errors
      if (err.message?.includes("Attempt to debit an account but found no record of a prior credit")) {
        setError(
          `Insufficient SOL balance. You have ${balance.toFixed(4)} SOL. Please airdrop SOL using the button above.`
        );
      } else if (err.message?.includes("UnauthorizedIssuer")) {
        setError(
          "You are not a verified issuer. Your wallet must be added to the issuer registry by the program authority."
        );
      } else {
        setError(err.message || "Failed to mint credential. Make sure you are a verified issuer.");
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
            Mint Credential
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Please connect your wallet to mint credentials
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Mint Credential
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Issue a verifiable credential NFT to a student's wallet
        </p>

        {/* Wallet Balance & Airdrop */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Wallet Balance
              </p>
              <p className={`text-2xl font-bold ${balance < 1 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {balance.toFixed(4)} SOL
              </p>
            </div>
            <button
              onClick={handleAirdrop}
              disabled={airdropping}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              {airdropping ? "Airdropping..." : "🚰 Airdrop 10 SOL"}
            </button>
          </div>
          {balance < 1 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              ⚠️ Low balance! You need SOL to pay for transactions. Click the airdrop button.
            </p>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Only verified issuers can mint credentials. Your wallet must be added to the issuer registry by the program authority.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {txSignature && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
            <p className="text-green-800 dark:text-green-200 mb-2">
              <strong>Success!</strong> Credential minted successfully
            </p>
            <a
              href={getExplorerUrl(txSignature, "tx")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              View transaction on Solana Explorer →
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Student Wallet */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Student Wallet Address *
              </label>
              <input
                type="text"
                required
                value={formData.studentWallet}
                onChange={(e) => setFormData({ ...formData, studentWallet: e.target.value })}
                placeholder="Enter student's Solana wallet address"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Doe"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Course/Achievement Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Course/Achievement Title * (max 50 chars)
              </label>
              <input
                type="text"
                required
                maxLength={50}
                value={formData.courseTitle}
                onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                placeholder="e.g., Advanced Blockchain Development"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g., APEC University"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Completion Date *
              </label>
              <input
                type="date"
                required
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Credential Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Credential Type *
              </label>
              <select
                required
                value={formData.credentialType}
                onChange={(e) => setFormData({ ...formData, credentialType: parseInt(e.target.value) as CredentialType })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value={CredentialType.Course}>{CREDENTIAL_TYPE_LABELS[CredentialType.Course]}</option>
                <option value={CredentialType.Degree}>{CREDENTIAL_TYPE_LABELS[CredentialType.Degree]}</option>
                <option value={CredentialType.SkillBadge}>{CREDENTIAL_TYPE_LABELS[CredentialType.SkillBadge]}</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Additional details about the credential..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Minting..." : "Mint Credential"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { Credential, CREDENTIAL_TYPE_LABELS } from "@/lib/types";
import { getExplorerUrl, truncatePublicKey } from "@/lib/solana";
import Link from "next/link";

interface CredentialCardProps {
  credential: Credential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
  const issuedDate = new Date(credential.issuedAt * 1000).toLocaleDateString();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {credential.name}
          </h3>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            {CREDENTIAL_TYPE_LABELS[credential.credentialType]}
          </span>
        </div>
        {credential.isRevoked && (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Revoked
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Issued:</span>
          <span className="text-gray-800 dark:text-gray-200">{issuedDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Issuer:</span>
          <span className="text-gray-800 dark:text-gray-200 font-mono">
            {truncatePublicKey(credential.issuer.toString())}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">NFT:</span>
          <span className="text-gray-800 dark:text-gray-200 font-mono">
            {truncatePublicKey(credential.mint.toString())}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={getExplorerUrl(credential.mint.toString())}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-semibold"
        >
          View on Explorer
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(credential.mint.toString());
            alert("NFT address copied!");
          }}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm font-semibold"
        >
          Copy Address
        </button>
      </div>
    </div>
  );
}

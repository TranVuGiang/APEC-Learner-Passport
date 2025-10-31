"use client";

import Link from "next/link";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              APEC Learner Passport
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/mint"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Mint Credential
            </Link>
            <Link
              href="/credentials"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              My Credentials
            </Link>
            <Link
              href="/verify"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Verify
            </Link>
          </div>

          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}

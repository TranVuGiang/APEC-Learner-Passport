"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-6">
            APEC Learner Passport
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Decentralized credential system for the APEC education ecosystem
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Empowering 25 million APEC students with instant, verifiable, and fraud-proof educational credentials on the Solana blockchain
          </p>
          <div className="flex gap-4 justify-center">
            {connected ? (
              <>
                <Link
                  href="/mint"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Mint Credential
                </Link>
                <Link
                  href="/credentials"
                  className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold py-3 px-8 rounded-lg transition-colors border border-primary-600"
                >
                  View My Credentials
                </Link>
              </>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                Connect your wallet to get started →
              </div>
            )}
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
            The Problem
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
            Students face <span className="font-bold text-primary-600">3-6 month delays</span> and
            <span className="font-bold text-primary-600"> high costs</span> when verifying educational
            credentials for cross-border opportunities. Traditional verification is centralized, slow,
            expensive, and vulnerable to fraud.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
              Instant Verification
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Verify educational credentials in seconds instead of months using blockchain technology
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🌏</div>
            <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
              Cross-Border Recognition
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Recognized across all 21 APEC member economies for scholarships, jobs, and transfers
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
              Fraud-Proof
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Blockchain-secured credentials that cannot be forged or tampered with
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
              Self-Sovereign
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Students own and control their credentials without intermediaries
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
              Cost-Effective
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Minimal fees compared to traditional verification services
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
              Privacy-Preserving
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share only what you need while maintaining control over your data
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
                  Institution Issues Credential
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Verified educational institutions mint NFT credentials to students' wallets upon course/degree completion
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
                  Student Owns Credential
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  The credential NFT appears in the student's wallet, giving them full ownership and control
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
                  Instant Verification
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Anyone can verify the authenticity of the credential by checking the blockchain
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              25M+
            </div>
            <div className="text-gray-600 dark:text-gray-300 mt-2">
              APEC Students Annually
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              21
            </div>
            <div className="text-gray-600 dark:text-gray-300 mt-2">
              APEC Member Economies
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              &lt;2s
            </div>
            <div className="text-gray-600 dark:text-gray-300 mt-2">
              Verification Time
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAtom, useAtomValue } from "jotai";
import { SAMPLE_COURSES } from "@/lib/courses-data";
import { CREDENTIAL_TYPE_LABELS } from "@/lib/types";
import {
  enrollInCourseAtom,
  getCourseProgressAtom,
  isEnrolledAtom,
  getCourseCompletionPercentageAtom,
  isCourseCompletedAtom,
  markCredentialMintedAtom,
} from "@/lib/course-progress-store";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection, getExplorerUrl } from "@/lib/solana";
import { getProgram, getIssuerRegistryPDA, getCredentialMintPDA, getMintPDA } from "@/lib/anchor-setup";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { connected, publicKey, wallet } = useWallet();

  const [, enrollInCourse] = useAtom(enrollInCourseAtom);
  const [, markCredentialMinted] = useAtom(markCredentialMintedAtom);
  const getCourseProgress = useAtomValue(getCourseProgressAtom);
  const isEnrolled = useAtomValue(isEnrolledAtom);
  const getCompletionPercentage = useAtomValue(getCourseCompletionPercentageAtom);
  const isCourseCompleted = useAtomValue(isCourseCompletedAtom);

  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState("");
  const [mintSuccess, setMintSuccess] = useState("");

  const course = SAMPLE_COURSES.find((c) => c.id === courseId);
  const enrolled = isEnrolled(courseId);
  const courseProgress = getCourseProgress(courseId);
  const completionPercentage = enrolled ? getCompletionPercentage(courseId, course?.lessons.length || 0) : 0;
  const completed = isCourseCompleted(courseId);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Course Not Found</h1>
        <Link href="/courses" className="text-primary-600 hover:underline">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  const handleEnroll = () => {
    enrollInCourse(courseId);
  };

  const handleClaimCredential = async () => {
    if (!connected || !publicKey || !wallet) {
      setMintError("Please connect your wallet first");
      return;
    }

    if (!completed) {
      setMintError("You must complete all lessons first");
      return;
    }

    if (courseProgress?.credentialMinted) {
      setMintError("You've already claimed this credential");
      return;
    }

    setMinting(true);
    setMintError("");
    setMintSuccess("");

    try {
      // Create metadata URI
      const timestamp = Date.now();
      const metadataUri = `ipfs://course/${courseId}/${timestamp}`;

      // Get program instance
      const program = getProgram(connection, wallet.adapter as any);

      // Derive PDAs
      const [issuerRegistryPDA] = getIssuerRegistryPDA();
      const [credentialMintPDA] = getCredentialMintPDA(publicKey, publicKey); // Self-issued
      const [mintPDA] = getMintPDA(credentialMintPDA);

      // Get associated token account address
      const associatedTokenAddress = await PublicKey.findProgramAddress(
        [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPDA.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Prepare symbol
      const symbol = course.title.substring(0, 10).toUpperCase().replace(/\s/g, "");

      console.log("Minting course completion credential...");

      // Call mint_credential instruction
      const tx = await program.methods
        .mintCredential(course.credentialType, course.title, symbol, metadataUri)
        .accounts({
          credentialMint: credentialMintPDA,
          issuerRegistry: issuerRegistryPDA,
          mint: mintPDA,
          tokenAccount: associatedTokenAddress[0],
          student: publicKey,
          issuer: publicKey, // Self-issued upon course completion
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log("Credential minted:", tx);

      // Mark as minted
      markCredentialMinted({ courseId, txSignature: tx });

      setMintSuccess(`Credential minted successfully! Transaction: ${tx}`);
    } catch (err: any) {
      console.error("Error minting credential:", err);
      setMintError(err.message || "Failed to mint credential");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/courses"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-6"
        >
          ← Back to Courses
        </Link>

        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8">
          {/* Thumbnail */}
          <div className="relative h-80 bg-gradient-to-br from-primary-400 to-purple-500">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-primary-800 dark:text-primary-200 rounded-full text-sm font-semibold">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-full text-sm font-semibold">
                  {course.country}
                </span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-xl text-white/90">{course.institution}</p>
            </div>
          </div>

          {/* Course Info */}
          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {Math.floor(course.duration / 60)}h {course.duration % 60}m
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Duration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {course.lessons.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {course.passingScore}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Passing Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {CREDENTIAL_TYPE_LABELS[course.credentialType]}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Credential</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">About This Course</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">{course.description}</p>
            </div>

            {/* Instructor */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-5xl">👨‍🏫</div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Instructor</div>
                  <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {course.instructor}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{course.institution}</div>
                </div>
              </div>
            </div>

            {/* Progress Bar (if enrolled) */}
            {enrolled && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Your Progress</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {Object.values(courseProgress?.lessonsProgress || {}).filter((l) => l.completed).length} of{" "}
                  {course.lessons.length} lessons completed
                </p>
              </div>
            )}

            {/* Claim Credential Section */}
            {completed && !courseProgress?.credentialMinted && connected && (
              <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">🎉</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      Congratulations! 🎊
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      You've completed all lessons! Claim your blockchain-verified credential NFT now.
                    </p>
                    {mintError && (
                      <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 rounded p-3 mb-4">
                        <p className="text-red-800 dark:text-red-200">{mintError}</p>
                      </div>
                    )}
                    {mintSuccess && (
                      <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-700 rounded p-3 mb-4">
                        <p className="text-green-800 dark:text-green-200">{mintSuccess}</p>
                      </div>
                    )}
                    <button
                      onClick={handleClaimCredential}
                      disabled={minting}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
                    >
                      {minting ? "Minting NFT..." : "🏆 Claim Your Credential NFT"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Already Claimed */}
            {courseProgress?.credentialMinted && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-400 dark:border-green-600">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">✅</div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                      Credential Claimed!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 mb-2">
                      Your NFT credential has been minted to your wallet.
                    </p>
                    {courseProgress.credentialTxSignature && (
                      <a
                        href={getExplorerUrl(courseProgress.credentialTxSignature, "tx")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 dark:text-green-400 hover:underline text-sm"
                      >
                        View transaction on Solana Explorer →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Enroll Button */}
            {!enrolled && (
              <button
                onClick={handleEnroll}
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105"
              >
                🚀 Enroll Now - Start Learning
              </button>
            )}
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Course Curriculum</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => {
              const lessonCompleted = enrolled && courseProgress?.lessonsProgress[lesson.id]?.completed;
              const quizScore = courseProgress?.lessonsProgress[lesson.id]?.quizScore;

              return (
                <div
                  key={lesson.id}
                  className={`border rounded-lg p-6 transition-all ${
                    lessonCompleted
                      ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-600"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                        lessonCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {lessonCompleted ? "✓" : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{lesson.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>⏱️ {lesson.duration} min</span>
                        <span>❓ {lesson.quiz.length} quiz questions</span>
                        {lessonCompleted && quizScore !== undefined && (
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            Score: {quizScore}%
                          </span>
                        )}
                      </div>
                      {enrolled ? (
                        <Link
                          href={`/learn/${courseId}/${lesson.id}`}
                          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                          {lessonCompleted ? "Review Lesson" : "Start Lesson"} →
                        </Link>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 italic">Enroll to access this lesson</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

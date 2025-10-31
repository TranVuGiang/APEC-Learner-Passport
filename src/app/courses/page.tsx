"use client";

import { useState } from "react";
import Link from "next/link";
import { SAMPLE_COURSES } from "@/lib/courses-data";
import { CourseCategory, ApecCountry } from "@/lib/courses-types";
import { useAtomValue } from "jotai";
import { getCourseCompletionPercentageAtom, isEnrolledAtom } from "@/lib/course-progress-store";

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const getCompletionPercentage = useAtomValue(getCourseCompletionPercentageAtom);
  const isEnrolled = useAtomValue(isEnrolledAtom);

  // Filter courses
  const filteredCourses = SAMPLE_COURSES.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesCountry = selectedCountry === "All" || course.country === selectedCountry;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.institution.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesCountry && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            Learn & Earn Credentials
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete courses from APEC institutions and earn blockchain-verified credentials
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Search Courses
              </label>
              <input
                type="text"
                placeholder="Search by title, institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="All">All Categories</option>
                {Object.values(CourseCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                APEC Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="All">All Countries</option>
                {Object.values(ApecCountry).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Found {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const completionPercentage = enrolled ? getCompletionPercentage(course.id, course.lessons.length) : 0;

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-400 to-purple-500 overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {Math.floor(course.duration / 60)}h {course.duration % 60}m
                    </div>
                    {enrolled && (
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-xs font-semibold">
                        {course.category}
                      </span>
                      {enrolled && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                          {completionPercentage}% Complete
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Institution */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>🏫</span>
                      <span>{course.institution}</span>
                    </div>

                    {/* Country */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>🌏</span>
                      <span>{course.country}</span>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>👨‍🏫</span>
                      <span>{course.instructor}</span>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {course.lessons.length} lessons
                        </span>
                        <span className="text-primary-600 dark:text-primary-400 font-semibold group-hover:underline">
                          {enrolled ? "Continue Learning →" : "Start Learning →"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

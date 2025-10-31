import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { UserProgress, CourseProgress, LessonProgress } from "./courses-types";

// Store user progress in localStorage
export const userProgressAtom = atomWithStorage<UserProgress>(
  "apec-course-progress",
  {}
);

// Enroll in a course
export const enrollInCourseAtom = atom(
  null,
  (get, set, courseId: string) => {
    const progress = get(userProgressAtom);

    // Don't enroll if already enrolled
    if (progress[courseId]) {
      return;
    }

    set(userProgressAtom, {
      ...progress,
      [courseId]: {
        courseId,
        enrolledAt: Date.now(),
        lessonsProgress: {},
        completed: false,
        credentialMinted: false,
      },
    });
  }
);

// Mark lesson as completed
export const completeLessonAtom = atom(
  null,
  (get, set, payload: { courseId: string; lessonId: string; quizScore: number }) => {
    const { courseId, lessonId, quizScore } = payload;
    const progress = get(userProgressAtom);

    if (!progress[courseId]) {
      throw new Error("Not enrolled in this course");
    }

    const lessonProgress: LessonProgress = {
      lessonId,
      completed: true,
      quizScore,
      completedAt: Date.now(),
    };

    set(userProgressAtom, {
      ...progress,
      [courseId]: {
        ...progress[courseId],
        lessonsProgress: {
          ...progress[courseId].lessonsProgress,
          [lessonId]: lessonProgress,
        },
      },
    });
  }
);

// Mark course as completed
export const completeCourseAtom = atom(
  null,
  (get, set, courseId: string) => {
    const progress = get(userProgressAtom);

    if (!progress[courseId]) {
      throw new Error("Not enrolled in this course");
    }

    set(userProgressAtom, {
      ...progress,
      [courseId]: {
        ...progress[courseId],
        completed: true,
        completedAt: Date.now(),
      },
    });
  }
);

// Mark credential as minted
export const markCredentialMintedAtom = atom(
  null,
  (get, set, payload: { courseId: string; txSignature: string }) => {
    const { courseId, txSignature } = payload;
    const progress = get(userProgressAtom);

    if (!progress[courseId]) {
      throw new Error("Not enrolled in this course");
    }

    set(userProgressAtom, {
      ...progress,
      [courseId]: {
        ...progress[courseId],
        credentialMinted: true,
        credentialTxSignature: txSignature,
      },
    });
  }
);

// Helper atoms for derived state
export const getCourseProgressAtom = atom((get) => (courseId: string): CourseProgress | undefined => {
  const progress = get(userProgressAtom);
  return progress[courseId];
});

export const isEnrolledAtom = atom((get) => (courseId: string): boolean => {
  const progress = get(userProgressAtom);
  return !!progress[courseId];
});

export const isCourseCompletedAtom = atom((get) => (courseId: string): boolean => {
  const progress = get(userProgressAtom);
  return progress[courseId]?.completed || false;
});

export const isLessonCompletedAtom = atom((get) => (courseId: string, lessonId: string): boolean => {
  const progress = get(userProgressAtom);
  return progress[courseId]?.lessonsProgress[lessonId]?.completed || false;
});

export const getCourseCompletionPercentageAtom = atom(
  (get) => (courseId: string, totalLessons: number): number => {
    const progress = get(userProgressAtom);
    if (!progress[courseId]) return 0;

    const completedLessons = Object.values(progress[courseId].lessonsProgress).filter(
      (lesson) => lesson.completed
    ).length;

    return Math.round((completedLessons / totalLessons) * 100);
  }
);

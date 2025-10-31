export enum CourseCategory {
  Technology = "Technology",
  Business = "Business",
  Healthcare = "Healthcare",
  Engineering = "Engineering",
  Arts = "Arts",
}

export enum ApecCountry {
  Australia = "Australia",
  Brunei = "Brunei",
  Canada = "Canada",
  Chile = "Chile",
  China = "China",
  HongKong = "Hong Kong",
  Indonesia = "Indonesia",
  Japan = "Japan",
  Korea = "South Korea",
  Malaysia = "Malaysia",
  Mexico = "Mexico",
  NewZealand = "New Zealand",
  PapuaNewGuinea = "Papua New Guinea",
  Peru = "Peru",
  Philippines = "Philippines",
  Russia = "Russia",
  Singapore = "Singapore",
  Taiwan = "Chinese Taipei",
  Thailand = "Thailand",
  USA = "United States",
  Vietnam = "Vietnam",
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube embed URL
  duration: number; // in minutes
  quiz: QuizQuestion[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: CourseCategory;
  country: ApecCountry;
  institution: string;
  instructor: string;
  duration: number; // total minutes
  lessons: Lesson[];
  credentialType: number; // Maps to CredentialType enum
  passingScore: number; // Percentage needed to pass each quiz (e.g., 80)
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  quizScore?: number;
  completedAt?: number; // timestamp
}

export interface CourseProgress {
  courseId: string;
  enrolledAt: number; // timestamp
  lessonsProgress: Record<string, LessonProgress>;
  completed: boolean;
  completedAt?: number;
  credentialMinted: boolean;
  credentialTxSignature?: string;
}

export interface UserProgress {
  [courseId: string]: CourseProgress;
}

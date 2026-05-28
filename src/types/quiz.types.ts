export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: "SINGLE_PICK" | "MULTI_PICK" | "SILHOUETTE" | "TRUE_FALSE";
  question: string;
  options: QuizOption[];
  imageUrl?: string;
}

export interface QuizRank {
  id: string;
  title: string;
  icon: string;
}

export interface AdminQuizQuestion {
  id: string;
  prompt: string;
  level: "EASY" | "NORMAL" | "HARD";
  pattern: "IMAGE_RECOGNITION" | "SINGLE_PICK_LIST" | "MULTI_PICK_GRID" | "TRUE_FALSE";
  optionsCount: number;
  createdAt: Date | string;
}

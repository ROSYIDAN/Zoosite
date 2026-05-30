export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
  leftImage?: string;
  rightImage?: string;
}

export interface QuizQuestion {
  id: string;
  type: "SINGLE_PICK" | "MULTI_PICK" | "SILHOUETTE" | "TRUE_FALSE" | "MATCHUP";
  question: string;
  options: QuizOption[];
  imageUrl?: string;
  matchPairs?: MatchPair[];
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
  pattern: "IMAGE_RECOGNITION" | "SINGLE_PICK_LIST" | "MULTI_PICK_GRID" | "TRUE_FALSE" | "MATCHUP";
  optionsCount: number;
  createdAt: Date | string;
}

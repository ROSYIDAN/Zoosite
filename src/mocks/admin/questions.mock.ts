import { AdminQuizQuestion } from "@/types/quiz.types";

export const MOCK_ADMIN_QUESTIONS: AdminQuizQuestion[] = [
  {
    id: "1",
    prompt: "Identify this animal from its silhouette",
    level: "EASY",
    pattern: "IMAGE_RECOGNITION",
    optionsCount: 4,
    createdAt: "2024-05-01T10:00:00Z",
  },
  {
    id: "2",
    prompt: "Which of these animals belongs to the order Monotremata?",
    level: "NORMAL",
    pattern: "SINGLE_PICK_LIST",
    optionsCount: 4,
    createdAt: "2024-05-02T11:30:00Z",
  },
  {
    id: "3",
    prompt: "Select all countries where the Snow Leopard is native",
    level: "HARD",
    pattern: "MULTI_PICK_GRID",
    optionsCount: 6,
    createdAt: "2024-05-03T14:45:00Z",
  },
  {
    id: "4",
    prompt: "What is the diet category of a Giant Panda?",
    level: "EASY",
    pattern: "SINGLE_PICK_LIST",
    optionsCount: 3,
    createdAt: "2024-05-04T09:15:00Z",
  },
  {
    id: "5",
    prompt: "Select all natural predators of the African Buffalo",
    level: "HARD",
    pattern: "MULTI_PICK_GRID",
    optionsCount: 6,
    createdAt: "2024-05-05T16:20:00Z",
  },
];

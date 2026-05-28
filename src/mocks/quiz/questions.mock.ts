import { QuizQuestion } from "@/types/quiz.types";

export const MOCK_QUIZ_QUESTIONS_BY_LEVEL: Record<string, QuizQuestion[]> = {
  easy: [
    {
      id: "e1",
      type: "SINGLE_PICK",
      question: "Which of these animals is a Mammal?",
      options: [
        { id: "eo1", label: "Great White Shark", isCorrect: false },
        { id: "eo2", label: "Lion", isCorrect: true },
        { id: "eo3", label: "Bald Eagle", isCorrect: false },
        { id: "eo4", label: "Poison Dart Frog", isCorrect: false },
      ],
    },
    {
      id: "e2",
      type: "MULTI_PICK",
      question: "Select all animals that can Fly.",
      options: [
        { id: "em1", label: "Eagle", isCorrect: true },
        { id: "em2", label: "Bat", isCorrect: true },
        { id: "em3", label: "Lion", isCorrect: false },
        { id: "em4", label: "Sparrow", isCorrect: true },
        { id: "em5", label: "Elephant", isCorrect: false },
        { id: "em6", label: "Penguin", isCorrect: false },
      ],
    },
    {
      id: "e3",
      type: "SILHOUETTE",
      question: "Identify this animal by its silhouette.",
      imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=800&auto=format&fit=crop",
      options: [
        { id: "es1", label: "Hippopotamus", isCorrect: false },
        { id: "es2", label: "Elephant", isCorrect: true },
        { id: "es3", label: "Rhinoceros", isCorrect: false },
        { id: "es4", label: "Water Buffalo", isCorrect: false },
      ],
    },
  ],
  normal: [
    {
      id: "n1",
      type: "SINGLE_PICK",
      question: "Which animal is known to have the longest lifespan?",
      options: [
        { id: "no1", label: "Giant Tortoise", isCorrect: true },
        { id: "no2", label: "African Elephant", isCorrect: false },
        { id: "no3", label: "Blue Whale", isCorrect: false },
        { id: "no4", label: "Macaw", isCorrect: false },
      ],
    },
    {
      id: "n2",
      type: "MULTI_PICK",
      question: "Which of these animals are primarily Nocturnal?",
      options: [
        { id: "nm1", label: "Owl", isCorrect: true },
        { id: "nm2", label: "Raccoon", isCorrect: true },
        { id: "nm3", label: "Squirrel", isCorrect: false },
        { id: "nm4", label: "Opossum", isCorrect: true },
        { id: "nm5", label: "Horse", isCorrect: false },
        { id: "nm6", label: "Zebra", isCorrect: false },
      ],
    },
    {
      id: "n3",
      type: "SILHOUETTE",
      question: "Can you guess this tall animal?",
      imageUrl: "https://images.unsplash.com/photo-1547721064-36202634a13b?q=80&w=800&auto=format&fit=crop",
      options: [
        { id: "ns1", label: "Ostrich", isCorrect: false },
        { id: "ns2", label: "Giraffe", isCorrect: true },
        { id: "ns3", label: "Llama", isCorrect: false },
        { id: "ns4", label: "Alpaca", isCorrect: false },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      type: "SINGLE_PICK",
      question: "What is the scientific name for the Gray Wolf?",
      options: [
        { id: "ho1", label: "Canis lupus", isCorrect: true },
        { id: "ho2", label: "Panthera leo", isCorrect: false },
        { id: "ho3", label: "Ursus arctos", isCorrect: false },
        { id: "ho4", label: "Equus ferus", isCorrect: false },
      ],
    },
    {
      id: "h2",
      type: "MULTI_PICK",
      question: "Select all animals currently listed as Endangered or Critically Endangered.",
      options: [
        { id: "hm1", label: "Mountain Gorilla", isCorrect: true },
        { id: "hm2", label: "Javan Rhino", isCorrect: true },
        { id: "hm3", label: "Red Fox", isCorrect: false },
        { id: "hm4", label: "Vaquita", isCorrect: true },
        { id: "hm5", label: "Domestic Cat", isCorrect: false },
        { id: "hm6", label: "Grey Squirrel", isCorrect: false },
      ],
    },
    {
      id: "h3",
      type: "SILHOUETTE",
      question: "This unique mammal lays eggs. What is it?",
      imageUrl: "https://images.unsplash.com/photo-1614213951336-d7486f99f36f?q=80&w=800&auto=format&fit=crop",
      options: [
        { id: "hs1", label: "Beaver", isCorrect: false },
        { id: "hs2", label: "Platypus", isCorrect: true },
        { id: "hs3", label: "Otter", isCorrect: false },
        { id: "hs4", label: "Echidna", isCorrect: false },
      ],
    },
  ],
};

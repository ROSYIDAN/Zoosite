# QUIZ: TECHNICAL SCHEMA & API PLAN

This document outlines the database schema and API architecture required to implement the Regular Quiz feature.

## 1. Database Schema (`prisma/schema.prisma`)

We need two new models and two enums to store the Question Bank.

### Enums
```prisma
enum QuizLevel {
  EASY
  NORMAL
  HARD
}

enum QuizPattern {
  SINGLE_PICK_LIST
  MULTI_PICK_GRID
  IMAGE_RECOGNITION
}
```

### Models
```prisma
model quiz_questions {
  id           String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  prompt       String        // The actual question text
  level        QuizLevel     // EASY, NORMAL, HARD
  pattern      QuizPattern   // How the UI should render it
  reference_id String?       @db.Uuid // Optional: link to an animal (for silhouettes/images)
  created_at   DateTime      @default(now()) @db.Timestamp(6)
  
  options      quiz_options[]
}

model quiz_options {
  id           String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  question_id  String        @db.Uuid
  label        String        // Text of the answer (e.g., "Bamboo", "Carnivore")
  is_correct   Boolean       @default(false)
  media_url    String?       // Optional: For Flags or Image Grids
  
  question     quiz_questions @relation(fields: [question_id], references: [id], onDelete: Cascade)
}
```

## 2. API Architecture (Next.js App Router)

Following the **Clean Architecture** (Route -> Service -> Repo), we will implement the following endpoints:

### User Endpoints (Public/Auth)
*   **`GET /api/quiz/questions?level=EASY`**
    *   **Purpose**: Fetches the questions for the player.
    *   **Security**: Does **NOT** return the `is_correct` boolean. The frontend should not know the answer.
*   **`POST /api/quiz/verify`**
    *   **Purpose**: The frontend submits the user's selected `option_ids`.
    *   **Security**: The backend compares it against the DB and returns `{ isCorrect: true/false, correctOptionIds: [...] }`.

### Admin Endpoints (Protected)
*   **`GET /api/admin/quiz/questions`**
    *   **Purpose**: Fetch all questions (including correct answers) for the Admin Table.
*   **`POST /api/admin/quiz/questions`**
    *   **Purpose**: Save a drafted question into the Question Bank.
*   **`DELETE /api/admin/quiz/questions/:id`**
    *   **Purpose**: Remove a bad question.
*   **`POST /api/admin/quiz/generate`**
    *   **Purpose**: The core "Question Factory" endpoint.
    *   **Payload**: `{ strategy: "DIET", animalId: "..." }`
    *   **Response**: Returns an unsaved "Draft" object containing the generated prompt and distractor options.

## 3. Directory Structure Updates
*   **Repositories**: `repositories/quiz.repo.ts` (Handles `quiz_questions` and `quiz_options` CRUD).
*   **Services**: `services/quiz.service.ts` (Handles verification logic).
*   **Generators**: `services/quiz_generators/` (Directory holding the individual strategy files).

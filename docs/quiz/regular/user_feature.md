# QUIZ: USER EXPERIENCE (REGULAR MODE)

## 1. Gameplay Loop
- **Objective**: Complete all 3 levels (Easy, Normal, Hard) to earn badges and rewards.
- **Rules**:
  - Level 1 (Easy) must be completed to unlock Level 2.
  - Level 2 (Normal) must be completed to unlock Level 3.
  - Each level consists of a set number of questions (e.g., 3-5).

## 2. Interaction Patterns
The user will encounter three main UI patterns:
- **SINGLE_PICK_LIST**: A simple list of text options. Best for taxonomy and diet category questions.
- **MULTI_PICK_GRID**: A grid of images (Flags or Animal Photos). Used for distribution and grouping questions.
- **IMAGE_RECOGNITION**: Large animal photo or silhouette. The user must identify the animal or a specific trait.

## 3. Feedback & Scoring
- **Real-time Feedback**: 
  - Correct selection → Green highlight.
  - Incorrect selection → Red highlight + correct answer shown.
- **Final Results**: 
  - Total score display.
  - "Congratulations" screen with earned badges.

## 4. Persistence
- Progress is saved in **LocalStorage**.
- If a user closes the browser, they can resume from their last unlocked level.

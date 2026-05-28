# QUIZ: ADMIN MANAGEMENT & GENERATION

## 1. The "Question Factory" (Generator)
The Admin Page at `/admin/quiz/generate` allows for the rapid creation of quiz content using the **Strategy Pattern**.

### Strategy Pattern Workflow
The Admin selects a **Logic Provider** and a **UI Pattern** to draft a question.

| Logic Provider | Data Source | Sample Pattern |
| :--- | :--- | :--- |
| **Taxonomy** | `animals` (ordo, family) | SINGLE_PICK_LIST |
| **Stats** | `dataset_animals` (speed, weight) | SINGLE_PICK_LIST |
| **Geography** | `countries` + `distributions` | MULTI_PICK_GRID (Flags) |
| **Diet** | `dataset_animals` (diet) | SINGLE_PICK_LIST |

### The "Hybrid" Approval Loop
1.  **Draft**: Admin clicks "Generate Draft."
2.  **Edit**: Admin can manually override the Prompt or the Options (e.g., changing "Herbivore" to "Bamboo").
3.  **Level Assignment**: Admin assigns the question to EASY, NORMAL, or HARD.
4.  **Commit**: Admin saves the question to the **Question Bank** (Database).

## 2. Question Bank Management
A dashboard at `/admin/quiz` to manage existing questions.
- **Table View**: List of all approved questions.
- **Filters**: Sort by Level, Type, or linked Animal.
- **Actions**: Edit, Delete, or Toggle Active status.

## 3. Data Integrity Rules
- **Distractors**: When auto-generating wrong answers, the system must pick animals from the same `class` or `family` to maintain difficulty.
- **Validation**: 
  - Single-select must have exactly 1 correct answer.
  - Multi-select must have at least 1 correct answer.
  - Questions must have a valid `prompt`.

## 4. Extensibility (Adding New Question Types)
Because the final questions are stored in a standard **Question Bank Database**, the system is highly extensible. The frontend quiz player only cares about reading the `prompt`, the `type`, and the `options` from the database. It doesn't care *how* it was generated.

**If you want to add new Data Logic (e.g., "Social Structure" or "Conservation Status"):**
1. You **do not** need to change the database schema or the frontend player.
2. You just write one new small "Generator Rule" in the backend.
3. It instantly appears as a new option in the Admin Dropdown.

**If you want to add a brand new UI Pattern (e.g., "Drag and Drop" or "Fill in the Blank"):**
1. Update the `QuestionType` enum in `schema.prisma` to include `DRAG_AND_DROP`.
2. Build the React component for it in the frontend.
3. Update the Admin Generator to support drafting it.

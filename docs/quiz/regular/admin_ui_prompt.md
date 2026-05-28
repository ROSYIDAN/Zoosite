
**Goal:**
Please generate a modern, clean admin dashboard page for managing a "Quiz Question Bank". It should look like a professional SaaS admin panel. 

**UI Requirements:**

Please generate two main parts for this interface:

### 1. The Question Bank Table (Main View)
Make a page that displays a list of all existing quiz questions in a data table. 
- **Columns needed:**
  - **Question Text:** (e.g., "What does a Panda eat?")
  - **Difficulty:** Show this as a colored badge (Green for Easy, Yellow for Normal, Red for Hard).
  - **Format Type:** Show this as a badge (e.g., "Single Pick", "Multi Pick", "Image Recognition").
  - **Options Count:** How many possible answers the question has.
  - **Actions:** A "Delete" button to remove the question.
- **Top Bar:** Include a search bar to filter questions, and a prominent "Create New Question" button at the top right.

### 2. The Create Question Form
When the user clicks "Create New Question", it should open a form (either a side panel, a modal, or a new page).
- **Basic Inputs:**
  - A text box for the **Question Prompt**.
  - A dropdown for the **Difficulty Level** (Easy, Normal, Hard).
  - A dropdown for the **Format Type** (Single Pick, Multi Pick, Image Recognition).
  - An optional text box for a **Media URL** (if the question relies on an image, like a silhouette).
- **Dynamic Answers Section:**
  - The form must allow the admin to add or remove multiple answer options dynamically (like a list of rows where you can click "Add Option" to add more).
  - For each answer row, include:
    - A text box for the **Answer Label**.
    - A checkbox or toggle to mark if this option **Is Correct**.
    - An optional text box for an **Image URL** (if the answers are pictures/flags).
  - Include a trash can icon next to each option to remove it.
- **Rules:**
  - The form should require the admin to mark at least one answer as "Correct" before they are allowed to submit.
- **Submission:** A "Save Question" button at the bottom.

**Styling:**
Please use React and TailwindCSS. Make it look beautiful, using modern UI patterns with nice spacing, clear typography, and subtle borders/shadows.

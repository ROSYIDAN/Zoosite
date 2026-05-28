# Prompt: Quiz Question Page (Full Page)

## Page Type
This is a **full-page standalone route** (`/quiz/[level]/play`). It must fill the entire browser viewport (`min-height: 100vh`). This is NOT a modal, dialog, or overlay. It is a complete page with its own background, layout, and navigation.

## Page Purpose
The core quiz experience. The user answers 3 questions (one SINGLE_PICK, one MULTI_PICK, one SILHOUETTE) with immediate feedback after each answer.

## Layout (Full Viewport)

### Top Bar (sticky, full-width, glass panel)
- Left: Back arrow icon → goes back to confirmation page.
- Center: "Question X of 3" label.
- Right: "Quit" icon button. Clicking shows an inline slide-down confirmation banner: "Leave the quiz? Progress will be lost. [Yes, Quit] [Cancel]". NOT a modal.

### Progress Bar (below top bar, full-width)
- A thin horizontal bar (4px–8px height) showing quiz completion (33% / 66% / 100%).
- Use green fill for the completed portion, muted dark for the remaining.

### Main Content Area (centered, max-width 720px)
This area changes based on the current question type:

#### Question Type 1: SINGLE_PICK_LIST
- **Question text**: Large headline (32px), white, centered.
- **Options**: 4 vertical buttons, full-width, stacked with 12px gap.
    - Default state: glass panel background, white text, left-aligned with a circular letter indicator (A, B, C, D).
    - On click (immediate reveal):
        - ✅ Correct pick: Green border, green background tint, checkmark icon replaces the letter.
        - ❌ Wrong pick: Red border, red background tint, X icon, shake animation. The correct answer simultaneously highlights with green border.
        - Unselected options: Fade to 50% opacity.
    - "Next Question" button appears at the bottom after reveal.

#### Question Type 2: MULTI_PICK_GRID
- **Question text**: Large headline, centered.
- **Instruction text**: "Select all that apply" in muted body text below the headline.
- **Options**: 2×3 grid of cards (responsive: 1 column on mobile, 2 on tablet, 3 on desktop). Each card:
    - Contains an icon/image placeholder + animal name label.
    - Default state: glass panel, subtle border.
    - Selected state (before submit): Bright outline ring (white or gold), slight scale-up.
- **"Submit Answer" button**: Appears at the bottom. Disabled until at least 1 option is selected. This is required — no auto-reveal on click.
- **After submit (the reveal)**:
    - ✅ User picked + correct: Solid green ring + green check badge (top-right corner).
    - ❌ User picked + wrong: Solid red ring + red X badge + shake.
    - ⚠️ User missed (correct but not picked): Dashed green border + ghost checkmark badge. Semi-transparent.
    - Neutral (wrong + not picked): Fade to 40% opacity + grayscale.
- "Next Question" button appears after reveal.

#### Question Type 3: SILHOUETTE (IMAGE_RECOGNITION)
- **Question text**: "Identify this animal by its silhouette." — centered headline.
- **Silhouette image**: Large (max 480px wide), centered. The animal image is rendered as a pure black shape using CSS `filter: brightness(0)`. Background behind it: a subtle gradient or muted pattern.
- **Options**: 4 vertical text buttons (same style as SINGLE_PICK).
- **On click (immediate reveal)**:
    - The silhouette CSS filter is removed, revealing the full-color animal photo with a smooth transition (`transition: filter 0.6s ease`).
    - Correct/incorrect highlighting follows the same rules as SINGLE_PICK.
- The final question shows "See Results" instead of "Next Question".

### Bottom Area
- The "Next Question" / "See Results" button: Centered, large rounded-full button with gold accent (`#FCD34D`), dark text. Shimmer hover effect.

## Visual Style
- Dark theme. Background: deep gradient that shifts per question (e.g., jungle green → savanna brown → ocean blue).
- Glass panels: `background: rgba(255,255,255,0.06)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 16px`.
- Heavy use of shadows for depth: `box-shadow: 0 20px 40px rgba(0,0,0,0.4)`.
- Typography: Serif headlines (Noto Serif), sans-serif body (Manrope).
- All interactive elements have `transition: all 0.3s ease`.

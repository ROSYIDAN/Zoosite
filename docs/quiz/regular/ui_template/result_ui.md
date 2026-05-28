# Prompt: Quiz Result Page (Full Page)

## Page Type
This is a **full-page standalone route** (`/quiz/[level]/result`). It must fill the entire browser viewport (`min-height: 100vh`). This is NOT a modal, dialog, or overlay. It is a complete page with its own background, layout, and navigation.

## Page Purpose
Show the user their quiz results, give them a rank title, and display their path to unlocking the next difficulty level.

## Layout (Full Viewport)

### Top Bar (sticky, full-width, glass panel)
- Minimal. Only shows:
    - Left: "Quiz Complete" label.
    - Right: Close (X) icon → navigates back to the Level Progress page.

### Hero Section (top half of viewport, centered)
- **Rank Icon**: A large emoji or illustrated icon (80px–96px) for the rank tier:
    - 3/3: 👑 Crown — "Zoo Mastermind"
    - 2/3: 🦒 Giraffe — "Savannah Scout"
    - 1/3: 🐾 Paw — "Curious Cub"
    - 0/3: 🥚 Egg — "Hatching Chick"
- **Rank Title**: Large serif headline (48px), white. E.g., "Zoo Mastermind!"
- **Score Display**: Animated counter (counts up from 0 to the score). Shown as "3 / 3" in a large display font (64px), with the numerator colored green and the denominator muted.
- **Tagline**: A short message below the score:
    - 3/3: "Perfect! You've unlocked the next level." (with a sparkle icon)
    - 2/3: "So close! Try again to unlock the next level."
    - 1/3: "Keep exploring, you'll get there!"
    - 0/3: "Don't worry — every expert was once a beginner."

### Performance Summary (middle section)
- **3 horizontal cards** in a row (responsive: vertical stack on mobile):
    - Each card represents one question from the quiz.
    - Card contains: Question number ("Q1"), the question pattern icon (list / grid / image), and a result badge (green ✅ or red ❌).
    - Correct cards: Subtle green-tinted glass background.
    - Incorrect cards: Subtle red-tinted glass background.

### Level Progress Section (below performance cards)
- **Unlock Status Message**:
    - If 3/3: "🔓 NORMAL level is now unlocked!" — shown in a success banner with green glow.
    - If < 3/3: "🔒 Score 3/3 to unlock the next level" — shown in a muted info banner.
- **Progress bar**: Visual bar showing "X/3 correct needed to unlock [NEXT LEVEL]".

### Action Buttons (bottom, centered, stacked)
- "Retake Quiz" — Secondary style (glass panel, outlined, white text). Full width on mobile.
- "Back to Levels" — Primary style (solid green, white text). Full width on mobile.

## Visual Style
- Dark theme. Background gradient is dynamic:
    - 3/3: Warm gold gradient (`#1a1005 → #3d2e0a`) with subtle confetti particles (canvas-confetti).
    - 2/3: Amber gradient (`#1a1505 → #2b1f13`).
    - 1/3: Cool blue gradient (`#0a1929 → #111412`).
    - 0/3: Deep neutral gradient (`#0c0f0d → #111412`).
- Glass panels, heavy shadows, serif headlines, sans-serif body — consistent with quiz page.
- Staggered entrance animations: Components fade + slide up sequentially (100ms delay between each).

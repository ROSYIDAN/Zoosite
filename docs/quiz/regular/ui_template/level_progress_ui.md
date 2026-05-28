# Prompt: Level Progress / Quiz Hub Page (Full Page)

## Page Type
This is a **full-page standalone route** (`/quiz`). It must fill the entire browser viewport (`min-height: 100vh`). This is NOT a modal, dialog, or overlay. It is a complete page with its own background, layout, and navigation.

## Page Purpose
The quiz "hub" or "home" where users see their current rank, which difficulty levels they've unlocked, and what they need to do to unlock the next one. This is the entry point to the entire quiz feature.

## Unlock Logic
- All users start with only **EASY** unlocked.
- To unlock **NORMAL**: Score 3/3 (perfect) on EASY.
- To unlock **HARD**: Score 3/3 (perfect) on NORMAL.
- Progress is stored in LocalStorage.

## Layout (Full Viewport)

### Top Bar (sticky, full-width, glass panel)
- Left: Back arrow → navigates to the main site (e.g., `/` or `/explore`).
- Center: "Animal Quiz" title in serif font.
- Right: Optional user avatar or score badge.

### Current Rank Section (upper portion, centered)
- **Rank Icon**: Large (80px) emoji or illustrated badge for the current rank.
- **Rank Title**: Serif headline (36px), white. E.g., "Savannah Scout".
- **XP / Progress Ring**: A circular progress indicator (SVG or CSS) showing progress towards the next rank. E.g., "2/3 levels completed".
- **Subtitle**: Muted text explaining the rank, e.g., "Complete all levels to become a Zoo Mastermind."

### Difficulty Level Cards (main content, centered grid)
- **3 vertical cards** in a row (responsive: stack on mobile). Each represents a difficulty:

#### EASY Card (Unlocked by default)
- Header: "🟢 EASY" in green pill badge.
- Description: "3 questions — Basics of the animal kingdom."
- Status: If completed with 3/3 → show "✅ Completed — 3/3" with green checkmark. If not yet attempted → show "Ready to play".
- Action: "Start Quiz" button (primary green). Navigates to `/quiz/easy/ready`.

#### NORMAL Card (Locked until EASY is 3/3)
- Header: "🟡 NORMAL" in amber pill badge.
- If locked:
    - Entire card is dimmed (40% opacity) with a frosted glass overlay.
    - A lock icon (🔒) centered on the card.
    - Text: "Score 3/3 on Easy to unlock".
    - No button.
- If unlocked:
    - Same structure as EASY card but with amber accent colors.
    - "Start Quiz" button active.

#### HARD Card (Locked until NORMAL is 3/3)
- Header: "🔴 HARD" in red pill badge.
- Same locked/unlocked pattern as NORMAL.
- Text when locked: "Score 3/3 on Normal to unlock".

### Bottom Section
- A small "Did You Know?" fun fact card about animals — glass panel, muted text, optional.

## Visual Style
- Dark theme. Background: Deep obsidian gradient (`#0c0f0d → #111412`).
- Accent colors: Emerald green for primary actions, gold for highlights, red for hard level.
- Glass panels: `background: rgba(255,255,255,0.06)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 24px`.
- Heavy shadows: `box-shadow: 0 20px 60px rgba(0,0,0,0.4)`.
- Typography: Serif headlines (Noto Serif), sans-serif body (Manrope).
- Hover effects on unlocked cards: Scale(1.02), border glow.
- Locked cards: No hover effect, cursor-not-allowed.

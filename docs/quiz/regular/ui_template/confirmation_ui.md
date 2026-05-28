# Prompt: Quiz Confirmation Page (Full Page)

## Page Type
This is a **full-page standalone route** (`/quiz/[level]/ready`). It must fill the entire browser viewport (`min-height: 100vh`). This is NOT a modal, dialog, or overlay. It is a complete page with its own background, layout, and navigation.

## Page Purpose
The "Are you ready?" gate before the quiz starts. It sets the mood and tells the user what to expect.

## Layout (Full Viewport)
- **Background**: Full-bleed gradient background covering the entire viewport. Use a deep jungle gradient (`#0c0f0d → #1a4d2e`). Layer a subtle, large animal silhouette watermark (30% opacity) in the bottom-right corner for visual depth.
- **Top Bar** (sticky, full-width): 
    - Left: Back arrow icon + "Quiz" label → navigates to the Level Progress page.
    - Right: "Quit" icon button (X or door icon). Clicking triggers an inline confirmation banner at the top: "Are you sure you want to quit? [Yes, Quit] [Cancel]". This banner is NOT a modal — it slides down from the top bar.
- **Center Content** (vertically and horizontally centered in the remaining space):
    - Trophy/Shield icon (64px, gold `#FFD700`, filled style, with a soft gold glow `drop-shadow`).
    - Headline: "Ready to Test Your Knowledge?" — large serif font (48px), white text.
    - Subtext: "3 questions. Instant feedback. Think fast!" — body font (18px), muted white (`rgba(255,255,255,0.7)`).
    - Difficulty badge: A small pill/chip showing the current level (e.g., "🟢 EASY") with the appropriate color.
    - "Start Quiz" button — large, rounded-full, primary green (`#1a4d2e`) with white text. On hover: scale(1.05) + shimmer sweep animation. Full width on mobile, auto width on desktop (min 240px).
- **Bottom**: Optional subtle footer text: "You need 3/3 to unlock the next level" — small, muted.

## Visual Style
- Dark theme throughout. No white backgrounds.
- Glassmorphism card around center content: `background: rgba(255,255,255,0.06)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 24px`, generous padding (48px).
- Shadows: `box-shadow: 0 20px 60px rgba(0,0,0,0.4)`.
- Typography: Serif for headlines (Noto Serif), sans-serif for body (Manrope).

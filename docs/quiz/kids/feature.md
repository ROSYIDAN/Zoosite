# QUIZ FEATURE (KIDS MODE)

## Core Gameplay
Focus is on **Interactive Learning** and **Sensory Engagement** rather than trivia stats.

## Feature Ideas
### 1. Phonics & Spelling
- **Task**: "How do you spell [ANIMAL_NAME]?"
- **UI**: Drag and drop letters into slots.
- **Feedback**: Play the sound of the letter when moved.

### 2. Sound Matching
- **Task**: "Which animal makes this sound?"
- **UI**: Play an audio clip (embedded from YouTube or hosted MP3).
- **Options**: Show 3-4 clear animal photos.

### 3. Diet Matching (Visual)
- **Task**: "What does this animal eat?"
- **UI**: Show an animal and 3 pictures of food (e.g., Grass, Meat, Bamboo).
- **Data**: Linked to the `diet` field in the database but mapped to kid-friendly icons.

### 4. Silhouette Match
- **Task**: "Who is hiding in the shadows?"
- **UI**: Show a black silhouette and ask for the matching animal photo.

## Technical Ideas
- **Audio Integration**: Using YouTube embeds or Cloudinary-hosted audio files.
- **Simplified UI**: Larger buttons, brighter colors, and less text.
- **Narrator**: (Future Idea) Text-to-speech to read the questions out loud.

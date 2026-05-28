this update fo the context of the creation of the quiz
- On the properties we have 2 method here :
1. admin can pick the image on existing animal media from database. like search bar on dashboard
2. or admin can upload new image for the question.
- this same on the aswer as well. 

but there's bit problem here, if admin upload new image on multi pick answer. it can only set one by one, but if admin just use search "exisiting image on db" they just can use the image already on db

for example question pick carnivore animal
if the animal already on the db
on each answer 
a => search animal name "lion" appear the list of the key word
b => ....
c => ...
d => ....

if they dont want to use the existing image on db
they can upload new image on each answer property. so each upload is redundant activity. any suggestion on this. or we just skip the upload redundant and fix it later

---

## Proposed Interactive Question Types

### 1. The "Texture" (Zoom-In)
- **Concept**: Show a close-up/macro shot of an animal's texture (stripes, spots, scales).
- **Interaction**: Identify the animal from the texture.
- **Visuals**: On reveal, the texture expands/cross-fades into the full animal photo.
- **Benefit**: Uses standard photos, high educational value.

### 2. Habitat Match
- **Concept**: Show a landscape image (Savanna, Rainforest, Reef).
- **Interaction**: "Which of these animals lives here?"
- **Logic**: Association-based rather than just naming.

### 3. Footprint (Track ID)
- **Concept**: Show an icon or photo of animal tracks.
- **Interaction**: Identify which animal left the tracks.
- **Benefit**: Replaces the problematic "Silhouette" type with cleaner, easier-to-source visuals.

### 4. True/False (Binary Choice)
- **Concept**: Kahoot-style quick-fire questions.
- **Interaction**: 2 answers only (Right/Wrong, Yes/No).
- **Example**: "Is this lion from Africa?"
- **UI**: Large, bold buttons for fast decision making.


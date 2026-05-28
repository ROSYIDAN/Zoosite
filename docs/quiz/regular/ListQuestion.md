# REGULAR QUIZ: EXAMPLE QUESTION BANK

This document lists 27 example questions distributed across 3 levels and 3 patterns, utilizing data from the `animals`, `dataset_animals`, and `countries` tables.

> [!NOTE]
> **Logic Types**:
> - **Automated**: System pulls directly from DB columns (e.g., Diet Category: "Herbivore").
> - **Manual/Hybrid**: Admin uses the "Generate" page but manually edits the text for specific details (e.g., "Bamboo") before saving.

---

## 🟢 EASY LEVEL

### 1. SINGLE_PICK_LIST (3 Questions)
- **Q1**: Which of these animals is a **Mammal**?
  - Options: [Lion (Correct), Great White Shark, Bald Eagle]
  - *Logic*: Query `class_id` or `ordo` to find mammals vs others.
- **Q2**: What is the **Diet Category** of a Giant Panda?
  - Options: [Carnivore, Herbivore (Correct), Insectivore]
  - *Logic (Automated)*: Directly pulls from the `diet` column in `dataset_animals`.
- **Q3**: Where does a **Polar Bear** live?
  - Options: [Rainforest, Desert, Arctic (Correct)]
  - *Logic (Automated)*: Pulls from the `habitat` column.

### 2. MULTI_PICK_GRID (3 Questions)
- **Q1**: Select all animals that can **Fly**.
  - Options: [Bat (✅), Eagle (✅), Sparrow (✅), Lion (❌), Elephant (❌), Penguin (❌)]
- **Q2**: Select all animals found in **Africa**.
  - Options: [Zebra (✅), Lion (✅), Giraffe (✅), Kangaroo (❌), Polar Bear (❌), Panda (❌)]
- **Q3**: Select all animals that have **4 Legs**.
  - Options: [Tiger (✅), Elephant (✅), Horse (✅), Snake (❌), Shark (❌), Eagle (❌)]

### 3. IMAGE_RECOGNITION (3 Questions)
- **Q1**: [Show Photo: Zebra] - What animal is this?
  - Options: [Zebra (Correct), Horse, Tiger]
- **Q2**: [Show Silhouette: Elephant] - Who is this hiding in the shadows?
  - Options: [Hippopotamus, Elephant (Correct), Rhinoceros]
- **Q3**: [Show Photo: Emperor Penguin] - Which family does this animal belong to?
  - Options: [Spheniscidae (Correct), Felidae, Canidae]

---

## 🟡 NORMAL LEVEL

### 1. SINGLE_PICK_LIST (3 Questions)
- **Q1**: What is the **Order** of a Giant Panda?
  - Options: [Carnivora, Herbivora (Correct), Insectivora, Both Carnivora and Herbivora]
- **Q2**: What is the conservation status of the **Javan Rhino**?
  - Options: [Vulnerable, Endangered, Critically Endangered (Correct), Extinct]
- **Q3**: Which animal has the scientific name ***Panthera leo***?
  - Options: [Tiger, Leopard, Lion (Correct), Cheetah]

### 2. MULTI_PICK_GRID (3 Questions)
- **Q1**: Select all animals belonging to the **Felidae** family.
  - Options: [Tiger (✅), Lion (✅), Cheetah (✅), Wolf (❌), Leopard (✅), Hyena (❌)]
- **Q2**: Select all animals that are **Endangered** or **Critically Endangered**.
  - Options: [Tiger (✅), Giant Panda (✅), Blue Whale (✅), Rabbit (❌), Dog (❌), Cat (❌)]
- **Q3**: Select all habitats where the **Red Fox** is native.
  - Options: [Forest (✅), Tundra (✅), Desert (❌), Ocean (❌), Grassland (✅), Cave (❌)]

### 3. IMAGE_RECOGNITION (3 Questions)
- **Q1**: [Show Photo: Okapi] - What is the name of this animal?
  - Options: [Okapi (Correct), Zebra, Giraffe, Antelope]
- **Q2**: [Show Silhouette: Tapir] - Identify this animal.
  - Options: [Anteater, Tapir (Correct), Pig, Elephant]
- **Q3**: [Show Photo: Komodo Dragon] - In which country is this animal native?
  - Options: [Indonesia (Correct), Thailand, Australia, Brazil]

---

## 🔴 HARD LEVEL

### 1. SINGLE_PICK_LIST (3 Questions)
- **Q1**: What is the average lifespan of a **Bowhead Whale**?
  - Options: [50 years, 100 years, 200+ years (Correct), 300+ years]
- **Q2**: Which of these animals belongs to the order **Monotremata**?
  - Options: [Platypus (Correct), Koala, Kangaroo, Wombat]
- **Q3**: What is the top recorded speed of a **Peregrine Falcon** in a dive?
  - Options: [120 km/h, 240 km/h, 320+ km/h (Correct), 450 km/h]

### 2. MULTI_PICK_GRID (3 Questions)
- **Q1**: [Show 6 Flags] - Select all countries where the **Snow Leopard** is native.
  - Correct: [China, India, Mongolia, Russia]
  - Distractors: [Brazil, USA]
- **Q2**: Select all animals that have a gestation period longer than **600 days**.
  - Options: [African Elephant (✅), Blue Whale (❌), Giraffe (❌), Black Rhino (✅), Hippo (❌), Asian Elephant (✅)]
- **Q3**: Select all natural **Predators** of the African Buffalo.
  - Options: [Lion (✅), Hyena (✅), Crocodile (✅), Cheetah (❌), Leopard (❌), Eagle (❌)]

### 3. IMAGE_RECOGNITION (3 Questions)
- **Q1**: [Show Silhouette: Saola] - Name this extremely rare "Asian Unicorn".
  - Options: [Saola (Correct), Oryx, Bongo, Kudu]
- **Q2**: [Show Photo: Kakapo] - What makes this bird unique?
  - Options: [It is flightless, It is nocturnal, It is the heaviest parrot, All of the above (Correct)]
- **Q3**: [Show Flags: Uganda & Congo] - Which animal is a national symbol native to both?
  - Options: [Okapi (Correct), Mountain Gorilla, Chimpanzee, African Elephant]

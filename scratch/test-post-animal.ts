
import { animalService } from "../src/services/animal.service";

async function testPostAnimal() {
  const animalData = {
    name: "Red Panda",
    scientific_name: "Ailurus fulgens",
    family: "Ailuridae",
    class_id: "facd76ce-0066-429b-805f-8df1394e4bf0", // Mammals
    description: "Red Panda are small, tree-dwelling mammals known for their reddish-brown fur, ringed tails, and white facial markings that help them blend into moss-covered forest canopies. They are excellent climbers thanks to their flexible ankles, sharp semi-retractable claws, and long bushy tails that provide balance and warmth in cold mountain habitats. Although classified as carnivores, red pandas mainly feed on bamboo and use a special “pseudo-thumb,” similar to giant pandas, to grasp food. They communicate by scent-marking their territory and possess a unique tongue adaptation used for detecting scents. Once debated as relatives of raccoons or bears, modern genetic research now places red pandas in their own family, Ailuridae, with scientists recognizing two distinct species that differ slightly in size and coloration.",
    description_source: "https://nationalzoo.si.edu/animals/red-panda",
    diet: "Carnivore",
    conservation_status: "Endangered",
    lifespan_years: "23",
    weight_kg: "3.6-7.7",
    height_cm: "37-47.2",
    avg_speed_kmh: "32-38",
    top_speed_kmh: "38",
    social_structure: "Solitary",
    predators: "Snow Leopard",
    tags: ["Cute"],
    countries: ["3657b468-6f1d-4128-8bf3-3d9c6a2f91ed"], // China
    habitats: ["Bamboo forest"],
    image: "https://images.unsplash.com/photo-1544073618-97c7951a87e8",
    image_source: "https://unsplash.com/@arttoinspire"
  };

  try {
    console.log("Executing final test case for Red Panda...");
    const result = await animalService.create(animalData as any);
    console.log("Success! Red Panda created with ID:", result.id);
  } catch (error) {
    console.error("Error during final test:", error);
  }
}

testPostAnimal();

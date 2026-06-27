"use client";

import NativeAnimalsWidget from "./native-animals-widget";
import type { NativeAnimalsData } from "@/types/native-animals.types";

/**
 * NativeAnimalsWidgetDemo - Demo version with mock data for testing UI
 * Replace this with real server component once backend is ready
 */
export default function NativeAnimalsWidgetDemo() {
  // Mock data for demonstration
  // Change mockState to test different states: "with-animals" | "no-country" | "no-animals"
  const mockState = "with-animals" as "with-animals" | "no-country" | "no-animals";

  let mockData: NativeAnimalsData;

  if (mockState === "no-country") {
    // State 1: User hasn't set country
    mockData = {
      animals: [],
      country: null,
    };
  } else if (mockState === "no-animals") {
    // State 2: Country set but no endemic animals
    mockData = {
      animals: [],
      country: {
        id: "sg",
        name: "Singapore",
        flag: "🇸🇬",
        region: "Southeast Asia",
      },
    };
  } else {
    // State 3: Normal display with animals
    mockData = {
      animals: [
        {
          id: "1",
          slug: "thai-elephant",
          name: "Thai Elephant",
          scientific_name: "Elephas maximus indicus",
          family: "Elephantidae",
          image: "/static_image.png",
          status: "ENDEMIC",
        },
        {
          id: "2",
          slug: "siamese-crocodile",
          name: "Siamese Crocodile",
          scientific_name: "Crocodylus siamensis",
          family: "Crocodylidae",
          image: "/static_image.png",
          status: "ENDEMIC",
        },
        {
          id: "3",
          slug: "indochinese-tiger",
          name: "Indochinese Tiger",
          scientific_name: "Panthera tigris corbetti",
          family: "Felidae",
          image: "/static_image.png",
          status: "NATIVE",
        },
        {
          id: "4",
          slug: "asian-elephant",
          name: "Asian Elephant",
          scientific_name: "Elephas maximus",
          family: "Elephantidae",
          image: "/static_image.png",
          status: "NATIVE",
        },
        {
          id: "5",
          slug: "sun-bear",
          name: "Sun Bear",
          scientific_name: "Helarctos malayanus",
          family: "Ursidae",
          image: "/static_image.png",
          status: "NATIVE",
        },
        {
          id: "6",
          slug: "clouded-leopard",
          name: "Clouded Leopard",
          scientific_name: "Neofelis nebulosa",
          family: "Felidae",
          image: "/static_image.png",
          status: "NATIVE",
        },
      ],
      country: {
        id: "th",
        name: "Thailand",
        flag: "🇹🇭",
        region: "Southeast Asia",
      },
    };
  }

  return <NativeAnimalsWidget />;
}

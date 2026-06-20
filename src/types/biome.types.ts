export interface FeaturedAnimal {
  name: string;
  slug: string;
  image: string;
}

export interface BiomeData {
  id: string;
  title: string;
  imageSrc: string;
  icon: string;
  badge: string;
  animalCount: number;
  habitats: { id: string; name: string }[];
  featuredAnimals: FeaturedAnimal[];
}

export interface BiomeTheme {
  iconBg: string;
  badgeBg: string;
  badgeText: string;
  tagClass: string;
}

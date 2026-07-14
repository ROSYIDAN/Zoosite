export interface AiAutofillResult {
  name?: string;
  scientific_name?: string;
  family?: string;
  genus?: string;
  ordo?: string;
  class?: string;
  description?: string;
  description_source?: string;
  diet?: string;
  lifespan_years?: string;
  weight_kg?: string;
  height_cm?: string;
  avg_speed_kmh?: string;
  top_speed_kmh?: string;
  social_structure?: string;
  conservation_status?: string;
  predators?: string;
  synonyms?: string;
  tags?: string[];
  habitats?: string[];
  countries?: string[];
}

export function parseAiJson(text: string): AiAutofillResult {
  let cleanText = text.trim();
  const markdownJsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = cleanText.match(markdownJsonRegex);
  if (match && match[1]) {
    cleanText = match[1].trim();
  }
  return JSON.parse(cleanText);
}

export function normalizeDietString(str: string): string {
  const lower = str.toLowerCase();
  if (lower.includes("carnivor")) return "Carnivore";
  if (lower.includes("herbivor")) return "Herbivore";
  if (lower.includes("omnivor")) return "Omnivore";
  return str;
}

export function resolveClassId(
  inputClass: string,
  classes: { id: string; name: string }[]
): { id: string; name: string } | null {
  const normalizedInput = inputClass.toLowerCase().trim();
  const matchedClass = classes.find((c) => {
    const clsName = c.name.toLowerCase();
    return (
      clsName.includes(normalizedInput) ||
      normalizedInput.includes(clsName) ||
      (normalizedInput === "mammal" && clsName === "mammalia") ||
      (normalizedInput === "mammalia" && clsName.includes("mammal")) ||
      (normalizedInput.includes("bird") && clsName === "aves") ||
      (normalizedInput === "aves" && clsName.includes("bird")) ||
      (normalizedInput.includes("reptil") && clsName.includes("reptil")) ||
      (normalizedInput.includes("amphib") && clsName.includes("amphib")) ||
      (normalizedInput.includes("fish") && clsName.includes("actinopterygii"))
    );
  });
  return matchedClass ? { id: matchedClass.id, name: matchedClass.name } : null;
}

export interface CountryListItem {
  id: string;
  country: string;
  country_flag: string | null;
}

export function resolveCountries(
  countriesInput: string[],
  countryList: CountryListItem[]
): { matchedIds: string[]; matchedNames: string[]; unmatchedNames: string[] } {
  const matchedIds: string[] = [];
  const matchedNames: string[] = [];
  const unmatchedNames: string[] = [];

  countriesInput.forEach((countryName) => {
    const trimmedName = countryName.toLowerCase().trim();
    const matched = countryList.find(
      (c) =>
        c.country.toLowerCase().trim() === trimmedName ||
        c.country.toLowerCase().trim().includes(trimmedName) ||
        trimmedName.includes(c.country.toLowerCase().trim())
    );

    if (matched) {
      matchedIds.push(matched.id);
      matchedNames.push(matched.country);
    } else {
      unmatchedNames.push(countryName);
    }
  });

  return { matchedIds, matchedNames, unmatchedNames };
}
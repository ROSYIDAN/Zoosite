import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import { USER_PROMPT_TEMPLATE, ADMIN_PROMPT_TEMPLATE } from "@/lib/templates/ai-prompts";
import {
  parseAiJson,
  normalizeDietString,
  resolveClassId,
  resolveCountries,
} from "@/lib/ai-autofill-parser";
import type { AutofillStats } from "@/components/features/admin/animals/animal-form-admin/autofill-report";

interface UseAnimalAiAutofillOptions {
  classes: { id: string; name: string }[];
  initialCountries?: { id: string; country: string; country_flag: string | null }[];
  setValue: (field: any, value: any, options?: any) => void;
  isUserRequest?: boolean;
  onSuccess?: () => void;
}

export function useAnimalAiAutofill({
  classes,
  initialCountries,
  setValue,
  isUserRequest = false,
  onSuccess,
}: UseAnimalAiAutofillOptions) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStats, setShowStats] = useState<AutofillStats | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [allCountries, setAllCountries] = useState<{ id: string; country: string; country_flag: string | null }[]>([]);

  useEffect(() => {
    if (!isUserRequest) {
      fetch("/api/countries?all=true")
        .then((res) => res.json())
        .then((data) => setAllCountries(data.data || []))
        .catch((err) => console.error("Failed to load countries for autofill:", err));
    }
  }, [isUserRequest]);

  const handleDownloadTemplate = () => {
    const templateContent = isUserRequest ? USER_PROMPT_TEMPLATE : ADMIN_PROMPT_TEMPLATE;
    const fileName = isUserRequest ? "zoosite-user-ai-template.txt" : "zoosite-admin-ai-template.txt";

    const blob = new Blob([templateContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("AI Prompt Template downloaded!");
  };

  const processAiJson = (text: string) => {
    setIsProcessing(true);
    setShowStats(null);

    try {
      const json = parseAiJson(text);

      // Resolve field mappings
      let fieldsFilledCount = 0;
      const setFormVal = (field: any, val: any) => {
        if (val !== undefined && val !== null && val !== "") {
          setValue(field, val, { shouldDirty: true, shouldValidate: true });
          fieldsFilledCount++;
        }
      };

      // Base fields based on form mode (User request vs Admin)
      if (isUserRequest) {
        setFormVal("animal_name", json.name);
      } else {
        setFormVal("name", json.name);
      }

      // Normalize diet/ordo to standard dropdown values ("Herbivore", "Carnivore", "Omnivore")
      let parsedDiet = json.diet ? normalizeDietString(json.diet) : "";
      let parsedOrdo = json.ordo ? normalizeDietString(json.ordo) : "";

      if (!parsedDiet && parsedOrdo) {
        if (["Carnivore", "Herbivore", "Omnivore"].includes(parsedOrdo)) {
          parsedDiet = parsedOrdo;
        }
      }
      if (!parsedOrdo && parsedDiet) {
        if (["Carnivore", "Herbivore", "Omnivore"].includes(parsedDiet)) {
          parsedOrdo = parsedDiet;
        }
      }

      setFormVal("scientific_name", json.scientific_name);
      setFormVal("family", json.family);
      setFormVal("genus", json.genus);
      setFormVal("ordo", parsedOrdo);
      setFormVal("description", json.description);
      setFormVal("description_source", json.description_source);
      setFormVal("diet", parsedDiet);
      setFormVal("lifespan_years", json.lifespan_years);
      setFormVal("weight_kg", json.weight_kg);
      setFormVal("height_cm", json.height_cm);
      setFormVal("avg_speed_kmh", json.avg_speed_kmh);
      setFormVal("top_speed_kmh", json.top_speed_kmh);
      setFormVal("social_structure", json.social_structure);
      setFormVal("conservation_status", json.conservation_status);
      setFormVal("predators", json.predators);
      setFormVal("synonyms", json.synonyms);

      // Resolve dropdown class_id
      let unresolvedClass: string | undefined = undefined;
      let resolvedClass: string | undefined = undefined;
      if (json.class) {
        const matchedClass = resolveClassId(json.class, classes);
        if (matchedClass) {
          setValue("class_id", matchedClass.id, { shouldDirty: true, shouldValidate: true });
          resolvedClass = matchedClass.name;
          fieldsFilledCount++;
        } else {
          unresolvedClass = json.class;
        }
      }

      // Resolve Admin Only tags, habitats, and countries
      const matchedCountries: string[] = [];
      const unmatchedCountries: string[] = [];
      if (!isUserRequest) {
        if (Array.isArray(json.tags)) {
          setFormVal("tags", json.tags);
        }
        if (Array.isArray(json.habitats)) {
          setFormVal("habitats", json.habitats);
        }

        // Resolve countries using loaded allCountries list or initialCountries fallback
        const countryList = allCountries.length > 0 ? allCountries : initialCountries;
        if (Array.isArray(json.countries) && countryList) {
          const { matchedIds, matchedNames, unmatchedNames } = resolveCountries(
            json.countries,
            countryList
          );

          matchedCountries.push(...matchedNames);
          unmatchedCountries.push(...unmatchedNames);

          if (matchedIds.length > 0) {
            setValue("countries", matchedIds, { shouldDirty: true, shouldValidate: true });
            fieldsFilledCount += matchedIds.length;
          }
        }
      }

      // Show celebration confetti and toast
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });

      toast.success(`Form successfully auto-filled with ${fieldsFilledCount} attributes!`);

      setShowStats({
        success: true,
        fieldsFilled: fieldsFilledCount,
        unresolvedClass,
        resolvedClass,
        matchedCountries,
        unmatchedCountries,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid AI JSON format. Please ensure you copied the complete JSON block.");
      setShowStats({
        success: false,
        fieldsFilled: 0,
        matchedCountries: [],
        unmatchedCountries: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPastedText(text);
    if (text.trim().startsWith("{") || text.trim().startsWith("```")) {
      processAiJson(text);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setPastedText(text);
        processAiJson(text);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setPastedText(text);
        processAiJson(text);
      };
      reader.readAsText(file);
    }
  };

  return {
    isDragOver,
    pastedText,
    isProcessing,
    showStats,
    fileInputRef,
    handleDownloadTemplate,
    handlePasteChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
  };
}
"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createQuizQuestionSchema, type CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";

import PromptSection from "./form/PromptSection";
import AnswerOptionsSection from "./form/AnswerOptionsSection";
import QuestionPropertiesCard from "./form/QuestionPropertiesCard";
import QuestionActionsCard from "./form/QuestionActionsCard";
import QuestionPreviewModal from "./form/QuestionPreviewModal";

interface QuestionFormProps {
  initialData?: CreateQuizQuestionInput;
}

export default function QuestionForm({ initialData }: QuestionFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const methods = useForm<CreateQuizQuestionInput>({
    resolver: zodResolver(createQuizQuestionSchema),
    defaultValues: initialData || {
      prompt: "",
      level: "EASY",
      pattern: "SINGLE_PICK_LIST",
      media_url: "",
      reference_id: "",
      options: [
        { label: "", is_correct: true, media_url: "" },
        { label: "", is_correct: false, media_url: "" },
      ],
    },
  });

  const pattern = methods.watch("pattern");
  const [prevPattern, setPrevPattern] = useState(methods.getValues("pattern"));

  useEffect(() => {
    if (pattern !== prevPattern) {
      if (pattern === "TRUE_FALSE") {
        methods.setValue("options", [
          { label: "True", is_correct: true, media_url: "" },
          { label: "False", is_correct: false, media_url: "" }
        ], { shouldValidate: true, shouldDirty: true });
      } else if (pattern === "MATCHUP") {
        methods.setValue("options", [
          { label: "|", is_correct: true, media_url: "" },
          { label: "|", is_correct: true, media_url: "" },
          { label: "|", is_correct: true, media_url: "" },
        ], { shouldValidate: true, shouldDirty: true });
      }
      setPrevPattern(pattern);
    }
  }, [pattern, prevPattern, methods]);

  const onSubmit = async (data: CreateQuizQuestionInput) => {
    try {
      // Data cleanup before submission
      const payload = {
        ...data,
        media_url: data.media_url || null,
        reference_id: data.reference_id || null,
        options: data.options.map((opt) => ({
          ...opt,
          media_url: opt.media_url || null,
        })),
      };

      const url = isEditing 
        ? `/api/admin/quiz/questions/${initialData.id}` 
        : "/api/admin/quiz/questions";
      
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? "update" : "create"} question`);
      }

      toast.success(isEditing ? "Question updated successfully!" : "Question created successfully!");
      router.push("/admin/quiz");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
      console.error(error);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
          {/* ── Left Column: Prompt & Answers ── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <PromptSection />
            <AnswerOptionsSection />
          </div>

          {/* ── Right Column: Properties & Actions ── */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            <QuestionPropertiesCard />
            <QuestionActionsCard onPreview={() => setIsPreviewOpen(true)} />
          </div>
        </form>

        {isPreviewOpen && (
          <QuestionPreviewModal onClose={() => setIsPreviewOpen(false)} />
        )}
      </FormProvider>
    </>
  );
}

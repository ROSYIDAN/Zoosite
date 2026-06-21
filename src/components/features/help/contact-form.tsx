"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { supportSchema, type SupportInput } from "@/lib/validations/support.schema";
import { ContactSuccessView } from "./contact-success-view";
import { ContactFormFields } from "./contact-form-fields";

export default function ContactForm() {
  const { data: session } = useSession();
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<SupportInput>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    },
  });

  const { setValue, reset } = methods;

  // Prefill name and email when session details become available
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setValue("name", session.user.name);
      if (session.user.email) setValue("email", session.user.email);
    }
  }, [session, setValue]);

  const onSubmit = async (data: SupportInput) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request.");
      }

      setIsSubmitSuccess(true);
      reset({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  if (isSubmitSuccess) {
    return <ContactSuccessView onReset={() => setIsSubmitSuccess(false)} />;
  }

  return (
    <FormProvider {...methods}>
      <ContactFormFields
        onSubmit={methods.handleSubmit(onSubmit)}
        submitError={submitError}
      />
    </FormProvider>
  );
}

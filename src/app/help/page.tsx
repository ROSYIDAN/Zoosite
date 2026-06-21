import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import FaqAccordion from "@/components/features/help/faq-accordion";
import ContactForm from "@/components/features/help/contact-form";

export const metadata = {
  title: "Help & Support Center | Arboreal Archive",
  description: "Get assistance, read frequently asked questions, or contact conservatory support.",
};

/**
 * Help Center page route (/help).
 * Following FE System Law: wrapped in DashboardLayout, responsive grid, clear titles and descriptions.
 */
export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 font-[#1a1c19] p-6 md:p-10">
        {/* Header */}
        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#154212] dark:text-[#d0e8c5]">
            Help & Support Center
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Welcome to the Conservatory support gateway. Browse frequently asked questions regarding taxonomy contributions, quiz milestones, and account safety guidelines, or send a direct inquiry to our administrative team.
          </p>
        </div>

        {/* Content Layout — responsive two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <FaqAccordion />
          <ContactForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

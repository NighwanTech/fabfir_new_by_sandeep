import { Metadata } from "next";
import { AssessmentSidebar } from "@/components/assessment/AssessmentSidebar";
import { AssessmentForm } from "@/components/assessment/AssessmentForm";

export const metadata: Metadata = {
  title: "Fitness Assessment Application",
  description: "Apply for 1-on-1 personalized fitness coaching with Head Performance Coach Ankit Baliyan. Fill out your assessment form to start your transformation.",
  alternates: {
    canonical: "https://fabfitperformance.com/assessment",
  },
  openGraph: {
    title: "Online Fitness Assessment - FabFit Performance",
    description: "Start your personalized fitness transformation with Head Performance Coach Ankit Baliyan.",
    url: "https://fabfitperformance.com/assessment",
    images: ["/og-image.jpg"],
  },
};

export default function AssessmentPage() {
  return (
    <div className="bg-[#09090b] text-white min-h-screen w-full py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 items-start">
        <AssessmentSidebar />
        <AssessmentForm />
      </div>
    </div>
  );
}

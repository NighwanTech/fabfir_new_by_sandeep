import { AssessmentSidebar } from "@/components/assessment/AssessmentSidebar";
import { AssessmentForm } from "@/components/assessment/AssessmentForm";

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

"use client";

import { useState, useEffect, useRef } from "react";
import {
  User, Calendar, Ruler, Scale, Mail, Phone, ArrowLeft, ArrowRight, Lightbulb, ShieldCheck,
  Target, Flame, BicepsFlexed, Dumbbell, Activity, Heart, RefreshCcw, MoreHorizontal,
  Briefcase, Footprints, Moon, Smile, Check, ClipboardCheck, Pill, Bandage, Leaf, Camera, FileText, Lock, Send, Edit3, AlertCircle, Trophy, Sparkles, CheckCircle2, MessageSquare, Home
} from "lucide-react";

function CustomSelect({
  id,
  label,
  value,
  options,
  onChange,
  error,
  icon: Icon,
  required = false,
  labelPosition = "floating"
}: {
  id?: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string;
  icon?: any;
  required?: boolean;
  labelPosition?: "floating" | "top";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative group/input w-full">
      {labelPosition === "top" && (
        <label className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap mb-2 flex items-center gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <div
          id={id}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-[#1a1a1a] border rounded-lg py-3 ${
            Icon ? "pl-10" : "pl-4"
          } pr-10 text-sm focus:outline-none transition-all cursor-pointer flex items-center justify-between min-h-[46px] ${
            error
              ? "border-red-500/50 ring-1 ring-red-500/50"
              : isOpen
              ? "border-primary ring-1 ring-primary/50 bg-[#1f1f22]"
              : value
              ? "border-white/20 text-white bg-[#1a1a1a]"
              : "border-white/10 hover:border-white/30 text-zinc-400"
          }`}
        >
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Icon
                className={`h-4 w-4 ${
                  error
                    ? "text-red-500"
                    : isOpen || value
                    ? "text-primary"
                    : "text-zinc-500"
                } transition-colors`}
              />
            </div>
          )}
          <span
            className={`text-sm ${
              selectedOption ? "text-white font-medium" : "text-transparent"
            }`}
          >
            {selectedOption ? selectedOption.label : " "}
          </span>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400 z-10">
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-primary" : "text-zinc-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {labelPosition === "floating" && (
          <label
            className={`absolute px-1.5 transition-all duration-200 pointer-events-none rounded-md z-10 whitespace-nowrap truncate max-w-[calc(100%-2.5rem)] ${
              !value && !isOpen
                ? `top-3.5 text-sm text-zinc-400 bg-transparent ${Icon ? "left-9" : "left-3"}`
                : `-top-2.5 text-[11px] font-semibold bg-[#121212] ${Icon ? "left-9" : "left-3"} ${
                    error
                      ? "text-red-500"
                      : isOpen
                      ? "text-primary"
                      : "text-zinc-400"
                  }`
            }`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {isOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#222225] border border-zinc-700/80 rounded-xl shadow-2xl z-30 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-3.5 text-sm cursor-pointer transition-all flex items-center justify-between border-b border-white/5 last:border-0 ${
                      isSelected
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CanvasConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    let width = (canvas.width = parent?.clientWidth || window.innerWidth);
    let height = (canvas.height = parent?.clientHeight || window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      rotation: number;
      rotSpeed: number;
      shape: "square" | "circle" | "star";
    }> = [];

    const colors = ["#FFB81C", "#F59E0B", "#FCD34D", "#FFFFFF", "#EAB308", "#F97316"];
    const shapes: Array<"square" | "circle" | "star"> = ["square", "circle", "star"];

    for (let i = 0; i < 110; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      particles.push({
        x: width / 2,
        y: Math.min(220, height * 0.25),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.006,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.98;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + i * 72) * Math.PI) / 180) * p.size);
            ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (p.size / 2));
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      });

      if (particles.some((p) => p.alpha > 0)) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
}

function AssessmentSuccessView() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  return (
    <div className="flex-1 w-full bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500 min-h-[600px] justify-center">
      <CanvasConfetti />

      {/* Decorative Gold Background Ambient Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Animated Icon Badge */}
      <div className="relative mb-6 z-10">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent p-1 shadow-[0_0_50px_rgba(255,184,28,0.35)] flex items-center justify-center relative group">
          <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-25" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-2 rounded-full border border-primary/20 border-dashed animate-spin" style={{ animationDuration: '20s' }} />
          
          <div className="w-full h-full rounded-full bg-[#18181c] border border-primary/50 flex items-center justify-center relative overflow-hidden">
            <Trophy className="w-14 h-14 text-primary animate-bounce stroke-[1.75]" />
          </div>

          <div className="absolute -bottom-1 -right-1 bg-primary text-black p-2 rounded-full shadow-lg border-2 border-[#121215]">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4 z-10 shadow-[0_0_15px_rgba(255,184,28,0.2)]">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Application Received
      </div>

      {/* Main Headline */}
      <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-3 z-10">
        WELCOME TO THE <span className="bg-gradient-to-r from-primary via-yellow-200 to-amber-500 bg-clip-text text-transparent">FABFIT FAMILY!</span>
      </h2>

      <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8 z-10">
        Boom! 🚀 You&apos;ve taken the most critical first step towards transforming your body, performance, and lifestyle. Your detailed assessment is now locked in.
      </p>

      {/* What Happens Next Roadmap */}
      <div className="w-full max-w-2xl bg-[#16161a]/90 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 z-10 text-left backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
          <Target className="w-4 h-4 text-primary" /> What Happens Next?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wide">1. Data Encrypted</div>
              <div className="text-zinc-400 text-xs mt-0.5">Your metrics & goals are safely logged into our coach portal.</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wide">2. Coach Review</div>
              <div className="text-zinc-400 text-xs mt-0.5">Coach Ankit is reviewing your stats to craft your plan.</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
              <Dumbbell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wide">3. Custom Blueprint</div>
              <div className="text-zinc-400 text-xs mt-0.5">Custom workout & nutrition strategy engineered for you.</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wide">4. Personal Outreach</div>
              <div className="text-zinc-400 text-xs mt-0.5">We will reach out on WhatsApp / Phone within 24 hours.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Head Coach Quote Card */}
      <div className="w-full max-w-2xl bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 z-10 flex items-center gap-4 text-left">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/40 shrink-0 bg-zinc-800 flex items-center justify-center text-primary font-black">
          AB
        </div>
        <div>
          <p className="text-xs sm:text-sm text-zinc-300 italic">
            &ldquo;Your details have landed directly in my dashboard. I&apos;m excited to build your tailored roadmap to crush your goals!&rdquo;
          </p>
          <div className="text-primary font-bold text-xs mt-1 uppercase tracking-wider">
            — Ankit Baliyan, Head Performance Coach
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full max-w-md">
        <a
          href="/"
          className="w-full sm:flex-1 h-12 bg-primary text-black font-black uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white hover:shadow-[0_0_25px_rgba(255,184,28,0.4)]"
        >
          <Home className="w-4 h-4" /> Back to Home
        </a>
        <a
          href="/#programs"
          className="w-full sm:flex-1 h-12 bg-white/5 border border-white/10 text-white font-bold uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white/10 hover:border-primary/50"
        >
          Explore Programs <ArrowRight className="w-4 h-4 text-primary" />
        </a>
      </div>
    </div>
  );
}

export function AssessmentForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // -- Form State --
  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [activityLevel, setActivityLevel] = useState<string | null>(null);

  // Step 2
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
  const [experience, setExperience] = useState("");
  const [frequency, setFrequency] = useState("");
  const [equipment, setEquipment] = useState<string | null>(null);
  const [cardio, setCardio] = useState("");
  const [occupation, setOccupation] = useState("");
  const [steps, setSteps] = useState("");
  const [sleep, setSleep] = useState("");
  const [stress, setStress] = useState("");
  const [diet, setDiet] = useState<string | null>(null);
  const [meals, setMeals] = useState("");
  const [alcohol, setAlcohol] = useState<string | null>(null);
  const [tobacco, setTobacco] = useState<string | null>(null);
  const [supplements, setSupplements] = useState("");

  // Step 3
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [injuries, setInjuries] = useState("");
  const [allergies, setAllergies] = useState("");
  const [waist, setWaist] = useState("");
  const [commitmentLevel, setCommitmentLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [physiqueImage, setPhysiqueImage] = useState<File | null>(null);
  const [bloodReport, setBloodReport] = useState<File | null>(null);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!age.trim()) newErrors.age = "Age is required";
    if (!gender) newErrors.gender = "Please select gender";
    if (!height.trim()) newErrors.height = "Height is required";
    if (!weight.trim()) newErrors.weight = "Weight is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!activityLevel) newErrors.activityLevel = "Please select an activity level";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!primaryGoal) newErrors.primaryGoal = "Please select a primary goal";
    if (!experience) newErrors.experience = "Please select experience level";
    if (!frequency) newErrors.frequency = "Please select frequency";
    if (!equipment) newErrors.equipment = "Please select equipment access";
    if (!cardio) newErrors.cardio = "Please select cardio routine";
    if (!occupation.trim()) newErrors.occupation = "Occupation is required";
    if (!steps.trim()) newErrors.steps = "Daily steps are required";
    if (!sleep.trim()) newErrors.sleep = "Sleep hours are required";
    if (!stress) newErrors.stress = "Please select stress level";
    if (!diet) newErrors.diet = "Please select dietary preference";
    if (!meals) newErrors.meals = "Please select number of meals";
    if (!alcohol) newErrors.alcohol = "Required";
    if (!tobacco) newErrors.tobacco = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!conditions.trim()) newErrors.conditions = "Required field";
    if (!medications.trim()) newErrors.medications = "Required field";
    if (!injuries.trim()) newErrors.injuries = "Required field";
    if (!allergies.trim()) newErrors.allergies = "Required field";
    if (!waist.trim()) newErrors.waist = "Waist measurement required";
    if (!commitmentLevel) newErrors.commitmentLevel = "Please select your commitment level";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep3()) {
      try {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('age', age.toString());
        formData.append('gender', gender || '');
        formData.append('height', height);
        formData.append('weight', weight);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('activityLevel', activityLevel || '');
        formData.append('primaryGoal', primaryGoal || '');
        formData.append('experience', experience);
        formData.append('frequency', frequency);
        formData.append('equipment', equipment || '');
        formData.append('cardio', cardio);
        formData.append('occupation', occupation);
        formData.append('steps', steps);
        formData.append('sleep', sleep);
        formData.append('stress', stress);
        formData.append('diet', diet || '');
        formData.append('meals', meals);
        formData.append('alcohol', alcohol || '');
        formData.append('tobacco', tobacco || '');
        if (supplements) formData.append('supplements', supplements);
        formData.append('conditions', conditions);
        formData.append('medications', medications);
        formData.append('injuries', injuries);
        formData.append('allergies', allergies);
        formData.append('waist', waist);
        formData.append('commitmentLevel', commitmentLevel?.toString() || '1');
        if (notes) formData.append('notes', notes);

        if (physiqueImage) formData.append('physiqueImage', physiqueImage);
        if (bloodReport) formData.append('bloodReport', bloodReport);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/assessments`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          setIsSubmitted(true);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }
        } else {
          console.error("Backend Error Response:", data);
          
          let errorDetails = "";
          if (data.errors && Array.isArray(data.errors)) {
            errorDetails = "\nCheck these fields: " + data.errors.map((e: any) => e.path.join('.') + ' (' + e.message + ')').join(', ');
          }
          
          alert(`Submission failed: ${data.message || "Please try again."}${errorDetails}`);
        }
      } catch (error) {
        console.error("Error submitting form", error);
        alert("Error submitting form");
      }
    } else {
      const formContainer = document.getElementById("form-scroll-container");
      if (formContainer) formContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ErrorMsg = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <span className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1 animate-in fade-in">
        <AlertCircle className="w-3 h-3" /> {errors[field]}
      </span>
    );
  };

  const inputClasses = (field: string) =>
    `w-full bg-[#1a1a1a] border rounded-lg py-3 px-4 text-white text-sm focus:outline-none transition-all placeholder:text-zinc-600 ${errors[field]
      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
      : 'border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50'
    }`;

  if (isSubmitted) {
    return <AssessmentSuccessView />;
  }

  return (
    <div className="flex-1 w-full bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative">
      {/* Top Progress Indicator */}
      <div className="pb-6 mb-8 border-b border-white/10 flex items-center justify-between overflow-x-auto custom-scrollbar">

        {/* Step 1 Indicator */}
        <div className={`flex items-center gap-4 min-w-max pr-8 transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm relative transition-colors ${step > 1 ? 'border-primary bg-primary text-black' : step === 1 ? 'border-primary text-primary' : 'border-white/20 text-white/50'}`}>
            {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : "1"}
            {step === 1 && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-t-md" />}
          </div>
          <div>
            <div className={`text-sm font-bold tracking-wide ${step >= 1 ? 'text-white' : 'text-zinc-500'}`}>About You</div>
            <div className="text-zinc-500 text-xs hidden sm:block">Personal Information</div>
          </div>
        </div>

        {/* Step 2 Indicator */}
        <div className={`flex items-center gap-4 min-w-max pr-8 relative transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`absolute top-1/2 -translate-y-1/2 -left-12 w-8 h-[1px] ${step >= 2 ? 'bg-primary' : 'bg-white/20'}`} />
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm relative transition-colors ${step > 2 ? 'border-primary bg-primary text-black' : step === 2 ? 'border-primary text-primary' : 'border-white/20 text-white/50'}`}>
            {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : "2"}
            {step === 2 && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-t-md" />}
          </div>
          <div>
            <div className={`text-sm font-bold tracking-wide ${step >= 2 ? 'text-white' : 'text-zinc-500'}`}>Goals & Background</div>
            <div className="text-zinc-500 text-xs hidden sm:block">Fitness & Lifestyle</div>
          </div>
        </div>

        {/* Step 3 Indicator */}
        <div className={`flex items-center gap-4 min-w-max relative transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`absolute top-1/2 -translate-y-1/2 -left-12 w-8 h-[1px] ${step >= 3 ? 'bg-primary' : 'bg-white/20'}`} />
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm relative transition-colors ${step === 3 ? 'border-primary text-primary' : 'border-white/20 text-white/50'}`}>
            3
            {step === 3 && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-t-md" />}
          </div>
          <div>
            <div className={`text-sm font-bold tracking-wide ${step >= 3 ? 'text-white' : 'text-zinc-500'}`}>Health & Additional Info</div>
            <div className="text-zinc-500 text-xs hidden sm:block">Medical, Nutrition & More</div>
          </div>
        </div>

      </div>

          {/* STEP 1 CONTENT */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-heading font-black text-2xl text-white uppercase tracking-tight mb-2">ABOUT YOU</h2>
                  <p className="text-zinc-400 text-sm">Let&apos;s start with some basic information.</p>
                </div>
                <div className="text-primary text-sm font-bold tracking-wide border border-primary/20 bg-primary/5 px-4 py-2 rounded-full hidden sm:block">
                  Step 1 of 3
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1: First Name & Last Name */}
                  <div className="space-y-2 flex flex-col mt-2">
                    <div className="relative group/input">
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
                        className={`${inputClasses('firstName').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 peer`}
                        placeholder=" "
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <User className={`h-4 w-4 ${errors.firstName ? 'text-red-500' : 'text-primary'} peer-focus:text-primary transition-colors`} />
                      </div>
                      <label 
                        htmlFor="firstName"
                        className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.firstName ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <ErrorMsg field="firstName" />
                  </div>

                  <div className="space-y-2 flex flex-col mt-2">
                    <div className="relative group/input">
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }}
                        className={`${inputClasses('lastName').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 peer`}
                        placeholder=" "
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <User className={`h-4 w-4 ${errors.lastName ? 'text-red-500' : 'text-primary'} peer-focus:text-primary transition-colors`} />
                      </div>
                      <label 
                        htmlFor="lastName"
                        className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.lastName ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                      >
                        Last Name / Title <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <ErrorMsg field="lastName" />
                  </div>                  {/* Row 2: Age & Gender */}
                  <div className="space-y-2 flex flex-col mt-2">
                    <div className="relative group/input">
                      <input
                        type="number"
                        id="age"
                        min="1"
                        max="120"
                        onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                        value={age}
                        onChange={(e) => { setAge(e.target.value); clearError('age'); }}
                        className={`${inputClasses('age').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 pr-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none peer`}
                        placeholder=" "
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Calendar className={`h-4 w-4 ${errors.age ? 'text-red-500' : 'text-primary'} peer-focus:text-primary transition-colors`} />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10 text-xs font-semibold text-zinc-500">
                        yrs
                      </div>
                      <label 
                        htmlFor="age"
                        className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.age ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                      >
                        Age <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <ErrorMsg field="age" />
                  </div>

                  <div className="space-y-2 flex flex-col mt-2">
                    <CustomSelect
                      id="gender"
                      label="Gender"
                      icon={User}
                      required
                      value={gender}
                      onChange={(val) => {
                        setGender(val);
                        clearError("gender");
                      }}
                      error={errors.gender}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" }
                      ]}
                    />
                    <ErrorMsg field="gender" />
                  </div>

                  {/* Row 3: Height & Weight */}
                  <div className="space-y-2 flex flex-col mt-2">
                    <div className="relative group/input">
                      <input
                        type="text"
                        id="height"
                        value={height}
                        onChange={(e) => { setHeight(e.target.value); clearError('height'); }}
                        className={`${inputClasses('height').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 pr-14 peer`}
                        placeholder=" "
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Ruler className={`h-4 w-4 ${errors.height ? 'text-red-500' : 'text-primary'} peer-focus:text-primary transition-colors`} />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10 text-xs font-semibold text-zinc-500">
                        cm
                      </div>
                      <label 
                        htmlFor="height"
                        className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.height ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                      >
                        Height <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <ErrorMsg field="height" />
                  </div>

                  <div className="space-y-2 flex flex-col mt-2">
                    <div className="relative group/input">
                      <input
                        type="text"
                        id="weight"
                        value={weight}
                        onChange={(e) => { setWeight(e.target.value); clearError('weight'); }}
                        className={`${inputClasses('weight').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 pr-14 peer`}
                        placeholder=" "
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Scale className={`h-4 w-4 ${errors.weight ? 'text-red-500' : 'text-primary'} peer-focus:text-primary transition-colors`} />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10 text-xs font-semibold text-zinc-500">
                        kg
                      </div>
                      <label 
                        htmlFor="weight"
                        className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.weight ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                      >
                        Current Weight <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <ErrorMsg field="weight" />
                  </div>

                  {/* Row 4: Email & Phone */}
                  <div className="space-y-2 flex flex-col mt-2">
                    <div className="relative group/input">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                        className={`${inputClasses('email').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 peer`}
                        placeholder=" "
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Mail className={`h-4 w-4 ${errors.email ? 'text-red-500' : 'text-primary'} peer-focus:text-primary transition-colors`} />
                      </div>
                      <label 
                        htmlFor="email"
                        className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.email ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <ErrorMsg field="email" />
                  </div>

                  <div className="space-y-2 flex flex-col mt-2">
                    <div className="relative group/input">
                      <div className={`flex h-[46px] border rounded-lg bg-[#1a1a1a] transition-all relative ${errors.phone ? 'border-red-500/50 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/50' : 'border-white/10 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50'}`}>
                        <div className="flex items-center pl-3 pr-3 border-r border-white/10 bg-[#1a1a1a] z-10 rounded-l-lg">
                          <span className="text-xl leading-none">🇮🇳</span>
                          <span className="text-white text-sm ml-2 font-medium">+91</span>
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={phone}
                          onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
                          className="peer flex-1 bg-transparent px-4 text-white text-sm focus:outline-none placeholder-transparent h-full"
                          placeholder=" "
                        />
                        <label 
                          htmlFor="phone"
                          className={`absolute left-[5.5rem] -top-2.5 bg-[#121212] px-1.5 text-[11px] transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-[5.5rem] peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-[5.5rem] peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.phone ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                      </div>
                    </div>
                    <ErrorMsg field="phone" />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-white text-sm font-semibold flex items-center gap-1">Current Activity Level <span className="text-red-500">*</span></label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: 'A', title: 'Sedentary', desc: '(mostly sitting)', icon: '🛋️' },
                      { id: 'B', title: 'Lightly active', desc: '(1-3 days/week)', icon: '🚶' },
                      { id: 'C', title: 'Moderately active', desc: '(3-5 days/week)', icon: '🏃' },
                      { id: 'D', title: 'Very active', desc: '(6-7 days/week)', icon: '🏋️' }
                    ].map((item) => {
                      const isActive = activityLevel === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => { setActivityLevel(item.id); clearError('activityLevel'); }}
                          className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${isActive ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]' : errors.activityLevel ? 'bg-red-500/5 border-red-500/50 hover:border-red-500' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'}`}
                        >
                          {isActive && (
                            <div className="absolute top-0 right-0 bg-primary text-black w-6 h-6 flex items-center justify-center rounded-bl-lg rounded-tr-xl">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                          )}
                          <div className="flex flex-col items-center text-center gap-3">
                            <div className={`text-2xl ${isActive ? '' : 'opacity-70'}`}>{item.icon}</div>
                            <div>
                              <div className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-zinc-400'}`}>{item.id}</div>
                              <div className={`text-sm ${isActive ? 'text-white' : 'text-zinc-400'}`}>{item.title}</div>
                              <div className={`text-xs mt-1 ${isActive ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.desc}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <ErrorMsg field="activityLevel" />
                </div>

                <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-4 flex items-center gap-3 mt-6">
                  <Lightbulb className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-zinc-400 text-xs sm:text-sm">Be honest about your activity level. It helps me create the safest and most effective plan for you.</p>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button type="button" disabled className="opacity-50 cursor-not-allowed group flex items-center justify-center h-12 px-6 bg-transparent border border-white/10 text-white text-sm font-bold tracking-wide uppercase transition-all rounded-md w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>

                  <div className="flex-1 max-w-xs w-full flex flex-col items-center gap-2">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/3 rounded-full transition-all duration-500" />
                    </div>
                    <span className="text-zinc-500 text-xs">Step 1 of 3</span>
                  </div>

                  <button type="button" onClick={handleNext} className="group flex items-center justify-center h-12 px-8 bg-primary text-black text-sm font-black tracking-wide uppercase transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] rounded-md w-full sm:w-auto">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2 CONTENT */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Target className="w-10 h-10 text-primary stroke-[1.5]" />
                  <div>
                    <h2 className="font-heading font-black text-2xl text-white uppercase tracking-tight mb-1">YOUR GOALS & BACKGROUND</h2>
                    <p className="text-zinc-400 text-sm">Tell me about your goals, training experience and lifestyle.</p>
                  </div>
                </div>
                <div className="text-primary text-sm font-bold tracking-wide border border-primary/20 bg-primary/5 px-4 py-2 rounded-full hidden sm:block">
                  Step 2 of 3
                </div>
              </div>

              <form className="space-y-10">
                <div className="space-y-4 border-t border-white/10 pt-8">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="text-primary">1.</span> Primary Goal <span className="text-zinc-500 text-sm font-normal ml-1">(Select your main goal)</span> <span className="text-red-500 text-sm">*</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {[
                      { id: 'A', title: 'Fat Loss', icon: Flame },
                      { id: 'B', title: 'Muscle Gain', icon: BicepsFlexed },
                      { id: 'C', title: 'Strength', icon: Dumbbell },
                      { id: 'D', title: 'Performance', icon: Activity },
                      { id: 'E', title: 'General Health', icon: Heart },
                      { id: 'F', title: 'Body Recomp', icon: RefreshCcw },
                      { id: 'G', title: 'Other', icon: MoreHorizontal }
                    ].map((item) => {
                      const isActive = primaryGoal === item.id;
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => { setPrimaryGoal(item.id); clearError('primaryGoal'); }}
                          className={`relative p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${isActive ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] text-primary' : errors.primaryGoal ? 'bg-red-500/5 border-red-500/50 hover:border-red-500' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'}`}
                        >
                          {isActive && (
                            <div className="absolute top-0 right-0 bg-primary text-black w-5 h-5 flex items-center justify-center rounded-bl-md rounded-tr-xl">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                          )}
                          <div className="flex flex-col items-center text-center gap-2">
                            <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-primary/80'}`} />
                            <div>
                              <div className={`font-bold text-xs ${isActive ? 'text-white' : 'text-zinc-400'}`}>{item.id}</div>
                              <div className={`text-[11px] leading-tight mt-0.5 ${isActive ? 'text-white font-medium' : 'text-zinc-400'}`}>{item.title}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <ErrorMsg field="primaryGoal" />
                </div>

                <div className="space-y-6 border-t border-white/10 pt-8">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="text-primary">2.</span> Training Background
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <CustomSelect
                        id="experience"
                        label="Years of resistance experience"
                        required
                        value={experience}
                        onChange={(val) => {
                          setExperience(val);
                          clearError("experience");
                        }}
                        error={errors.experience}
                        options={[
                          { value: "none", label: "None" },
                          { value: "1", label: "1 Year" },
                          { value: "2-3", label: "2-3 Years" },
                          { value: "4+", label: "4+ Years" }
                        ]}
                      />
                      <ErrorMsg field="experience" />
                    </div>

                    <div className="space-y-2 flex flex-col">
                      <CustomSelect
                        id="frequency"
                        label="Current workout frequency"
                        required
                        value={frequency}
                        onChange={(val) => {
                          setFrequency(val);
                          clearError("frequency");
                        }}
                        error={errors.frequency}
                        options={[
                          { value: "0", label: "0 days" },
                          { value: "1-2", label: "1-2 days/week" },
                          { value: "3-4", label: "3-4 days/week" },
                          { value: "5+", label: "5+ days/week" }
                        ]}
                      />
                      <ErrorMsg field="frequency" />
                    </div>

                    <div className="space-y-2 flex flex-col">
                      <CustomSelect
                        id="cardio"
                        label="Cardio routine"
                        required
                        value={cardio}
                        onChange={(val) => {
                          setCardio(val);
                          clearError("cardio");
                        }}
                        error={errors.cardio}
                        options={[
                          { value: "none", label: "None" },
                          { value: "light", label: "Light" },
                          { value: "intense", label: "Intense" }
                        ]}
                      />
                      <ErrorMsg field="cardio" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-white text-sm font-semibold flex items-center gap-1">
                      Access to equipment <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'Gym', label: 'Gym', icon: Dumbbell },
                        { id: 'Home Gym', label: 'Home Gym', icon: Dumbbell },
                        { id: 'Home', label: 'Home', desc: '(Bodyweight only)', icon: User }
                      ].map((item) => {
                        const isActive = equipment === item.id;
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.id}
                            onClick={() => { setEquipment(item.id); clearError('equipment'); }}
                            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                              isActive
                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] font-bold'
                                : errors.equipment
                                ? 'bg-red-500/5 border-red-500/50 text-zinc-400'
                                : 'bg-[#1a1a1a] border-white/10 hover:border-white/20 text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 shrink-0 text-primary" />
                              <div className="flex flex-col text-left">
                                <span className="text-sm font-semibold leading-none">{item.label}</span>
                                {item.desc && <span className="text-[10px] text-zinc-500 mt-1">{item.desc}</span>}
                              </div>
                            </div>
                            {isActive && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                          </div>
                        );
                      })}
                    </div>
                    <ErrorMsg field="equipment" />
                  </div>
                </div>

                <div className="space-y-6 border-t border-white/10 pt-8">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="text-primary">3.</span> Lifestyle
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2 flex flex-col mt-2">
                      <div className="relative group/input">
                        <input
                          type="text"
                          id="occupation"
                          value={occupation}
                          onChange={(e) => { setOccupation(e.target.value); clearError('occupation'); }}
                          className={`${inputClasses('occupation').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 peer`}
                          placeholder=" "
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Briefcase className={`h-4 w-4 ${errors.occupation ? 'text-red-500' : 'text-zinc-500'} peer-focus:text-primary transition-colors`} />
                        </div>
                        <label 
                          htmlFor="occupation"
                          className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] whitespace-nowrap transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.occupation ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                        >
                          Occupation <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <ErrorMsg field="occupation" />
                    </div>

                    <div className="space-y-2 flex flex-col mt-2">
                      <div className="relative group/input">
                        <input
                          type="text"
                          id="steps"
                          value={steps}
                          onChange={(e) => { setSteps(e.target.value); clearError('steps'); }}
                          className={`${inputClasses('steps').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 pr-16 peer`}
                          placeholder=" "
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Footprints className={`h-4 w-4 ${errors.steps ? 'text-red-500' : 'text-zinc-500'} peer-focus:text-primary transition-colors`} />
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10 text-xs font-semibold text-zinc-500">
                          steps
                        </div>
                        <label 
                          htmlFor="steps"
                          className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] whitespace-nowrap transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.steps ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                        >
                          Daily steps <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <ErrorMsg field="steps" />
                    </div>

                    <div className="space-y-2 flex flex-col mt-2">
                      <div className="relative group/input">
                        <input
                          type="text"
                          id="sleep"
                          value={sleep}
                          onChange={(e) => { setSleep(e.target.value); clearError('sleep'); }}
                          className={`${inputClasses('sleep').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 pr-14 peer`}
                          placeholder=" "
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Moon className={`h-4 w-4 ${errors.sleep ? 'text-red-500' : 'text-zinc-500'} peer-focus:text-primary transition-colors`} />
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10 text-xs font-semibold text-zinc-500">
                          hrs
                        </div>
                        <label 
                          htmlFor="sleep"
                          className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] whitespace-nowrap transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.sleep ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                        >
                          Sleep <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <ErrorMsg field="sleep" />
                    </div>

                    <div className="space-y-2 flex flex-col mt-2">
                      <CustomSelect
                        id="stress"
                        label="Stress level"
                        icon={Smile}
                        required
                        value={stress}
                        onChange={(val) => {
                          setStress(val);
                          clearError("stress");
                        }}
                        error={errors.stress}
                        options={[
                          { value: "low", label: "Low" },
                          { value: "moderate", label: "Moderate" },
                          { value: "high", label: "High" }
                        ]}
                      />
                      <ErrorMsg field="stress" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t border-white/10 pt-8">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="text-primary">4.</span> Nutrition
                  </h3>

                  <div className="space-y-6">
                    {/* Row 1: Dietary Preference */}
                    <div className="space-y-2 flex flex-col">
                      <label className="text-white text-sm font-semibold flex items-center gap-1">
                        Dietary Preference <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'A', title: 'Vegetarian', icon: '🌱' },
                          { id: 'B', title: 'Eggetarian', icon: '🥚' },
                          { id: 'C', title: 'Non-Vegetarian', icon: '🍗' },
                          { id: 'D', title: 'Vegan', icon: '🌿' }
                        ].map((item) => {
                          const isActive = diet === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => { setDiet(item.id); clearError('diet'); }}
                              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border cursor-pointer transition-all duration-300 text-center gap-1 ${
                                isActive
                                  ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] font-bold'
                                  : errors.diet
                                  ? 'bg-red-500/5 border-red-500/50 text-zinc-400'
                                  : 'bg-[#1a1a1a] border-white/10 hover:border-white/20 text-zinc-400'
                              }`}
                            >
                              <div className="text-xl">{item.icon}</div>
                              <div className="font-bold text-xs">{item.id}</div>
                              <span className="text-[11px] leading-tight font-medium mt-0.5">{item.title}</span>
                            </div>
                          );
                        })}
                      </div>
                      <ErrorMsg field="diet" />
                    </div>

                    {/* Row 2: Meals / Alcohol / Tobacco */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                      <div className="flex flex-col">
                        <CustomSelect
                          id="meals"
                          label="Meals / day"
                          labelPosition="top"
                          required
                          value={meals}
                          onChange={(val) => {
                            setMeals(val);
                            clearError("meals");
                          }}
                          error={errors.meals}
                          options={[
                            { value: "2", label: "2" },
                            { value: "3", label: "3" },
                            { value: "4", label: "4+" }
                          ]}
                        />
                        <ErrorMsg field="meals" />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
                          Do you consume alcohol? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 h-[46px]">
                          <button
                            type="button"
                            onClick={() => { setAlcohol('Yes'); clearError('alcohol'); }}
                            className={`h-full rounded-lg border text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                              alcohol === 'Yes'
                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]'
                                : errors.alcohol
                                ? 'border-red-500/50 text-red-500 bg-red-500/5'
                                : 'bg-[#1a1a1a] border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            {alcohol === 'Yes' && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => { setAlcohol('No'); clearError('alcohol'); }}
                            className={`h-full rounded-lg border text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                              alcohol === 'No'
                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]'
                                : errors.alcohol
                                ? 'border-red-500/50 text-red-500 bg-red-500/5'
                                : 'bg-[#1a1a1a] border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            {alcohol === 'No' && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                            No
                          </button>
                        </div>
                        <ErrorMsg field="alcohol" />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
                          Smoke / use tobacco? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 h-[46px]">
                          <button
                            type="button"
                            onClick={() => { setTobacco('Yes'); clearError('tobacco'); }}
                            className={`h-full rounded-lg border text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                              tobacco === 'Yes'
                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]'
                                : errors.tobacco
                                ? 'border-red-500/50 text-red-500 bg-red-500/5'
                                : 'bg-[#1a1a1a] border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            {tobacco === 'Yes' && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => { setTobacco('No'); clearError('tobacco'); }}
                            className={`h-full rounded-lg border text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                              tobacco === 'No'
                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]'
                                : errors.tobacco
                                ? 'border-red-500/50 text-red-500 bg-red-500/5'
                                : 'bg-[#1a1a1a] border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            {tobacco === 'No' && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                            No
                          </button>
                        </div>
                        <ErrorMsg field="tobacco" />
                      </div>
                    </div>

                    {/* Row 3: Supplements */}
                    <div className="space-y-2 pt-2">
                      <label className="text-white text-sm font-semibold flex items-center gap-1">
                        Supplements currently using (if any)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Pill className="w-4 h-4 text-zinc-500" />
                        </div>
                        <input
                          type="text"
                          value={supplements}
                          onChange={(e) => setSupplements(e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                          placeholder="e.g. Whey Protein, Creatine, Fish Oil, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button type="button" onClick={handleBack} className="group flex items-center justify-center h-12 px-6 bg-transparent border border-white/10 text-white text-sm font-bold tracking-wide uppercase transition-all hover:bg-white/5 rounded-md w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back
                  </button>

                  <div className="flex-1 max-w-xs w-full flex flex-col items-center gap-2">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-2/3 rounded-full transition-all duration-500" />
                    </div>
                    <span className="text-zinc-500 text-xs">Step 2 of 3</span>
                  </div>

                  <button type="button" onClick={handleNext} className="group flex items-center justify-center h-12 px-8 bg-primary text-black text-sm font-black tracking-wide uppercase transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] rounded-md w-full sm:w-auto">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3 CONTENT */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <ClipboardCheck className="w-10 h-10 text-primary stroke-[1.5]" />
                  <div>
                    <h2 className="font-heading font-black text-2xl text-white uppercase tracking-tight mb-1">HEALTH & ADDITIONAL INFO</h2>
                    <p className="text-zinc-400 text-sm">Almost there! A few final details to help me build the best plan for you.</p>
                  </div>
                </div>
                <div className="text-primary text-sm font-bold tracking-wide border border-primary/20 bg-primary/5 px-4 py-2 rounded-full hidden sm:block">
                  Step 3 of 3
                </div>
              </div>

              <form className="space-y-10" onSubmit={handleSubmit}>

                {/* 1. Medical & Health History */}
                <div className="space-y-6 border-t border-white/10 pt-8">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="text-primary">1.</span> Medical & Health History
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-2 flex flex-col mt-2">
                      <CustomSelect
                        id="conditions"
                        label="Diagnosed medical conditions"
                        icon={Activity}
                        required
                        value={conditions}
                        onChange={(val) => {
                          setConditions(val);
                          clearError("conditions");
                        }}
                        error={errors.conditions}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" }
                        ]}
                      />
                      <ErrorMsg field="conditions" />
                    </div>

                    <div className="space-y-2 flex flex-col mt-2">
                      <CustomSelect
                        id="medications"
                        label="Currently taking medications"
                        icon={Pill}
                        required
                        value={medications}
                        onChange={(val) => {
                          setMedications(val);
                          clearError("medications");
                        }}
                        error={errors.medications}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" }
                        ]}
                      />
                      <ErrorMsg field="medications" />
                    </div>

                    <div className="space-y-2 flex flex-col mt-2">
                      <CustomSelect
                        id="injuries"
                        label="Injuries, surgeries or pain"
                        icon={Bandage}
                        required
                        value={injuries}
                        onChange={(val) => {
                          setInjuries(val);
                          clearError("injuries");
                        }}
                        error={errors.injuries}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" }
                        ]}
                      />
                      <ErrorMsg field="injuries" />
                    </div>

                    <div className="space-y-2 flex flex-col mt-2">
                      <CustomSelect
                        id="allergies"
                        label="Dietary allergies/intolerances"
                        icon={Leaf}
                        required
                        value={allergies}
                        onChange={(val) => {
                          setAllergies(val);
                          clearError("allergies");
                        }}
                        error={errors.allergies}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" }
                        ]}
                      />
                      <ErrorMsg field="allergies" />
                    </div>
                  </div>
                </div>

                {/* 2. Progress Tracking */}
                <div className="space-y-6 border-t border-white/10 pt-8">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="text-primary">2.</span> Progress Tracking
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="col-span-1 md:col-span-4 space-y-2 flex flex-col mt-2">
                      <div className="relative group/input">
                        <input
                          type="text"
                          id="waist"
                          value={waist}
                          onChange={(e) => { setWaist(e.target.value); clearError('waist'); }}
                          className={`${inputClasses('waist').replace('placeholder:text-zinc-600', 'placeholder-transparent')} pl-10 pr-14 peer`}
                          placeholder=" "
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Ruler className={`h-4 w-4 ${errors.waist ? 'text-red-500' : 'text-zinc-500'} peer-focus:text-primary transition-colors`} />
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10 text-xs font-semibold text-zinc-500">
                          cm
                        </div>
                        <label 
                          htmlFor="waist"
                          className={`absolute left-9 -top-2.5 bg-[#121212] px-1.5 text-[11px] whitespace-nowrap max-w-[calc(100%-3rem)] truncate transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-10 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-9 peer-focus:text-[11px] peer-focus:bg-[#121212] ${errors.waist ? 'text-red-500 peer-focus:text-red-500' : 'text-zinc-400 peer-focus:text-primary'} z-10`}
                        >
                          Waist circumference <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <ErrorMsg field="waist" />
                    </div>

                    <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {/* Photo Upload (Optional) */}
                      <div className="space-y-2">
                        <label className="text-white text-sm font-semibold flex items-center gap-1">
                          Progress Photos
                        </label>
                        <label className="border-2 border-dashed border-white/20 rounded-xl bg-[#1a1a1a]/50 p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1a1a1a] hover:border-primary/50 transition-all h-16 group block">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg, image/png"
                            onChange={(e) => setPhysiqueImage(e.target.files?.[0] || null)}
                          />

                          <p className="text-sm text-zinc-300 font-medium truncate w-full px-4">
                            {physiqueImage ? physiqueImage.name : "Click to choose files or drag here"}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">JPG, PNG (Max. 10MB)</p>
                        </label>
                      </div>

                      {/* Blood Work Upload (Optional) */}
                      <div className="space-y-2">
                        <label className="text-white text-sm font-semibold flex items-center gap-1">
                          Recent blood work
                        </label>
                        <label className="border-2 border-dashed border-white/20 rounded-xl bg-[#1a1a1a]/50 p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1a1a1a] hover:border-primary/50 transition-all h-16 group block">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf, image/jpeg, image/png"
                            onChange={(e) => setBloodReport(e.target.files?.[0] || null)}
                          />

                          <p className="text-sm text-zinc-300 font-medium truncate w-full px-4">
                            {bloodReport ? bloodReport.name : "Click to choose files or drag here"}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">PDF, JPG (Max. 10MB)</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Commitment & Final Questions */}
                <div className="space-y-8 border-t border-white/10 pt-8">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="text-primary">3.</span> Commitment & Final Questions
                  </h3>

                  <div className="space-y-8">
                    <div className="space-y-6 flex flex-col">
                      <label className="text-white text-base font-semibold leading-relaxed block max-w-2xl">
                        On a scale of 1-10, how committed are you to following a structured nutrition and training plan for the next 12 weeks? <span className="text-red-500">*</span>
                      </label>

                      <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap max-w-4xl">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <div
                            key={num}
                            onClick={() => { setCommitmentLevel(num); clearError('commitmentLevel'); }}
                            className={`flex-1 min-w-[35px] sm:min-w-[40px] h-12 sm:h-14 flex items-center justify-center rounded-lg border-2 text-base sm:text-lg font-black cursor-pointer transition-all ${commitmentLevel === num ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] scale-110 z-10' : errors.commitmentLevel ? 'border-red-500/50 text-red-500' : 'bg-[#1a1a1a] border-white/10 text-zinc-500 hover:border-white/30 hover:text-white'}`}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-zinc-500 font-medium max-w-4xl px-2">
                        <span>Not committed</span>
                        <span className="text-primary/80">Highly committed</span>
                      </div>
                      <ErrorMsg field="commitmentLevel" />
                    </div>

                    <div className="space-y-3 pt-4">
                      <label className="text-white text-sm font-semibold flex items-center gap-1">
                        Is there anything else you think I should know before designing your program?
                      </label>
                      <div className="relative mt-2">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-5 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600 min-h-[140px] resize-none custom-scrollbar"
                          placeholder="Type your message here... Any specific preferences, constraints, or previous experiences?"
                        />
                        <div className="absolute bottom-5 right-5 pointer-events-none text-primary">
                          <Edit3 className="w-5 h-5 opacity-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal Footer & Quote */}
                <div className="border-t border-white/10 pt-8 mt-8">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-8">

                    <div className="flex-1 space-y-5">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5 opacity-80" />
                        <div>
                          <h4 className="text-white text-sm font-bold mb-1">Privacy is Our Priority</h4>
                          <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">All information is confidential and used only to design your personalized program.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5 opacity-80" />
                        <div>
                          <h4 className="text-white text-sm font-bold mb-1">100% Secure Data</h4>
                          <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">Your data is fully encrypted and will never be shared with any third party.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 lg:max-w-md w-full flex flex-col justify-center items-start lg:items-end text-left lg:text-right border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 pl-0 lg:pl-8">
                      <div className="relative">
                        <span className="absolute -top-3 -left-4 text-4xl text-white/10 font-serif">"</span>
                        <p className="text-zinc-400 text-sm italic leading-relaxed relative z-10 pl-2 lg:pl-0">
                          Your transformation starts with the right plan. Let&apos;s build a stronger, healthier you.
                        </p>
                      </div>
                      <div className="mt-4 flex flex-col lg:items-end">
                        <span className="text-primary text-lg font-black uppercase tracking-wider font-heading">- Ankit Baliyan</span>
                        <span className="text-sm font-bold text-white mt-1">15+ Years Experience</span>
                        <span className="text-xs text-zinc-400 mt-1 max-w-[250px]">ASCA Level 2, ACE, NASM CES, ISSA NUTRITIONIST</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Actions for Step 3 */}
                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
                  <button type="button" onClick={handleBack} className="group flex items-center justify-center h-12 lg:h-14 px-6 lg:px-8 bg-transparent border border-white/10 text-white text-sm lg:text-base font-bold tracking-wide uppercase transition-all hover:bg-white/5 rounded-lg w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4 lg:h-5 lg:w-5 transition-transform group-hover:-translate-x-1" />
                    Back
                  </button>

                  <div className="flex-1 max-w-sm w-full flex flex-col items-center gap-2 lg:gap-3">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]" />
                    </div>
                    <span className="text-zinc-400 text-xs lg:text-sm font-medium">Final Step - Ready to Submit</span>
                  </div>

                  <button type="submit" className="group flex items-center justify-center h-12 lg:h-14 px-8 lg:px-10 bg-primary text-black text-sm lg:text-base font-black tracking-wide uppercase transition-all hover:bg-white hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] rounded-lg w-full sm:w-auto">
                    Submit Application
                    <Send className="ml-2 lg:ml-3 h-4 w-4 lg:h-5 lg:w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>
              </form>
            </div>
          )}

    </div>
  );
}

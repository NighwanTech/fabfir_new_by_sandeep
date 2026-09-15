export const globalData = {
  navbar: {
    logo: {
      line1: "ELITE",
      line2: "PERFORMANCE"
    },
    links: [
      { name: "HOME", href: "/#home" },
      { name: "ABOUT", href: "/#about" },
      { name: "PROGRAMS", href: "/#programs" },
      { name: "SERVICES", href: "/#services" },
      { name: "COACHES", href: "/#coaches" },
      { name: "TRANSFORMATIONS", href: "/#transformations" },
      { name: "MEMBERSHIP", href: "/#pricing" },
      { name: "GALLERY", href: "/#gallery" },
      { name: "CONTACT", href: "/#contact" },
    ],
    cta: "BOOK ASSESSMENT"
  }
};

export const homeData = {
  heroSlides: [
    {
      id: "default-1",
      badge: "PROVEN METHODOLOGY",
      headingLine1: "BUILT ON",
      headingLine2: "PURE SCIENCE",
      description: "Work with industry-leading coaches who tailor every session to your unique biomechanics and goals.",
      primaryCTA: "Start Your Journey",
      secondaryCTA: "View Programs",
      src: "/fabfit.jpeg",
      type: "image"
    },
    {
      id: "default-2",
      badge: "ELITE PERFORMANCE",
      headingLine1: "UNLEASH YOUR",
      headingLine2: "TRUE POTENTIAL",
      description: "Transform your body with data-driven fitness coaching and customized nutrition.",
      primaryCTA: "Book Assessment",
      secondaryCTA: "Explore Programs",
      src: "/coach-dhiraj.png",
      type: "image"
    }
  ],
  stats: [
    /* --- DATA NOW FETCHED FROM API (/api/counters) ---
    { value: "500+", label: "Transformations", icon: "User" },
    { value: "8+", label: "Years Experience", icon: "Trophy" },
    { value: "25+", label: "Expert Coaches", icon: "Activity" },
    { value: "4.9/5", label: "Client Rating", icon: "Star" },
    */
  ] as any[],
  intro: {
    badge: "ABOUT US",
    headingLine1: "BUILD ON PASSION",
    headingLine2: "DRIVEN BY RESULTS",
    description: "We're more than just a training facility. We are a team of passionate coaches and performance specialists dedicated to helping you become the strongest, healthiest version of yourself.",
    checklist: [
      "Personalized Training",
      "Evidence Based Approach",
      "Holistic Performance",
      "Sustainable Results"
    ],
    cta: "LEARN MORE",
    images: ["/fabfit.jpeg", "/coach-dhiraj.png"]
  },
  services: {
    badge: "WHAT WE OFFER",
    headingLine1: "SERVICES /",
    headingLine2: "TRAINING",
    description: "Science-backed training programs to help you move better, get stronger and perform at your best.",
    items: [
      /* --- DATA NOW FETCHED FROM API (/api/services) ---
      {
        id: 1,
        title: "STRENGTH & CONDITIONING",
        description: "Build muscle, increase strength and improve overall performance.",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
        icon: "Dumbbell"
      }
      */
    ] as any[],
    cta: "BOOK YOUR ASSESSMENT"
  },
  coaches: {
    badge: "THE MASTER EXPERT",
    headingLine1: "MEET THE",
    headingLine2: "EXPERT",
    description: "An elite industry leader dedicated to pushing your limits and maximizing your true potential.",
    items: [
      /* --- DATA NOW FETCHED FROM API (/api/team-members) ---
      {
        id: 1,
        name: "HEAD COACH",
        role: "EVIDENCE-BASED FITNESS & NUTRITION COACH",
        catchyText: "TRAIN SMARTER.\nFUEL BETTER.\nPERFORM FOR LIFE.",
        description: "Helping busy professionals improve body composition, strength and performance through evidence-based coaching.",
        bottomCredentials: "HYROX Athlete • National Men's Physique Athlete",
        details: [
          "CSCS - Certified Strength & Conditioning Specialist",
          "8+ years coaching elite athletes"
        ],
        image: "/coach-dhiraj.png",
        ctaText: "Book Your Assessment Call",
        socials: { instagram: "#", twitter: "#", linkedin: "#" }
      }
      */
    ] as any[]
  },
  trainers: {
    badge: "OUR ELITE TEAM",
    headingLine1: "MEET YOUR",
    headingLine2: "GUIDES",
    description: "Our diverse team of specialized trainers, yoga instructors, and therapists are here to craft your perfect fitness journey.",
    items: [
      /* --- DATA NOW FETCHED FROM API (/api/team-members) ---
      {
        id: 1,
        name: "SARAH JENNINGS",
        role: "YOGA & MOBILITY SPECIALIST",
        specialty: "Ashtanga & Vinyasa Flow",
        description: "Guiding you towards better flexibility, mental clarity, and core strength through advanced yoga practices.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
        socials: { instagram: "#", linkedin: "#" }
      }
      */
    ] as any[]
  },
  testimonials: {
    statsBadge: "1000+ CLIENTS COACHED | 5000+ PERSONALIZED PROGRAMS | 10000+ COACHING HOURS",
    badge: "TRANSFORMATIONS",
    headingLine1: "REAL BODIES.",
    headingLine2: "REAL RESULTS.",
    description: "Witness the undeniable power of evidence-based coaching. These are real transformations from individuals who committed to the process.",
    cta: "VIEW ALL STORIES",
    bottomHeader: "REAL PEOPLE. REAL PROGRESS.",
    bottomSubHeader: "Personalized coaching built around individual goals.",
    bottomCta: "VIEW ALL TRANSFORMATIONS",
    featuredTransformations: [
      /* --- DATA NOW FETCHED FROM API (/api/transformations) --- */
    ] as any[],
    progressGrid: [
      /* --- DATA NOW FETCHED FROM API (/api/transformations) --- */
    ] as any[]
  },
  clientTestimonials: {
    badge: "TESTIMONIALS",
    headingLine1: "WHAT",
    headingLine2: "CLIENTS SAY",
    subHeader: "Real stories from real people. Real transformations.",
    reviews: [
      /* --- DATA NOW FETCHED FROM API (/api/testimonials) --- */
    ] as any[],
    footerStats: [
      { value: "500+", label: "TRANSFORMED CLIENTS", icon: "users" },
      { value: "8+ YEARS", label: "COACHING EXPERIENCE", icon: "shield" },
      { value: "100%", label: "PERSONALIZED APPROACH", icon: "dumbbell" },
      { value: "EVIDENCE BASED", label: "PROVEN METHODS", icon: "checkCircle" },
      { value: "RESULTS", label: "THAT LAST", icon: "heart" }
    ]
  },
  membership: {
    badge: "MEMBERSHIP & PERSONAL TRAINING",
    headingLine1: "CHOOSE YOUR",
    headingLine2: "COMMITMENT.",
    subHeader: "Every membership includes an onboarding assessment, monthly BCA tracking and full access to the training floor.",
    plans: [
      /* --- DATA NOW FETCHED FROM API (/api/membership-plans) --- */
    ] as any[],
    ptBanner: {
      title: "One-time onboarding – Get personalized attention with our expert Personal training.",
      subtitle: "Programmed, coached and tracked end to end. Contact for PT",
      ctaText: "Contact for PT"
    },
    footerStats: [
      { value: "500+", label: "TRANSFORMED CLIENTS", icon: "users" },
      { value: "8+ YEARS", label: "COACHING EXPERIENCE", icon: "shield" },
      { value: "100%", label: "PERSONALIZED APPROACH", icon: "dumbbell" },
      { value: "EVIDENCE BASED", label: "PROVEN METHODS", icon: "checkCircle" },
      { value: "RESULTS", label: "THAT LAST", icon: "heart" }
    ]
  },
  gallery: {
    badge: "GALLERY",
    headingLine1: "MOMENTS THAT",
    headingLine2: "INSPIRE.",
    subHeader: "Real people. Real workouts. Real progress.",
    photoCategories: ["ALL", "TRANSFORMATIONS", "TRAINING SESSIONS", "GYM LIFE", "EVENTS", "COMMUNITY", "WORKSHOPS"],
    videoCategories: ["ALL", "TRAINING SESSIONS", "EXERCISE TECHNIQUE", "EVENTS", "WORKSHOPS", "TRANSFORMATIONS", "CLIENT STORIES"],
    previewItems: [
      /* --- DATA NOW FETCHED FROM API (/api/gallery/preview) --- */
    ] as any[],
    photos: [
      /* --- DATA NOW FETCHED FROM API (/api/gallery) --- */
    ] as any[],
    videos: [
      /* --- DATA NOW FETCHED FROM API (/api/gallery) --- */
    ] as any[]
  },
  contact: {
    badge: "CONTACT US",
    headingLine1: "LET'S START",
    headingLine2: "YOUR TRANSFORMATION",
    headingLine3: "TOGETHER.",
    subHeader: "Have questions or ready to begin? Our team is here to help you achieve your best.",
    info: [
      { id: 1, type: "phone", title: "CALL US", details: "+91 92203 93004" },
      { id: 2, type: "email", title: "EMAIL US", details: "fabfitgym04@gmail.com" },
      { id: 3, type: "address", title: "VISIT US", details: "62C, 6th Floor, Supermart 1,\nDLF Phase-4, Gurgaon" },
      { id: 4, type: "hours", title: "OPENING HOURS", details: "Mon - Sun: 6:00 AM - 11:00 PM" }
    ],
    socials: [
      { id: 1, name: "Instagram", url: "#" },
      { id: 2, name: "Facebook", url: "#" },
      { id: 3, name: "YouTube", url: "#" },
      { id: 4, name: "WhatsApp", url: "#" }
    ],
    formHeader: "SEND US A",
    formHeaderHighlight: "MESSAGE",
    mapAddress: {
      title: "Fab Fit Performance",
      addressLine1: "62C, 6th Floor, Supermart 1,",
      addressLine2: "DLF Phase-4, Gurgaon"
    }
  },
  programs: {
    badge: "OUR PROGRAMS",
    headingLine1: "TRAIN WITH PURPOSE.",
    headingLine2: "CHOOSE",
    headingLine3: "YOUR GOAL.",
    subHeader: "Whether you want to transform your body, build strength, or perform at your best, we have the right program for you.",
    mainCards: [
      /* --- DATA NOW FETCHED FROM API (/api/programs) --- */
    ] as any[],
    stagePrep: {
      titleLine1: "COMPETITION /",
      titleLine2: "STAGE PREP",
      description: "Complete preparation for bodybuilding & fitness competitions. Includes workout, nutrition, posing and peak week guidance.",
      image: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1200&auto=format&fit=crop",
      features: [
        { iconType: "clipboard", text1: "Customized", text2: "Training" },
        { iconType: "utensils", text1: "Nutrition", text2: "Planning" },
        { iconType: "figure", text1: "Posing", text2: "Practice" },
        { iconType: "calendar", text1: "Peak Week", text2: "Management" }
      ]
    },
    footerFeatures: [
      { id: 1, title: "GOAL FOCUSED", description: "Programs designed around your specific goals.", iconType: "target" },
      { id: 2, title: "EXPERT COACHING", description: "Learn from certified experts with real experience.", iconType: "user-check" },
      { id: 3, title: "PROVEN RESULTS", description: "Structured programs that deliver measurable results.", iconType: "bar-chart" },
      { id: 4, title: "ONGOING SUPPORT", description: "We are with you 24/7 to keep you on track.", iconType: "message" },
      { id: 5, title: "FLEXIBLE OPTIONS", description: "Multiple programs to suit every lifestyle and level.", iconType: "award" }
    ]
  }
};


// random color, with 10 copntrasting colors, cold and hot in consecutive order
export const colors = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
  
]

export const languageList = [
  { code: 'en', name: 'English', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg" },
  { code: 'zh-tw', name: '繁體中文', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/TW.svg" },
  { code: 'zh-cn', name: '简体中文', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg" },
  { code: 'jp', name: 'Japanese', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg" },
  { code: 'es', name: 'Spanish', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg" },
  { code: 'fr', name: 'French', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg" },
  { code: 'ar', name: 'Arabic', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/SA.svg" },
  { code: 'ru', name: 'Russian', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/RU.svg" },
  { code: 'pt', name: 'Portuguese', flag: "http://purecatamphetamine.github.io/country-flag-icons/3x2/PT.svg" }
];

export function getLanguageNameByCode(code) {
  const language = languageList.find(lang => lang.code === code);
  return language ? language : null;
}

export const chromeStoreLink = "https://chromewebstore.google.com/detail/fusion-video-book/cncegakknkokakaclbpieegnhklkfpik"
export const shareLink = import.meta.env.VITE_FUSIONAI_SHARE_URL
export const fusionaiLink = import.meta.env.VITE_FUSIONAI_BASE_URL


export const inActionContents = {
  headline: "Experience in Action",
  description: "Pick one demo video and click the summarization button to get an instant summary.",
}

export const whyContents = {
  "headline": "Watch Smarter, Not Longer!",
  otherHeadline: [
    "Get to the Point, Every Time!",
    "Only the Essentials, No Extra Seconds Wasted!",
    "Cut the Clutter, Enjoy the Core Content!",
    "Maximize Your Time, Minimize the Watch!",
    "Watch Smarter, Not Longer!"
  ],
  "subheadline": "Save Time, Take Better Notes, and Revisit Content Easily",
  why: [
    {
      subheader: "Avoid Redundancy in Content",
      description: "Many YouTube videos share similar content. You shouldn't have to waste time watching the same information over and over again. We streamline your experience, providing you with unique and valuable insights without the repetition.",
      image: "avoidRredundancyInContent"
    },
    {
      subheader: "Skip the Fluff",
      description: "Videos are often designed for easy consumption, featuring openings, transitions, and sometimes entertaining but non-informative content. You don't need these fillers; you need the core information. We extract the essentials, giving you what truly matters.",
      image: "skipTheFluff"
    },
    {
      subheader: "Improve Learning Efficiency",
      description: "Learning from videos can be effective, but also time-intensive. Our service focuses on highlighting the critical points, making learning faster and more efficient. We believe in empowering you with knowledge quickly, so you can learn and grow without delays.",
      image: "improveLearningEfficiency"
    },
    // {
    //   subheader: "Get Reliable Information Quickly",
    //   description: "Sometimes we need information fast. Videos are reliable sources, especially those with high views and ratings, as they are often updated and accurate. However, they can be time-consuming. We aim to deliver the necessary information swiftly, saving you valuable time."
    // },
    // {
    //   subheader: "Enhance Your Productivity",
    //   description: "Time is one of the most precious resources. By summarizing videos, we help you reclaim time spent on lengthy content, allowing you to focus on more important tasks. Our mission is to enhance your productivity by providing quick access to key information."
    // },
    // {
    //   subheader: "Stay Informed, Effortlessly",
    //   description: "Keep up with the latest trends, news, and developments without the hassle of watching entire videos. Our service ensures you stay informed with the most relevant and significant content, saving you time and effort."
    // }
  ]
  ,
  "cta": {
    "text": "Get Started",
    "link": "/register"
  }
}

export const featuresContents = {
  headline: "Transform Your Learning with AI",
  subheadline: "Enhance your learning process with our innovative AI summarization. Gain quick access to critical information and make your video consumption more effective.",
  features: [
    {
      title: "Low Cost, High Speed Transcription",
      description: "Experience the power of advanced AI technologies that deliver fast and accurate speech-to-text and video-to-text services. Our platform supports various languages, offering low-cost solutions without compromising on speed or quality.",
      mobileDescription: "Advanced AI delivers quick, accurate speech-to-text for multiple languages at a low cost.",
      image: "BoltIcon",
    },
    {
      title: "YouTube Video Support",
      description: "Seamlessly integrate with YouTube, allowing you to summarize and transcribe videos directly from the platform. Enjoy quick and easy access to insights from your favorite YouTube content.",
      mobileDescription: "Summarize and transcribe YouTube videos effortlessly.",
      image: "PlayCircleIcon"
    },
    {
      title: "Upload Your Own Video/Audio",
      description: "Whether it's a lecture, a meeting, or personal content, our service supports uploading your own video or audio files. Get precise transcriptions and summaries tailored to your specific needs.",
      mobileDescription: "Get precise transcriptions and summaries for your own video/audio files.",
      image: "ArrowUpTrayIcon"
    },
    {
      title: "Variety Summary Options",
      description: "Choose from a range of summarization options to suit any requirement. From brief overviews to detailed summaries, our platform adapts to provide the level of detail you need.",
      mobileDescription: "Choose from brief overviews to detailed summaries to fit your needs.",
      image: "DocumentTextIcon"
    },
    {
      title: "Save and Retrieve Content",
      description: "Save your videos and easily retrieve the content by asking questions. Our intuitive search feature ensures you can find the exact information you need, whenever you need it.",
      mobileDescription: "Save videos and find content easily with our search feature.",
      image: "ArchiveBoxArrowDownIcon"
    },
    {
      title: "Easy Sharing",
      description: "Share your summaries effortlessly with friends, colleagues, and teams. Enhance collaboration and communication by providing quick access to essential information.",
      mobileDescription: "Share summaries with friends, colleagues, and teams for better collaboration.",
      image: "ShareIcon"
    }
  ]
}

export const aboutPageContents = {
  title: "About Fusion AI",
  headline: "About Fusion AI",
  seoDescription: "Our mission is to make video content easily accessible and digestible for everyone, saving you time and effort in extracting valuable information.",
  description: "Welcome to Fusion AI, your go-to platform for advanced video transcription and summarization. Our mission is to make video content easily accessible and digestible for everyone, saving you time and effort in extracting valuable information.",
  introduction: {
    headline: "Our Mission",
    description: "At Fusion AI, we believe that time is your most valuable asset. Our goal is to empower you with the tools to quickly and accurately summarize and transcribe video content, enabling you to focus on what truly matters. Whether you're a student, professional, or content creator, Fusion AI helps you harness the power of AI to streamline your workflow.",
  },
  story: {
    headline: "Our Story",
    description: "Fusion AI was born out of the need to simplify the overwhelming amount of video content available online. Our founders, passionate about artificial intelligence and efficiency, set out to create a solution that would transform how people consume and interact with video content. Since our inception, we've been dedicated to innovation, constantly improving our platform to meet the evolving needs of our users."
  },
  technology:{
    headline: "Our Technology",
    description: "Our platform leverages state-of-the-art AI algorithms to deliver fast and accurate transcription and summarization services. We support multiple languages and formats, ensuring that you can work with a diverse range of content. Our cloud-based solution offers secure storage and advanced search capabilities, turning your video content into a powerful knowledge database."
  },
  team:{
    headline: "Our Team",
    description: "Fusion AI is powered by a team of dedicated professionals with expertise in AI, machine learning, and software development. Our team's diverse backgrounds and shared passion for technology drive our commitment to excellence and continuous improvement. We're here to support you every step of the way, from initial use to advanced feature adoption."
  },
  why:{
    headline: "Why Choose Fusion AI",
    description: "At Fusion AI, we're committed to providing you with the best possible experience when it comes to video transcription and summarization. Here are a few reasons why you should choose us:",
    reasons: [
      {
        title: "Innovation",
        description: "We utilize cutting-edge AI technology to provide the most accurate and efficient transcription and summarization services."
      },
      {
        title: "User-Centric Design",
        description: "Our platform is designed with you in mind, offering intuitive features that save you time and enhance productivity."
      },
      {
        title: "Security",
        description: "We prioritize your data security, with robust measures in place to protect your content and personal information."
      },
      {
        title: "Support",
        description: "Our dedicated support team is always ready to assist you with any questions or issues you may encounter."
      }
    ]
  },
  cta:{
    text: 
      "Join the Fusion AI community today and transform the way you interact with video content. Sign up for a free trial and experience the future of video summarization and transcription."
  }
}
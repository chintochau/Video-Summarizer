
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
      image: "BoltIcon"
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
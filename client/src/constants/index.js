
export const languageList = [
  { code: 'en', name: 'English', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"},
  { code: 'zh-tw', name: '繁體中文', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/TW.svg"},
  { code: 'zh-cn', name: '简体中文', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg"},
  { code: 'jp', name: 'Japanese', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg"},
  { code: 'es', name: 'Spanish', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg"},
  { code: 'fr', name: 'French', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg"},
  { code: 'ar', name: 'Arabic', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/SA.svg"},
  { code: 'ru', name: 'Russian', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/RU.svg"},
  { code: 'pt', name: 'Portuguese', flag :"http://purecatamphetamine.github.io/country-flag-icons/3x2/PT.svg"}
];

export function getLanguageNameByCode(code) {
  const language = languageList.find(lang => lang.code === code);
  return language ? language : null;
}

export const chromeStoreLink = "https://chromewebstore.google.com/detail/fusion-video-book/cncegakknkokakaclbpieegnhklkfpik"
export const shareLink = import.meta.env.VITE_FUSIONAI_SHARE_URL
export const fusionaiLink = import.meta.env.VITE_FUSIONAI_BASE_URL 



export const homeContents = {
    "headline": "Revolutionize Your Learning Experience",
    "subheadline": "Save Time, Take Better Notes, and Revisit Content Easily",
    "why": [
        {
          "title": "Outline a 2-hour video in 10 seconds",
          "description": "You’re eager to learn something new and find a promising video, but it’s two hours long. We tell you whether it's worth your time in seconds."
        },
        {
          "title": "The Time-Saving Power of AI Summarization",
          "description": "We use cutting-edge AI to analyze videos and generate concise summaries. In minutes, you understand the core content and decide if it’s worth delving deeper."
        },
        {
          "title": "Effortless Note-Taking",
          "description": "No more jotting down notes while trying to keep up with a video. Our app transcribes and summarizes videos for you, letting you focus on learning."
        },
        {
          "title": "Revisit and Retrieve with Ease",
          "description": "Every transcript and summary is stored in the cloud, easily searchable and accessible. Need to recall a specific detail? Just type in your query, and our app finds it instantly."
        },
        {
          "title": "A Gateway to Endless Knowledge",
          "description": "Our app finds related videos on topics like AI, summarizes them, and organizes the insights in your personal cloud database. Ask any question, and our app retrieves the relevant information."
        },
        {
          "title": "Transforming the Way You Learn",
          "description": "Our app empowers you to learn smarter by addressing uncertain video value, tedious note-taking, and difficulty in revisiting content. Maximize your potential and let your curiosity thrive without limits."
        }
      ]
      ,
    "cta": {
        "text": "Get Started",
        "link": "/register"
    }
}

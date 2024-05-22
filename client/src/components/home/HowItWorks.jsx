import React from 'react';
import { Container } from '../common/Container';
import { useEffect, useState } from 'react'
import { cn } from '@/utils/utils';
import backgroundImage from '@/assets/background-features.jpg'
import screenshotHistory from '@/assets/history-demo.png'
import screenshotYoutube from '@/assets/youtube-demo.png'
import screenshotUpload from '@/assets/upload-demo.png'
import screenshotSummaryOption from '@/assets/summary-options.png'


const features = [
  {
    title: 'Youtube integration',
    description:
      "Get Transcript and Summary of Youtube videos in minutes",
    image: screenshotYoutube,
  },
  {
    title: 'Upload your Video',
    description:
      "Upload Video / Audio / Subtitle files to start, and get the summary in minutes.",
    image: screenshotUpload,
  },
  {
    title: 'Video Notebook',
    description:
      "Never fotget what you have watched, get the summary of the video you have watched.",
    image: screenshotHistory,
  },
  {
    title: 'Variety Summary Options',
    description:
      "Choose from a variety of summary options to get the summary you need.",
    image: screenshotSummaryOption,
  },
]

const HowItWorks = () => {
  let [tabOrientation, setTabOrientation] = useState('horizontal')
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
    >
      <img
        className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="text-3xl tracking-tight text-white sm:text-4xl md:text-5xl font-medium">
            Empower Your Learning with AI Summarization.
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            Unleash the Potential of Knowledge in Minutes.

          </p>
        </div>

        <div
          className="mt-16 gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:pt-0 flex flex-col lg:flex-row"
        >

          <div className='flex flex-wrap lg:flex-col w-full lg:w-1/3 justify-center lg:py-24 '>
            {
              features.map((feature, featureIndex) => (
                <div key={featureIndex} className={cn(
                  'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 cursor-pointer',
                  selectedIndex === featureIndex
                    ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                    : 'hover:bg-white/10 lg:hover:bg-white/5',
                )}
                  onClick={() => setSelectedIndex(featureIndex)}>
                  <h3 className={cn(
                    ' text-lg ui-not-focus-visible:outline-none font-medium',
                    selectedIndex === featureIndex
                      ? 'text-blue-600 lg:text-white'
                      : 'text-blue-100 hover:text-white lg:text-white',
                  )}>{feature.title}</h3>
                  <p
                    className={cn(
                      'mt-2 hidden text-sm lg:block font-thin',
                      selectedIndex === featureIndex
                        ? 'text-white'
                        : 'text-blue-100 group-hover:text-white',
                    )}
                  >
                    {feature.description}
                  </p>
                </div>
              ))
            }
          </div>

          <div className='lg:block '>
            <img src={features[selectedIndex].image} alt="" className='lg:absolute h-full rounded-xl' loading='lazy'/>
          </div>

        </div>
      </Container>
    </section>
  )
};

export default HowItWorks;

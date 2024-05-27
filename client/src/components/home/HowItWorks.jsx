import React from 'react';
import { useEffect, useState } from 'react'
import { cn } from '@/utils/utils';
import backgroundImage from '@/assets/background-features.jpg'
import screenshotHistory from '@/assets/history-demo.png'
import screenshotYoutube from '@/assets/youtube-demo.png'
import screenshotUpload from '@/assets/upload-demo.png'
import screenshotSummaryOption from '@/assets/summary-options.png'
import screenshot from '@/assets/screenshot.png'
import { featuresContents } from '@/constants';
import { Separator } from '../ui/separator';
import { BoltIcon, PlayCircleIcon, ArrowUpTrayIcon, DocumentTextIcon, ArchiveBoxArrowDownIcon, ShareIcon } from '@heroicons/react/24/outline';


const icons = {
  BoltIcon, PlayCircleIcon, ArrowUpTrayIcon, DocumentTextIcon, ArchiveBoxArrowDownIcon, ShareIcon
};


const HowItWorks = () => {
  let [tabOrientation, setTabOrientation] = useState('horizontal')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { features } = featuresContents

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
      aria-label="Features for Fusion AI Video Summarization Tool"
      className="relative overflow-hidden  pb-28 pt-20 sm:py-32 bg-gradient-to-br from-cyan-900 to-indigo-900"
    >
      <div className='container '>
        <div
          className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start '
        >
          <div className='md:px-10 my-auto'>
            <h2
              className="text-3xl md:text-4xl text-white font-display font-semibold"
            >
              {featuresContents.headline}
            </h2>
            <p
              className="text-md md:text-xl  text-gray-300 f ont-roboto font-normal max-w-3xl mt-4"
            >
              {featuresContents.subheadline}
            </p>
            <div className='pr-4'><Separator className='mt-8 bg-gray-100/30' /></div>
            {
              features.map((feature, index) => {
                const IconComponent = icons[feature.image];
                return (
                  <div
                    key={index}
                    className={cn('mt-8 flex items-start', {
                      'flex-col': tabOrientation === 'vertical'
                    })}
                  >
                    <div className='flex-shrink-0'>
                      <IconComponent className='w-6 h-6' />
                    </div>
                    <div className='ml-4'>
                      <h3 className='text-xl font-semibold text-white'>{feature.title}</h3>
                      <p className='text-gray-300 font-roboto font-normal mt-2'>{feature.mobileDescription}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className='p-0.5 my-auto w-[48rem] h-[27.4rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[1427px] sm:h-[809px] bg-gradient-to-br from-cyan-500 to-indigo-900' >
          <img src={screenshot} className='my-auto w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[1423px] ' />
          </div>
        </div>
      </div>
    </section>
  )
};

export default HowItWorks;


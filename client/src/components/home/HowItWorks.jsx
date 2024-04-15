import React from 'react';
// Assuming you have these icons in your project. If not, you can replace them with any icons of your choice.
import { ArrowUpIcon, ArrowPathIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';
import { Container } from '../common/Container';
import { useEffect, useState } from 'react'
import { cn } from '@/utils/utils';
import backgroundImage from '@/assets/background-features.jpg'
import screenshotExpenses from '@/assets/expenses.png'
import screenshotPayroll from '@/assets/payroll.png'
import screenshotReporting from '@/assets/reporting.png'
import screenshotVatReturns from '@/assets/vat-returns.png'


const features = [
  {
    title: 'Payroll',
    description:
      "Keep track of everyone's salaries and whether or not they've been paid. Direct deposit not supported.",
    image: screenshotExpenses,
  },
  {
    title: 'Claim expenses',
    description:
      "All of your receipts organized into one place, as long as you don't mind typing in the data by hand.",
    image: screenshotPayroll,
  },
  {
    title: 'VAT handling',
    description:
      "We only sell our software to companies who don't deal with VAT at all, so technically we do all the VAT stuff they need.",
    image: screenshotReporting,
  },
  {
    title: 'Reporting',
    description:
      'Easily export your data into an Excel spreadsheet where you can do whatever the hell you want with it.',
    image: screenshotVatReturns,
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
        width={2245}
        height={1636}
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="text-3xl tracking-tight text-white sm:text-4xl md:text-5xl font-medium">
            Everything you need to run your books.
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            Well everything you need if you aren’t that picky about minor
            details like tax compliance.
          </p>
        </div>

        <div
          className="mt-16 gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:pt-0 flex "
        >
          <div className='flex lg:flex-col w-full lg:w-1/2 justify-center lg:py-24'>
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
                    ' text-lg ui-not-focus-visible:outline-none',
                    selectedIndex === featureIndex
                      ? 'text-blue-600 lg:text-white'
                      : 'text-blue-100 hover:text-white lg:text-white',
                  )}>{feature.title}</h3>
                  <p
                    className={cn(
                      'mt-2 hidden text-sm lg:block',
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

          <div className='hidden lg:block'>
            <img src={features[selectedIndex].image} alt="" className='absolute w-[1080px] h-auto rounded-xl' />
          </div>

        </div>
      </Container>
    </section>
  )
};

export default HowItWorks;

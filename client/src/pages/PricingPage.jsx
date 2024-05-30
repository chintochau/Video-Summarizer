import React from 'react'
import PricingPlans from '../components/home/PricingPlans'
import { Helmet } from 'react-helmet-async'
import { fusionaiLink } from '@/constants'
import Header from '@/components/common/Header'

const PricingPage = () => {
  return (
    <>
    <Helmet>
      <title>Pricing Plans</title>
      <meta name="description" content="Discover Fusion AI's affordable pricing plans for video transcription and summarization. Choose the plan that fits your needs and budget. Start saving time today!"/>
      <meta name="keywords" content="Fusion AI pricing, video transcription cost, summarization plans, affordable AI services, subscription plans, pricing tiers"/>
      <link rel="canonical" href={`${fusionaiLink}/pricing`}/>
      <meta property="og:title" content="Pricing Plans"/>
      <meta property="og:description" content="Discover Fusion AI's affordable pricing plans for video transcription and summarization. Choose the plan that fits your needs and budget. Start saving time today!"/>
      <meta property="og:url" content={`${fusionaiLink}/pricing`}/>
      <meta property="og:image" content={`${fusionaiLink}/fusionai-logo.png`}/>
      <meta property="og:image:alt" content="Fusion AI logo"/>
    </Helmet>
    <Header title="Pricing Plans"/>
    <PricingPlans/>
    </>
  )
}

export default PricingPage
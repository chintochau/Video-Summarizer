import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "../common/Container";

const faqs = [
  {
    "question": "How does your platform summarize YouTube videos?",
    "answer": "Our platform uses advanced AI algorithms to generate transcripts from YouTube videos and then applies summarization techniques to condense the content into key points."
  },
  {
    "question": "What if a YouTube video doesn't have a built-in transcript?",
    "answer": "In such cases, our platform utilizes AI to generate a transcript automatically, which is then summarized for your convenience."
  },
  {
    "question": "Can I upload my own videos, audio files, or subtitle files for summarization?",
    "answer": "Yes, our platform allows users to upload various types of media files, including videos, audio files, and subtitle files, for summarization."
  },
  {
    "question": "Are there any limitations on the length of the transcript based on user tier?",
    "answer": "Depending on your subscription tier, there may be limitations on the length of the transcript that can be processed. Higher-tier subscriptions typically offer longer transcript processing capabilities."
  },
  {
    "question": "How does the cloud database storage work for stored results?",
    "answer": "Our platform securely stores summarized content in a cloud database, ensuring easy access and retrieval for users at any time."
  },
  {
    "question": "What are the advanced features of your platform, particularly regarding vectorization and LLM interaction?",
    "answer": "Our platform employs advanced techniques such as content vectorization and interaction with Large Language Models (LLMs) to enable powerful search, Q&A, and content interaction capabilities."
  },
  {
    "question": "Can you elaborate on how the platform uses LLM for search, Q&A, and interaction with stored contents?",
    "answer": "LLMs allow our platform to understand user queries, provide relevant search results, answer questions based on stored content, and enable rich interaction experiences with summarized content."
  },
  {
    "question": "How does the platform gather and summarize related videos from YouTube based on a user's search topic?",
    "answer": "Our platform uses intelligent algorithms to search for and analyze related videos on YouTube based on user-provided topics, generating transcripts and summaries for further exploration and understanding."
  },
  {
    "question": "Can users save and access previously summarized content for future reference?",
    "answer": "Yes, users can save summarized content in their accounts for future reference, making it easy to revisit and utilize the information whenever needed."
  },
  {
    "question": "How can I get started using your platform and accessing its features?",
    "answer": "To get started, simply sign up for an account on our website and explore the various features available. You can then upload your media files, search for topics of interest, and start summarizing and interacting with content right away."
  }
]


const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Container className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Frequently Asked Questions</h2>
      </div>
      <Accordion type="single" collapsible 
      className="max-w-3xl mx-auto"
      >
        {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))
      }
      </Accordion>
    </Container>
  );
};

export default FAQs;

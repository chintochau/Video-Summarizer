import React, { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YTVideoField } from "..";
import Markdown from "markdown-to-jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { transformTimestampRangeFromArticleToSingleLink } from "../summary-field-conpoments/SummaryTab";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import { getLanguageNameByCode, inActionContents } from "@/constants";
import { Separator } from "../ui/separator";
import { ArrowRight } from "lucide-react";
import { LinkToDashboard } from "../common/RoutingLinks";
import { useTranslation } from "react-i18next";

const SeeInAction = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [summaries, setSummaries] = useState(
    demoVideos.map((video, index) => video.summary.map((summary, index) => ""))
  );

  // 點擊轉錄時跳轉視頻
  const handleTimestampClick = (time) => {
    let [hours, minutes, seconds] = time.split(":");
    let secondsTotal;

    if (time.split(":").length === 2) {
      secondsTotal = parseInt(hours) * 60 + parseFloat(minutes);
    } else if (time.split(":").length === 3) {
      secondsTotal =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
    }

    if (videoRef && videoRef.current) {
      videoRef.current.currentTime = secondsTotal;
      if (videoRef.current.internalPlayer) {
        videoRef.current.internalPlayer.seekTo(secondsTotal);
      }
    }
  };

  const linkOverride = {
    a: {
      component: ({ children, href, ...props }) => {
        if (href.startsWith("#timestamp")) {
          const timestamp = children[0].split(" - ")[0];
          return (
            <a
              className={"text-blue-500 cursor-pointer"}
              onClick={() => handleTimestampClick(timestamp)}
            >
              {children}
            </a>
          );
        }
        return (
          <a href={href} {...props}>
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className="bg-gray-50 pt-8 lg:pt-10 lg:pb-5">
      <h2 className=" text-3xl pb-2 mx-2.5 lg:px-6 lg:text-4xl font-bold sm:text-center text-cyan-700/70 py-2 lg:py-2">
        {t("inActionContents.headline")}
      </h2>
      <p className="mx-2.5 py-2 lg:px-6 lg:text-lg text-gray-500 sm:text-center lg:py-2 font-light text-xl pb-8 ">
        {t("inActionContents.description")}
      </p>
      <Tabs className="w-full lg:text-center" defaultValue="video-0">
        <div className=" overflow-x-auto pb-2 md:pb-0 mb-2">
          <TabsList className="lg:mx-6 lg:mt-2 lg:mb-5 md:py-5 bg-transparent rounded-lg">
            {demoVideos.map((video, index) => (
              <TabsTrigger
                key={index}
                value={`video-${index}`}
                className=" data-[state=active]:bg-cyan-600/70 data-[state=active]:text-white data-[state=active]:hover:bg-cyan-800 data-[state=active]:hover:text-white border mx-1 rounded-lg hover:bg-cyan-100 hover:text-cyan-900 hover:border-cyan-200"
              >
                {t(`inActionContents.option${index}.option`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {demoVideos.map((video, index) => (
          <TabsContent key={index} value={`video-${index}`}>
            <Card className="border-indigo-50 md:shadow-md container px-0 lg:px-2 my-2 rounded-xl border-0 sm:border">
              <CardHeader className="text-left py-4 lg:pt-10 pb-2  lg:px-5 lg:pb-4 ">
                <CardTitle className=" text-gray-800 lg:text-cyan-600/70">
                  {t(`inActionContents.option${index}.title`)}
                </CardTitle>
              </CardHeader>
              <div className="w-full px-2 lg:px-6 pb-4">
                <Separator className="w-full" />
              </div>
              <CardContent className="flex flex-col md:flex-row gap-2 lg:gap-3 px-2.5 lg:px-5 pb-4">
                <div className="w-full md:w-1/2  lg:w-5/12 flex flex-col">
                  <YTVideoField
                    youtubeId={video.youtubeId}
                    homeMode
                    videoRef={videoRef}
                  />
                  <CardDescription className="text-left font-semibold text-base hidden md:block">
                    {t("inActionContents.youtubeVideo")}
                  </CardDescription>
                  <CardDescription className="text-left text-gray-800 text-xl font-semibold items-center gap-2 pb-2  lg:text-2xl hidden md:block">
                    {video.videoTitle} - ({video.videoLength})
                  </CardDescription>
                </div>

                <Tabs
                  defaultValue="summary-0"
                  className=" w-full md:w-1/2 lg:w-7/12 lg:text-left"
                >
                  <TabsList className="lg:mx-6 lg:mt-2 lg:mb-5 md:py-5 bg-transparent rounded-lg">
                    {video.summary.map((summary, index) => (
                      <TabsTrigger
                        key={index}
                        value={`summary-${index}`}
                        className="data-[state=active]:bg-cyan-600/70 data-[state=active]:text-white data-[state=active]:hover:bg-cyan-800 data-[state=active]:hover:text-white border mx-1 rounded-lg hover:bg-cyan-100 hover:text-cyan-900 hover:border-cyan-200"
                      >
                        <img
                          src={getLanguageNameByCode(summary.language).flag}
                          alt={getLanguageNameByCode(summary.language).name}
                          className="w-6 h-4 inline-block mr-2"
                        />
                        {getLanguageNameByCode(summary.language).name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {video.summary.map((summary, summaryIndex) => (
                    <TabsContent
                      key={summaryIndex}
                      value={`summary-${summaryIndex}`}
                    >
                      {summaries[index][summaryIndex] === "" ? (
                        <div className=" text-center lg:text-left mt-4 lg:px-10 lg:py-4">
                          <Button
                            className="w-full h-40 md:h-56 border-cyan-500 text-cyan-500 hover:bg-cyan-800 hover:text-white md:text-2xl rounded-xl shadow-md"
                            variant="outline"
                            onClick={() => {
                              // when click, loop through the summari[index], and set the summary[index] to the content using setSummaries, and set timeout, each time add 10 more characters
                              let i = 0;
                              const interval = setInterval(() => {
                                if (i >= summary.content.length) {
                                  clearInterval(interval);
                                }
                                setSummaries((prev) => {
                                  const newSummaries = [...prev];
                                  newSummaries[index][summaryIndex] =
                                    summary.content.substring(0, i);
                                  return newSummaries;
                                });
                                i += 20;
                                if (i > 2000) {
                                  i += 2000;
                                }
                                if (i > 300) {
                                  i += 90;
                                }
                              }, 70);
                            }}
                          >
                            {t("inActionContents.generateSummary")}
                          </Button>
                        </div>
                      ) : (
                        <ScrollArea className="h-[40vh] min-h-[40vh] md:h-[40vw] md:max-h-[60vh] text-left overflow-auto border-l-indigo-50 border-l-2 px-2 lg:px-8 ">
                          <Markdown
                            className="prose max-w-full "
                            options={{ overrides: linkOverride }}
                          >
                            {transformTimestampRangeFromArticleToSingleLink(
                              summaries[index][summaryIndex]
                            )}
                          </Markdown>
                        </ScrollArea>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
              <div className="lg:px-6 px-2">
                <Separator className="w-full my-2 " />
              </div>
              <CardFooter className="pb-4 lg:pb-6 lg:pt-3">
                <LinkToDashboard className="flex items-center gap-x-2 mx-auto">
                  <Button
                    className="w-full text-cyan-500"
                    variant="link"
                    size="lg"
                  >
                    {t("inActionContents.cta")}
                    <ArrowRight size={20} />
                  </Button>
                </LinkToDashboard>
              </CardFooter>
            </Card>
            <div className="flex flex-col md:flex-row w-full justify-between items-center bg-gray-50 p-2 rounded-md"></div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SeeInAction;

const demoVideos = [
  {
    option: "Long Turotial",
    title: "Detail Summary of a 2-hour long video",
    additionalInfo: "",
    videoTitle: "30 Years of Business Knowledge in 2hrs 26mins",
    youtubeId: "9VlvbpXwLJs",
    videoLength: "2:26:13",
    summaryButton: "Long Summary",
    summary: [
      {
        language: "en",
        content: `### Summary

The transcript provided is the first 5 minutes of a video titled "30 Years of Business Knowledge in 2hrs 26mins". The speaker, who has built 19 companies and invested in 78 startups over the last 30 years, is offering to share all his business knowledge and expertise for free. He plans to cover a wide range of topics, including how to start, grow, maintain, and sell a business, as well as strategies for finding purpose, co-founders, investors, mentors, and more. The speaker emphasizes that the key to success is not finding a unique idea, but rather following your passions and applying a business mindset to what you love. He believes that the first step in starting a business is to identify what you enjoy doing and then build a business around it.
### Part 1 of 15
### Main Body

#### Starting a Business with Passion
- 00:00:00 - 00:00:22: The speaker has built 19 companies and invested in 78 startups over the past 30 years. He wants to share his business knowledge and expertise for free, covering a wide range of topics to help people start, grow, maintain, and sell a business.
- 00:00:22 - 00:00:42: The speaker emphasizes that the key to success is not finding a unique idea, but rather following your passions and applying a business mindset to what you love.
- 00:00:42 - 00:01:04: The speaker suggests that the first step in starting a business is to identify what you enjoy doing and then build a business around it, rather than trying to find a market gap or niche.

#### Combining Passion and Execution
- 00:01:04 - 00:01:24: The speaker recommends finding a co-founder who can complement your skills and provide the accountability needed to succeed.
- 00:01:24 - 00:01:43: The speaker emphasizes the importance of learning how to sell, as it is the key to unlocking freedom and success in business.

#### Experimenting with Revenue Models
- 00:01:43 - 00:02:04: The speaker suggests exploring different revenue models and not limiting yourself to the obvious choices. He provides an example of his own company, Fluid, where they charged based on the outcome rather than by the hour.
- 00:02:04 - 00:02:26: The speaker emphasizes the importance of building a strong brand and personal brand, as these can be more valuable than the business itself.

#### Embracing Purpose and Adaptability
- 00:02:26 - 00:02:52: The speaker advises finding a strong purpose to motivate yourself, your team, and your customers, and being willing to adapt and evolve your business as needed.

### Conclusion for this part
The video transcript provided is the first part of a larger video, where the speaker shares his extensive business knowledge and expertise gained over the past 30 years. The key focus of this part is on the importance of starting a business based on your passions and interests, rather than trying to find a unique idea or market gap. The speaker also emphasizes the importance of finding the right co-founder, experimenting with revenue models, and building a strong brand and purpose for your business. Overall, the speaker aims to provide a comprehensive guide to starting, growing, and selling a successful business.
### Part 2 of 15
### Main Body
#### Purpose and Passion
  - The speaker emphasizes the importance of having a purpose bigger than oneself and being passionate about what you do (00:10:01 - 00:10:18).
  - He suggests that with a strong purpose and passion, you won't need to manage people, as they will be motivated by the shared purpose.
  - The speaker encourages starting a service-based business with a revenue model, even if your goal is to launch an app, as it can help get the business going without significant upfront investment (00:10:18 - 00:11:21).

#### Delayed Gratification
  - The speaker believes that delayed gratification is the key to winning in business (00:11:40 - 00:12:49).
  - He provides the example of how he initially did work for free for his first customer, which led to a long-term relationship and referrals.
  - The speaker suggests that successful companies like Facebook and Instagram waited years before monetizing their platforms, focusing on building value for users first (00:15:56 - 00:17:23).

#### Embracing Failure
  - The speaker argues that the ability to accept and learn from failure is crucial for success (00:17:44 - 00:19:08).
  - He shares how losing a significant amount of money on a failed business venture actually helped him become more successful in the long run.
  - The speaker encourages embracing a "D student" mentality, where you are not afraid to fail and are willing to take risks, unlike "A students" who are too afraid to lose (00:19:37 - 00:20:01).

### Conclusion for this part
In this part of the video, the speaker emphasizes the importance of having a strong purpose and passion, delayed gratification, and embracing failure as key strategies for building a successful business. He provides various examples and perspectives to support his claims, highlighting the need to focus on long-term value creation rather than short-term gains. The overall message is that true success in business comes from a mindset of patience, risk-taking, and learning from mistakes.
### Part 3 of 15
### Main Body
#### Focusing on your passions and building a business around it
  - At 00:20:01, the speaker emphasizes that one should not let others decide their success. He encourages the audience to not let anyone judge them based on external factors like material possessions, but rather focus on their own internal drive and passion.
  - At 00:20:25, the speaker advises the audience to embrace failure and not fear it, as it is a crucial part of the journey to success. He guarantees that if they pursue their passions, they will ultimately succeed.

#### Importance of creating a mind map over a traditional business plan
  - At 00:20:50, the speaker introduces the concept of a mind map as a practical tool for mapping out the potential directions of a business, in contrast to a traditional business plan.
  - At 00:21:12, the speaker explains that a mind map is more flexible and allows for exploration, whereas a business plan can be restrictive and lead to the demise of a company.
  - At 00:21:35, the speaker walks through the process of creating a mind map, starting with the core hobby or passion, and then building out the different aspects of the business, such as revenue streams, partnerships, and scalability.

#### Finding purpose as the key to success
  - At 00:28:09, the speaker emphasizes the importance of finding purpose, which he believes is not adequately addressed in the traditional education system.
  - At 00:28:30, the speaker suggests that the first step in finding purpose is to simply think about it, without letting others distract or discourage you.
  - At 00:28:54, the speaker explains that the concept of purpose has been lost in modern society, where the focus is more on working for someone else rather than solving problems and helping others.

### Conclusion for this part
In this part of the video, the speaker emphasizes the importance of focusing on your passions and building a business around it, rather than letting others dictate your success. He introduces the concept of a mind map as a practical tool for mapping out the potential directions of a business, in contrast to a traditional business plan. Finally, the speaker highlights the crucial role of finding purpose as the key to success, suggesting that this is not adequately addressed in the traditional education system.
### Part 4 of 15
### Main Body

#### Finding Your Purpose
- 00:30:01 - 00:30:21: The speaker encourages the audience to think about and identify the problems that matter to them, as this can help them discover their purpose. He suggests starting by considering simple issues that affect one's daily life.
- 00:30:21 - 00:30:41: The speaker explains that by thinking about problems that bother you, you can "wake up the entrepreneur muscle" in your brain and begin to understand how to solve those problems, which can lead to finding your purpose.
- 00:30:41 - 00:31:03: The speaker advises breaking down how to make your life match your purpose, as often the dream is only a small difference from one's existing life. He emphasizes the importance of truly knowing yourself to find your purpose.

#### Importance of a Co-founder
- 00:31:03 - 00:31:32: The speaker highlights the similarities between humans and chimpanzees, suggesting that finding your purpose may be closer to your current life than you think. He uses the example of someone wanting to start a catering business, which is similar to their current job, to illustrate this point.
- 00:31:32 - 00:31:50: The speaker argues that the system sometimes wants you to feel satisfied enough that you don't need to make a change, even if your purpose is not fully fulfilled. He encourages the audience to realize that they need to take risks and learn to truly know themselves to find their purpose.
- 00:31:50 - 00:32:07: The speaker emphasizes the importance of not relying on others for the answers, as it is crucial to figure out the answers for yourself to truly know your purpose.

#### Finding a Co-founder
- 00:32:07 - 00:32:29: The speaker shares an anecdote about a billionaire who learned to trust his intuition by not relying on his parents for the answers. The speaker applies this lesson to finding your purpose, stating that you need to ask yourself the right questions and figure out the answers on your own.
- 00:32:29 - 00:32:53: The speaker encourages the audience to think about what problem they want to solve and then match their life to that purpose. He suggests that you don't have to do this alone and can work with others who share your goals.
- 00:32:53 - 00:33:12: The speaker uses the example of caring about climate change to illustrate how you can find your purpose and then work with others who are doing something in that space, while ensuring you ask for equity wherever you work.

### Conclusion for this part
In this part of the video, the speaker emphasizes the importance of finding your purpose and the value of having a co-founder. He provides guidance on how to identify your purpose by considering the problems that affect you and breaking down how to make your life match your purpose. The speaker also highlights the benefits of having a co-founder, stressing the importance of finding someone with complementary skills and a similar moral code. Finally, he offers a step-by-step approach to finding and working with a co-founder.
### Part 5 of 15
### Main Body

#### Finding a Co-Founder
- 00:40:02 - 00:40:21: The speaker emphasizes the importance of finding a co-founder to ensure success in your business. He suggests using tools like Helpbank.com to find potential co-founders, and then sorting out the equity structure.

#### Selling Strategies
- 00:40:21 - 00:41:13: The speaker believes that anyone can learn to sell effectively. He emphasizes the importance of "selling the sizzle, not the steak," using the example of how Steve Jobs presented Apple products.
- 00:41:13 - 00:43:12: The speaker outlines a three-step process for successful selling: 1) Understand your customer and their needs, 2) Ensure there is a genuine connection and mutual liking between you and the customer, and 3) Focus on making the deal happen.
- 00:43:12 - 00:46:36: The speaker emphasizes the importance of taking a long-term approach to sales, and maintaining consistent contact with potential customers over an extended period of time. He suggests using tools like email lists and regular outreach to build relationships.

#### Marketing Strategies
- 00:46:36 - 00:50:01: The speaker acknowledges that marketing is a deep and complex subject, but he shares some key insights. He suggests that 50% of marketing efforts are likely to be wasted, and emphasizes the importance of experimentation and connecting with people over time through branding.

### Conclusion for this part

In this part of the video, the speaker focuses on providing practical advice and strategies for finding a co-founder, selling effectively, and developing successful marketing approaches. He emphasizes the importance of building relationships, understanding your customers, and taking a long-term, experimental approach to these critical business activities.
### Part 6 of 15
### Main Body

#### Marketing is the Key to Success
- At 00:50:01, the speaker emphasizes that marketing is not just about having a good product, but a complex structure that includes PR, brand messaging, and product-market fit.
- He stresses that understanding your customer is the most important aspect of marketing (00:50:27).
- The speaker uses Facebook's early strategy of focusing on a niche (universities) and building features tailored to that audience as an example of effective marketing (00:50:53).

#### The Staircase Philosophy
- At 00:51:59, the speaker shares a personal story of buying a staircase in London, which he used as a symbol for his "staircase philosophy" of marketing.
- The key elements of this philosophy are:
  - Doing something unconventional or "crazy" to get attention and media coverage (00:52:26, 00:53:14).
  - Evolving the initial idea into a new way of helping people (00:53:59).
  - Partnering with other companies to expand the reach and impact (00:54:20).

#### Systemizing Marketing Efforts
- At 00:56:11, the speaker discusses the importance of having systems in place for various marketing activities, such as email, social media, and PR.
- He emphasizes the need to do a few things well rather than trying to do everything poorly (00:56:58).
- The speaker provides an example of how he efficiently creates content for multiple social media platforms (00:57:19).

#### Aligning Marketing with Founder's Strengths
- At 00:58:00, the speaker cautions against solely focusing on the "staircase" or gimmick, and instead encourages aligning marketing strategies with the founder's or team's natural strengths and interests.
- He uses the example of preferring written content over video as a way to determine the best marketing channels (00:58:23).
- The speaker also emphasizes that marketing should be fun and enjoyable, using Starbucks' early marketing strategies as an example (00:58:42).

### Conclusion for this part

In this part of the video, the speaker provides a comprehensive overview of his perspectives on effective marketing strategies. He emphasizes the importance of understanding your customer, using unconventional tactics to stand out, and building systems to streamline marketing efforts. Additionally, he stresses the importance of aligning marketing with the founder's or team's strengths and interests to ensure it is an enjoyable and sustainable process.
### Part 7 of 15
### Main Body

#### Respecting and Caring for Employees
- 01:00:02 - 01:00:27: The speaker highlights how Starbucks in its early days respected and cared for its baristas, even providing them with medical care and days off if they were unwell. This created a sense of loyalty and ownership among the employees, which in turn helped in representing the brand effectively.

#### Importance of PR and Targeted Approach
- 01:01:32 - 01:02:13: The speaker emphasizes the importance of PR for a business, but stresses the need for a targeted approach. He gives examples of how getting PR coverage in the right outlets can lead to tangible results, while generic PR coverage may only serve to make the business owner feel good, without any real impact.

#### Tips for Effective PR
- 01:02:33 - 01:04:42: The speaker provides several tips for effective PR, including:
  - Targeting the right media outlets and journalists based on the business's needs
  - Providing journalists with a ready-to-publish press release and all the necessary assets
  - Researching and understanding the journalist's interests and writing style
  - Building relationships with journalists, for example, by engaging with them on social media.

#### Caution around Social Media Presence
- 01:06:38 - 01:07:02: The speaker cautions entrepreneurs about their social media presence, emphasizing that it can impact their PR and brand image. He advises being disciplined and conscious of the content shared, as inappropriate or controversial posts can deter journalists from covering the business.

### Conclusion for this part

In this part of the video, the speaker shares his insights and strategies on various aspects of running a successful business. He highlights the importance of respecting and caring for employees, as it can have a positive impact on the business's representation and branding. The speaker also emphasizes the significance of PR and the need for a targeted approach, providing practical tips on how to effectively secure media coverage. Additionally, he cautions entrepreneurs about the impact of their social media presence on their brand image and PR efforts.
### Part 8 of 15
### Main Body

#### Perspective 1 - Getting Investment from Family and Friends
- 01:10:02 - 01:10:34: The speaker advises being honest with family and friends when seeking investment, informing them that they could potentially lose all their money. He cautions against overselling the business and presenting it as a guaranteed win, as there are no such guarantees in business.
- 01:10:34 - 01:10:55: The speaker acknowledges that getting help from family and friends can be more valuable than just money, especially in the early stages of a business. He encourages considering this option, but still emphasizes the need for transparency and honesty.

#### Perspective 2 - Considering Team Members as Potential Investors
- 01:11:37 - 01:12:15: The speaker suggests considering the people you want to work with in your company as potential investors. He provides the example of trying to recruit the number two person at LinkedIn to join a competing business, as they may be interested in the opportunity to build their own company.
- 01:12:15 - 01:12:36: The speaker explains that this approach can help reduce the company's costs, bring in the best talent, and provide additional funding, which is better than having external investors who may be more focused on getting their money back.

#### Perspective 3 - Approaching Angel Investors
- 01:13:14 - 01:13:35: The speaker explains that the traditional approach of desperately trying to get an angel investor to see your vision is the wrong way to go about it. Instead, he suggests identifying the right angel investor and then approaching them for help rather than directly asking for money.
- 01:13:35 - 01:14:11: The speaker emphasizes that the best way to get an angel investor is to make them feel valued and that they can bring something to the table, rather than just treating them as a source of capital. He suggests creating a sense of "fear of missing out" (FOMO) to make the investor feel that they're missing out on a great opportunity.
- 01:14:11 - 01:14:33: The speaker shares his own experience as an angel investor, stating that he feels honored and lucky when he gets to invest in a successful business. He prefers to be treated with respect and have the entrepreneur explain how he can bring value to the business.

#### Perspective 4 - Approaching Venture Capitalists (VCs)
- 01:16:10 - 01:16:34: The speaker explains that VCs usually want to invest in a business that has already proven itself and needs capital to scale. He advises considering whether the VC has the funds available to invest, as they may be in the process of raising new funds and not actively deploying capital.
- 01:16:34 - 01:17:16: The speaker suggests researching the companies the VC has invested in before, as this can provide valuable insights. If the VC has invested in a similar business, it could either be good or bad news, depending on whether they typically invest in multiple companies in the same sector or just one.
- 01:17:39 - 01:18:21: The speaker recommends trying to get connected to a previous company that the VC has invested in, as an introduction from one of their portfolio companies can be more powerful than approaching the VC directly. He also advises using this as an opportunity to do due diligence on the VC's reputation and track record.

#### Perspective 5 - Partnering with Clients or Brand Partners to Fund Growth
- 01:19:03 - 01:19:29: The speaker shares a personal example of how a client wanted the speaker's company to expand to a new market, and the client ended up funding that expansion, as it was more beneficial for the client than the speaker's company having to do it themselves.
- 01:19:29 - 01:19:48: The speaker considers this a valuable "hack" that he plans to use more often, as sometimes a client or brand partner may be willing to pay for the company's expansion or growth, as it aligns with their own interests and needs.

### Conclusion for this part
The provided transcript covers a portion of a video where the speaker, who has extensive experience in building and investing in businesses, shares various perspectives and strategies for obtaining investment and funding for a business. The key points covered in this part of the video include getting investment from family and friends, considering team members as potential investors, approaching angel investors and venture capitalists, and partnering with clients or brand partners to
### Part 9 of 15
### Main Body
#### Investing in clients as shareholders
  - At 01:20:01, the speaker discusses the potential benefits of having clients invest in your business. This can make them feel "invested in your success" and less likely to "make you go for a tender every year" or "chop and change you as a client or partner."
  - However, the speaker cautions that this needs to be done carefully, as it can "get very messy" legally if a bank or major provider invests in your business, as it may impact your relationships with other suppliers.
  - The speaker provides the example of Google Ventures investing in a coffee shop called Blue Bottle, showing that even large tech companies have investment divisions that can potentially invest in businesses.

#### Avoiding unnecessary investment
  - At 01:21:09, the speaker emphasizes the importance of determining whether you truly need investment, as often the issue is not a lack of funding, but rather a need for a better sales system.
  - The speaker suggests exploring alternatives like crowdfunding or pre-selling your product to generate the revenue you need, rather than taking on investors, as this allows you to avoid giving away equity.

#### Securing sponsorship deals
  - Starting at 01:23:25, the speaker provides insights on how to secure sponsorship deals, which he says is a common request he receives.
  - The speaker explains that the two key factors that make a sponsor come on board are: 1) the value return, or what the sponsor gets in return for their investment, and 2) the emotional sale, or making the sponsorship personal and meaningful for the brand and its decision-makers.
  - The speaker cautions that many people fail to properly structure the value for the sponsor or understand the brand's values and how they traditionally advertise, which can lead to unsuccessful sponsorship pitches.

### Conclusion for this part
In this part of the video, the speaker provides valuable insights on alternative funding sources, such as investing clients and crowdfunding, as well as strategies for securing sponsorship deals. He emphasizes the importance of understanding the needs and values of potential investors or sponsors, and structuring the deal in a way that provides clear value for both parties.
### Part 10 of 15
### Main Body

#### Selling to Media Buyers and Agencies
- 01:30:02 - The speaker suggests that instead of trying to sell directly to brands, businesses should sell to media buyers, as they have existing relationships with brands and often hold the allocated marketing budgets.
- 01:30:17 - The speaker also recommends working with advertising agencies, as they are responsible for creating campaigns for brands and can help incorporate your product or idea into their plans.

#### Personal Branding
- 01:34:10 - The speaker emphasizes the importance of personal branding, as people will talk about you whether you like it or not. He suggests embracing personal branding and understanding how others perceive you, as it can significantly impact the trajectory of your life.
- 01:34:33 - However, the speaker also cautions that personal branding can be problematic if it's the only thing you focus on, as it can be difficult to scale and may create a sense of responsibility to constantly produce content.

#### Building a Company Brand
- 01:36:26 - The speaker explains that when building a company brand, it's important to align it with your personal brand and values. He uses the example of his company, Help Bank, where the branding reflects his personal values of honesty, openness, and authenticity, while also conveying a more serious tone to reflect the company's focus on providing financial support.
- 01:37:33 - The speaker discusses two main approaches to building a company brand: the "reference" model, where the brand partners with influential individuals or entities to leverage their reputation, and the "leadership" model, where the company's founder or key representative becomes the face of the brand.

### Conclusion for this part
In this part of the video, the speaker provides insights on effective strategies for selling to media buyers and advertising agencies, the importance of personal branding, and the key considerations in building a strong company brand. He emphasizes the need to align personal and company values, and outlines two primary approaches to brand building: the "reference" model and the "leadership" model.
### Part 11 of 15
### Main Body

#### Scaling Brand and Leadership Model
- 01:40:02 - 01:40:15: The speaker discusses the downside of scaling a brand, emphasizing the need to have mechanisms in place to protect the brand, especially when the brand is closely tied to a leader. He cites the example of Steve Jobs and Apple, where the brand was heavily dependent on Jobs, and the company faced challenges when he left.
- 01:40:15 - 01:40:38: The speaker further discusses the importance of ensuring that the leadership model is sustainable and that there is a good transition plan in place. He points out that Tim Cook's appointment as the CEO of Apple was a strategic move, as he was seen as a trustworthy and transparent leader who could take the company forward.

#### Saying No and Protecting Brand
- 01:40:38 - 01:41:36: The speaker emphasizes the importance of learning to say no to the wrong relationships, brand partnerships, and clients to protect the brand. He shares his own experience of how a bad client damaged his brand's reputation, which took years to build. The speaker stresses that the brand is the most valuable asset a business can have and that saying no is a powerful tool in preserving its integrity.

#### Hiring, Equity, and Building Culture
- 01:41:36 - 01:44:10: The speaker discusses the importance of hiring the right people who believe in the company's purpose. He suggests checking the candidates' social media and references to ensure their values align with the company's. The speaker also emphasizes the importance of offering equity to employees, as it aligns their interests with the company's success and helps with employee retention.
- 01:44:10 - 01:47:35: The speaker talks about the importance of building a strong company culture and values. He shares his experience with a creative agency, where he initially focused on making money, leading to high employee turnover. The speaker then shifted the agency's focus to protecting the staff and managing clients, which transformed the business and helped it grow.

#### Identifying Growth Goals
- 01:47:35 - 01:50:00: The speaker emphasizes the need to identify the specific goals and reasons for growing a business. He suggests that growth should be driven by a clear purpose, rather than just a desire to become bigger. The speaker shares his own goal of helping 10 million people start businesses they love, and how this purpose guides the growth of his platform.

### Conclusion for this part
This part of the video transcript covers the speaker's insights on scaling a brand, the importance of leadership transition, the need to protect the brand by saying no to the wrong opportunities, and the strategies for hiring the right people, building a strong company culture, and identifying clear growth goals. The speaker draws from his extensive experience as an entrepreneur and investor to provide practical advice on building a successful and sustainable business.
### Part 12 of 15
### Main Body
#### Importance of Continuous Innovation
  - 01:50:02 - 01:50:21: The speaker emphasizes that companies cannot afford to remain stagnant and must constantly innovate to stay relevant. He cites examples like Blockbuster and Kodak, who failed to adapt to changing market conditions and lost their competitive edge.
  - 01:50:21 - 01:50:37: The speaker advises that to build a successful and lasting business, companies must be willing to disrupt themselves and their core products or services. Clinging to the status quo will ultimately lead to downfall.

#### Transitioning from a Generalist to a Specialist Mindset
  - 01:50:37 - 01:50:58: The speaker recognizes that in the early stages of a business, the founder may need to be a "generalist" and handle a wide range of tasks. However, as the company grows, it is important to transition to a "specialist" mindset, where individuals are empowered to focus on specific areas of expertise.
  - 01:50:58 - 01:51:18: The speaker explains that building systems and processes that enable specialization is crucial for the business to scale effectively. Trying to maintain a generalist approach becomes a hindrance as the company grows.
  - 01:51:18 - 01:51:41: The speaker acknowledges that as a founder, you may need to replace yourself with a more specialized CEO who can better lead the company at scale. This can be a difficult but necessary step to ensure the long-term success of the business.

#### Effectively Managing and Transitioning Employees
  - 01:51:41 - 01:52:04: The speaker emphasizes the importance of aligning the company's purpose, values, and destination with the goals and aspirations of the employees. Providing equity to the team can help foster a sense of shared ownership and commitment.
  - 01:52:04 - 01:52:34: The speaker recognizes that firing employees is a necessary skill for business leaders, but it is also a challenging task. He introduces the "seven and eight rule" as a framework for identifying and managing underperforming employees.
  - 01:52:34 - 01:52:57: The speaker advises that while the legal and procedural aspects of firing can be handled by a lawyer, the decision-making process and the human element are crucial. He emphasizes the need for empathy and a willingness to help the employee find a better-suited role.

#### Expanding into New Markets
  - 01:52:57 - 01:53:18: The speaker acknowledges that expanding a business into new global markets can be a daunting prospect, but it can also significantly reduce the company's risk exposure. He suggests that understanding the potential opportunities in other markets can be a valuable step, even if the company is not ready to immediately establish a presence in those markets.
  - 01:53:18 - 01:53:46: The speaker outlines a few key steps for going global, including identifying potential markets, understanding the investment required, and exploring brand partnership opportunities that can facilitate expansion.
  - 01:53:46 - 01:54:06: The speaker emphasizes the importance of diversifying risk by operating in multiple markets, rather than being dependent on a single local market. This can provide stability and growth opportunities for the business.

### Conclusion for this part
In this part of the video transcript, the speaker shares valuable insights and strategies for building a successful and sustainable business. He emphasizes the importance of continuous innovation, transitioning from a generalist to a specialist mindset, effectively managing and transitioning employees, and expanding into new global markets. The speaker's extensive experience and practical advice provide a comprehensive framework for entrepreneurs and business leaders to navigate the challenges of building and scaling a company.
### Part 13 of 15
### Main Body

#### Going Global
- 02:00:02 - The speaker emphasizes the importance of finding out where your product could be sold, even if you don't want to do the work to set it up. He suggests using franchising models, where someone else will open up and run the business in another market, allowing you to make money without doing the work.
- 02:00:15 - The speaker believes that franchising is a "real opportunity" and is often misunderstood. He explains that franchising can apply to service businesses, not just traditional franchises like Subway or McDonald's.
- 02:00:35 - The speaker advises that thinking globally from the outset can help a business stand the test of time. He argues that it's easier to run a big company than a small one, as it allows you to afford senior management, get help, and take time off, which is difficult with a small business.

#### Finding a Mentor
- 02:02:00 - The speaker addresses the common question of how to find a mentor. He argues that what people actually need is not a mentor, but rather someone who can answer their specific questions and provide relevant advice, which can be achieved without a formal mentorship.
- 02:02:20 - The speaker suggests that a mentor might not always provide the most relevant advice, as their experience may not align with your specific needs. He encourages finding a coach or someone to hold you accountable, or hiring specialists (e.g., a salesperson) to address specific needs.
- 02:03:05 - The speaker provides a step-by-step guide on how to find a mentor or advisor. He emphasizes the importance of researching the person, defining the relationship, and potentially getting a referral or providing value to the potential mentor before asking for their time.

#### Equity and Control
- 02:08:27 - The speaker emphasizes the importance of getting the equity structure right in a business, as it can make or break a company. He explains that equity ownership does not necessarily equal control, and that control is determined by the shareholder agreement.
- 02:09:10 - The speaker addresses the common misconception that dropping below 50% equity means losing control of the company. He clarifies that control is determined by the shareholder agreement, not the equity percentage.

### Conclusion for this part
In this part of the video, the speaker covers several important topics for entrepreneurs and business owners. He emphasizes the benefits of thinking globally and using franchising models, the importance of finding the right mentors or advisors, and the critical role of equity structure and control in a business. The speaker provides practical advice and insights based on his extensive experience in starting and investing in numerous companies over the past 30 years.
### Part 14 of 15
### Main Body

#### Equity Ownership and Structure
- 02:10:01 - 02:10:19: The speaker emphasizes the importance of understanding how much equity to maintain control of the business. Selling too much equity early on can lead to not having enough later to reach your goals.
- 02:10:19 - 02:10:40: For technology companies that plan to raise a lot of capital, the speaker advises being very cautious with equity in the early stages, as there is a lot of information online that can help guide this.
- 02:10:40 - 02:11:06: The speaker's strong recommendation is to avoid selling any equity at all if possible, as a bootstrapped business allows for 100% control and ownership, which is generally healthier in their opinion.

#### Equity Split with Co-Founders
- 02:11:06 - 02:11:31: The speaker warns against the common mistake of giving one co-founder a slightly higher equity percentage, like 52/48, as this can lead to resentment and unequal effort.
- 02:11:31 - 02:11:56: The speaker's instant recommendation is to always split equity 50/50 between co-founders, as this avoids the psychological impact of one partner feeling less valued.

#### Decision-Making with 50/50 Equity
- 02:11:56 - 02:12:20: The speaker acknowledges the potential danger of decision-making deadlocks with a 50/50 equity split, and suggests having a third-party advisor to help make difficult decisions.
- 02:12:20 - 02:12:47: The speaker emphasizes the importance of being very clear about the shared vision and goals from the start to avoid conflicts later on, such as disagreements over profit reinvestment versus withdrawal.

#### Equity Ownership and Company Branding
- 02:12:47 - 02:14:14: The speaker advises that the equity ownership structure should align with the company's brand and reputation, as the people involved can impact the company's image.

#### Equity for Employees
- 02:14:39 - 02:15:24: The speaker believes that giving equity to employees is essential for building a scalable business. He discusses the differences between share options and actual equity ownership, and the implications of each.

### Conclusion for this part
In this part of the video, the speaker primarily focuses on the topic of equity ownership and structure, providing various perspectives and recommendations. The key themes include maintaining control through equity, the importance of an equitable split with co-founders, navigating decision-making with 50/50 equity, aligning equity with company branding, and the value of offering equity to employees. The speaker emphasizes the complexities of equity and encourages viewers to research the topic further to make informed decisions for their businesses.
### Part 15 of 15
### Main Body
  #### Selling a Business
  - 02:20:02 - The best way to sell a company is to not want to sell it at all. The speaker says the most money he ever got for a company was when he didn't want to sell it, as that is the strongest negotiating position.
  - 02:20:18 - The speaker advises building a business you love, as then selling it will happen "accidentally." He cites the example of Mark Zuckerberg, who was offered $1 billion by Yahoo but refused, and now Facebook is worth $1 trillion.
  - 02:21:07 - Another way to sell a business is to partner with a company that could potentially buy it. The speaker gave the example of his company Fluid partnering with PwC, which led to PwC eventually acquiring Fluid.
  - 02:21:54 - Working with business sales agents can also be a way to sell a company, though the speaker cautions to do due diligence as their agendas may vary.
  - 02:22:55 - Merging with a competitor is a common way to exit, though the speaker notes this may not always maximize value, and selling to a non-competitor can sometimes be more lucrative.
  - 02:24:06 - Allowing the management team to buy the business is another option, which the speaker says he has done, as it allows the business to continue without disruption.

### Conclusion for this part
The speaker in this part of the video provides several perspectives and strategies for successfully selling a business. He emphasizes the importance of building a business you are passionate about, as this can lead to an "accidental" sale at a high valuation. He also discusses the benefits of partnering with potential acquirers, working with sales agents, merging with competitors, and allowing the management team to buy the company. Overall, the speaker presents a nuanced view on the best approaches to selling a business.

  
`,
      },
      {
        language: "zh-tw",
        content: `### 摘要
  這段視頻的前5分鐘中，講者分享了他在過去30年中專注於經營業務的經驗。他建立了19家公司，投資了78家初創企業。他強調不收費幫助他人，而是願意免費分享知識。在接下來的45分鐘中，他將講解如何創業、成長業務、維持業務和出售業務的關鍵。他提到了改變思維、成功工具、失敗重要性、心智圖、目的尋找、合夥人選擇、銷售技巧、營銷策略、投資者、贊助商、品牌建立、個人品牌、招聘、擴張、全球化、導師選擇、避免錯誤、運氣、以及如何出售業務等主題。他認為業務的開始不是源於市場空白或尋找利基，而是從追隨自己的熱情開始，並將其應用於商業思維。他強調追隨熱情是開展業務的第一步，並分享了自己從事營銷的經歷作為例子。
  ### Part 1 of 15
  ### Main Body
  
  #### Perspective 1 - Introduction and Background
  - **00:00:00**: 講者介紹自己在過去30年中創建了19家公司，並投資了78家初創企業。他每天都會被人請求成為他們的導師，甚至有人願意支付£10,000來獲得他的一天指導。
  - **00:00:22**: 講者強調他不想收費，而是願意免費分享知識。他將在接下來的45分鐘內講解如何創業、成長業務、維持業務和出售業務的關鍵。
  
  #### Perspective 2 - 改變思維與成功工具
  - **00:00:42**: 講者提到將在視頻中改變觀眾的思維，提供成功所需的工具，並創建新的思維路徑，讓觀眾有機會成功。
  - **00:01:04**: 他認為教育系統不希望人們自由工作、自主控制自己的命運，因此他將講解如何在沒有資金的情況下創業，如何贏得比賽，以及業務成功的秘密。
  
  #### Perspective 3 - 失敗的重要性與心智圖
  - **00:01:04**: 講者強調失敗的重要性，並介紹心智圖作為比商業計劃更靈活的工具。
  - **00:01:24**: 他還提到找到目的的重要性，這不僅能激勵自己，也能激勵團隊和客戶。
  
  #### Perspective 4 - 合夥人選擇與銷售技巧
  - **00:01:24**: 講者認為選擇合夥人就像選擇伴侶一樣重要，正確的合夥人能帶來責任感。
  - **00:01:43**: 他強調每個人都能學會銷售，並且銷售是解鎖自由的關鍵。
  
  #### Perspective 5 - 營銷策略與品牌建立
  - **00:01:43**: 講者將介紹如何營銷業務，如何為自己和業務進行公關，以及如何獲得投資者和贊助商。
  - **00:02:04**: 他認為建立品牌比建立業務更有價值，並將深入探討品牌的定義及如何建立品牌。
  
  #### Perspective 6 - 個人品牌與招聘
  - **00:02:04**: 講者強調個人品牌在當今時代的重要性，並將介紹如何在公開舞台和行業內建立個人品牌。
  - **00:02:26**: 他還會講解如何招聘、擴展業務以及全球化的重要性。
  
  #### Perspective 7 - 導師選擇與避免錯誤
  - **00:02:26**: 講者將介紹如何選擇導師，並強調很少有人知道該如何做。
  - **00:02:52**: 他還會講解如何避免大錯誤，並接受運氣進入生活，最終如何出售業務。
  
  #### Perspective 8 - 創業的第一步：追隨熱情
  - **00:02:52**: 講者認為業務的開始不是源於市場空白或尋找利基，而是從追隨自己的熱情開始，並將其應用於商業思維。
  - **00:03:15**: 他以自己創建的公司Fluid為例，強調熱情和專注的重要性。
  
  #### Perspective 9 - 執行計劃與收入模式
  - **00:06:50**: 講者提到執行計劃的重要性，並分享了他如何通過簡單的執行步驟來實現業務想法。
  - **00:08:27**: 他強調收入模式的靈活性，建議在開始時實驗不同的收入模式。
  
  #### Perspective 10 - 目的與社會影響
  - **00:09:43**: 講者認為新業務需要考慮如何對世界產生積極影響，而不僅僅是追求利潤。
  - **00:09:59**: 他強調如果業務只是為了利潤，員工和合作夥伴會要求更多的報酬。
  
  ###
  ### Part 2 of 15
  ### Main Body
  
  #### perspective - 目的大於自己
  - **時間戳記: 00:10:01**
  - 講者強調，如果你的業務目標大於自己，那麼你不再需要管理人員，而是管理目的。這將減少管理公司的壓力。
  
  #### perspective - 開始服務型業務
  - **時間戳記: 00:10:18**
  - 即使你的創業想法需要大量資金，講者建議從服務型業務開始，利用收入模式來支持發展。例如，Airbnb最初通過在會議上賣麥片盒來籌集資金。
  
  #### perspective - 延遲滿足感
  - **時間戳記: 00:11:40**
  - 延遲滿足感是業務成功的關鍵。講者提到他在創建Fluid公司時，最初為客戶免費工作，這建立了良好的關係並帶來長期的收益。
  
  #### perspective - 嚴格的道德規範和文化
  - **時間戳記: 00:12:49**
  - 公司文化比策略更重要。講者舉例說明Amazon專注於客戶的文化，並強調為客戶帶來價值的重要性。
  
  #### perspective - 幸運是可以被駭入的
  - **時間戳記: 00:13:59**
  - 幸運可以通過三種方式駭入：持續性、明確的目標和學會冒險。講者強調持續性和愛好所做事情的重要性，並建議設定清晰的目標和學會冒險。
  
  #### perspective - 建立品牌而非業務
  - **時間戳記: 00:16:23**
  - 建立品牌比立即賺錢更重要。講者提到Facebook和Instagram在開始時專注於用戶價值，而不是立即貨幣化。
  
  #### perspective - 接受失敗
  - **時間戳記: 00:17:44**
  - 成功的關鍵是學會接受失敗。講者分享了他在漫畫書業務上虧損一百萬英鎊的經歷，並強調失敗的學習對成功的重要性。
  
  ### Conclusion for this part
  
  這段視頻的第二部分，講者深入探討了創業和經營業務的關鍵因素。他強調了目標的重要性，建議從服務型業務開始，並強調延遲滿足感和公司文化的重要性。他還分享了如何駭入幸運，並強調建立品牌的重要性。最後，講者強調接受失敗和從中學習是成功的關鍵。
  ### Part 3 of 15
  ### Main Body
  
  #### perspective - Embrace Failure and Love Losing
  - **時間戳記 00:20:01**: 講者強調不要讓別人決定你的成功與否，也不要讓別人告訴你該怎麼做。他建議培養一種內在的自信，不要因為別人對你的評價而認為自己是失敗者。
  - **時間戳記 00:20:25**: 他鼓勵觀眾學會愛上失敗，並擁抱失敗。他保證，即使你失敗了，也可以重新開始，最終會成功。
  
  #### perspective - Mind Mapping Instead of Business Plans
  - **時間戳記 00:20:50**: 講者認為商業計劃沒有用處，反而會限制公司的發展。他建議使用心智圖來規劃業務的發展方向。
  - **時間戳記 00:21:12**: 他解釋說，心智圖不需要模板，也不會花費你任何錢，並且可以讓你靈活地探索業務的不同方向。
  - **時間戳記 00:22:01**: 講者以自己的公司為例，展示如何使用心智圖來規劃業務。他從自己的愛好開始，然後將其連接到業務上。
  
  #### perspective - Building a Network through Podcasts
  - **時間戳記 00:22:23**: 講者分享了他如何通過播客建立了一個網絡。他提到，通過訪問200多位成功的企業家，他建立了寶貴的人脈，這些人脈對他的業務有很大幫助。
  - **時間戳記 00:22:47**: 他指出，這些人脈不僅幫助他建立了網絡，還幫助他獲得了品牌合作機會。
  
  #### perspective - Team Building and Partnerships
  - **時間戳記 00:25:00**: 講者強調了團隊建設的重要性，並指出需要根據自己的弱點來選擇團隊成員，例如需要一個會計來處理行政事務。
  - **時間戳記 00:25:24**: 他還提到，可以通過播客建立的網絡來尋找合作夥伴，而不僅僅是僱員。
  
  #### perspective - Scalability and Merchandising
  - **時間戳記 00:26:26**: 講者談到如何擴展業務並使其在沒有自己參與的情況下運行。他提到，四年前他就開始考慮商品化，並列出了可能的商品，如T恤和帽子。
  - **時間戳記 00:27:13**: 他分享了即將推出的糖果品牌，並指出這是他在心智圖中早已計劃好的。
  
  #### perspective - Finding Purpose
  - **時間戳記 00:28:09**: 講者介紹了如何找到人生的目標。他認為學校教育並沒有教導我們如何找到目標，因為一旦理解了目標，人們就不太可能為他人工作。
  - **時間戳記 00:28:30**: 他強調，找到目標是個人化的過程，需要自己去思考和探索。
  
  ### Conclusion for this part
  
  在這段視頻中，講者分享了多個關鍵觀點，包括擁抱失敗、使用心智圖而非商業計劃、通過播客建立網絡、團隊建設與合作夥伴、業務擴展與商品化以及如何找到人生的目標。他強調了內在自信的重要性，並提供了實用的工具和方法來幫助觀眾更好地規劃和發展自己的業務。
  ### Part 4 of 15
  ### Main Body
  
  #### Perspective - 尋找目的
  - 00:30:01 講者強調找到目的的重要性，並指出可以從思考對自己影響的問題開始。
  - 00:30:21 他建議從日常生活中的小問題開始，這些問題可能會激發創業者的思維。
  
  #### Perspective - 配合生活與目的
  - 00:31:03 講者提到將生活與目的相匹配的重要性，並舉例說明很多人的夢想與現實生活其實只有3%的差距。
  - 00:31:32 他舉例一位想開餐飲業務的人，指出他們實際上已經接近實現自己的目的，只是缺乏一些知識。
  
  #### Perspective - 知道自己
  - 00:32:07 講者強調了解自己和冒險的重要性，並分享了一位億萬富翁如何通過自己尋找答案來建立直覺的故事。
  - 00:32:53 他指出，找到目的後需要思考如何實現，並建議尋找解決問題的方法。
  
  #### Perspective - 合作的重要性
  - 00:33:12 講者強調不必單打獨鬥，可以與他人合作來實現目的，並建議尋找股權機會。
  - 00:33:33 他提到自己的團隊如何合作解決問題，並強調團隊合作的重要性。
  
  #### Perspective - 合夥人的價值
  - 00:34:37 講者指出合夥人的重要性，並建議在確定不需要合夥人之前要謹慎考慮。
  - 00:34:56 他舉例說明合夥人如何提供價值，例如健身夥伴提供的責任感。
  
  #### Perspective - 合夥人的選擇
  - 00:35:54 講者建議誠實面對自己喜歡和不喜歡的事情，並尋找具有相反技能但相同道德標準的合夥人。
  - 00:36:19 他強調選擇合夥人就像選擇生活伴侶一樣重要，並建議詳細描述理想合夥人的特徵。
  
  #### Perspective - 公開尋找合夥人
  - 00:39:40 講者建議公開尋找合夥人，並在各種場合中尋找理想的合夥人。
  - 00:40:02 他強調這個人就在外面，只需積極尋找。
  
  ### Conclusion for this part
  這部分視頻主要討論了找到和實現個人目的的重要性，並強調了合作和選擇合夥人的價值。講者提供了具體的建議和例子，幫助觀眾理解如何將生活與目的相匹配，並強調了誠實面對自己喜好和道德標準的重要性。總結來說，這段視頻強調了找到目的、合作實現目標以及選擇合夥人的關鍵步驟。
  ### Part 5 of 15
  ### Main Body
  
  #### perspective - 找到合夥人 (00:40:02)
  - 講者強調找到合夥人是確保業務成功的最強大方法之一。
  - 他建議使用各種工具和平台來尋找合夥人，例如 help bank.com。
  - 需要正確處理股權結構。
  
  #### perspective - 如何銷售 (00:40:21)
  - 銷售是一個系統和哲學，任何人都可以做到，不論背景。
  - 銷售的關鍵是賣點而非產品本身，講者以蘋果產品和 Steve Jobs 的例子說明。
  - Steve Jobs 通過建立小型社區來銷售，並讓這些人幫助他傳播產品信息。
  
  #### perspective - 銷售過程中的關鍵步驟 (00:43:12)
  - 第一步是了解你的客戶，確保他們需要你所提供的產品或服務。
  - 第二步是建立真誠的關係，確保雙方互相喜歡。
  - 第三步是達成交易，如果前兩步做好，交易自然會發生。
  
  #### perspective - 長期銷售策略 (00:45:52)
  - 銷售需要長期的策略，不能只靠一次聯繫。
  - 頂級銷售人員會持續多次聯繫潛在客戶，建立長期關係。
  - 建立電子郵件列表並定期聯繫客戶是有效的方法。
  
  #### perspective - 真誠和個性化 (00:48:04)
  - 成功的銷售需要真誠和個性化，不能只為了佣金而賣產品。
  - 講者分享了一個例子，一位銷售員建議他去另一家展廳購買更適合的車，這種長期思維讓他聘請了這位銷售員。
  
  ### Conclusion for this part
  這段視頻主要講解了找到合夥人和銷售的關鍵策略。講者強調了找到合夥人的重要性，並提供了具體的銷售技巧和策略，包括了解客戶、建立真誠關係和長期策略。他還強調了在銷售中保持真誠和個性化的重要性。
  ### Part 6 of 15
  ### Main Body
  #### perspective - 行銷的重要性
  - **時間戳記: 00:50:01**
  - 講者強調行銷的重要性，並指出iPod的成功並非僅僅因為產品本身，而是因為蘋果公司在行銷上投入了大量資金。行銷是一個複雜的結構，包括公關、品牌訊息和產品市場契合度等。
  
  #### perspective - 了解你的客戶
  - **時間戳記: 00:50:53**
  - 講者提到，了解你的客戶是行銷的關鍵。以Facebook為例，Facebook最初專注於大學市場，並根據大學生的需求設計功能，如顯示單身狀態，這樣的行銷策略幫助Facebook迅速擴展。
  
  #### perspective - 階梯哲學
  - **時間戳記: 00:51:59**
  - 講者介紹了他所謂的「階梯哲學」，並分享了一個實例：他購買了一個倫敦的樓梯，並利用這個樓梯進行了一系列行銷活動，獲得了大量的免費媒體報導。這展示了如何通過創意行銷來吸引注意力和擴展影響力。
  
  #### perspective - 系統化行銷
  - **時間戳記: 00:56:11**
  - 講者強調了建立行銷系統的重要性。行銷有很多不同的方式，如電子郵件行銷、社交媒體、公共關係等。無論選擇哪種方式，都需要建立一個系統來有效地執行。
  
  #### perspective - 享受行銷過程
  - **時間戳記: 00:58:23**
  - 講者認為行銷應該是有趣的，並分享了他和兒子一起購買和清理樓梯的經歷。他強調，享受行銷過程能夠提高行銷效果，並舉例說明星巴克如何通過開設新店和關注員工來進行行銷。
  
  ### Conclusion for this part
  這段視頻講述了行銷在業務中的關鍵作用。講者通過多個實例和概念，如iPod的行銷策略、Facebook的市場定位、階梯哲學和系統化行銷，強調了了解客戶和創意行銷的重要性。他還指出，行銷應該是有趣的，並分享了自己在行銷過程中的愉快經歷。這些觀點和實例展示了如何通過有效的行銷策略來推動業務成長。
  ### Part 7 of 15
  ### Main Body
  
  #### perspective - 員工關懷與行銷
  - 時間戳記: 01:00:02 - 01:01:06
  - 講者提到Starbucks早期的成功部分歸功於他們對員工的關懷，這包括提供醫療保險和病假，即使是兼職員工也能享有這些福利。
  - 他強調，如果員工不能代表公司，那麼其他一切也無法代表公司，因為員工是創造這些代表公司的事物的核心。
  
  #### perspective - 有效的公關策略
  - 時間戳記: 01:01:06 - 01:07:28
  - 講者強調公關應該是有針對性的，而不是僅僅為了自我滿足。他舉例說明了如何針對目標市場進行公關，例如在BBC新聞上報導他們的項目，這帶來了實際的效果。
  - 他建議要為記者提供完整的故事和高解析度的照片，這樣記者只需稍作修改即可發佈，這樣可以提高獲得報導的機會。
  - 他還提到要研究記者的背景，了解他們的興趣和寫作風格，這樣可以更好地定制公關內容。
  - 他警告不要輕易相信那些聲稱能幫助你獲得公關的公司，因為自己做公關可以建立直接的記者關係，並且可以通過社交媒體如Twitter來接觸記者。
  
  #### perspective - 投資者的選擇
  - 時間戳記: 01:07:28 - 01:09:57
  - 講者強調在尋找投資者之前要仔細考慮是否真的需要投資者，因為錯誤的投資者可能會讓你的生活變得困難。
  - 他建議在尋找投資者時要了解對方的背景和需求，例如某些投資者可能會要求較多的股權或參與業務管理。
  - 他提到家人和朋友可能是好的投資來源，因為他們了解你的個性和承諾，不需要額外的說服。
  
  ### Conclusion for this part
  
  在這段視頻中，講者分享了關於員工關懷與行銷、公關策略以及投資者選擇的見解。他強調了員工關懷對企業成功的重要性，並提供了有效公關的實用建議，最後討論了在尋找投資者時應該注意的事項。這些觀點都旨在幫助企業更好地成長和發展。
  ### Part 8 of 15
  ### Main Body
  
  #### perspective - 向家人和朋友籌資
  - **時間戳記: 01:10:02**
  - 講者強調，向家人和朋友籌資時必須誠實告知他們有可能會失去所有的投資。不要過度推銷，讓他們清楚了解風險。
  
  #### perspective - 利用人脈網絡
  - **時間戳記: 01:10:55**
  - 講者建議利用朋友的推薦來接觸潛在的富有投資者，這樣可以節省在風險投資世界中的時間。
  
  #### perspective - 將團隊成員視為潛在投資者
  - **時間戳記: 01:11:37**
  - 講者提到，考慮讓你想要在公司工作的人作為潛在投資者，這樣可以降低成本，並且吸引最優秀的人才。
  
  #### perspective - 向天使投資者尋求幫助
  - **時間戳記: 01:13:14**
  - 講者指出，向天使投資者尋求幫助而不是直接要求資金，這樣更有可能獲得投資。讓他們感覺自己能帶來價值。
  
  #### perspective - 風險投資
  - **時間戳記: 01:16:10**
  - 講者解釋了如何與風險投資公司合作，強調要確保他們有資金，並了解他們之前的投資記錄。
  
  #### perspective - 與品牌合作夥伴或客戶合作
  - **時間戳記: 01:19:03**
  - 講者分享了一個經驗，說有時候品牌合作夥伴或客戶會資助你的擴展，這樣可以減少自己承擔的風險。
  
  ### Conclusion for this part
  
  這部分視頻主要探討了創業者如何籌集資金的不同策略。講者分享了向家人和朋友籌資時的誠實重要性，利用人脈網絡的技巧，將團隊成員視為潛在投資者的好處，以及如何向天使投資者和風險投資公司尋求幫助。最後，他還提到與品牌合作夥伴或客戶合作來資助擴展的策略。這些建議旨在幫助創業者更有效地獲得所需的資金。
  ### Part 9 of 15
  ### Main Body
  
  #### perspective - 投資者的選擇
  - **時間戳記：01:20:01 - 01:20:45**
  - 講者提到讓客戶成為投資者的潛力，因為這樣客戶會更關注你的成功，不會輕易更換供應商或合作夥伴。
  - 需要謹慎選擇適合的客戶或品牌來投資，避免法律問題或市場競爭的影響。
  
  #### perspective - 資金需求的真正原因
  - **時間戳記：01:21:09 - 01:21:47**
  - 講者強調在尋求投資之前，應該確保自己真正需要投資者的資金，而不是僅僅需要一個更好的銷售系統。
  - 舉例說明，有時候企業需要的是更好的銷售系統，而不是額外的資金。
  
  #### perspective - 眾籌的力量
  - **時間戳記：01:21:47 - 01:23:08**
  - 講者介紹了眾籌作為一種籌集資金的有效方式，可以預售產品來獲得製作資金，這樣不需要放棄股權。
  - 提到不同類型的眾籌平台，如Indiegogo，並強調在尋求傳統投資之前應該考慮眾籌。
  
  #### perspective - 贊助商的價值
  - **時間戳記：01:23:25 - 01:24:17**
  - 講者解釋了贊助商尋求的兩種主要價值：投資回報和情感銷售。
  - 提到贊助商希望看到實際的投資回報，如廣告的曝光率和銷售額。
  
  #### perspective - 理解品牌的重要性
  - **時間戳記：01:24:17 - 01:26:31**
  - 講者分享了自己在推廣啤酒墊廣告時的失敗經驗，因為沒有理解珠寶品牌的價值觀。
  - 強調需要了解品牌的價值和傳統的廣告方式，才能成功獲得贊助。
  
  #### perspective - 品牌內部的人際關係
  - **時間戳記：01:26:31 - 01:28:50**
  - 講者提到了解品牌內部的人員及其動機的重要性，這樣可以找到品牌內部的支持者來幫助獲得贊助。
  - 舉例說明GoDaddy的案例，品牌內部的人員因為自身經歷而支持企業家。
  
  #### perspective - 與媒體購買公司合作
  - **時間戳記：01:29:11 - 01:29:58**
  - 講者提到與品牌的媒體購買公司合作的重要性，這些公司負責為品牌購買廣告空間，與他們合作可以更容易獲得贊助。
  - 舉例說明有人希望在貨車上投放廣告，與媒體購買公司合作可以更有效地達成目標。
  
  ### Conclusion for this part
  
  這段視頻主要討論了如何選擇合適的投資者、理解資金需求的真正原因、利用眾籌籌集資金、獲得贊助商的價值、理解品牌的重要性、品牌內部的人際關係以及與媒體購買公司合作的策略。講者強調了在尋求投資和贊助時需要謹慎選擇和深入理解品牌價值，並提供了多個實例來支持這些觀點。
  ### Part 10 of 15
  ### Main Body
  
  #### Perspective - 與媒體買家合作
  - **時間戳記: 01:30:02**
  - 講者提到，直接向品牌銷售產品可能會遇到困難，品牌通常會將預算分配給媒體買家。媒體買家與品牌有良好的關係，並且持有品牌的預算，因此銷售給媒體買家會更快更有效。
  
  #### Perspective - 與代理商合作
  - **時間戳記: 01:30:17**
  - 代理商通常會為品牌設計廣告活動，並將其應用於現實世界中。講者建議可以通過代理商來推銷產品，因為代理商已經與品牌建立了關係，能夠更容易地將產品納入品牌的活動中。
  
  #### Perspective - 投入品牌
  - **時間戳記: 01:31:03**
  - 講者強調，個人對品牌的投入能夠促進品牌合作。例如，他們在辦公室安裝了Ring門鈴，並未要求贊助，但最終Ring和Amazon看到了他們的使用，並開始合作。
  
  #### Perspective - 品牌建立
  - **時間戳記: 01:32:33**
  - 建立品牌需要從個人品牌開始，了解自己的價值觀和個性。講者提到，個人品牌會影響到公司品牌，並且需要明確品牌的價值觀和目標。
  
  #### Perspective - 品牌應用
  - **時間戳記: 01:37:07**
  - 公司品牌的應用有兩種方法：參考模式和領導模式。參考模式是通過贊助名人來提升品牌形象，而領導模式則是由公司內部的領導者來代表品牌價值。
  
  ### Conclusion for this part
  這部分視頻講述了如何通過與媒體買家和代理商合作來促進銷售，並強調了個人投入品牌的重要性。講者還介紹了品牌建立的基本原則和公司品牌應用的兩種主要方法。總體來說，這部分內容強調了品牌合作和品牌建立的策略和方法。
  ### Part 11 of 15
  ### Main Body
  
  #### Perspective - 品牌擴展與領導模式的挑戰
  - **時間戳: 01:40:02**
  - 講者提到品牌擴展時可能面臨的風險，例如如果某個品牌代言人做了不好的事情，會對品牌造成危害。因此，需要有機制來保護品牌。
  - **時間戳: 01:40:15**
  - 以Steve Jobs為例，當他離開蘋果公司時，公司遇到了很大的問題，因為太多品牌價值依賴於Steve Jobs的個人品牌。這表明領導模式的脆弱性。
  - **時間戳: 01:40:38**
  - 當Steve Jobs回到蘋果公司時，他有一個強有力的過渡模式，即Tim Cook。Tim Cook雖然不是Steve Jobs，但他被選中部分原因是他看起來值得信任，並且以透明的方式交流。
  
  #### Perspective - 品牌成功策略
  - **時間戳: 01:41:00**
  - 講者指出，蘋果現在更注重數據和信任，而不是一個天才領導者講述一個偉大的產品。這表明品牌成功的策略之一是選擇合適的領導模式。
  - **時間戳: 01:41:19**
  - 無論選擇哪種策略，都需要考慮到最終結果，並且要有能力在出現問題時將影響者排除在業務之外。
  - **時間戳: 01:41:36**
  - 講者強調，學會說“不”非常重要，以避免錯誤的關係和品牌合作，否則會對品牌造成損害。
  
  #### Perspective - 招聘與員工股權
  - **時間戳: 01:42:44**
  - 講者提到，招聘時要確保新員工真正關心公司的目標，這樣可以減少管理壓力。
  - **時間戳: 01:43:07**
  - 他建議給員工股權，這樣他們會與公司的成功保持一致，並且更有動力和忠誠度。
  - **時間戳: 01:45:16**
  - 講者強調，給員工股權可以減少高流動率和高管理壓力，並且如果員工擁有股權，他們更不會輕易離開公司。
  
  #### Perspective - 企業文化與價值觀
  - **時間戳: 01:47:15**
  - 講者指出，企業的成長需要依賴於文化的建立，並且需要確保企業有明確的價值觀。
  - **時間戳: 01:47:35**
  - 他分享了自己創建的公司Fluid的經驗，最初公司以賺錢為目標，但後來轉變為保護員工免受壞客戶的影響，這使得公司得以成長。
  
  #### Perspective - 成長的目標
  - **時間戳: 01:48:43**
  - 講者強調，企業成長需要有明確的目標，並且需要知道為什麼要成長。
  - **時間戳: 01:49:00**
  - 他舉例說明，自己希望建立一個幫助人們免費學習商業知識的平台，這是他成長的動力。
  
  ### Conclusion for this part
  這段視頻強調了品牌擴展和領導模式的挑戰、品牌成功的策略、招聘與員工股權的重要性、企業文化與價值觀的建立以及成長的目標。講者通過自己的經驗和例子，詳細闡述了這些觀點，並強調了在商業運營中學會說“不”的重要性。
  ### Part 12 of 15
  ### Main Body
  
  #### perspective - 創業公司需要不斷創新 (01:50:02)
  - 講者強調，創業公司不能停滯不前，必須不斷嘗試新的產品和方法。他舉了Blockbusters和Kodak的例子，說明這些公司因為停滯不前而失敗的原因。
  
  #### perspective - 建立系統和專業化 (01:50:37)
  - 講者指出，創業初期通常是每個人都能做所有事情的“通才”心態，但隨著公司成長，需要轉變為“專才”心態，讓每個人專注於特定領域。他以自己專注於市場營銷為例，說明這種轉變的重要性。
  
  #### perspective - 解雇員工的技巧 (01:52:34)
  - 講者分享了他解雇員工的經驗，強調這是一項必要的技能。他介紹了一個“七和八規則”，用來判斷員工是否應該被解雇，並說明了如何在解雇過程中保持結構和合法性。
  
  #### perspective - 全球化的重要性 (01:58:26)
  - 講者解釋了為什麼全球化對於減少業務風險非常重要。他以自己早期在香港的公司為例，說明了單一市場的風險，並強調全球化可以通過分散風險來保護公司。
  
  ### Conclusion for this part
  這段視頻強調了創業公司需要不斷創新、建立系統和專業化、以及全球化的重要性。講者分享了他在這些方面的經驗和見解，並提供了具體的例子和方法來支持他的觀點。
  ### Part 13 of 15
  ### Main Body
  
  #### Perspective - Franchising and Global Expansion
  - **Timestamp: 02:00:02 - 02:00:56**
  - 在這個階段，發現產品可以銷售的市場，即使自己不想親自經營，也可以考慮設立特許經營模式。這樣，其他人可以在不同市場開設業務並運營，而你可以在不做任何工作的情況下賺錢。講者強調，雖然他不喜歡被動收入的概念，但這種模式是最接近的。
  - 特許經營是一個真正的機會，很多人誤解了這個詞，認為它僅適用於像Subway或麥當勞這樣的品牌，但實際上，特許經營也可以應用於服務業務，許多公司都是在特許經營結構下建立的。
  - 全球化的另一個重要方面是確保你的業務能夠經得起時間的考驗。如果你的業務有全球化的思維，反而更有可能在長期內生存。講者提到，經營大公司比經營小公司更容易，因為小公司往往只有創始人一人能運營，無法負擔高級管理層或其他幫助。
  
  #### Perspective - The Reality of Mentorship
  - **Timestamp: 02:02:00 - 02:05:32**
  - 講者指出，很多人問他如何找到導師，但實際上他認為人們需要的不是導師，而是能回答問題的人。導師會分享他們的經驗，但這些經驗可能並不適用於你的情況。
  - 他建議，如果你需要有人在業務中與你合作並保持你負責，可以找一個聯合創始人；如果你需要銷售幫助，可以僱用銷售人員。
  - 如果你仍然堅持要找導師，首先要研究對方的背景，確保他們有你需要的知識。其次，不要只是簡單地請求對方成為你的導師，而是要具體說明你需要的幫助，例如每週10分鐘的時間。
  - 另一種方法是將“導師”這個詞換成“顧問”，這樣更容易找到合適的人選，並且顧問通常會更願意參與公司的運營。
  
  #### Perspective - Giving Value to Potential Mentors
  - **Timestamp: 02:07:20 - 02:08:27**
  - 找到導師的最佳方法是為對方提供價值。講者提到，有些人曾主動幫助他，例如重新設計他的网站，這樣他自然會願意回報並給予時間和幫助。
  - 他認為，很多人只是想從別人那裡獲取價值，而不是先給予價值。他強調，應該採取“給予而不求回報”的態度，這樣更有可能找到導師。
  
  #### Perspective - Understanding Equity Structure
  - **Timestamp: 02:08:49 - 02:09:59**
  - 講者強調，正確的股權結構對於業務的成功至關重要。他參與過很多業務，由於股權結構不當而失敗。
  - 大多數人不願意將股權降到50%以下，因為他們認為這樣會失去控制權。但實際上，公司控制權是通過股東協議來實現的，而不是股權比例。
  
  ### Conclusion for this part
  這段視頻主要探討了幾個關鍵的業務策略，包括特許經營和全球擴展的優勢、導師的重要性以及如何找到合適的導師，以及正確理解和設立股權結構的重要性。講者通過分享自己的經驗，強調了在這些方面做出正確決策對於業務長期成功的影響。
  ### Part 14 of 15
  ### Main Body
  
  #### perspective - Equity Control and Business Direction
  - **時間戳記: 02:10:01**
  - 講者強調在早期階段不要出售太多股權，因為這可能會影響後期的控制權和業務發展。
  - 提到如果你的商業模式是科技公司並計劃籌集大量資金，需要特別小心早期的股權分配。
  - 建議研究互聯網上的各種圖表和信息來理解這一點。
  
  #### perspective - 合夥人股權分配
  - **時間戳記: 02:11:06**
  - 講者建議與合夥人創業時應該50/50分配股權，不應該因為誰提出了創意而多給自己2%。
  - 提到這樣的分配會導致心理上的不平衡，並可能引發長期的爭執。
  - 建議設立一個第三方來幫助做出重大決策，避免決策僵局。
  
  #### perspective - 股權與品牌價值
  - **時間戳記: 02:14:14**
  - 講者強調股權結構會影響公司的品牌形象，因此需要確保股權持有人與品牌價值一致。
  - 提到給員工股權是一種激勵措施，但需要理解不同的股權結構（如股票期權和實際股權）的差異。
  
  #### perspective - 股權結構的複雜性
  - **時間戳記: 02:17:08**
  - 講者建議花時間理解不同的股權類別，並強調這些結構會影響公司的成敗。
  - 提到如果計劃將公司上市，需要從一開始就設計好股權結構，否則可能會在後期遇到困難。
  
  #### perspective - 使用SAFE協議
  - **時間戳記: 02:18:41**
  - 講者介紹了SAFE（簡單協議未來股權）作為一種在早期階段估值困難時的解決方案。
  - 提到這種協議可以避免當前的估值問題，並且對吸引投資者和激勵員工都很有幫助。
  
  ### Conclusion for this part
  這段視頻主要討論了股權控制、合夥人股權分配、股權與品牌價值、股權結構的複雜性以及使用SAFE協議等主題。講者強調了在早期階段不要出售太多股權的重要性，並建議合夥人應該平等分配股權以避免長期爭執。此外，講者還強調了股權結構對公司品牌和未來發展的影響，並介紹了SAFE協議作為早期估值困難時的解決方案。
  ### Part 15 of 15
  ### Main Body
  
  #### perspective - 不想出售公司
  - 時間戳記: 02:20:02
  - 講者分享了他過去幾次出售公司的經驗，並指出最好的出售公司方式是根本不想出售。這樣可以在談判中處於最有利的位置，因為最豐厚的報價往往來自於你不想出售的情況。
  
  #### perspective - 建立合作關係
  - 時間戳記: 02:21:07
  - 講者提到，與有可能購買你公司的人建立合作關係也是一種有效的出售方式。他舉例說明了自己與普華永道（PWC）的合作，最終促成了出售。
  
  #### perspective - 使用專業代理
  - 時間戳記: 02:22:19
  - 講者建議使用專業的業務出售代理來幫助出售公司，因為這樣你可以專注於業務的增長。然而，他也提醒要仔細調查這些代理公司的背景和法律結構，以避免被騙。
  
  #### perspective - 合併
  - 時間戳記: 02:22:55
  - 講者指出，與競爭對手合併也是一種出售公司的方式。他分享了自己曾經與競爭對手建立友好關係的經歷，並提到有時候與非競爭對手出售可能會獲得更高的價值。
  
  #### perspective - 管理層收購
  - 時間戳記: 02:24:06
  - 講者提到，讓公司內部的管理層收購也是一種出售公司的方法。他分享了自己讓Nest的領導團隊收購公司的經歷，認為這樣可以讓業務不受損害，同時給予管理層應得的成功和愛。
  
  ### Conclusion for this part
  
  這段視頻的最後部分，講者詳細介紹了幾種出售公司的策略，包括不想出售、建立合作關係、使用專業代理、合併以及管理層收購。他強調，最重要的是建立一個你熱愛的業務，而不是為了出售而建立公司。這樣不僅能吸引投資者，還能讓潛在買家更感興趣。
  
  `,
      },
    ],
  },
  {
    option: "Book Review",
    title: "Quick Outline of a 15 mins video",
    additionalInfo: "",
    videoTitle:
      "Anything You Want：微型創業者必修的 8 堂課，一人公司的最佳指南",
    youtubeId: "oqeJGz1Fdww",
    videoLength: "15:45",
    summaryBUtton: "Summary",
    summary: [
      {
        language: "zh-tw",
        content: `### 簡介
Derek Sivers 是一位獨特的創業家,他的經歷和理念值得我們細細品味。這本《Anything You Want》是他創業心法中最重要的作品,本文將為您濃縮分享其中8個最實用的創業必修課。

### 主要內容

#### 第一個觀點 - 生意模式越簡單越好
- 他創辦的 CD Baby 公司的商業模式非常簡單,就是幫獨立音樂人上架銷售CD,然後收取一定比例的佣金。即使公司發展到營收千萬美金,這兩個收入來源依舊是唯一的。

#### 第二個觀點 - 將事業打造成烏托邦
- 他將自己理想中的音樂發行商歸納成四大原則:每週付錢、告知顧客資料、永不下架、不接受付費曝光。他堅持在 CD Baby 實踐這些理念,即使大公司願意出高價廣告,他也一一拒絕。

#### 第三個觀點 - 把沒有資金當成優勢
- 他沒有外部投資,反而認為這是優勢,因為可以專注於滿足客戶需求,而不必討好投資者。他會直接詢問客戶,「我現在要怎麼樣做才能最好地幫助你呢?」

#### 第四個觀點 - 點子不值錢,執行力才是王道
- 他提出一個公式:點子乘以執行力就等於事業的價值。即使有再好的點子,如果執行力不強,也只值一兩萬美金,相反地,就算是普通點子,搭配最強的執行力,也能值上千萬美金。

#### 第五個觀點 - 別做長遠的計畫,專注於眼前的客戶
- 他說CD Baby從來沒有制定長遠計劃,因為往往會被現實超越。相反地,他只專注於滿足當下的客戶需求,並且樂在其中。

#### 第六個觀點 - 保持有趣
- 他本人就是一個有趣的人,這種個人特質也影響到他經營CD Baby的方式。他們網站上每個細節都注入幽默元素,讓客戶感受到工作人員的熱忱。

#### 第七個觀點 - 享受創造的過程
- 即便公司發展需要外包功能,但Sivers仍然堅持自己動手開發網站系統。他說最重要的是成為一個有影響力的企業家,而不是擁有一個數百萬美金的事業。

#### 第八個觀點 - 創造你想要的任何事情
- 他的創業初衷從未是為了賺錢,而是要打造一個能讓自己快樂的烏托邦。所以當CD Baby越做越大,他反而感到不快樂,最後選擇以2200萬美金的價格將公司賣掉,並將所得捐給自己創立的信託基金。

### 結論
Derek Sivers是一位不同尋常的創業家,他的思維和做事方式也格外獨特。他的創業心法強調簡單、專注、自主,以及追求真正的快樂,不論是對自己還是對他
`,
      },
      {
        language: "en",
        content: `### Introduction
This video provides an overview of the book "Anything You Want" by Derek Sivers, a musician-turned-entrepreneur who founded the online music store CD Baby. The video highlights the key lessons and perspectives from Sivers' entrepreneurial journey and the principles he followed in building his successful business.

### Main Body
#### Perspective 1 - Simple Business Model
  - Sivers' business model for CD Baby was extremely simple - he helped independent musicians sell their CDs online and charged a commission on each sale.
  - He determined the commission rate by asking a local record store how much they charged for consignment sales, and set the price accordingly.
  - Even as the business grew to over $10 million in revenue, this basic model remained the company's sole source of income.

#### Perspective 2 - Creating a Utopian Vision
  - Sivers was initially reluctant to expand CD Baby, as he just wanted to focus on his music career.
  - However, he decided to continue growing the business to help more independent musicians.
  - He outlined his "utopian" vision for CD Baby, which included features like weekly payouts, providing customer information, never dropping artists, and no paid placements.
  - He stuck to this vision, even turning down opportunities to generate more revenue through advertising and promotions that didn't align with his principles.

#### Perspective 3 - Leveraging Lack of Capital
  - Sivers saw his lack of funding as an advantage, as it prevented him from expanding the business in ways that went against his goals.
  - He made decisions based on what was best for his customers, rather than appeasing investors or trying to grow rapidly.
  - He would often ask his customers directly what they wanted, and then focus on satisfying those needs.

#### Perspective 4 - Ideas are Cheap, Execution is Valuable
  - Sivers believed that the execution of an idea is far more important than the idea itself.
  - He used a formula to illustrate this point: Idea x Execution = Value. A great idea with poor execution has little value, while a mediocre idea with excellent execution can be highly valuable.
  - This mindset encouraged Sivers to focus on implementing his ideas rather than overthinking them.

#### Perspective 5 - Don't Make Long-Term Plans
  - Sivers avoided making long-term plans for CD Baby, preferring to focus on serving his current customers.
  - When he tried to forecast the company's future growth, his predictions proved far off the mark, as the business ended up expanding much more rapidly than he had anticipated.
  - He learned to embrace the uncertainty and just focus on doing what was best for his customers in the present moment.

#### Perspective 6 - Maintain a Sense of Fun
  - Sivers was known for infusing a sense of humor and playfulness into his business, from the confirmation emails he wrote to the unique customer requests he fulfilled.
  - He believed that maintaining a fun and engaging company culture was key to keeping employees motivated and customers satisfied.

#### Perspective 7 - Enjoy the Creative Process
  - Despite the opportunity to outsource development and focus on higher-level tasks, Sivers preferred to personally code and build the functionality for CD Baby.
  - He found great satisfaction in the creative process of building the systems his business needed, even if it was slower and less efficient than outsourcing.
  - For Sivers, the journey of creating something was more important than the end result or financial success.

#### Perspective 8 - Create the Life You Want
  - Sivers' ultimate goal was not to build a massive, profitable business, but to create a lifestyle and work environment that allowed him to be happy and fulfilled.
  - When CD Baby grew to the point where it no longer aligned with his personal vision, he made the decision to sell the company and use the proceeds to fund his charitable foundation.
  - He emphasized that the purpose of entrepreneurship should be to design the life you want to live, not just to accumulate wealth.

### Conclusion
The video provides a comprehensive overview of the key perspectives and lessons from Derek Sivers' entrepreneurial journey with CD Baby. The overarching theme is Sivers' focus on creating a business and lifestyle that aligned with his personal values and goals, rather than pursuing growth and profits for their own sake. His unconventional approach to entrepreneurship offers a refreshing alternative to the typical startup narrative.

### Call to Action from Author
The author strongly recommends this book, "Anything You Want", to anyone interested in entrepreneurship and building a fulfilling career. The principles and mindset espoused by Sivers offer a unique and inspiring perspective on what it means to be a successful founder. The author also promotes their own email newsletter, which shares insights and strategies for achieving financial, physical, and mental freedom.
`,
      },
    ],
  },
  {
    option: "Meeting Minutes",
    title: "Meeting Minutes of a 1-hour meeting",
    additionalInfo: "*GPT-4o is recommended for meeting minutes ",
    videoTitle: "Product Marketing Meeting (weekly) 2021-06-07",
    youtubeId: "06dkG-smO78",
    videoLength: "49:33",
    summaryBUtton: "Meeting Minutes",
    summary: [
      {
        language: "en",
        content: `## Product Marketing Meeting Summary (2021-06-07)

## Key Takeaways

### 1. Sales and Messaging Strategy
- **Timestamp: 00:00:02 - 00:02:21**
  - Sami proposed tracking the top 30-40 deals to understand sales conversations and improve messaging.
  - Focus on qualitative information from sales calls and direct team interactions.
  - Action: Split the identified deals across the team for analysis.

### 2. Team Goals and Responsibilities
- **Timestamp: 00:02:21 - 00:06:14**
  - The team should focus on messaging, assisting in deals, and understanding the buyer's journey.
  - Develop a tight PM-PMM relationship to convey customer feedback effectively.
  - Action: Cindy to continue her role in joining calls and providing market knowledge.

### 3. Engaging with Sales Process
- **Timestamp: 00:06:14 - 00:09:20**
  - PMMs should assist in accelerating the sales cycle by overcoming objections and providing feedback to PMs.
  - Action: Team members to establish themselves as subject matter experts to be naturally looped into relevant sales calls.

### 4. Tracking Top Deals
- **Timestamp: 00:09:20 - 00:16:14**
  - Each team member should track the top 5-7 deals by revenue each quarter, including enterprise, mid-market, and SMB deals.
  - Action: Review sales dashboards and QBRs to identify and track these deals.

### 5. Competitive Pages Redesign
- **Timestamp: 00:35:00 - 00:42:00**
  - The new format for competitive pages will include the name of the capability, a descriptor, and a 0-1-2 rating system.
  - Future iterations will allow for specific descriptions per competitor.
  - Action: Team to draft generic descriptors for capabilities and iterate to make them specific.

### 6. Security Growth Initiative
- **Timestamp: 00:45:11 - 00:46:56**
  - Cindy is leading an initiative to grow security, involving broad plans and short-term progress.
  - Action: Follow the discussions in the security channel and review Pyle's document on sales plays and growth.

### 7. Microsoft Competitive Intel
- **Timestamp: 00:47:38 - 00:48:43**
  - Elita has created a comprehensive Microsoft report with suggestions for various segments.
  - Action: Review the document, coordinate with Elita, and determine follow-up actions for agile, GitHub, and GitHub Actions content.

## Action Items by Individual/Department

### Sami
- Split identified deals across the team for analysis.
- Review sales dashboards and QBRs to identify top deals.

### Cindy
- Continue joining sales calls and providing market knowledge.
- Lead the security growth initiative and follow discussions in the security channel.

### Team Members
- Establish themselves as subject matter experts to be naturally looped into relevant sales calls.
- Track the top 5-7 deals by revenue each quarter, including enterprise, mid-market, and SMB deals.
- Draft generic descriptors for capabilities and iterate to make them specific.

### William
- Document the four reasons to be involved in the sales motion in the handbook.
- Poke into Pyle's weekly meeting to find out what deals are on the agenda.

### Brian
- Track down who populates the "wins key deals" channel and report back to the team.

### Elita
- Coordinate with team members on the Microsoft competitive intel and follow up on agile, GitHub, and GitHub Actions content.

This summary provides a comprehensive overview of the meeting's content, focusing on key takeaways and action items assigned to specific individuals or departments.`,
      },
      {
        language: "zh-tw",
        content: `## 產品行銷會議總結(2021-06-07)

## 要點

### 1. 銷售與訊息傳遞策略
- **時間戳記：00:00:02 - 00:02:21**
   - Sami 建議追蹤前 30-40 筆交易，以了解銷售對話並改善訊息傳遞。
   - 專注於來自銷售電話和直接團隊互動的定性資訊。
   - 行動：將已確定的交易拆分到團隊中進行分析。

### 2. 團隊目標與責任
- **時間戳記：00:02:21 - 00:06:14**
   - 團隊應專注於訊息傳遞、協助交易以及了解買家的旅程。
   - 建立緊密的 PM-PMM 關係，以有效傳達客戶回饋。
   - 行動：Cindy 繼續在加入電話會議和提供市場知識方面發揮作用。

### 3. 參與銷售流程
- **時間戳記：00:06:14 - 00:09:20**
   - PMM 應透過克服異議並向 PM 提供回饋來協助加快銷售週期。
   - 行動：團隊成員將自己打造為主題專家，以便自然參與相關的銷售拜訪。

### 4. 追蹤熱門優惠
- **時間戳記：00:09:20 - 00:16:14**
   - 每個團隊成員應追蹤每季收入排名前 5-7 名的交易，包括企業、中端市場和中小企業交易。
   - 行動：查看銷售儀表板和 QBR 以識別和追蹤這些交易。

### 5. 競賽頁面重新設計
- **時間戳記：00:35:00 - 00:42:00**
   - 競爭性頁面的新格式將包括能力名稱、描述符和 0-1-2 評級系統。
   - 未來的迭代將允許對每個競爭對手進行具體描述。
   - 行動：團隊起草能力的通用描述符並迭代以使其具體化。

### 6. 安全成長計劃
- **時間戳記：00:45:11 - 00:46:56**
   - 辛迪正在領導一項增強安全性的舉措，涉及廣泛的計劃和短期進展。
   - 行動：關注安全頻道中的討論並查看 Pyle 關於銷售活動和成長的文件。

### 7. 微軟競爭英特爾
- **時間戳記：00:47:38 - 00:48:43**
   - Elita 創建了一份全面的 Microsoft 報告，其中包含針對各個細分市場的建議。
   - 行動：審查文檔，與 Elita 協調，並確定敏捷、GitHub 和 GitHub Actions 內容的後續行動。

## 個人/部門的行動項目

### Sami
- 將確定的交易拆分到整個團隊中進行分析。
- 查看銷售儀表板和 QBR 以識別熱門交易。

### Cindy
- 繼續參加銷售電話並提供市場知識。
- 領導安全成長計畫並關注安全頻道中的討論。

### 團隊成員
- 使自己成為主題專家，自然地參與相關的銷售拜訪。
- 追蹤每季收入排名前 5-7 名的交易，包括企業、中端市場和中小企業交易。
- 起草功能的通用描述符並迭代以使其具體化。

### William
- 在手冊中記錄參與銷售動議的四個原因。
- 深入查看派爾的每週會議，以了解議程上有哪些交易。

### Brian
- 追蹤誰填充了「贏得關鍵交易」頻道並向團隊報告。

### Elita
- 與團隊成員就 Microsoft 競爭情報進行協調，並跟進敏捷、GitHub 和 GitHub Actions 內容。

本摘要全面概述了會議內容，重點在於關鍵要點和分配給特定個人或部門的行動項目。`,
      },
    ],
  },
  {
    option: "Product Review",
    title: "Quick Outline of a 15 mins video",
    additionalInfo: "",
    videoTitle: "iPhone 15 Pro: 3 Months Later!",
    youtubeId: "YmwskGLycHo",
    videoLength: "10:26",
    summaryBUtton: "Product Review",
    summary: [
      {
        language: "en",
        content: `## Title: A Comprehensive Review of the iPhone 15 Pro After 3 Months of Use

### Summary:

**High-level Overview and Key Takeaways**:
   - The video reviews the Titanium iPhone 15 Pro after using it for 3 months without a case.
   - The reviewer provides insights on the long-term usage and performance of the device, focusing on features such as the camera, action button, and USB-C implementation.

**Pros and Cons**:
- Pros:
     - The titanium frame and lighter color show fewer fingerprints (0:07:10)
     - The USB-C implementation is much more convenient for charging and data transfer (0:05:00)
     - The action button provides customization options, though the placement could be improved (0:02:25 - 0:04:23)
- Cons:
     - The multiple focal length camera feature is not used much by the reviewer (0:01:37 - 0:02:06)
     - The action button placement is not very reachable, especially for one-handed use (0:03:10)
     - The reviewer still needs to carry a Lightning cable for certain accessories (0:05:31 - 0:06:01)

**Other Important Details**:
   - The phone has received several software updates, including the introduction of the new Journal app and support for spatial video recording for the Apple Vision Pro (0:06:17 - 0:08:00)
   - The reviewer has had the opportunity to experience the Apple Vision Pro and provides tips on capturing spatial videos (0:08:06 - 0:08:41)
   - The reviewer concludes that the iPhone 15 Pro is a worthy upgrade, especially for users with older iPhones, and compares it to the Porsche 911 in terms of refined design evolution (0:09:17 - 0:10:10)
`,
      },
      {
        language: "zh-tw",
        content: `## 標題：iPhone 15 Pro 使用 3 個月後的全面評測

### 概括：

### 高層概述與要點
  - 影片回顧了鈦金 iPhone 15 Pro 在不使用保護殼的情況下使用 3 個月後的情況。
  - 審核者提供有關裝置的長期使用和效能的見解，重點在於相機、操作按鈕和 USB-C 實作等功能。

**優點和缺點**：
- 優點：
      - 鈦金屬框架和較淺的顏色顯示較少的指紋 (0:07:10)
      - USB-C 實現充電和資料傳輸更加方便 (0:05:00)
      - 操作按鈕提供了自訂選項，但位置還可以改進 (0:02:25 - 0:04:23)
- 缺點：
      - 審稿者較不使用多焦距相機功能 (0:01:37 - 0:02:06)
      - 操作按鈕的位置較不容易觸及，尤其是單手使用
      時 (0:03:10)
      - 評論者仍需要攜帶某些配件的閃電電纜 (0:05:31 - 0:06:01)

### 其他重要細節：
  - 該手機已獲得多項軟體更新，包括引入新的 Journal 應用程式以及對 Apple Vision Pro 空間錄影的支援 (0:06:17 - 0:08:00)
  - 評測者有機會體驗 Apple Vision Pro 並提供了拍攝空間影片的技巧 (0:08:06 - 0:08:41)
  - 評測者的結論是，iPhone 15 Pro 值得升級，尤其是對於使用較舊 iPhone 的用戶，並將其與保時捷 911 的精緻設計演變進行比較 (0:09:17 - 0:10:10)`,
      },
    ],
  },
];

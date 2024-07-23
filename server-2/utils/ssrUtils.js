// Generate meta tags based on the page content
const shareLink = process.env.SHARE_URL;

const markdownToText = (mdString) => {
  // remove ### headings, bold, italic, and strikethrough

  const text = mdString
    .replace(/## Introduction/g, "") // remove Introduction heading (for now/)
    .replace(/#+/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/_+/g, "")
    .replace(/~~+/g, "");

  return text;
};

export const generateMetaTags = (summary) => {
  const summaryText = markdownToText(summary.summary);

  return `
    <title>${summary.sourceTitle} | Fusion AI Summary</title>
      <meta name="description" content="${summaryText}" />
      <meta property="og:title" content="${summary.sourceTitle}" />
      <meta property="og:description" content="${summaryText}" />
      <meta property="og:image" content="https://img.youtube.com/vi/${summary.sourceId}/0.jpg" />
      <meta property="og:url" content="${shareLink}${summary._id}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${summary.sourceTitle}" />
      <meta name="twitter:description" content="${summaryText}" />
      <meta name="twitter:url" content="${shareLink}${summary._id}" />
      <meta name="twitter:image" content="https://img.youtube.com/vi/${summary.sourceId}/0.jpg" />
      <link rel="canonical" href="${shareLink}${summary._id}" />
    `;
};

// Generate meta tags based on the page content

const shareLink = process.env.SHARE_URL

export function generateMetaTags(summary) {
  return `
    <title>${summary.sourceTitle} | Youtube Summary</title>
      <meta name="description" content="${summary.summary}" />
      <meta property="og:title" content="${summary.sourceTitle}" />
      <meta property="og:description" content="${summary.summary}" />
      <meta property="og:image" content="https://img.youtube.com/vi/${summary.sourceId}/0.jpg" />
      <meta property="og:url" content="${shareLink}${summary._id}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${summary.sourceTitle}" />
      <meta name="twitter:description" content="${summary.summary}" />
      <meta name="twitter:image" content="https://img.youtube.com/vi/${summary.sourceId}/0.jpg" />
      <link rel="canonical" href="${shareLink}${summary._id}" />
    `;
}

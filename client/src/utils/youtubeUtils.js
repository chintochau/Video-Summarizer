/**
 * Extracts the YouTube video ID from a given YouTube video link.
 * @param {string} youtubeLink - The YouTube video link from which the ID needs to be extracted.
 * @returns {string|null} - The YouTube video ID extracted from the link or null if not found.
 */
export const getYoutubeIdFromLink = (youtubeLink) => {
    const youtubeIdFromLink = youtubeLink.match(
        /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
    // Set YouTube link and ID states
    if (youtubeIdFromLink) {
        return youtubeIdFromLink[1]
      } else {
        return null
      }
} 
import Video from "../models/videoModel.js";


export const fineVideoIdBySourceIdAndReturnID = async (sourceId) => {
  const video = await Video.findOne({ sourceId }, { _id: 1 });
  return video;
}

export const fineVideoIdBySourceIdAndVideo = async (sourceId) => {
  const video = await Video.findOne({ sourceId });
  return video;
}


/**
 * Retrieves an existing video by source ID or creates a new video if it doesn't exist.
 * @param {Object} options - The options for retrieving or creating a video.
 * @param {Object} options.video - The video object containing source ID, title, type, author, and duration.
 * @param {string} options.userId - The ID of the user associated with the video.
 * @returns {Promise<Object>} - A promise that resolves to the existing or newly created video.
 */
export const getOrCreateVideoBySourceId = async ({ video, userId, originalTranscript = "" }) => {

  const { sourceId, sourceTitle, sourceType, author, videoDuration } = video;
  let videoThumbnail;

  let existingVideo = await fineVideoIdBySourceIdAndReturnID(sourceId);
  if (!existingVideo) {
    if (sourceType === "youtube") {
      videoThumbnail = `https://img.youtube.com/vi/${sourceId}/0.jpg`;
    }

    const newVideo = new Video({
      userId,
      sourceId,
      sourceTitle,
      sourceType,
      author,
      videoThumbnail,
      videoDuration,
      originalTranscript,
    });
    existingVideo = await newVideo.save();
  }

  return existingVideo;
}

export const getOrCreateVideoAndUpdateTranscript = async ({ video, userId, originalTranscript,utterances, speakers }) => {
  const { sourceId, sourceTitle, sourceType, author, videoDuration } = video;
  let videoThumbnail;

  let existingVideo = await fineVideoIdBySourceIdAndVideo(sourceId);
  if (!existingVideo) {
    if (sourceType === "youtube") {
      videoThumbnail = `https://img.youtube.com/vi/${sourceId}/0.jpg`;
    }
    const newVideo = new Video({
      userId,
      sourceId,
      sourceTitle,
      sourceType,
      author,
      videoThumbnail,
      videoDuration,
      originalTranscript,
      utterances,
      speakers,
    });
    existingVideo = await newVideo.save();
  }
  else {
    existingVideo.originalTranscript = originalTranscript;
    existingVideo.lastUpdated = Date.now();
    existingVideo = await existingVideo.save();
  }

  return existingVideo;
}
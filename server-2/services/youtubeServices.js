import ytdl from "@distube/ytdl-core";

export const getYoutubeThumbnail = async (youtubeId) => {
  try {
    const videoInfo = await ytdl.getInfo(youtubeId);
  } catch (error) {
    console.error(error.message);
  }
};

export const YTconvertToSrt = (transcript) => {
  let srt = "";
  let index = 1;

  // sub function
  function formatTimeSrt(seconds) {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = Math.floor(seconds % 60);
    const ms = Math.round((seconds - Math.floor(seconds)) * 1000);

    return `${pad(hh)}:${pad(mm)}:${pad(ss)},${pad(ms, 3)}`;
  }
  // sub function
  function pad(num, size = 2) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  transcript.forEach((line, i) => {
    const startTime = formatTimeSrt(line.offset / 1000);
    const endTime = formatTimeSrt((line.offset + line.duration) / 1000);

    srt += `${index}\n${startTime} --> ${endTime}\n${line.text}\n\n`;
    index++;
  });

  return srt;
};


export const getYoutubeChapters = async (youtubeId) => {
  try {
    const videoInfo = await ytdl.getInfo(youtubeId);
    console.log("videoInfo", videoInfo.videoDetails.chapters);
    const chapters = videoInfo.videoDetails.chapters;
    return chapters;
  } catch (error) {
    console.error(error.message);
  }

}

import { assembly } from "../config/summaryConfig.js";
import { colors } from "../utils/constants.js";

export const transcribeWithAssemblyAI = async(data) => {
    const { filePath, language, fileLink } = data;

    let colorNum = 0
    
    const transcript = await assembly.transcripts.transcribe({
      audio: filePath || fileLink,
      language_code: language,
      speaker_labels:true
    });


    // only get the end, start, speaker, and text from the utterances

    console.log("utterancesL: ",transcript.utterances);
    const utterances = transcript.utterances.map(utterance => {
      return {
        start: utterance.start,
        end: utterance.end,
        speaker: utterance.speaker,
        text: utterance.text
      }
    });

    const speakers = utterances.reduce((acc, utterance) => {
      if (!acc.find(speaker => speaker.id === utterance.speaker)) {
          // generate random color
          acc.push({ id: utterance.speaker, name: utterance.speaker, color: colors[colorNum]})
          colorNum++
      }
      colorNum = colorNum === colors.length ? 0 : colorNum
      return acc
  }, [])

    const srt = await assembly.transcripts.subtitles(transcript.id, "srt");
    return {srt,utterances,speakers};
  }
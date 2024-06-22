import { assembly } from "../config/summaryConfig.js";

export const transcribeWithAssemblyAI = async(data) => {
    const { filePath, language, fileLink } = data;
    
    const transcript = await assembly.transcripts.transcribe({
      audio: filePath || fileLink,
      language_code: language,
      speaker_labels:true
    });

    const utterances = transcript.utterances
    const srt = await assembly.transcripts.subtitles(transcript.id, "srt");
    return {srt,utterances};
  }
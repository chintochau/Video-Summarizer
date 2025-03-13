import { openai } from "../config/summaryConfig.js";
import fs from "fs";
import path from "path";

export const generateSpeech = async (req, res) => {
    const { text } = req.body;
    const speechFile = path.resolve("./speech.mp3");
    console.log(text);
    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova",
            input: `
`,
        });

        console.log(speechFile);
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);
        res.sendFile(speechFile);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

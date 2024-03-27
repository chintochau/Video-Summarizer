// transcribeService.js
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

export const transcribeFile = async (file) => {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path));

    try {
        const response = await fetch('http://127.0.0.1:5000/transcribe', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });

        if (response.ok) {
            const text = await response.text();
            return text;
        } else {
            throw new Error('Failed to transcribe');
        }

    } catch (error) {
        console.error("Error occurred during transcription:", error);
        throw new Error("Error occurred during transcription");
    } finally {

        cleanupFiles(file.path, file.path)
    }
}

const cleanupFiles = (filePath, originalFilePath) => {
    if (filePath) {
        fs.unlinkSync(filePath);
    }
    if (filePath !== originalFilePath) {
        fs.unlinkSync(originalFilePath);
    }
}
import React, { useState } from 'react'
import { useVideoContext } from '../../contexts/VideoContext'

const GenerateOptions = (params) => {
    const {loadSrtTranscript,uploadAndTranscriptFile } = params
    const [selectedFile, setSelectedFile] = useState(null)
    const [language, setLanguage] = useState('en')
    const [selectedModel, setSelectedModel] = useState('assembly')
    const { videoCredits, } = useVideoContext()


    const getTranscriptWithUpload = (file) => {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const srt = e.target.result;
            loadSrtTranscript(srt);
        };
        reader.readAsText(file);
    };


    return (
        <div className="flex-col ">
            <div>Generate Transcript with AI</div>
            <div className="flex mx-auto  ">
                <label
                    htmlFor="language-select"
                    className=" text-indigo-600 mr-1"
                >
                    Language:
                </label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    id="language-select"
                    className="bg-gray-50 border border-indigo-300 text-indigo-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block hover:text-indigo-400 "
                >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    {/* Add more languages as needed */}
                </select>
            </div>
            <div className="flex">
                <label
                    htmlFor="language-select"
                    className=" text-indigo-600 mr-1"
                >
                    Model:
                </label>
                <select
                    value={selectedModel}
                    onChange={(e) => {
                        setSelectedModel(e.target.value);
                    }}
                    id="language-select"
                    className="bg-gray-50 border border-indigo-300 text-indigo-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block hover:text-indigo-400 "
                >
                    <option value="assembly">
                        Assenbly AI (Free for now)
                    </option>
                    <option value="openai">
                        Open AI (Better Performance)
                    </option>
                    {/* Add more languages as needed */}
                </select>
            </div>
            <button
                className="my-2 bg-indigo-600 hover:bg-indigo-400 px-3.5 py-2.5 rounded-md text-white disabled:bg-gray-400"
                onClick={uploadAndTranscriptFile}
            >
                Generate (Credits: {videoCredits})
            </button>
            <div className=" w-72">
                a hour long video takes up to 5 mins to transcribe
            </div>
            <div>OR</div>
            <div>
                <input
                    type="file"
                    onChange={(e) =>
                        getTranscriptWithUpload(e.target.files[0])
                    }
                />
                {selectedFile && (
                    <p>Selected File: {selectedFile.name}</p>
                )}
            </div>
        </div>
    )
}

export default GenerateOptions
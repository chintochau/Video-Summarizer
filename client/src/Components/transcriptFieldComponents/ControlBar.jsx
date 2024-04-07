import React from 'react'
import { ArrowDownTrayIcon, ArrowPathIcon, ClipboardDocumentIcon, PencilSquareIcon } from '@heroicons/react/24/outline'


export const ControlBar = (params) => {
    const { handleTranscriptMode, exportSRT, setIsEditMode, isEditMode, handleTextMode, editableTranscript, viewMode, resetTranscriptField } = params
    return (
        <div className=" flex pl-2 justify-between">
            <div className=" flex items-end">
                <button
                    onClick={handleTranscriptMode}
                    className={` px-2 py-1 rounded-t-md hover:text-indigo-400 ${viewMode === "transcript"
                        ? " text-indigo-600 bg-white "
                        : " text-gray-600"
                        }`}
                >
                    Transcript
                </button>
                <button
                    onClick={handleTextMode}
                    className={` px-2 py-1 rounded-t-md hover:text-indigo-400 ${viewMode !== "transcript"
                        ? " text-indigo-600 bg-white "
                        : " text-gray-600"
                        }`}
                >
                    Text
                </button>
            </div>

            <div className=''>
                <button
                    onClick={() => exportSRT(editableTranscript)}
                    className=" text-indigo-600 hover:text-indigo-400 "
                >
                    <div className='flex h-8 p-1'>
                        <ArrowDownTrayIcon />
                        <p>SRT</p>
                    </div>
                </button>
                <button
                    onClick={() => navigator.clipboard.writeText(
                        editableTranscript.map(({ text, start }) =>
                            viewMode === "transcript"
                                ? start.split(",")[0] + " " + text
                                : text
                        )
                            .join("\n")
                    )
                    }
                    className="w-8 p-1  text-indigo-600  hover:text-indigo-400 "
                >
                    <ClipboardDocumentIcon />
                </button>

                <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`w-8 p-1  text-indigo-600 rounded-md hover:text-indigo-400  outline-indigo-600 ${isEditMode ? " bg-indigo-500 text-white" : ""}`}>
                    <PencilSquareIcon />
                </button>
                <button
                    onClick={resetTranscriptField}
                    className="w-8 p-1 text-gray-500 text-sm hover:text-indigo-400 "
                >
                    <ArrowPathIcon />
                </button>
            </div>
        </div>
    )
}

export default ControlBar
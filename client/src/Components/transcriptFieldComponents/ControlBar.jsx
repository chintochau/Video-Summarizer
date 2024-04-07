import React, { useState } from 'react'
import { ArrowDownTrayIcon, ArrowPathIcon, ClipboardDocumentIcon, PencilSquareIcon } from '@heroicons/react/24/outline'


export const ControlBar = (params) => {
    const { exportSRT, setIsEditMode, isEditMode, editableTranscript, viewMode, resetTranscriptField, setViewMode } = params
    const [currentTab, setCurrentTab] = useState('Transcript');
    const classNames = (...classes) => {
        return classes.filter(Boolean).join(' ')
    }

    const tabs = [
        { name: 'Transcript', label: 'transcript' },
        { name: 'Text', label: 'text' }
    ]

    return (
        <div >

            <div className="bg-gray-50">
                <div className="border-b border-gray-200 flex justify-between ">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => {
                                    setCurrentTab(tab.name)
                                    setViewMode(tab.label)
                                }}
                                className={classNames(
                                    currentTab === tab.name
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'whitespace-nowrap border-b-2 py-2 px-1 text-md font-medium cursor-pointer'
                                )}
                                aria-current={currentTab === tab.name ? 'page' : undefined}
                            >
                                {tab.name}
                            </button>
                        ))}

                    </nav>

                    <div className='content-center'>
                        <button
                            onClick={() => exportSRT(editableTranscript)}
                            className=" text-indigo-600 hover:text-indigo-400"
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


            </div>

        </div>
    )
}

export default ControlBar
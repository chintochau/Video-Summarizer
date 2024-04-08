import { Fragment, useEffect, useRef, useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { PlayCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import VideoField from '../VideoField'
import SummaryField from '../SummaryField'
import TranscriptField from '../TranscriptField'
import { useVideoContext } from '../../contexts/VideoContext'
import { useTranscriptContext } from '../../contexts/TranscriptContext'
import { getYoutubeIdFromLink } from '../../utils/youtubeUtils'
import HistoryPage from '../../pages/HistoryPage'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../ui/resizable"


const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const YoutubeSummary = () => {
    const videoRef = useRef(null)
    const [youtubeLink, setYoutubeLink] = useState("")
    const { youtubeId, setYoutubeId } = useVideoContext()
    const { setParentSrtText, setParentTranscriptText, parentSrtText, parentTranscriptText } = useTranscriptContext()

    const submitYoutubeLink = (e) => {
        e.preventDefault();
        const id = getYoutubeIdFromLink(youtubeLink)
        if (id) {
            setYoutubeId(id)
        } else {
            setYoutubeId("")
        }
    }

    return (
        <div className="flex flex-col h-full">

            {/* Navbar */}
            <div className="sticky top-0 z-40 flex h-8 md:h-14 shrink-0 items-center gap-x-4 border-2 m-1 rounded-lg border-gray-200 bg-gray-50 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 ">
                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
                    <form className="relative flex flex-1 " onSubmit={submitYoutubeLink} >
                        <label htmlFor="youtube-bar" className="sr-only">
                            youtube link
                        </label>
                        <PlayCircleIcon
                            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        <input
                            id="search-field"
                            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-gray-50"
                            placeholder="Youtube link"
                            type="search"
                            autoComplete='off'
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                        />
                    </form>
                </div>
            </div>

            {/* Main Content */}
            {youtubeId && <ResizablePanelGroup direction="horizontal">

                <ResizablePanel className="flex flex-col flex-1" >
                    <div className=''>
                        <VideoField
                            videoRef={videoRef}
                            youtubeId={youtubeId}
                        />
                    </div>
                    <div className=' h-40 flex-1 hidden md:block overscroll-scroll'>
                        <TranscriptField
                            youtubeId={youtubeId}
                            videoRef={videoRef}
                            setParentTranscriptText={setParentTranscriptText}
                            setParentSrtText={setParentSrtText}
                            displayMode="youtube"
                        />
                    </div>
                    <div className='md:hidden h-[calc(100vh-30vh)]'>
                        <SummaryField
                            videoRef={videoRef}
                            parentSrtText={parentSrtText}
                            parentTranscriptText={parentTranscriptText} 
                            setParentSrtText={setParentSrtText}
                            />
                    </div>
                </ResizablePanel >
                <ResizableHandle className="w-1 bg-indigo-100 hidden md:flex"/>
                <ResizablePanel className="hidden sticky top-20 shrink-0 md:block w-full md:w-1/2  h-1/2  md:h-full p-1 bg-gray-50">
                    <SummaryField
                        videoRef={videoRef}
                        parentSrtText={parentSrtText}
                        parentTranscriptText={parentTranscriptText} />
                </ResizablePanel>

            </ResizablePanelGroup>}

            {!youtubeId &&
                <div className=' overflow-auto'><HistoryPage sourceType="youtube" /></div>
            }
        </div>
    )
}

export default YoutubeSummary


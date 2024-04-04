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
    const { setParentSrtText, setParentTranscriptText,parentSrtText,parentTranscriptText } = useTranscriptContext()

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
        <div className="flex flex-col h-screen">

            <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-2 m-1 rounded-lg border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 ">
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
                            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm "
                            placeholder="Youtube link"
                            type="search"
                            autoComplete='off'
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                        />
                    </form>
                </div>
            </div>


            <div className="mx-auto flex w-full max-w-[1920px] items-start gap-x-1 px-2 py-1 sm:px-2 lg:p-1  flex-grow max-h-[calc(100vh-64px)]">
                <div className="flex-1 shrink-0 lg:block w-full md:w-1/2 lg:w-3/5 flex flex-col p-1  h-full max-h-[calc(100vh-68px)] ">
                    <VideoField
                        videoRef={videoRef}
                        youtubeId={youtubeId}
                    />
                    <TranscriptField
                        youtubeId={youtubeId}
                        videoRef={videoRef}
                        setParentTranscriptText={setParentTranscriptText}
                        setParentSrtText={setParentSrtText}
                    />
                </div>

                <div className="hidden sticky top-20 shrink-0 md:block w-full md:w-1/2 lg:w-2/5 h-1/2  md:h-full p-1 ">
                    <SummaryField 
                        videoRef={videoRef}
                        parentSrtText={parentSrtText}
                        parentTranscriptText={parentTranscriptText}/>
                </div>

            </div>
        </div>
    )
}

export default YoutubeSummary


/**xl:h-[calc(100vh-32.5vw)] 3xl:h-[calc(100vh-700px)] */
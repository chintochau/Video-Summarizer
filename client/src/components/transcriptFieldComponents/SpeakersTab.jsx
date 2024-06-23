import { useTranscriptContext } from '@/contexts/TranscriptContext'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { useVideoContext } from '@/contexts/VideoContext'
import { secondsToTime } from '@/utils/timeUtils'
import { cn } from '@/lib/utils'
import TranscribeService from '@/services/TranscribeService'
import { Button } from '../ui/button'

const SpeakersTab = (params) => {
    const { onClick } = params
    const { utterances, speakers, setSpeakers,transcriptId } = useTranscriptContext()
    const { currentPlayTime } = useVideoContext()

    const updateSpeakers = async () => {
        try{
            TranscribeService.updateTranscriptSpeakers({transcriptId, speakers})
        } catch {
            console.error("Error updating speakers")
        }
    }

    return (
        <ScrollArea className="md:h-full p-1 ">
            <SpeakerTable speakers={speakers} setSpeakers={setSpeakers} updateSpeakers={updateSpeakers}/>
            {utterances.length > 0 ?
                <>
                    {utterances.map((utterance, index) => {
                        return (
                            <UtteranceBox
                                key={index}
                                utterance={utterance}
                                onClick={onClick}
                                currentPlayTime={currentPlayTime}
                                speakers={speakers}
                            />
                        )
                    })}
                </> : <div className="text-center text-gray-400">No Speakers Identified</div>
            }
        </ScrollArea>
    )
}

const SpeakerTable = ({ speakers, setSpeakers,updateSpeakers }) => {
    return (
        <div className="flex flex-col gap-2 px-2">
            Speakers {speakers.length > 0 && `(${speakers.length})`}
            <div className='flex gap-2'>{speakers.map((speaker, index) =>
                <SpeakerTag key={index} speaker={speaker} setSpeakers={setSpeakers} updateSpeakers={updateSpeakers} />)}
            </div>
        </div>
    )
}

const SpeakerTag = ({ speaker, setSpeakers, updateSpeakers }) => {
    const [isEditing, setIsEditing] = useState(false)

    const changeSpeakerName = (newName) => {
        setSpeakers(prev => {
            const index = prev.findIndex(s => s.id === speaker.id)
            prev[index].name = newName
            return [...prev]
        })
    }

    return (
        <div className="flex gap-2 px-3 rounded-xl  text-white items-center bg-secondary/10">
            {!isEditing ?
                <div
                    onClick={() => setIsEditing(true)}
                    className='cursor-pointer hover:underline'
                    style={{ color: speaker.color }}
                >{speaker.name}</div> :
                <div className='flex'>
                    <input
                        autoFocus
                        className=' bg-transparent  focus:border-transparent focus:ring-0 w-28 h-6'
                        style={{ color: speaker.color }}
                        type="text"
                        defaultValue={speaker.name}
                        onFocus={(e) => {
                            e.target.select()
                        }}
                        onBlur={(e) => {
                            changeSpeakerName(e.target.value)
                            setIsEditing(false)
                            updateSpeakers()
                        }}
                    />
                </div>
            }
        </div>
    )
}

const UtteranceBox = ({ utterance, onClick, currentPlayTime, speakers }) => {
    const time = secondsToTime(utterance.start / 1000)
    const end = utterance.end / 1000
    const isCurrent = currentPlayTime > utterance.start / 1000 && currentPlayTime < end

    const [speakerName, setSpeakerName] = useState(utterance.speaker)
    const [color, setColor] = useState('')

    useEffect(() => {
        const speaker = speakers.find(speaker => speaker.id === utterance.speaker)
        if (speaker) {
            setSpeakerName(speaker.name)
            setColor(speaker.color)
        }
    }, [speakers])

    return (
        <div
            className={cn("flex gap-2 cursor-pointer hover:outline outline-blue-400 rounded-md mx-2 my-1 outline-1 p-1 border-b mb-2", isCurrent && "bg-blue-100")}
            onClick={() => onClick(time)}
        >
            <div
                className=" text-center w-24 mx-4">
                <div style={{ color: color, }}>
                    {speakerName}
                </div>
                <div
                    className="cursor-pointer underline text-xs text-nowrap text-blue-600 hover:text-blue-800"
                    onClick={() => onClick(time)}>
                    {time}
                </div>
            </div>

            <div className="flex-1">{utterance.text}</div>
        </div>
    );
};

export default SpeakersTab
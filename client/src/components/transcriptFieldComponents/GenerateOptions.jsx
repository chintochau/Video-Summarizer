import React, { useEffect, useState } from 'react'
import { useVideoContext } from '../../contexts/VideoContext'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { useAuth } from '@/contexts/AuthContext'
import { secondsToTimeInMinutesAndSeconds } from '@/utils/timeUtils'
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/outline'
import { transcribeOptions, useTranscriptContext } from '@/contexts/TranscriptContext'

const HistoryTable = () => {

    const { userId } = useAuth()

    return (<Table>
        <TableHeader>
            <TableRow>
                <TableHead>Transcript</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Created At</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>Transcript 1</TableCell>
                <TableCell>English</TableCell>
                <TableCell>Assembly</TableCell>
                <TableCell>2021-09-01</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Transcript 2</TableCell>
                <TableCell>English</TableCell>
                <TableCell>Assembly</TableCell>
                <TableCell>2021-09-01</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Transcript 3</TableCell>
                <TableCell>English</TableCell>
                <TableCell>Assembly</TableCell>
                <TableCell>2021-09-01</TableCell>
            </TableRow>
        </TableBody>

    </Table>)
}

const classNames = (...classes) => classes.filter(Boolean).join(' ')

const GenerateOptions = (params) => {
    const { loadSrtTranscript, uploadAndTranscriptFile, displayMode, generateTranscriptWithAIForYoutube } = params
    const [selectedFile, setSelectedFile] = useState(null)
    const { videoCredits, videoDuration } = useVideoContext()
    const [selectedIndex, setSelectedIndex] = useState(null)
    const { credits } = useAuth()
    const { selectedTranscribeOption,
        setSelectedTranscribeOption
    } = useTranscriptContext()

    useEffect(() => {
      setSelectedTranscribeOption(null)
    }, [])
    
    const getTranscriptWithUpload = (file) => {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const srt = e.target.result;
            loadSrtTranscript(srt);
        };
        reader.readAsText(file);
    };

    const calculateTime = (timeFactor) => {
        const lower = secondsToTimeInMinutesAndSeconds(videoDuration * timeFactor.lower)
        const upper = secondsToTimeInMinutesAndSeconds(videoDuration * timeFactor.upper)
        return `${lower} - ${upper}`
    }


    const TransbeOptionTable = () => {
        return (<Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Options</TableHead>
                    <TableHead>Estimated Time</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className=" cursor-pointer">
                {transcribeOptions.map((option, index) => (<TableRow key={option.value} className={
                    classNames(
                        index === selectedIndex ? ' bg-zinc-200 hover:bg-zinc-100' : '',
                        ""
                    )
                } onClick={
                    () => {
                        setSelectedIndex(index)
                        setSelectedTranscribeOption(option)
                    }
                }>
                    <TableCell>{option.label}</TableCell>
                    <TableCell>{calculateTime(option.timeFactor)}</TableCell>
                    <TableCell>{(videoCredits * option.creditFactor).toFixed(2)}</TableCell>
                    <TableCell><CheckIcon className={
                        classNames(
                            index === selectedIndex ? '' : 'hidden',
                            ' text-indigo-900 size-4')} /></TableCell>
                </TableRow>))}
            </TableBody>

        </Table>)
    }

    const handleGenerateTranscript = () => {
        if (displayMode === 'youtube') {
            generateTranscriptWithAIForYoutube()
        } else if (displayMode === 'audio' || displayMode === 'video') {
            uploadAndTranscriptFile()
        }
    }

    const CreditsCost = () => {
        if (selectedTranscribeOption) {
            return (
                <div className='flex flex-col gap-y-1'>
                    <Label htmlFor="model" className="pt-2">Credits: {videoCredits * selectedTranscribeOption.creditFactor}</Label>
                </div>
            )
        }
        return null
    }


    return (
        <ScrollArea className="h-full">
            <Card className="flex-col m-4 shadow-md">
                <CardHeader>
                    <CardTitle>Generate Transcript with AI</CardTitle>
                    <CardDescription>Different options to generate transcript</CardDescription>
                </CardHeader>
                <CardContent>
                    <TransbeOptionTable options={transcribeOptions} />
                </CardContent>
                <CardFooter>
                    <div className='flex flex-col gap-y-1'>
                        <Label htmlFor="model" className="pt-2"><CreditsCost /></Label>
                        <Button className="mx-auto" onClick={handleGenerateTranscript} disabled={!selectedTranscribeOption}>Generate</Button>
                    </div>
                </CardFooter>
            </Card>
            <Card className="flex-col m-4 shadow-md">

                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>Load a previous transcription from server</CardDescription>
                </CardHeader>
                <CardContent>
                    <HistoryTable />
                </CardContent>
            </Card>
            <Card className="flex-col m-4 shadow-md">

                <CardHeader>
                    <CardTitle>Upload Transcript</CardTitle>
                    <CardDescription>Upload SRT file from local storage</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input type="file" onChange={(e) => getTranscriptWithUpload(e.target.files[0])} />
                </CardContent>
            </Card>
        </ScrollArea>
    )
}

export default GenerateOptions
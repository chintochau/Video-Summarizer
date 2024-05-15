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
import { CheckIcon } from '@heroicons/react/24/outline'
import { transcribeOptions, useTranscriptContext } from '@/contexts/TranscriptContext'
import TranscriptHistoryTable from './TranscriptHistoryTable'
import { Label } from "@/components/ui/label"





const classNames = (...classes) => classes.filter(Boolean).join(' ')

const GenerateOptions = (params) => {
    const { uploadToCloudAndTranscribe } = params
    const { setupTranscriptWithInputSRT } = useTranscriptContext()
    const { videoCredits, videoDuration } = useVideoContext()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { currentUser } = useAuth()
    const { selectedTranscribeOption,
        setSelectedTranscribeOption
    } = useTranscriptContext()

    useEffect(() => {
        setSelectedTranscribeOption(transcribeOptions[0])
    }, [])

    const getTranscriptWithUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const srt = e.target.result;
            setupTranscriptWithInputSRT(srt);
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
            <TableBody className="cursor-pointer">
                {transcribeOptions.map((option, index) => (
                    <TableRow key={option.value} className={
                        classNames(
                            index === selectedIndex ? ' bg-zinc-200 hover:bg-zinc-100' : '',
                            option.available ? '' : 'opacity-50 cursor-not-allowed',
                        )
                    } onClick={
                        () => {
                            if (!option.available) return
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
                    </TableRow>))
                }
            </TableBody>

        </Table>)
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


    if (!currentUser) {
        return <Card className="m-4 shadow-md">
            <CardHeader>
                <CardTitle>Generate Transcript with AI</CardTitle>
                <CardDescription>Different options to generate transcript</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-y-2 bg-gray-100 rounded-md p-4 '>
                    <p className='text-center'>Youtube Transcript is not available for this Video, <br /> Login to genertae transcript with AI</p>
                    <Button className="mx-auto" onClick={() => { window.location.href = '/login' }} variant="outline">Sign in</Button>
                </div>
            </CardContent>
        </Card>
    }

    return (
        <ScrollArea className="h-full">
            <div className='flex flex-col py-6 px-10 gap-y-4'>

                <CardTitle className="text-indigo-400">
                    Choose an option to generate transcript
                </CardTitle>

                <Card className="flex-colshadow-md">
                    <CardHeader>
                        <CardTitle>1. Generate Transcript with AI</CardTitle>
                        <CardDescription>Utilize AI to generate video transcripts. You can either wait on the screen or return later after initiating the process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='rounded-md border '><TransbeOptionTable options={transcribeOptions} /></div>
                    </CardContent>
                    <CardFooter>
                        <div className='flex flex-col gap-y-1'>
                            <Label htmlFor="model" className="pt-2"><CreditsCost /></Label>
                            <Button className="mx-auto" onClick={uploadToCloudAndTranscribe} disabled={!selectedTranscribeOption}>Generate</Button>
                        </div>
                    </CardFooter>
                </Card>
                <Card className="flex-col shadow-md">

                    <CardHeader>
                        <CardTitle>2. Browse from History</CardTitle>
                        <CardDescription>Retrieve a previous transcription from the server.</CardDescription>

                    </CardHeader>
                    <CardContent>
                        <TranscriptHistoryTable />
                    </CardContent>
                </Card>
                <Card className="flex-col shadow-md">
                    <CardHeader>
                        <CardTitle>3. Upload Transcript</CardTitle>
                        <CardDescription>Upload an SRT file from your computer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input className=" cursor-pointer" type="file" onChange={(e) => getTranscriptWithUpload(e.target.files[0])} />
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    )
}

export default GenerateOptions
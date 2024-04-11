import React, { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import SummaryService from '@/services/SummaryService';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoContext } from '@/contexts/VideoContext';
import { useState } from 'react';
import { convertMongoDBDateToLocalTime, secondsToTime } from '@/utils/timeUtils';
import { ScrollArea } from '../ui/scroll-area';
import { useTranscriptContext } from '@/contexts/TranscriptContext';

const TranscriptHistoryTable = () => {
    const { setupTranscriptWithInputSRT } = useTranscriptContext()

    const { userId } = useAuth()
    const page = 1
    const { sourceType } = useVideoContext()
    const [videos, setVideos] = useState([])

    const fetchVideos = async () => {
        try {
            const videos = await SummaryService.getAllVideosForUser({ userId, page, sourceType: "user-upload" });
            setVideos(videos.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchVideos()
    }, [userId, page, sourceType])

    const setTranscript = (transcript) => {
        setupTranscriptWithInputSRT(transcript)
    }


    return (
        <ScrollArea className=" h-60 rounded-md outline outline-1 outline-gray-100">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Transcript</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        videos.map((video) => {
                            if(!video.originalTranscript) {
                                return null
                            }
                            return (
                                <TableRow onClick={() => setTranscript(video.originalTranscript)} className=" cursor-pointer">
                                    <TableCell>{video.sourceTitle}</TableCell>
                                    <TableCell>{secondsToTime(video.videoDuration)}</TableCell>
                                    <TableCell>{convertMongoDBDateToLocalTime(video.lastUpdated)}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </ScrollArea>
    )
}

export default TranscriptHistoryTable
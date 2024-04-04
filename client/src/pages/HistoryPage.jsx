import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SummaryService from "../services/SummaryService";
import { formatDuration } from '../Components/Utils';
import { convertMongoDBDateToLocalTime } from '../utils/timeUtils';
import { useVideoContext } from '../contexts/VideoContext';

const HistoryPage = () => {
    const navigate = useNavigate()
    const { currentUser, userId } = useAuth()
    const [videos, setVideos] = useState([])
    const [totalPage, setTotalPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const { setYoutubeId } = useVideoContext()

    useEffect(() => {
        async function fetchVideos() {
            const videos = await SummaryService.getAllVideosForUser({ userId });
            setVideos(videos.data)
            setCurrentPage(videos.page)
            setTotalPage(Math.max(Math.ceil((videos.count) / 10), 1))
            setTotalItems(videos.count)
        }
        fetchVideos();
    }, [])

    if (!currentUser) {
        navigate('/login');
    }


    const VideoListItem = ({ video, index }) => {
        const { _id, url, sourceTitle, sourceType, sourceId, lastUpdated, videoDuration, videoThumbnail } = video
        return (
            <li key={_id} className="flex justify-between gap-x-6 py-2.5 hover:outline outline-indigo-400 rounded-md px-4 cursor-pointer"
                onClick={() => {
                    if(sourceType === "youtube") {

                        setYoutubeId(sourceId) 
                        navigate("/summarizer")
                    }
                    }}>
                <div className="flex min-w-0 gap-x-4">
                    <div className='self-center w-10 text-right p-2'>{index + 1}</div>
                    <img className=" h-36 flex-none  bg-gray-50" src={videoThumbnail} alt="" />
                    <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{sourceTitle}</p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{sourceType}</p>
                    </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">{formatDuration(videoDuration)}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                        {convertMongoDBDateToLocalTime(lastUpdated)}
                    </p>
                </div>
            </li>)
    }


    return (
        <div className='max-w-7xl mx-auto'>
            <div className=' container mx-auto p-2'>
                <ul role="list" className="divide-y divide-gray-100">
                    {videos.map((video, index) => (
                        <VideoListItem key={index} video={video} index={index} />
                    ))}
                </ul>
                <div className='flex justify-between px-4 mt-2'>
                    <div>Previous</div>
                    <div>{currentPage}/{totalPage}</div>
                    <div>Next</div>
                </div>
            </div>

        </div>
    )
}

export default HistoryPage
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SummaryService from "../services/SummaryService";
import { formatDuration } from '../Components/Utils';
import { convertMongoDBDateToLocalTime } from '../utils/timeUtils';
import { useVideoContext } from '../contexts/VideoContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const HistoryPage = ({ sourceType = "all" }) => {
    const navigate = useNavigate()
    const { currentUser, userId } = useAuth()
    const [videos, setVideos] = useState([])
    const [totalPage, setTotalPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const { setYoutubeId, setSourceId, setSourceType, setSourceTitle } = useVideoContext()

    async function fetchVideos(page) {
        const videos = await SummaryService.getAllVideosForUser({ userId, page, sourceType });
        setVideos(videos.data)
        setCurrentPage(videos.currentPage)
        setTotalPage(videos.totalPages)
        setTotalItems(videos.total)
    }

    useEffect(() => {
        if (userId) {
            fetchVideos(1)
        }
    }, [userId])

    const classNames = (...classes) => {
        return classes.filter(Boolean).join(' ')
    }

    const nextPage = () => {
        const pageToFetch = Math.min(currentPage + 1, totalPage)
        fetchVideos(pageToFetch)
    }

    const previousPage = () => {
        const pageToFetch = Math.max(currentPage - 1, 1)
        fetchVideos(pageToFetch)
    }


    const openVideoHistory = (video) => {

        switch (video.sourceType) {
            case "user-upload":
                setSourceId(video.sourceId);
                setSourceTitle(video.sourceTitle);
                setSourceType("user-upload");
                navigate("/console/upload");
                break;
            case "youtube":
                setYoutubeId(video.sourceId);
                setSourceTitle(video.sourceTitle);
                setSourceType("youtube");
                navigate("/console/youtube");
                break;
            default:
                break;
        }
    };
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900 pt-8">History</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {totalItems} Items found
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                        {"Page" + currentPage}/{totalPage}
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0 px-4">
                            <thead>
                                <tr>
                                    <th className='w-8 top-0 sticky cursor-pointer border-b border-gray-300 bg-white bg-opacity-75 hover:text-indigo-400' onClick={previousPage}><ChevronLeftIcon /> </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-3 lg:pl-4"
                                    >
                                        Video
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                    >
                                        Title
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter xl:table-cell"
                                    >
                                        Time
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter xl:table-cell"
                                    >
                                        Last Updated
                                    </th>

                                    <th className='w-8  top-0 sticky cursor-pointer border-b border-gray-300 bg-white bg-opacity-75 hover:text-indigo-400' onClick={nextPage}><ChevronRightIcon /> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.map((video, videoIndex) => (
                                    <tr key={video._id} className='hover:bg-indigo-100 cursor-pointer' onClick={() => openVideoHistory(video)}>
                                        <td></td>
                                        <td
                                            className={classNames(
                                                videoIndex !== videos.length - 1 ? 'border-b border-gray-200' : '',
                                                'py-4 pl-4 pr-3  text-gray-900 sm:pl-2 lg:pl-4 flex-shrink-0 w-60'
                                            )}
                                        >
                                            <img className=" h-36 w-full bg-gray-50" src={video.videoThumbnail} alt="" />
                                        </td>
                                        <td
                                            className={classNames(
                                                videoIndex !== videos.length - 1 ? 'border-b border-gray-200' : '',
                                                'py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3 lg:pl-4'
                                            )}
                                        >
                                            <p>{video.sourceTitle}</p>
                                            <p className=' text-gray-400 font-normal'>{video.sourceType}</p>
                                            <p className=' text-gray-400 font-normal xl:hidden'>{formatDuration(video.videoDuration)}</p>
                                            <p className=' text-gray-400 font-normal xl:hidden'> {convertMongoDBDateToLocalTime(video.lastUpdated)}</p>
                                        </td>
                                        <td
                                            className={classNames(
                                                videoIndex !== videos.length - 1 ? 'border-b border-gray-200' : '',
                                                'hidden px-3 py-4 text-sm text-gray-500 xl:table-cell'
                                            )}
                                        >
                                            {<p className='hidden md:block'>{formatDuration(video.videoDuration)}</p>}
                                        </td>
                                        <td
                                            className={classNames(
                                                videoIndex !== videos.length - 1 ? 'border-b border-gray-200' : '',
                                                'px-3 py-4 text-sm text-gray-500 hidden xl:table-cell'
                                            )}
                                        >

                                            <p>{convertMongoDBDateToLocalTime(video.lastUpdated)}</p>
                                        </td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoryPage
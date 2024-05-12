import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SummaryService from "../services/SummaryService";
import { formatDuration } from "../components/Utils";
import { convertMongoDBDateToLocalTime } from "../utils/timeUtils";
import { useVideoContext } from "../contexts/VideoContext";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranscriptContext } from "@/contexts/TranscriptContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/utils";
import defaultImage from "@/assets/default-image.png";
import { Button } from "@/components/ui/button";

const HistoryPage = ({ sourceType = "all" }) => {
  const navigate = useNavigate();
  const { userId, currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { setYoutubeId, setSourceId, setSourceType, setSourceTitle } =
    useVideoContext();
  const { resetTranscript, setLoadingTranscript } = useTranscriptContext();

  async function fetchVideos(page) {
    const videos = await SummaryService.getAllVideosForUser({
      userId,
      page,
      sourceType,
    });
    setVideos(videos.data);
    setCurrentPage(videos.currentPage);
    setTotalPage(videos.totalPages);
    setTotalItems(videos.total);
  }

  useEffect(() => {
    if (userId) {
      fetchVideos(1);
    }
  }, [userId]);

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const nextPage = () => {
    const pageToFetch = Math.min(currentPage + 1, totalPage);
    fetchVideos(pageToFetch);
  };

  const previousPage = () => {
    const pageToFetch = Math.max(currentPage - 1, 1);
    fetchVideos(pageToFetch);
  };

  const openVideoHistory = (video) => {
    resetTranscript();
    setLoadingTranscript(true);
    switch (video.sourceType) {
      case "user-upload":
        setSourceId(video.sourceId);
        setYoutubeId(null);
        setSourceTitle(video.sourceTitle);
        setSourceType("user-upload");
        navigate("/console/upload");
        break;
      case "youtube":
        setYoutubeId(video.sourceId);
        setSourceId(null);
        setSourceTitle(video.sourceTitle);
        setSourceType("youtube");
        navigate("/console/youtube");
        break;
      default:
        break;
    }
  };

  const PagnationComponent = ({className}) => {
    return (
      <Pagination className={cn(
        "flex justify-center",
        className
      )}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={previousPage}
              className="cursor-pointer"
            />
          </PaginationItem>
          {
            // render first, last, current page and ellipsis
            // if total pages is less than 5
            totalPage <= 5 ? (
              Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => fetchVideos(page)}
                    className={classNames(
                      page === currentPage ? "bg-blue-500 text-white" : "",
                      "px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))
            ) : (
              // if total pages is more than 5
              // render first, last, current page, previous and next page
              // with ellipsis in between
              // render first only when current page is more than 3
              // render last only when current page is less than totalPage - 2
              // render ellipsis only when current page is more than 2
              // and less than totalPage - 1
              <>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => fetchVideos(1)}
                    className={classNames(
                      1 === currentPage ? "bg-blue-500 text-white" : "",
                      "px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                    )}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 3 && <PaginationEllipsis />}
                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => fetchVideos(currentPage - 1)}
                      className={classNames(
                        "px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                      )}
                    >
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {currentPage > 1 && currentPage < totalPage && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => fetchVideos(currentPage)}
                      className={classNames(
                        "px-3 py-2 rounded-md text-sm font-medium cursor-pointer bg-blue-500 text-white"
                      )}
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {currentPage < totalPage - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => fetchVideos(currentPage + 1)}
                      className={classNames(
                        "px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                      )}
                    >
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {currentPage < totalPage - 2 && <PaginationEllipsis />}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => fetchVideos(totalPage)}
                    className={classNames(
                      totalPage === currentPage ? "bg-blue-500 text-white" : "",
                      "px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                    )}
                  >
                    {totalPage}
                  </PaginationLink>
                </PaginationItem>
              </>
            )
          }
          <PaginationItem>
            <PaginationNext onClick={nextPage} className="cursor-pointer" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="h-full">
      <PagnationComponent className="my-2" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2 sm:w-1/3 md:w-1/4">Video</TableHead>
            <TableHead>Title</TableHead>
            <TableHead
              className={classNames(
                "px-3 py-4 text-sm text-gray-500 hidden xl:table-cell"
              )}
            >
              Time
            </TableHead>
            <TableHead
              className={classNames(
                "px-3 py-4 text-sm text-gray-500 hidden xl:table-cell"
              )}
            >
              Last Updated
            </TableHead>
            <TableHead/>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video, videoIndex) => (
            <TableRow
              key={video._id}
              className="cursor-pointer "
              onClick={() => openVideoHistory(video)}
            >
              <TableCell className="px-1 md:px-3">
                {video.videoThumbnail ? (
                  <img
                    className="aspect-auto h-40 w-auto object-cover rounded-lg mx-auto"
                    src={video.videoThumbnail}
                  />
                ) : (
                  <img
                    className="aspect-auto h-40 w-auto object-cover rounded-lg mx-auto"
                    src={defaultImage}
                  />
                )}
              </TableCell>
              <TableCell className="px-0 md:px-3">
                <p>{video.sourceTitle}</p>
                <p className="text-gray-400 font-normal">{video.sourceType}</p>
                <p className="text-gray-400 font-normal xl:hidden">
                  {formatDuration(video.videoDuration)}
                </p>
                <p className="text-gray-400 font-normal xl:hidden">
                  {convertMongoDBDateToLocalTime(video.lastUpdated)}
                </p>
              </TableCell>
              <TableCell
                className={classNames(
                  "hidden px-3 py-4 text-sm text-gray-500 xl:table-cell"
                )}
              >
                <p className="text-sm text-gray-400">
                  {formatDuration(video.videoDuration)}
                </p>
              </TableCell>
              <TableCell
                className={classNames(
                  "px-3 py-4 text-sm text-gray-500 hidden xl:table-cell"
                )}
              >
                <p className="text-sm text-gray-400">
                  {convertMongoDBDateToLocalTime(video.lastUpdated)}
                </p>
              </TableCell>
              <TableCell
              className='px-0 sm:px-1 md:px-2'
              >
                <Button 
                variant="ghost"
                className="hover:bg-transparent p-2 hover:text-red-500 text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  SummaryService.deleteVideoAndSummaries({
                    userId,
                    sourceId: video.sourceId,
                  }).then(() => fetchVideos(currentPage));
                }}
                >
                  <TrashIcon className="w-6 h-6 m-0 " />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PagnationComponent className="py-2" />
    </div>
  );
};

export default HistoryPage;

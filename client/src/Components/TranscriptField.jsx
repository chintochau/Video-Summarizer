import React, { useRef, useEffect, useState } from "react";
import { getYoutubeTranscript, parseSRT, exportSRT } from "./Utils";
import GeneralButton, { OutlinedButton } from "./GeneralButton";
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Box
const TranscriptBox = ({
  start,
  text,
  onClick,
  index,
  handleTranscriptChange,
}) => {
  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // 先重置高度，允許它縮小
    e.target.style.height = e.target.scrollHeight + "px"; // 然後設置為正確的高度
  };

  return (
    <div className="my-1 flex bg-white shadow-sm mx-2 rounded-sm">
      <div
        className="cursor-pointer underline p-2 pt-0 text-nowrap text-blue-600 hover:text-blue-800"
        onClick={() => onClick(start)}
      >
        {start.split(",")[0] + " :"}
      </div>
      <textarea
        className="w-full focus:outline-none p-1 pt-0 bg-none"
        style={{ overflowY: "hidden", resize: "none" }}
        value={text}
        onChange={(e) => {
          handleTranscriptChange(index, e.target.value);
          adjustHeight(e);
        }}
      ></textarea>
    </div>
  );
};

// Field
const TranscriptField = ({ youtubeId, videoRef, setParentTranscriptText }) => {
  const [transcript, setTranscript] = useState("");
  const [editableTranscript, setEditableTranscript] = useState([]);
  const [viewMode, setViewMode] = useState("transcript"); // 新增狀態變量
  const [fetchingTranscript, setFetchingTranscript] = useState(true);
  const [transcriptAvailable, setTranscriptAvailable] = useState(true);
  const [videoValid, setVideoValid] = useState(false);

  const loadTranscript = async () => {
    try {
      const result = await getYoutubeTranscript({ youtubeLink: youtubeId });

      const parsedTranscript = parseSRT(result.srt);
      setTranscript(parsedTranscript);
      setEditableTranscript(parsedTranscript.map((entry) => ({ ...entry }))); // 深拷貝以獨立編輯
      setTranscriptAvailable(true);
      setFetchingTranscript(false);
      setParentTranscriptText(
        parsedTranscript
          .map(({ start, text }) => start.split(",")[0] + " " + text)
          .join("\n")
      );
    } catch (error) {
      setFetchingTranscript(false);
      setTranscriptAvailable(false);
      setParentTranscriptText("");
    }
  };

  // 切換到轉錄模式
  const handleTranscriptMode = () => {
    setViewMode("transcript");
  };

  // 切換到純文本模式
  const handleTextMode = () => {
    setViewMode("text");
  };

  // 點擊轉錄時跳轉視頻
  const handleTranscriptClick = (time) => {
    const [hours, minutes, seconds] = time.split(":");
    const secondsTotal =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);

    if (videoRef && videoRef.current) {
      videoRef.current.currentTime = secondsTotal;
      videoRef.current.internalPlayer.seekTo(secondsTotal);
    }
  };

  // 編輯轉錄文本
  const handleTranscriptChange = (index, newText) => {
    const updatedTranscript = editableTranscript.map((entry, i) =>
      i === index ? { ...entry, text: newText } : entry
    );
    setEditableTranscript(updatedTranscript);
  };

  useEffect(() => {
    if(!videoRef) {
      return
    }
    if (videoRef.current.props.videoId !== "") {
      setVideoValid(true);
      loadTranscript();
    } else {
      setVideoValid(false);
      setParentTranscriptText("");
    }
    return () => {
      setTranscript("");
      setEditableTranscript([]);
      setFetchingTranscript(true);
    };
  }, [youtubeId]);


  return (
    <div className="h-[70vw] max-h-[60vh] flex-col">
      {videoValid ? (
        fetchingTranscript ? (
          <div className="flex justify-center h-full items-center">
            <div className="flex-col">
              <div class="mx-auto animate-spin rounded-full h-10 w-10 border-r-2 border-b-2 border-indigo-600" />{" "}
              <div>Fetching Transcript...</div>
            </div>
          </div>
        ) : (
          <div className="h-[70vw] max-h-[60vh] flex-col">
            {transcriptAvailable ? (
              <div className="h-full ">

                <div className=" flex pl-2 justify-between">

                  <div className=" flex items-end">
                    <button onClick={handleTranscriptMode}
                    className={` px-2 py-1 rounded-t-md hover:text-indigo-400 ${viewMode==="transcript" ? " text-indigo-600 bg-white ":" text-gray-600"}`}>Transcript</button>
                    <button onClick={handleTextMode}
                    className={` px-2 py-1 rounded-t-md hover:text-indigo-400 ${viewMode!=="transcript" ? " text-indigo-600 bg-white ":" text-gray-600"}`}>Text</button>
                  </div>

                  <div className="">
                  <button onClick={() => exportSRT(editableTranscript)}
                    className="px-2 py-1 rounded-t-md text-indigo-600 text-sm hover:text-indigo-400"><DownloadIcon/> SRT</button>
                    <button onClick={() => navigator.clipboard.writeText(editableTranscript
                        .map(({ text, start }) => viewMode==="transcript" ? start.split(",")[0] + " " +  text : text)
                        .join("\n"))}
                      className="px-2 py-1 rounded-t-md text-indigo-600 text-sm hover:text-indigo-400"><ContentCopyIcon/></button>
                  </div>
                </div>
                {/* transcript box */}

                {/* 根據viewMode渲染不同的內容 */}
                {viewMode === "transcript" ? (
                  <div className="h-[calc(100%-50px)] overflow-y-auto max-h-[calc(100%-50px)]">
                    {editableTranscript.map(({ start, text }, index) => (
                      <TranscriptBox
                        key={index}
                        start={start}
                        text={text}
                        index={index}
                        onClick={handleTranscriptClick}
                        handleTranscriptChange={handleTranscriptChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-[calc(100%-50px)]">
                    <textarea
                      className="w-full h-full p-2 mx-2"
                      value={editableTranscript
                        .map(({ text }) => text)
                        .join("\n")}
                      readOnly
                    ></textarea>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center h-full items-center">
                <div>Transcript Not Available</div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="flex justify-center h-full items-center">
          Video is Not Valid
        </div>
      )}
    </div>
  );
};

export default TranscriptField;

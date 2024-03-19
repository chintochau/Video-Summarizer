import Summarizer from "../Components/Summarizer";
import { VideoProvider } from "../contexts/VideoContext";
function SummarizePage() {
  return (
    <>
      <VideoProvider>
        <Summarizer />
      </VideoProvider>
    </>
  );
}

export default SummarizePage;

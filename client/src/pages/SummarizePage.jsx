import Summarizer from "../Components/Summarizer";
import { SummaryProvider } from "../contexts/SummaryContext";
import { VideoProvider } from "../contexts/VideoContext";
function SummarizePage() {
  return (
    <>
      <SummaryProvider>
        <VideoProvider>
          <Summarizer />
        </VideoProvider>
      </SummaryProvider>
    </>
  );
}

export default SummarizePage;

import Summarizer from "../Components/Summarizer";
import { SummaryProvider } from "../contexts/SummaryContext";
function SummarizePage() {
  return (
    <>
      <SummaryProvider>
          <Summarizer />
      </SummaryProvider>
    </>
  );
}

export default SummarizePage;

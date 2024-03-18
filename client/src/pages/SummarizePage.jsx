import Summarizer from "../Components/Summarizer";
import { useModels } from "../contexts/ModelContext";

function SummarizePage() {

  const {usableModels} = useModels()

  console.log(usableModels);

  return (
    <>
      <Summarizer />
    </>
  );
}

export default SummarizePage;

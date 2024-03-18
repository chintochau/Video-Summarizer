import Summarizer from "../Components/Summarizer";
import { useModels } from "../contexts/ModelContext";

function SummarizePage() {

  const { usableModels } = useModels()



  return (
    <>
      {usableModels.map((item) => 
        <div key={item}>{item}</div>)}
      <Summarizer />
    </>
  );
}

export default SummarizePage;

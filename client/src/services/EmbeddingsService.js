const api = `${import.meta.env.VITE_API_BASE_URL}`;
class EmbeddingsService {
  static async saveEmbeddings({ video, parentSrtText, userId }) {
    const response = await fetch(`${api}/api/save-embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ video, parentSrtText, userId }),
    });
    return response.json();
  }

  static async vectorSearch({ query }) {
    const response = await fetch(`${api}/api/vector-search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    return response.json();
  }

  static async answerQuestions(data) {
    // data = {userInput, userId, referenceVideosArray}
    try {
      const response = await fetch(api + "/api/answer-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const answer = result.choices[0].message.content;
      return answer;
    } catch (error) {
      console.error("Error occurred during question answering:", error);
      return { error: "Error occurred during question answering" };
    }
  }

  static async getEmbeddingCollectionAndVideos({ userId }) {
    const response = await fetch(`${api}/api/get-embeddings/${userId}`);
    return response.json();
  }
}
export default EmbeddingsService;

const api = `${import.meta.env.VITE_API_BASE_URL}`;
class EmbeddingsService {

    static async getEmbeddings() {
        const response = await fetch(`${api}/get-embeddings`);
        return response.json();
    }

    static async saveEmbeddings({ video, transcriptText,userId }) {
        const response = await fetch(`${api}/api/save-embeddings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ video, transcriptText,userId }),
        });
        return response.json();
    }

}
export default EmbeddingsService;
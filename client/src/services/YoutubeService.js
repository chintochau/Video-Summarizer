const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

export default class YoutubeService {
  static getYoutubeTranscript = async ({ youtubeId }) => {
    try {
      const response = await fetch(
        apiUrl + "/api/youtubeTranscript/" + youtubeId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  };

  static getYoutubeAudio = async ({ youtubeLink }) => {
    const data = { youtubeLink };
    try {
      const response = await fetch(apiUrl + "/api/downloadYoutubeAudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Download failed: ${errorMessage}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "download.mp3"; // Fallback filename
      console.log(contentDisposition);
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };
}

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

const summaryApiCall = (id) => {
  switch (id) {
    case 1:
      return "/api/stream-response-large-text";
    case 6:
      return "/api/stream-response-series";
    case 7:
      return "/api/get-summary-meetings";
    default:
      return "/api/get-summary";
  }
};

/**
 * Asynchronously sends a request to the ChatGPT API to process input data and handles the response.
 *
 * This function constructs and executes a POST request to the ChatGPT API, sending along a payload that contains
 * data such as transcription text, language preference, and other options. The options may include ID and a prompt
 * for ChatGPT among others. The specific API endpoint is determined by appending an option-related request path
 * to a base `apiUrl`, which is assumed to be defined externally. Responses from the API are streamed and
 * handled in chunks. As each chunk of the response is read, it is passed to a completion handler callback function,
 * which the caller provides, allowing for asynchronous handling of partial or full response data as it's received.
 * Errors during the API call or processing are caught and passed to the completion handler along with a null data
 * argument for appropriate error handling.
 *
 * @param {Object} data - An object containing details for the API request, including:
 *      - `option`: An object specifying details such as the ChatGPT prompt and other identifiers.
 *      - `language`: A string indicating the preferred language for processing the transcript.
 *      - `transcript`: A string containing the text to be processed by ChatGPT.
 *      - `interval`: Potential additional data required for processing (usage context-dependent).
 * @param {Function} completionHandler - A callback function that is called with the result of the API call.
 *      The function should accept two arguments: an error (if any occurred) and the response data from the API.
 *      If an error occurs, the first argument is populated with the error object, and the second argument is null.
 *      On successful data retrieval, the first argument is null, and the second argument contains the response data.
 */

export default class SummaryService {
  static summarizeWithAI = async (data, completionHandler) => {
    const {
      option,
      language,
      transcript,
      interval,
      selectedModel,
      userId,
      video,
    } = data;

    const apiRequest = summaryApiCall(option.id);

    try {
      const response = await fetch(apiUrl + apiRequest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          option,
          transcript,
          language,
          interval,
          selectedModel,
          userId,
          video,
        }),
      });

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Signal completion - Sending a specific value to indicate completion
          completionHandler(null, { completed: true });
          break;
        }
        completionHandler(null, value);
      }
    } catch (error) {
      completionHandler(error, null);
    }
  };

  // Function to fetch summaries for a video
  static fetchSummariesForVideo = async (userId, sourceId) => {
    try {
      const response = await fetch(
        apiUrl + `/api/summaries/${userId}/${sourceId}`
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("No summaries found");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  static getAllVideosForUser = async ({ userId, page = 1 }) => {
    try {
      const response = await fetch(
        apiUrl + `/api/user/${userId}/videos?page=${page}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch summaries");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching summaries:", error);
      return null;
    }
  };
}

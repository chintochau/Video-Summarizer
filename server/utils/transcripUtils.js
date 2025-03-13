const parseTimestamp = (timestamp) => {
  // Converts a SRT timestamp to milliseconds.
  const parts = timestamp.split(":");
  const millis = parts[2].split(",")[1] || "0";
  return (
    Number(parts[0]) * 3600000 +
    Number(parts[1]) * 60000 +
    Number(parts[2].split(",")[0]) * 1000 +
    Number(millis)
  );
};

const secondsToMMSS = (seconds) => {
  // Converts seconds to mm:ss format.
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

/**
 * Groups subtitles text by every 'interval' seconds.
 *
 * @param {string} subtitles - The subtitles in SRT format.
 * @param {number} intervalInSeconds - The interval in seconds.
 * @returns {Object} - An object containing the grouped subtitles text, where the keys are the interval ranges and the values are the corresponding text.
 */
export const groupSubtitlesByInterval = (subtitles, intervalInSeconds) => {
  // subtitles is in SRT format
  // Groups subtitles text by every 'interval' seconds.
  const blocks = subtitles.trim().split("\n\n");
  const interval = intervalInSeconds * 1000; // Convert interval to milliseconds for all calculations
  let currentIntervalStart = 0;
  const intervalTexts = {};
  let currentText = [];

  blocks.forEach((block) => {
    const lines = block.split("\n");
    if (lines.length < 3) return; // Safety check

    const [startTimestamp] = lines[1].split(" --> ");
    const startMilliseconds = parseTimestamp(startTimestamp);

    if (startMilliseconds >= currentIntervalStart + interval) {
      // Adjusted to include the last second of each interval by subtracting 1 from next interval start time
      const currentIntervalEnd = currentIntervalStart + interval - 1000;

      // Save the current interval text and reset for the next interval
      const intervalKey = `${secondsToMMSS(
        currentIntervalStart / 1000
      )}-${secondsToMMSS(currentIntervalEnd / 1000)}`;
      intervalTexts[intervalKey] = currentText.join(" ");
      currentText = [];

      // Update the interval start time to the next interval that includes the current subtitle start time
      while (startMilliseconds >= currentIntervalStart + interval) {
        currentIntervalStart += interval;
      }
    }

    // Add current subtitle text to the current interval's text
    currentText.push(lines.slice(2).join(" "));
  });

  // Add the last interval's text if there is any
  if (currentText.length > 0) {
    const currentIntervalEnd = currentIntervalStart + interval - 1000; // Including the last second of the final interval
    const intervalKey = `${secondsToMMSS(
      currentIntervalStart / 1000
    )}-${secondsToMMSS(currentIntervalEnd / 1000)}`;
    intervalTexts[intervalKey] = currentText.join(" ");
  }

  return intervalTexts;
}

/**
 * Formats the grouped subtitles into a single string.
 * @param {Object} groupSubtitleByInterval - The grouped subtitles object.
 * @returns {string} - The formatted string of grouped subtitles.
 */
export const formatGroupedSubtitle = (groupSubtitleByInterval, includeTimestamp = false) => {
  let outputString = "";
  for (let x in groupSubtitleByInterval) {
    if (includeTimestamp) {
      outputString =
        outputString +
        "----------" +
        x +
        " " +
        groupSubtitleByInterval[x] +
        "\n\n";
    } else {
      outputString =
        outputString +
        "----------" +
        x +
        " " +
        groupSubtitleByInterval[x] +
        "\n\n";
    }
  }
  return outputString;
};

export const formatGroupedSubtitleWithTimestamp = (groupSubtitleByInterval) => {
  let outputArray = [];
  for (let x in groupSubtitleByInterval) {
    outputArray.push({
      timeRange: x,
      text: groupSubtitleByInterval[x],
    });
  }
  return outputArray;
}
export const secondsToTime = (seconds) => {
    // Convert seconds to mm:ss format, if less than an hour
    // Convert seconds to hh:mm:ss format, if more than an hour
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const remainingSeconds2 = remainingSeconds % 60;

    if (hours === 0) {
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds2.toFixed(0).toString().padStart(2, "0")}`;
    } else {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds2.toFixed(0).toString().padStart(2, "0")}`;
    }
}

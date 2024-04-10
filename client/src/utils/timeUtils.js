export const timeToSeconds = (timestamp) => {
    const timeArray = timestamp.split(":").map(Number);

    if (timeArray.length === 3) {
        // Convert hh:mm:ss format to seconds
        return timeArray[0] * 3600 + timeArray[1] * 60 + timeArray[2];
    } else if (timeArray.length === 2) {
        // Convert mm:ss format to seconds
        return timeArray[0] * 60 + timeArray[1];
    } else {
        // Handle invalid formats
        console.log("Invalid timestamp format.");
        return null;
    }
}

export const secondsToTimeInMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toFixed(0).toString().padStart(2, "0")}`;
}

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



export const convertMongoDBDateToLocalTime = (lastUpdated) => {
    const date = new Date(lastUpdated);
    return date.toLocaleString();
};
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



export const convertMongoDBDateToLocalTime = (lastUpdated) => {
    const date = new Date(lastUpdated);
    return date.toLocaleString();
};
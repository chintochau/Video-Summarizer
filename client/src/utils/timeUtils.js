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
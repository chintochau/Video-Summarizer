// a SummaryHandler Class for handling socket.io summary request, only connect to server before request
const api = `${import.meta.env.VITE_API_BASE_URL}`;
import {io} from 'socket.io-client'


export default class SummaryHandler {
    static requestSummary(data,response) {
        const socket = io(api);
        socket.on("summaryResponse", (data) => {
            response(data)
            socket.disconnect();
        })
        socket.on("text", (data) => {
            response(data)
        })
        socket.emit("summaryRequest", data)
    }
}


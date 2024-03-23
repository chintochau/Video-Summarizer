import ytdl from "ytdl-core";


export const getYoutubeThumbnail = async (youtubeId) => {

    try {
        const videoInfo = await ytdl.getInfo(youtubeId);
        
    } catch (error) {
        console.error(error.message);
    }

}
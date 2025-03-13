import Playlist from "../models/playlistModel.js";
import Video from "../models/videoModel.js";

export const addVideoToPlaylist = async (req, res) => {
    const { playlistId, videoId } = req.body;

    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res
                .status(404)
                .json({ success: false, message: "Playlist not found" });
        }

        const video = await Video.findById(videoId);

        if (!video) {
            return res
                .status(404)
                .json({ success: false, message: "Video not found" });
        }

        if (playlist.videos.includes(video._id)) { 
            return res
                .status(400)
                .json({ success: false, message: "Video already in playlist" });
        }

        playlist.videos.push(video._id);

        await playlist.save();

        res.status(200).json({ success: true, data: playlist });

    } catch (error) {   
        res.status(500).json({ success: false, error: error.message });
    }
};


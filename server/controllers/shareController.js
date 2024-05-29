import Summary from '../models/summaryModel.js';

export const renderSharePage = async (req, res) => {
    try {
        console.log(req.params.summaryId);

        const summary = await Summary.findById(req.params.summaryId).populate("videoId");

        if (summary) {
            res.render("share", { 
                title: `Summary: ${summary.sourceTitle} - Fusion AI Video Book`,
                description: summary.summary,
                imageUrl: summary.videoId.videoThumbnail,
                url: `${process.env.CLIENT_URL}/share?s=${summary._id}`
             });
        } else {
            res.status(404).json({ success: false, error: "Summary not found" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

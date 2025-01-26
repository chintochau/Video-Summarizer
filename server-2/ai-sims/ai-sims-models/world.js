
import mongoose from "mongoose";

const worldSchema = new mongoose.Schema({
    grid: {
        type: [[Object]], // A 2D array of grid cells
        default: () => Array.from({ length: 50 }, () => Array(50).fill(null)) // Example: 50x50 grid
    },
    time: {
        type: Number,
        default: 0, // Initial time in 15-minute intervals
    },
});

export const World = mongoose.model('World', worldSchema);
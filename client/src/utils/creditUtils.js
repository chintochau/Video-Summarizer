

export const calculateVideoCredits = (videoDuration) => {
    // $0.006(cost/min) * mins(Time) * 100(credits factor) *1.5(profit factor)
    return (0.006 * (videoDuration / 60) * 100 * 1.5).toFixed(1)
}
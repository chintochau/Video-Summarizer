
const sampleStatus = [
    {
        name: "Peter",
        status: "sleeping",
        x: 100, y: 100 ,
        stats: {
            money: 1000,
            hunger: 0,
            thirst: 0,
            happiness: 0,
            stress: 0,
        },
        lastUpdated: Date.now(),
    },
    {
        name: "John",
        status: "sleeping",
        x: 200, y: 200 ,
        stats: {
            money: 1000,
            hunger: 0,
            thirst: 0,
            happiness: 0,
            stress: 0,
        },
        lastUpdated: Date.now(),
    },
]

export const showAiSimsStatus = (req, res) => {
    res.status(200).json({ success: true, data: sampleStatus });
}
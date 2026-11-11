
function generateLargeRunData() {
    const steps = [];
    const loss = [];
    const lr = [];
    const grad_norm = [];
    
    for (let i = 1; i <= 1000000; i++) {
        steps.push(i);
        let l = 0.5 / (1 + i * 0.00001);
        if (i >= 499990 && i <= 500010) {
            l += 15.5;
        }
        loss.push(l);
        lr.push(0.01 * Math.pow(0.99, i / 10000));
        grad_norm.push(Math.random() * 0.5 + 0.1);
    }
    return { steps, loss, lr, grad_norm };
}

const largeData = generateLargeRunData();

export const runs = [
    {
        id: 1,
        name: "Training Run 1 (Normal)",
        status: "Completed",
        loss: 0.15,
        steps: 6,
        stepsData: [100, 200, 300, 400, 500, 600],
        lossData: [0.9, 0.7, 0.5, 0.4, 0.25, 0.15],
        lrData: [0.01, 0.009, 0.008, 0.007, 0.005, 0.003],
        gradData: [0.9, 0.8, 0.7, 0.6, 0.5, 0.4]
    },
    {
        id: 2,
        name: "Training Run 2 (Running)",
        status: "Running",
        loss: 0.32,
        steps: 6,
        stepsData: [100, 200, 300, 400, 500, 600],
        lossData: [0.9, 0.8, 0.65, 0.55, 0.4, 0.32],
        lrData: [0.01, 0.009, 0.008, 0.007, 0.006, 0.005],
        gradData: [1.2, 1.1, 1.0, 0.9, 0.8, 0.7]
    },
    {
        id: 3,
        name: "Training Run 3 (Failed / Diverging)",
        status: "Failed",
        loss: 0.85,
        steps: 6,
        stepsData: [100, 200, 300, 400, 500, 600],
        lossData: [0.5, 0.6, 0.7, 0.85, 0.9, 0.85],
        lrData: [0.01, 0.009, 0.008, 0.007, 0.006, 0.005],
        gradData: [0.8, 1.0, 1.2, 1.5, 1.7, 1.9]
    },
    {
        id: 4,
        name: "Training Run 4 (Null values)",
        status: "Completed",
        loss: 0.08,
        steps: 6,
        stepsData: [100, 200, 300, 400, 500, 600],
        lossData: [0.8, null, 0.4, 0.25, null, 0.08],
        lrData: [0.01, 0.008, 0.006, 0.004, 0.002, 0.001],
        gradData: [1.0, 0.8, 0.7, 0.5, 0.3, 0.2]
    },
    {
        id: 5,
        name: "Training Run 5 (Unsorted steps)",
        status: "Completed",
        loss: 0.21,
        steps: 6,
        stepsData: [300, 100, 200, 600, 400, 500],
        lossData: [0.5, 0.9, 0.75, 0.21, 0.45, 0.3],
        lrData: [0.008, 0.01, 0.009, 0.002, 0.006, 0.004],
        gradData: [0.9, 1.1, 1.0, 0.5, 0.7, 0.6]
    },
    {
        id: 6,
        name: "Training Run 6 (Duplicate steps)",
        status: "Completed",
        loss: 0.19,
        steps: 6,
        stepsData: [100, 200, 200, 300, 400, 500],
        lossData: [0.9, 0.7, 0.68, 0.5, 0.35, 0.19],
        lrData: [0.01, 0.009, 0.0085, 0.008, 0.006, 0.004],
        gradData: [0.8, 0.7, 0.72, 0.6, 0.5, 0.4]
    },
    
    ...Array.from({ length: 13 }, (_, index) => {
        const id = index + 7;
        return {
            id: id,
            name: `Training Run ${id}`,
            status: id % 3 === 0 ? "Failed" : (id % 2 === 0 ? "Running" : "Completed"),
            loss: Number((Math.random() * 0.5 + 0.05).toFixed(3)),
            steps: 500,
            stepsData: [100, 200, 300, 400, 500],
            lossData: [0.8, 0.6, 0.4, 0.2, 0.1].map(v => Number((v * Math.random()).toFixed(3))),
            lrData: [0.01, 0.008, 0.006, 0.004, 0.002],
            gradData: [0.5, 0.4, 0.3, 0.2, 0.1]
        };
    }),
    {
        id: 20,
        name: "Training Run 20 (1M Points & Spike)",
        status: "Completed",
        loss: 0.012,
        steps: 1000000,
        stepsData: largeData.steps,
        lossData: largeData.loss,
        lrData: largeData.lr,
        gradData: largeData.grad_norm
    }
];
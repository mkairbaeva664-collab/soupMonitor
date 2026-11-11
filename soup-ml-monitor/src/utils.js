
export function sortData(steps, values) {
    const combined = steps.map((step, i) => ({ step, val: values[i] }));
    combined.sort((a, b) => a.step - b.step);
    return {
        steps: combined.map(item => item.step),
        values: combined.map(item => item.val)
    };
}

export function removeDuplicates(steps, values) {
    const map = new Map();
    for (let i = 0; i < steps.length; i++) {
        map.set(steps[i], values[i]);
    }
    return {
        steps: Array.from(map.keys()),
        values: Array.from(map.values())
    };
}

export function validateData(steps, values) {
    const validSteps = [];
    const validValues = [];
    for (let i = 0; i < values.length; i++) {
        const val = values[i];
        if (val !== null && val !== undefined && !Number.isNaN(val) && Number.isFinite(val)) {
            validSteps.push(steps[i]);
            validValues.push(val);
        }
    }
    return { steps: validSteps, values: validValues };
}

export function downsampleData(steps, values, targetCount = 1000) {
    if (steps.length <= targetCount) return { steps, values };

    const sampledSteps = [];
    const sampledValues = [];
    const blockSize = Math.ceil(steps.length / targetCount);

    for (let i = 0; i < steps.length; i += blockSize) {
        const chunkSteps = steps.slice(i, i + blockSize);
        const chunkValues = values.slice(i, i + blockSize);

        if (chunkValues.length === 0) continue;

        let minIdx = 0;
        let maxIdx = 0;

        for (let j = 1; j < chunkValues.length; j++) {
            if (chunkValues[j] < chunkValues[minIdx]) minIdx = j;
            if (chunkValues[j] > chunkValues[maxIdx]) maxIdx = j;
        }

        const indices = Array.from(new Set([minIdx, maxIdx])).sort((a, b) => a - b);
        for (const idx of indices) {
            sampledSteps.push(chunkSteps[idx]);
            sampledValues.push(chunkValues[idx]);
        }
    }

    return { steps: sampledSteps, values: sampledValues };
}
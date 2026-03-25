let lastMs = 0;
let seq = 0;

function getWorkerSlot(): number {
    const workerIndex = Number(process.env.TEST_WORKER_INDEX);

    if (Number.isInteger(workerIndex) && workerIndex >= 0) {
        return workerIndex % 100;
    }

    return process.pid % 100;
}

function uniqueIDFaker(namespace: number): number {
    const workerSlot = getWorkerSlot();
    const now = Date.now();

    if (now > lastMs) {
        lastMs = now;
        seq = 0;
    } else {
        seq += 1;

        if (seq > 9) {
            lastMs += 1;
            seq = 0;
        }
    }

    return lastMs * 10000 + workerSlot * 100 + seq * 10 + namespace;
}

export function uniqueRecordId(): number {
    return uniqueIDFaker(1);
}
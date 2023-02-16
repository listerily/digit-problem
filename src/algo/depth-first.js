import {getRightIndex, getDownIndex, getLeftIndex, getNullIndex, getUpIndex} from "../util/util";

let DepthFirst = {
    size: null,
    visitedLookup: new Map(),
    stackedStates: [],
    callback: null,
    fromMatrix: [],
    toMatrix: [],
    currentId: 0,
    maxDepth: 20,
    initialized: false,
    timeConsumed: 0,
    terminated: false,

    initialize: function (size, fromMatrix, toMatrix, callback, maxDepth) {
        this.size = size;
        this.callback = callback;
        this.fromMatrix = fromMatrix;
        this.toMatrix = toMatrix;
        this.currentId = 0;
        this.timeConsumed = 0;
        this.visitedLookup = new Map();
        this.stackedStates = [];
        this.maxDepth = maxDepth;
        this.stackedStates.push([0, this.fromMatrix.map(x => {return x;}), 0]);
        this.visitedLookup.set(JSON.stringify(this.fromMatrix), 0);
        this.initialized = true;
    },
    step: function () {
        if (this.terminated)
            return false;
        const t0 = Date.now();
        while (this.stackedStates.length !== 0) {
            const depth = this.stackedStates.length;
            if (depth + 1 > this.maxDepth) {
                this.stackedStates.pop();
                continue;
            }
            const [stateId, matrix, stage] = this.stackedStates[this.stackedStates.length - 1];
            let index = -1;
            const nullIndex = getNullIndex(this.size, matrix);
            if (stage === 0) {
                index = getUpIndex(this.size, matrix);
            } else if (stage === 1) {
                index = getLeftIndex(this.size, matrix);
            } else if (stage === 2) {
                index = getDownIndex(this.size, matrix);
            } else if (stage === 3) {
                index = getRightIndex(this.size, matrix);
            }
            if (index !== -1) {
                let newMatrix = matrix.map(x => {return x;});
                const t = newMatrix[nullIndex];
                newMatrix[nullIndex] = newMatrix[index];
                newMatrix[index] = t;
                if (!this.visitedLookup.has(JSON.stringify(newMatrix))) {
                    this.currentId += 1;
                    this.visitedLookup.set(JSON.stringify(newMatrix), this.currentId);
                    this.stackedStates.pop();
                    this.stackedStates.push([stateId, matrix, stage + 1]);
                    this.stackedStates.push([this.currentId, newMatrix, 0]);
                    this.callback(stateId, this.currentId, JSON.stringify(newMatrix) === JSON.stringify(this.toMatrix), newMatrix, depth, null);
                    this.timeConsumed += Date.now() - t0;
                    return true;
                }
            }
            this.stackedStates.pop();
            if (stage + 1 < 4) {
                this.stackedStates.push([stateId, matrix, stage + 1]);
            }
        }
        this.timeConsumed += Date.now() - t0;
        this.terminated = true;
        return false;
    },
    getNodesTraversed: function () {
        return this.currentId;
    },
    getTimeConsumed: function () {
        return this.timeConsumed;
    },
    getMemoryConsumed: function () {
        return this.stackedStates.length * (this.size * this.size * 4 + 10) + this.visitedLookup.size * (this.size * this.size * 4 + 16);
    }
};

export default DepthFirst
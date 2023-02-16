import {getRightIndex, getDownIndex, getLeftIndex, getNullIndex, getUpIndex} from "../util/util";

let BreadthFirst = {
    size: null,
    visitedLookup: new Map(),
    queuedStates: [],
    callback: null,
    fromMatrix: [],
    toMatrix: [],
    currentId: 0,
    initialized: false,
    timeConsumed: 0,
    terminated: false,

    initialize: function (size, fromMatrix, toMatrix, callback) {
        this.size = size;
        this.callback = callback;
        this.fromMatrix = fromMatrix;
        this.toMatrix = toMatrix;
        this.currentId = 0;
        this.timeConsumed = 0;
        this.visitedLookup = new Map();
        this.queuedStates = [];
        this.visitedLookup.set(JSON.stringify(this.fromMatrix), 0);
        const nullIndex = getNullIndex(this.size, this.fromMatrix);
        for (let i = 0; i < 4; i += 1) {
            let index = -1;
            if (i === 0) {
                index = getUpIndex(this.size, this.fromMatrix);
            } else if (i === 1) {
                index = getLeftIndex(this.size, this.fromMatrix);
            } else if (i === 2) {
                index = getDownIndex(this.size, this.fromMatrix);
            } else if (i === 3) {
                index = getRightIndex(this.size, this.fromMatrix);
            }
            if (index !== -1) {
                let newMatrix = this.fromMatrix.map(x => {return x;});
                const t = newMatrix[nullIndex];
                newMatrix[nullIndex] = newMatrix[index];
                newMatrix[index] = t;
                if (!this.visitedLookup.has(JSON.stringify(newMatrix))) {
                    this.visitedLookup.set(JSON.stringify(newMatrix), 0);
                    this.queuedStates.push([this.funcH(newMatrix), 0, 2, newMatrix]);
                }
            }
        }
        this.initialized = true;
    },
    step: function () {
        if (this.terminated)
            return false;
        const t0 = Date.now();
        if (this.queuedStates.length !== 0) {
            this.queuedStates.sort((lhs, rhs) => {
                const x = lhs[0] + lhs[2];
                const y = rhs[0] + rhs[2];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            const [fh, parentId, depth, matrix] = this.queuedStates[0];
            const isAnswer = JSON.stringify(matrix) === JSON.stringify(this.toMatrix);
            this.queuedStates.shift();
            this.currentId += 1;
            const nullIndex = getNullIndex(this.size, matrix);
            for (let i = 0; i < 4 && !isAnswer; i += 1) {
                let index = -1;
                if (i === 0) {
                    index = getUpIndex(this.size, matrix);
                } else if (i === 1) {
                    index = getLeftIndex(this.size, matrix);
                } else if (i === 2) {
                    index = getDownIndex(this.size, matrix);
                } else if (i === 3) {
                    index = getRightIndex(this.size, matrix);
                }
                if (index !== -1) {
                    let newMatrix = matrix.map(x => {return x;});
                    const t = newMatrix[nullIndex];
                    newMatrix[nullIndex] = newMatrix[index];
                    newMatrix[index] = t;
                    if (!this.visitedLookup.has(JSON.stringify(newMatrix))) {
                        if (JSON.stringify(newMatrix) !== JSON.stringify(this.toMatrix))
                            this.visitedLookup.set(JSON.stringify(newMatrix), 0);
                        this.queuedStates.push([this.funcH(newMatrix), this.currentId, depth + 1, newMatrix]);
                    }
                }
            }
            this.callback(parentId, this.currentId, isAnswer, matrix, depth, fh);
            this.timeConsumed += Date.now() - t0;
            return true;
        }
        this.terminated = true;
        this.timeConsumed += Date.now() - t0;
        return false;
    },
    getNodesTraversed: function () {
        return this.currentId;
    },
    getTimeConsumed: function () {
        return this.timeConsumed;
    },
    getMemoryConsumed: function () {
        return this.queuedStates.length * (this.size * this.size * 4 + 10) + this.visitedLookup.size * (this.size * this.size * 4 + 16);
    },
    funcH: function (matrix) {
        let sum = 0;
        for (let i = 0; i < this.size * this.size; ++i) {
            if (matrix[i] !== this.toMatrix[i]) {
                const l_x = i - i % this.size;
                const l_y = i % this.size;
                let j = 0;
                for (; j < this.size * this.size; ++j) {
                    if (matrix[i] === this.toMatrix[j]) {
                        break;
                    }
                }
                const r_x = j - j % this.size;
                const r_y = j % this.size;
                sum += Math.abs(r_x - l_x) + Math.abs(r_y - l_y);
            }
        }
        return sum;
    }
};

export default BreadthFirst
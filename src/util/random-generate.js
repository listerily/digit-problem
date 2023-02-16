import {getRightIndex, getDownIndex, getLeftIndex, getNullIndex, getUpIndex} from "./util";

let RandomGenerate = {
    size: null,
    visitedLookup: new Map(),
    stackedStates: [],

    generate: function (size) {
        this.size = size;
        this.visitedLookup = new Map();
        let steps = this.size * this.size * 2;
        let startMatrix = [];
        for (let i = 0; i < this.size * this.size; ++i) {
            startMatrix.push(i);
        }
        for (let i = 0; i < this.size * this.size; ++i) {
            const r = Math.floor(Math.random() * i) | 0;
            [startMatrix[r], startMatrix[i]] = [startMatrix[i], startMatrix[r]];
        }
        startMatrix[startMatrix.indexOf(0)] = null;
        let matrix = startMatrix.map(x => {return x;});
        let prevMatrix = [];
        for (let j = 0; j < steps; ++j) {
            const i = Math.floor(Math.random() * 4) | 0;
            const nullIndex = getNullIndex(this.size, matrix);
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
                if (JSON.stringify(newMatrix) !== JSON.stringify(prevMatrix)) {
                    prevMatrix = matrix;
                    matrix = newMatrix;
                }
            }
        }
        startMatrix[startMatrix.indexOf(null)] = 0;
        matrix[matrix.indexOf(null)] = 0;
        return [startMatrix, matrix];
    }
};

export default RandomGenerate
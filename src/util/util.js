exports.getNullIndex = (matrixSize, arr) => {
    return arr.indexOf(null);
};
exports.getUpIndex = (matrixSize, arr) => {
    const nullIndex = arr.indexOf(null);
    let index = nullIndex - matrixSize;
    if (index < 0)
        index = -1;
    return index;
};
exports.getDownIndex = (matrixSize, arr) => {
    const nullIndex = arr.indexOf(null);
    let index = nullIndex + matrixSize;
    if (index >= matrixSize * matrixSize)
        index = -1;
    return index;
};
exports.getLeftIndex = (matrixSize, arr) => {
    const nullIndex = arr.indexOf(null);
    let index = nullIndex - 1;
    if (index - index % matrixSize !== nullIndex - nullIndex % matrixSize)
        index = -1;
    return index;
};
exports.getRightIndex = (matrixSize, arr) => {
    const nullIndex = arr.indexOf(null);
    let index = nullIndex + 1;
    if (index - index % matrixSize !== nullIndex - nullIndex % matrixSize)
        index = -1;
    return index;
};

'use strict'

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

//creats and shuffles an array of numbers from 1 to len
function createRandomArray(len) {
    var nums = []
    for (var i = 0; i < len; i++) {
        nums.push(i + 1)
    }
    var res = []
    for (var i = 0; i < len; i++) {
        var randNum = getRandomIntInc(1, nums.length) - 1
        var num = nums.splice(randNum, 1)
        res.push(num[0])
    }
    return res
}


function getRandomIntInc(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function getRandomIntExc(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}
'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png">'
const GAMER_PURP_IMG = '<img src="img/gamer-purple.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/candy.png">'

// Model:
var gBoard
var gGamerPos
var gBallInterval
var gBallTimeLaps = 4 //sec
var gGlueInterval
var gGlueTimeLaps = 5 //sec
var gBallCounter = 0
var gCollectedBallsCounter = 0
var gIsGameOn = false
var gJump = false
var gGlueCell = null
var gIsGlued = false



function onInitGame() {
    gGamerPos = { i: 2, j: 9 }
    gBallCounter = 2
    gCollectedBallsCounter = 0

    var elCounter = document.querySelector('.counter')
    elCounter.innerText = `Balls collected: ${gCollectedBallsCounter}`

    gBoard = buildBoard()
    renderBoard(gBoard)
    gIsGameOn = true
    gBallInterval = setInterval(createBall, gBallTimeLaps * 1000)
    gGlueInterval = setInterval(createGlue, gGlueTimeLaps * 1000)
}

function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }
    board[0][5].type = FLOOR
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR
    board[9][5].type = FLOOR
    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL

    // console.log(board)
    return board
}

// Render the board to an HTML table
function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    elBoard.innerHTML = strHTML
}

function ballCollected() {
    var elCounter = document.querySelector('.counter')
    // console.log('Collecting!')
    playSound()
    gCollectedBallsCounter++
    elCounter.innerText = `Balls collected: ${gCollectedBallsCounter}`
    if (gBallCounter === gCollectedBallsCounter) victory()

}

// Move the player to a specific location
function moveTo(i, j) {
    if (!gIsGameOn) return
    if (gIsGlued) return
    // console.log(i, j)
    const targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return
    // if (targetCell === gBoard[5][12]) targetCell = gBoard[5][0]
    // Calculate distance to make sure we are moving to a neighbor cell
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || gJump === true) {
        if (targetCell.gameElement === BALL) {
            ballCollected()
        }
        if (targetCell.gameElement === GLUE) {
            steppedOnGlue()
        }
        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)
        if (gJump) gJump = false
        checkSerrounding()
    }
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

// Move the player by keyboard arrows
function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    // console.log('event.key:', event.key)
    switch (event.key) {
        case 'ArrowLeft':
            if (i === 5 && j === 0) {
                moveTo(5, 11)
                gJump = true
            } else {
                moveTo(i, j - 1)
            }
            break
        case 'ArrowRight':
            if (i === 5 && j === 11) {
                moveTo(5, 0)
                gJump = true
            } else {
                moveTo(i, j + 1)
            }
            break
        case 'ArrowUp':
            if (i === 0 && j === 5) {
                moveTo(9, 5)
                gJump = true
            } else {
                moveTo(i - 1, j)
            }
            break
        case 'ArrowDown':
            if (i === 9 && j === 5) {
                moveTo(0, 5)
                gJump = true
            } else {
                moveTo(i + 1, j)
            }
            break
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function victory() {
    var elRestartBtn = document.querySelector('.restert')
    alert('you won')
    gIsGameOn = false
    clearInterval(gBallInterval)
    clearInterval(gGlueInterval)
    elRestartBtn.style.display = 'block'
}


function checkSerrounding() {
    var elBallsNEgCount = document.querySelector('.ballsNear')
    const i = gGamerPos.i
    const j = gGamerPos.j

    var numberOfSerBalls = 0
    for (var k = i - 1; k < i + 2; k++) {
        if (k < 0 || k >= gBoard.length) continue
        for (var z = j - 1; z < j + 2; z++) {
            if (k === i && z === j) continue
            if (z < 0 || z >= gBoard[k].length) continue
            // console.log('gBoard[k][z].gameElement', gBoard[k][z].gameElement)
            //check in gBoard i-1 to i+1
            if (gBoard[k][z].gameElement === BALL) numberOfSerBalls++
            // console.log('numberOfSerBalls', numberOfSerBalls)
        }
    }
    // console.log('i,j', i, j)
    // return numberOfSerBalls
    elBallsNEgCount.innerText = `Balls near player: ${numberOfSerBalls}`
}

function steppedOnGlue() {
    gIsGlued = true
    // console.log('stepped on glue')
    renderCell(gGamerPos, GAMER_PURP_IMG)
    setTimeout(isNotGlued, 3000)
    // renderCell(gGamerPos, GAMER_IMG)
}

function isNotGlued() {
    gIsGlued = false
    renderCell(gGamerPos, GAMER_IMG)
}

function createGlue() {
    var randEmptyCell = getRandEmptyCell()
    var glueCell = gBoard[randEmptyCell.i][randEmptyCell.j]
    glueCell.gameElement = GLUE
    gGlueCell = randEmptyCell
    renderCell(randEmptyCell, GLUE_IMG)
    // console.log('gGlueCell', gGlueCell)
    // console.log('gGlueCell', gGlueCell)
    if (gGamerPos.i === gGlueCell.i && gGamerPos.j === gGlueCell.j) {
        renderCell(randEmptyCell, GAMER_PURP_IMG)
    }//gamer purp does not work as i want for some reason.

    setTimeout(removeGlue, 3000)
}

function removeGlue() {
    var glueCell = gBoard[gGlueCell.i][gGlueCell.j]
    glueCell.gameElement = null
    // console.log('gGamerPos', gGamerPos.i)
    // console.log('glueCell', gGlueCell.i)
    if (gGamerPos.i === gGlueCell.i && gGamerPos.j === gGlueCell.j) {
        renderCell(gGlueCell, GAMER_PURP_IMG)
    } else {
        renderCell(gGlueCell, '')
    }
}


//creates a ball in given cell
function createBall() {
    var randEmptyCell = getRandEmptyCell()
    //update model
    var currCell = gBoard[randEmptyCell.i][randEmptyCell.j]
    currCell.gameElement = BALL
    // console.log('randEmptyCell', randEmptyCell.i)
    // console.log('currCell', currCell)
    //update MOD
    renderCell(randEmptyCell, BALL_IMG)
    gBallCounter++
    // console.log('gBallCounter', gBallCounter)
    checkSerrounding()
}

//finds empty cell
function getRandEmptyCell() {
    var emptyCells = getEmptyCells()
    var rand = getRandomIntInc(0, emptyCells.length - 1)
    var cell = emptyCells[rand]
    // console.log('cell', cell)
    return cell
}


function getEmptyCells() {
    var emptyCells = []
    // console.log('gBoard', gBoard.length)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].gameElement === null && gBoard[i][j].type !== WALL) emptyCells.push({ i, j })
        }
    }
    // console.log('emptyCells', emptyCells)
    return emptyCells
    // return emptyCells
}


function playSound() {
    var sound = new Audio('sound/bite.mp3')
    sound.play()

}

const board = document.querySelector(".board")

const defaultBombs = 30
const bombsParam = getURLParam("bombs", defaultBombs)
const bombsCount = bombsParam < 0 ? defaultBombs : parseInt(bombsParam)

const defaultWidth = 25
const widthParam = getURLParam("columns", defaultWidth)
const boardWidth = widthParam < 0 ? defaultWidth : parseInt(widthParam)

const defaultHeight = 10
const heightParam = getURLParam("rows", defaultHeight)
const boardHeight = heightParam < 0 ? defaultHeight : parseInt(heightParam)

const ratio = bombsCount / (boardWidth * boardHeight)

const ratioElement = document.createElement("p")
ratioElement.textContent = `Average: ${(ratio * 100).toPrecision(2)} bombs for 100 squares.`
board.parentElement.insertBefore(ratioElement, board)

setCustomProperty("board-columns-count", boardWidth.toString())
setCustomProperty("board-rows-count", boardHeight.toString())

// + number of attempts
// + time used
// + number of flags

let flagCount = 0;

const numberColors = [
    "hsl(190deg, 75%, 50%)",
    "hsl(240deg, 75%, 50%)",
    "hsl(290deg, 75%, 50%)",
    "hsl(340deg, 75%, 50%)",
    "hsl(30deg, 75%, 50%)",
    "hsl(80deg, 75%, 50%)",
    "hsl(130deg, 75%, 50%)",
    "hsl(180deg, 75%, 50%)",
]

const generateBombs = (bombsCount, cellsCount) => {
    const bombs = []

    const random = () => Math.floor(Math.random() * cellsCount)

    for (let i = 0; i < bombsCount; i++) {
        let number = random()
        while (bombs.includes(number)) {
            number = random()
        }
        bombs.push(number)
    }

    return bombs
}

function getCoordsAround(square) {
    const { x, y } = getCoord(square)

    const checker = (x, y) => {
        const coord = { x, y }
        if (!areInGrid(coord)) return undefined
        return coord
    }

    const result = [
        checker(x - 1, y - 1), // top left
        checker(x, y - 1), // top
        checker(x + 1, y - 1), // top right
        checker(x - 1, y), // left
        checker(x + 1, y), // right
        checker(x - 1, y + 1), // bottom left
        checker(x, y + 1), // bottom
        checker(x + 1, y + 1), // bottom right
    ]

    // remove the ones that are undefined
    return result.filter((item) => item != undefined)
}

function getBombsAround(square) {
    const coordArounds = getCoordsAround(square)

    return coordArounds.reduce((totalBombs, currentCoord) => {
        const square = getSquareAt(currentCoord)
        if (!square) return totalBombs

        return isBomb(square) ? totalBombs + 1 : totalBombs
    }, 0)
}

const showLoseModal = () => {
    board.style.pointerEvents = "none"
    board.style.filter = "brightness(50%)"

    const modal = document.body.querySelector(".modal")
    setTimeout(() => {
        modal.style.display = "block"
        modal.style.opacity = "100%"
    }, 250)
}

const showWinModal = () => {
    document.querySelector(".modal__title").textContent = "Congrats! You won!"
    board.style.pointerEvents = "none"
    board.style.filter = "brightness(50%)"

    const modal = document.body.querySelector(".modal")
    setTimeout(() => {
        modal.style.display = "block"
        modal.style.opacity = "100%"
    }, 250)
}

const discover = (square) => {
    if (!isHidden(square)) return

    setStatus(square, "discovered")

    if (isBomb(square)) {
        return showLoseModal()
    }

    const bombsAround = getBombsAround(square)
    if (bombsAround !== 0) {
        square.textContent = bombsAround.toString()
        square.style.color = numberColors[bombsAround - 1]
        return
    }

    const coordAround = getCoordsAround(square)
    coordAround.forEach(({ x, y }) => discover(getSquareAt({ x, y })))
}

const hasWon = () => {
    const squares = board.querySelectorAll(".board__square")

    for (square of squares) {
        if (isHidden(square)) return false
    }

    return true
}

const toggleMark = (square) => {
    if (isDiscovered(square)) return

    if (isMarked(square)) {
        setStatus(square, "hidden")
        square.innerHTML = ""
        flagCount--;
        return
    }

    if(flagCount === bombsCount) {
        alert("You have no flag left.")
        return
    }

    flagCount++;

    setStatus(square, "marked")

    const flag = document.createElement("img")
    flag.setAttribute("src", "./assets/svg/icon.svg")
    return square.appendChild(flag)
}

const populateBoard = () => {
    board.innerHTML = ""
    const bombs = generateBombs(bombsCount, boardWidth * boardHeight)

    let cellIndex = 0
    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            cellIndex++

            const square = document.createElement("button")

            square.classList.add("board__square")
            if ((x + y) % 2 === 0) square.classList.add("light")

            setType(square, "grass")
            setStatus(square, "hidden")
            setCoord(square, x, y)

            if (bombs.includes(cellIndex)) {
                setType(square, "bomb")
            }

            square.addEventListener("click", () => {
                discover(square)
                if (hasWon()) {
                    return showWinModal()
                }
            })
            square.addEventListener("contextmenu", (event) => {
                event.preventDefault()
                toggleMark(square)
                if (hasWon()) {
                    return showWinModal()
                }
            })

            board.appendChild(square)
        }
    }
}

populateBoard()

function getType(square) {
    return square.dataset.type
}

function isBomb(square) {
    const type = getType(square)
    return type === "bomb" ? true : false
}

function setType(square, newType) {
    square.dataset.type = newType
}

function getStatus(square) {
    return square.dataset.status
}

function setStatus(square, newStatus) {
    square.dataset.status = newStatus
}

function isHidden(square) {
    return getStatus(square) === "hidden"
}

function isDiscovered(square) {
    return getStatus(square) === "discovered"
}

function isMarked(square) {
    return getStatus(square) === "marked"
}

function areInGrid(coord) {
    if (coord.x < 0 || coord.x > boardWidth - 1) return false
    if (coord.y < 0 || coord.y > boardHeight - 1) return false
    return true
}

function getSquareAt({ x, y }) {
    const query = `.board__square[data-x="${x}"][data-y="${y}"]`
    return board.querySelector(query)
}

function getCoord(square) {
    return {
        x: getX(square),
        y: getY(square),
    }
}

function setCoord(square, newX, newY) {
    setX(square, newX)
    setY(square, newY)
}

function getX(square) {
    return parseInt(square.dataset.x)
}

function setX(square, newX) {
    square.dataset.x = newX
}

function getY(square) {
    return parseInt(square.dataset.y)
}

function setY(square, newY) {
    square.dataset.y = newY
}

function getCustomProperty(name) {
    return document.documentElement.style.getPropertyValue(`--${name}`)
}

function setCustomProperty(name, value) {
    document.documentElement.style.setProperty(`--${name}`, value)
}

function getURLParams() {
    const vars = {}
    window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (_m, key, value) {
            vars[key] = value
        }
    )
    return vars
}

function getURLParam(parameter, defaultValue) {
    return getURLParams()[parameter] || defaultValue
}

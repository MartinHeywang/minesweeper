document.documentElement.style.setProperty("--board-columns-count", "15")
document.documentElement.style.setProperty("--board-rows-count", "20")

const board = document.querySelector(".board")
const boardColumnsCount = parseInt(
    document.documentElement.style.getPropertyValue("--board-columns-count")
)
const boardRowsCount = parseInt(
    document.documentElement.style.getPropertyValue("--board-rows-count")
)

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
        // checks the 8 squares around if they are in grid
        checker(x - 1, y - 1),
        checker(x, y - 1),
        checker(x + 1, y - 1),
        checker(x - 1, y),
        checker(x + 1, y),
        checker(x - 1, y + 1),
        checker(x, y + 1),
        checker(x + 1, y + 1),
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

const lose = () => {
    board.style.pointerEvents = "none"
    board.style.filter = "brightness(50%)"
    alert("You lose ! Reload the page to restart.")
}

const discover = (square) => {
    if (!isHidden(square)) return

    setStatus(square, "discovered")

    if (isBomb(square)) {
        return lose()
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

const toggleMark = (square) => {
    if (isDiscovered(square)) return

    if (isMarked(square)) {
        setStatus(square, "hidden")
        square.innerHTML = ""
    }

    setStatus(square, "marked")

    const flag = document.createElement("img")
    flag.setAttribute("src", "./assets/svg/icon.svg")
    return square.appendChild(flag)
}

const populateBoard = () => {
    const bombs = generateBombs(30, boardColumnsCount * boardRowsCount)

    let cellIndex = 0
    for (let y = 0; y < boardRowsCount; y++) {
        for (let x = 0; x < boardColumnsCount; x++) {
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
            })
            square.addEventListener("contextmenu", (event) => {
                event.preventDefault()
                toggleMark(square)
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
    if (coord.x < 0 || coord.x > boardColumnsCount - 1) return false
    if (coord.y < 0 || coord.y > boardRowsCount - 1) return false
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

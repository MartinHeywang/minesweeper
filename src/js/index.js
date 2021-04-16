import flagImg from "../assets/svg/icon.svg" // eslint-disable-line

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

const isBomb = (square) => {
    const type = square.getAttribute("data-type")
    return type === "bomb" ? true : false
}

const getBombsAround = (square) => {
    const cellX = parseInt(square.getAttribute("data-x"))
    const cellY = parseInt(square.getAttribute("data-y"))

    // amounts to add to the "cellIndex" to find the cells around this one.
    const indexesAround = [-1, 0, 1]

    return indexesAround.reduce((totalY, currentY) => {
        return (
            totalY +
            indexesAround.reduce((totalX, currentX) => {
                const x = cellX + currentX
                const y = cellY + currentY

                const element = board.querySelector(
                    `.board__square[data-x="${x}"][data-y="${y}"]`
                )
                const bomb = element && isBomb(element)
                return bomb ? totalX + 1 : totalX
            }, 0)
        )
    }, 0)
}

const lose = () => {
    board.style.pointerEvents = "none"
    board.style.filter = "brightness(50%)"
    alert("You lose ! Reload the page to restart.")
}

const discover = (square) => {
    const status = square.getAttribute("data-status")
    if (status !== "hidden") return

    square.setAttribute("data-status", "discovered")

    if(isBomb(square)) {
        return lose()
    }

    const bombsAround = getBombsAround(square)
    if (bombsAround !== 0) {
        square.textContent = bombsAround.toString()
        square.style.color = numberColors[bombsAround - 1]
        return
    }

    const indexesAround = [-1, 0, 1]
    console.group()
    indexesAround.forEach((indexY) => {
        indexesAround.forEach((indexX) => {
            const x = parseInt(square.getAttribute("data-x")) + indexX
            const y = parseInt(square.getAttribute("data-y")) + indexY

            const query = `.board__square[data-x="${x}"][data-y="${y}"]`
            const element = board.querySelector(query)

            if (!element) return
            if (element === square) return

            discover(element)
        })
    })
    console.groupEnd()
}

const toggleMark = (square) => {
    const status = square.getAttribute("data-status")
    if (status === "discovered") return

    if (status === "hidden") {
        square.setAttribute("data-status", "marked")

        const flag = document.createElement("img")
        flag.setAttribute("src", flagImg)

        square.appendChild(flag)

        return
    }

    square.setAttribute("data-status", "hidden")
    square.innerHTML = ""
}

const populateBoard = () => {
    const bombs = generateBombs(30, boardColumnsCount * boardRowsCount)

    let cellIndex = 0
    for (let x = 0; x < boardRowsCount; x++) {
        for (let y = 0; y < boardColumnsCount; y++) {
            cellIndex++

            const square = document.createElement("button")

            square.classList.add("board__square")
            if ((x + y) % 2 === 0) square.classList.add("light")

            square.setAttribute("data-type", "grass")
            square.setAttribute("data-status", "hidden")
            square.setAttribute("data-x", `${x}`)
            square.setAttribute("data-y", `${y}`)

            if (bombs.includes(cellIndex)) {
                square.setAttribute("data-type", "bomb")
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

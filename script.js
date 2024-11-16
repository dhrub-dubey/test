document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const width = 8;
    const squares = [];
    let score = 0;

    const candyColors = [
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/red-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/blue-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/green-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/yellow-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/orange-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/purple-candy.png)",
    ];

    let firstSelectedSquare = null;
    let secondSelectedSquare = null;

    // Creating Game Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", i);
            square.style.backgroundImage = candyColors[Math.floor(Math.random() * candyColors.length)];
            grid.appendChild(square);
            squares.push(square);

            // Add event listener for tap-to-select functionality
            square.addEventListener("click", handleCandyTap);
        }
    }
    createBoard();

    // Handle tap events
    function handleCandyTap() {
        if (!firstSelectedSquare) {
            // Select the first candy
            firstSelectedSquare = this;
            firstSelectedSquare.classList.add("selected");
        } else if (!secondSelectedSquare) {
            // Select the second candy
            secondSelectedSquare = this;

            // Check if the second candy is adjacent
            if (isAdjacent(parseInt(firstSelectedSquare.id), parseInt(secondSelectedSquare.id))) {
                // Swap candies
                swapCandies();
                // Check if the move is valid
                setTimeout(() => {
                    const validMove = checkMatches();
                    if (!validMove) {
                        // Revert swap if no match
                        swapCandies();
                    }
                    resetSelection();
                }, 300);
            } else {
                // If not adjacent, clear selection
                resetSelection();
            }
        }
    }

    // Check if two candies are adjacent
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / width);
        const row2 = Math.floor(index2 / width);
        const col1 = index1 % width;
        const col2 = index2 % width;

        return (Math.abs(row1 - row2) + Math.abs(col1 - col2)) === 1;
    }

    // Swap two selected candies
    function swapCandies() {
        const firstColor = firstSelectedSquare.style.backgroundImage;
        const secondColor = secondSelectedSquare.style.backgroundImage;

        firstSelectedSquare.style.backgroundImage = secondColor;
        secondSelectedSquare.style.backgroundImage = firstColor;
    }

    // Reset candy selection
    function resetSelection() {
        if (firstSelectedSquare) firstSelectedSquare.classList.remove("selected");
        firstSelectedSquare = null;
        secondSelectedSquare = null;
    }

    // Dropping candies once some have been cleared
    function moveIntoSquareBelow() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                if (firstRow.includes(i) && squares[i].style.backgroundImage === "") {
                    squares[i].style.backgroundImage = candyColors[Math.floor(Math.random() * candyColors.length)];
                }
            }
        }
    }

    // Check matches and score points
    function checkMatches() {
        let matched = false;

        function checkRowForThree() {
            for (let i = 0; i < 61; i++) {
                const rowOfThree = [i, i + 1, i + 2];
                const decidedColor = squares[i].style.backgroundImage;
                const isBlank = decidedColor === "";

                const notValid = [
                    6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55
                ];
                if (notValid.includes(i)) continue;

                if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                    matched = true;
                    score += 3;
                    scoreDisplay.innerHTML = score;
                    rowOfThree.forEach(index => squares[index].style.backgroundImage = "");
                }
            }
        }

        function checkColumnForThree() {
            for (let i = 0; i < 47; i++) {
                const columnOfThree = [i, i + width, i + width * 2];
                const decidedColor = squares[i].style.backgroundImage;
                const isBlank = decidedColor === "";

                if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                    matched = true;
                    score += 3;
                    scoreDisplay.innerHTML = score;
                    columnOfThree.forEach(index => squares[index].style.backgroundImage = "");
                }
            }
        }

        checkRowForThree();
        checkColumnForThree();
        return matched;
    }

    window.setInterval(() => {
        moveIntoSquareBelow();
        checkMatches();
    }, 100);
}

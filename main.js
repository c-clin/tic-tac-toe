$(document).ready(function() {
    var origBoard;
    const huPlayer = 'O';
    const aiPlayer = 'X';
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ]
    const cells = Array.from($('.cell'));
    console.log(cells);

    startGame();

    function startGame() {
        $('.endgame').css('display', 'none');
        // create an array of 0-9
        origBoard = Array.from(Array(9).keys());
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = '';
            cells[i].style.removeProperty('background-color');
            cells[i].addEventListener('click', turnClick, false);
        }
    }

    function turnClick(e) {
        if (typeof origBoard[e.target.id] == 'number') {
            turn(e.target.id, huPlayer);
            if (!checkWin(origBoard, huPlayer)) {
                setTimeout(() => {
                    if (!checkTie()) turn(bestSpot(), aiPlayer);
                }, 500);
                
            }
            
        }
    }

    function turn(eventID, player) {
        origBoard[eventID] = player;
        $(`#${eventID}`).text(player);
        let gameWon = checkWin(origBoard, player);
        if (gameWon) gameOver(gameWon);

    }

    function checkWin(board, player) {
        // get all the index of the player
        let plays = board.reduce((a, e, i) =>
            (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        // entries return a key-value pair of the array
        for (let [index, win] of winCombos.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                gameWon = { index: index, player: player };
                break;
            }
        }
        return gameWon;
    }

    function gameOver(gameWon) {
        for (let index of winCombos[gameWon.index]) {
            document.getElementById(index).style.backgroundColor =
                gameWon.player == huPlayer ? "blue" : "red";
        }

        for (let i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner(gameWon.player == huPlayer ? 'you win!!' : 'you lost!');
    }

    function declareWinner(who) {
        $('.endgame').css('display', 'block');
        $('.endgame .text').text(who);
    }

    function emptySquares() {
        return origBoard.filter(s => typeof s == 'number');
    }

    function bestSpot() {
        return minmax(origBoard, aiPlayer).index;
    }

    function checkTie() {
        if (emptySquares().length === 0) {
            for (let i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = 'green';
                cells[i].removeEventListener("click", turnClick, false);
            }
            declareWinner('Tie Game');
            return true;
        }
        return false;
    }
    
    function minmax(newBoard, player) {
        var availSpots = emptySquares(newBoard);
        if (checkWin(newBoard, player)) {
            return {score: -10};
        } else if (checkWin(newBoard, aiPlayer)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }

        var moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;

            if (player == aiPlayer) {
                var result = minmax(newBoard, huPlayer);
                move.score = result.score;
            } else {
                var result = minmax(newBoard, aiPlayer);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        }

        var bestMove;
        if (player === aiPlayer) {
            var bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                } 
            }
        } else {
            var bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }      
        }
        return moves[bestMove];
    }

    // restart the game
    $(".replay-btn").click(startGame);

});






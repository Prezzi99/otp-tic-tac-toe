const gameBoard = (function() {
    const board = [];
    const rows = 3;
    const columns = 3;

    NewBoard()

    const UpdateBoard = (row, column, mark) => {
        // If the cell doesn't have a mark. Add the players mark.
        if (!board[row][column].GetMark()) {
            board[row][column].AddMark(mark);
            return true;
        }
        else {
            return false;
        }
    }

    const PrintBoard = () => {
        let gameBoard = [];
        board.forEach((row) => {
            gameBoard.push(row.map((cell) => cell.GetMark()));
        });
        console.log(gameBoard);
    };

    function NewBoard() {
        // Add rows (arrays) and columns (cells/objects) to the game board. 
        // A column is denoted by the series of cells in each row
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    }

    return { UpdateBoard, PrintBoard, NewBoard };
})();

function Cell() {
    const cell = {mark: ''};

    const AddMark = (playerMark) => {
        cell.mark = playerMark;
    }

    const GetMark = () => cell.mark;

    return { AddMark, GetMark };
}

// For controlling the game flow.
function Game(playerOne = 'Player One', playerTwo = 'Player Two') {
    // Count past plays
    let playCount;

    // Create players
    const players = [
        {playerOne, mark: 'X'},
        {playerTwo, mark: 'O'}
    ]

    // Play round
    let player = players[0];
    function MakePlay(row, column, player) {
        validPlay = gameBoard.UpdateBoard(row, column, player.mark);
        if (validPlay) playCount++;
        FindWinner({row, column});
        (validPlay) ? SwitchPlayer(player) : console.log('Invalid Play');
    }

    // Switch player
    function SwitchPlayer(activePlayer) {
        if (activePlayer.mark === 'X') {
            player = players[1];
        }
        else if (activePlayer.mark === 'O') {
            player = players[0];
        }
    }

    const getActivePlayer = () => player;
    
    return { MakePlay, getActivePlayer };
}

function FindWinner(indecies) {
    // Abort if there are less than 3 marks on the board.
    if (playCount < 3) return;

    // Check the index position of the last play and then evaluate contiguous cells.
    let gameWon;

    // Check the row of the last play
    gameWon = Boolean(board[indecies.row].map((cell) => cell.mark).reduce(accumulator));

    // Check the column of the last play
    const column = [];
    for (let i = 0; i < 3; i++) column.push(board[i][indecies.column]);
    gameWon = Boolean(column.map((cell) => cell.mark)).reduce(accumulator);

    // Check for diagonal pattern
    
    function accumulator(accumulator, mark) {
        return (accumulator === mark) ? accumulator = mark : accumulator = false;
    }
}

// const board = GameBoard();
board.PrintBoard();
// board.UpdateBoard(0, 0, 'X');
// board.PrintBoard();
// board.NewBoard();
// board.PrintBoard();
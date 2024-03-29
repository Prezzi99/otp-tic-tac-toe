function GameBoard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    // Add rows (arrays) and columns (cells/objects) to the game board. 
    // A column is denoted by the series of cells in each row
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

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

    return { UpdateBoard, PrintBoard }
}

function Cell() {
    const cell = {};

    const AddMark = (playerMark) => {
        cell.mark = playerMark;
    }

    const GetMark = () => cell.mark;

    return { AddMark, GetMark }
}

function GameController() {

}

const board = GameBoard();
board.PrintBoard();
// For controlling the game flow.
function Game(playerOne = 'Player One', playerTwo = 'Player Two') {
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

        function Cell() {
            const cell = {mark: ''};
        
            const AddMark = (playerMark) => {
                cell.mark = playerMark;
            }
        
            const GetMark = () => cell.mark;
        
            return { AddMark, GetMark };
        }

        function GetBoard() { return board }
    
        return { UpdateBoard, NewBoard, GetBoard };
    })();

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
        winner = FindWinner({row, column});
        
        // Switch player if the play is valid and is not a winning move
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

    function PrintBoard() {
        let board = [];
        gameBoard.GetBoard().forEach((row) => {
            board.push(row.map((cell) => cell.GetMark()));
        });
        console.log(board);
    };

    function FindWinner(indecies) {
        // Abort if there are less than 3 marks on the board.
        if (playCount < 3) return;
    
        // Check the index position of the last play and then evaluate contiguous cells.
        let gameWon;
    
        // Check the row of the last play
        const newRow = gameBoard.GetBoard()[indecies.row]
        gameWon = Boolean(gameBoard.GetBoard()[indecies.row].map((cell) => cell.GetMark()).reduce(accumulator));
        if (gameWon) return player;
    
        // Check the column of the last play
        const column = [];
        for (let i = 0; i < 3; i++) column.push(gameBoard.GetBoard()[i][indecies.column]);
        gameWon = Boolean(column.map((cell) => cell.GetMark()).reduce(accumulator));
        console.log(column.map((cell) => cell.GetMark()));
        if (gameWon) return player;
    
    
        // Check for diagonal pattern
        
        function accumulator(accumulator, mark) {
            return (accumulator === mark) ? accumulator = mark : accumulator = false;
        }
    }

    const getActivePlayer = () => player;
    // const showUs = (PrintBoard)

    return { MakePlay, getActivePlayer, PrintBoard};
}

const ticTacToe = Game();
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

    let player = players[0];

    // Play round
    function MakePlay(row, column, player) {
        validPlay = gameBoard.UpdateBoard(row, column, player.mark);
        if (validPlay && playCount < 3) playCount++;
        PrintBoard();
        winner = FindWinner({row, column});
        if (winner) console.log({winner});

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

    function getActivePlayer() { return player };

    function FindWinner(indecies) {
        // Abort if there are less than 3 marks on the board.
        if (playCount < 3) return;
    
        // Check the index position of the last play and then evaluate contiguous cells.
        const board = gameBoard.GetBoard();
    
        // Check the row of the last play
        if (matchAllThree(board[indecies.row])) return player;
    
        // Check the column of the last play
        const Column = [];
        for (let i = 0; i < 3; i++) Column.push(board[i][indecies.column]);
        if (matchAllThree(Column)) return player;
    
        // Check for diagonal pattern
        const {row, column} = indecies;
        const Diagonal = [];

        if (row == 0 && column == 0 || row == 2 && column == 2) {
            // Top row, left column
            for (let i = 0; i < 3; i++) Diagonal.push(board[i][i]);
            if (matchAllThree(Diagonal)) return player;

        }
        else if (row == 2 && column == 0 || row == 0 && column == 2) {
            // Bottom row, left column
            let startColumn = 2;
            for (let i = 0; i < 3; i++) Diagonal.push(board[i][startColumn--]);
            if (matchAllThree(Diagonal)) return player;

        }
        else if (row == 1 && column == 1) {
            // top row, right column
            for (let i = 0; i < 3; i++) Diagonal.push(board[i][i]);
            if (matchAllThree(Diagonal)) {
                return player
            }
            else {

                Diagonal.splice(0, Diagonal.length); //Remove all the elements in Diagonal.
                let startColumn = 2;
                for (let i = 0; i < 3; i++) Diagonal.push(board[i][startColumn--]);
                if (matchAllThree(Diagonal)) return player
            }
        }

        function matchAllThree(gridLine) {
            won = Boolean(gridLine.map((cell) => cell.GetMark()).reduce(accumulator));
            return won;

            function accumulator(accumulator, mark) {
                return (accumulator === mark) ? accumulator = mark : accumulator = false;
            }
        }
    }

    return { MakePlay, getActivePlayer, PrintBoard };
}

const ticTacToe = Game();
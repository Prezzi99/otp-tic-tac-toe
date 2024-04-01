StartGame();
// InterfaceControl();

// For controlling the game flow.
function Game(playerOne = 'Player One', playerTwo = 'Player Two') {
    const gameBoard = (function() {
        const board = [];
        const rows = 3;
        const columns = 3;
    
        NewBoard();
    
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
            const cell = {};
        
            const AddMark = (playerMark) => {
                cell.mark = playerMark;
            }
        
            const GetMark = () => cell.mark;
        
            return { AddMark, GetMark };
        }

        function GetBoard() { return board }
    
        return { UpdateBoard, NewBoard, GetBoard };
    })();

    // Count plays
    let playCount = 0;
    let draws = 0; // Count ties
    let winner; // Winner of the last round
    let finalMove //Capture the final move

    // Create players
    const players = [
        {playerOne, mark: 'X', score: 0},
        {playerTwo, mark: 'O', score: 0}
    ];

    let player = players[0];

    // Play round
    function MakePlay(row, column, player) {
        validPlay = gameBoard.UpdateBoard(row, column, player.mark);
        if (validPlay) {
            playCount++ 
            winner = FindWinner({row, column});
            finalMove = (winner || playCount == 9) ? true : false;
            if (winner) {
                console.log({winner});
                winner.score++;
                gameBoard.NewBoard();
                playCount = 0;
            }

            if (playCount === 9) {   
                gameBoard.NewBoard();
                if (!winner) draws++
                playCount = 0;
            }

            SwitchPlayer(player);
            return true;
        }
        else {
            console.log('Invalid Play');
        }
    }

    // Switch player
    function SwitchPlayer(activePlayer) {
        if (activePlayer.mark === 'X') {
            player = players[1];
        }
        else if (activePlayer.mark === 'O') {
            player = players[0];
        }
    };

    function PrintBoard() {
        let board = [];
        gameBoard.GetBoard().forEach((row) => {
            board.push(row.map((cell) => cell.GetMark()));
        });
        console.log(board);
    };

    function resetScores() { 
        for (const player of players) player.score = 0;
        draws = 0;
    };

    function getActivePlayer() { return player };

    function getFinalMove() { return finalMove };

    function getScores() { 
        return {
            playerOneScore: players[0].score, 
            playerTwoScore: players[1].score,
            draws: draws
        } 
    };

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

        if (row == 0 && column == 0 || row == 2 && column == 2 || row == 1 && column == 1) {
            // Left Diagonal, from top
            const Diagonal = [];
            for (let i = 0; i < 3; i++) Diagonal.push(board[i][i]);
            if (matchAllThree(Diagonal)) return player;

        }
        if (row == 2 && column == 0 || row == 0 && column == 2 || row == 1 && column == 1) {
            // Right Diagonal, from top
            const Diagonal = [];
            let startColumn = 2;
            for (let i = 0; i < 3; i++) Diagonal.push(board[i][startColumn--]);
            const result = [];
            // Diagonal.forEach((cell) => result.push(cell.GetMark()));
            if (matchAllThree(Diagonal)) return player;

        }

        function matchAllThree(gridLine) {
            won = Boolean(gridLine.map((cell) => cell.GetMark()).reduce(accumulator));
            return won;

            function accumulator(accumulator, mark) {
                return (accumulator === mark) ? accumulator = mark : accumulator = false;
            }
        }
    };

    return { MakePlay, getActivePlayer, resetScores, getFinalMove, getScores };
}

// Allows users to start and restart the game, and play a new round.
function GameController(playerOne, playerTwo) {
    const ticTacToe = Game(playerOne, playerTwo); 
    const gameGrid = document.querySelector('#cell-grid');

    const newRoundButton = document.querySelector('#new-round');
    const restartGameButton = document.querySelector('#new-game');

    gameGrid.addEventListener('click', Play);

    // If the user chooses to play another round.
    newRoundButton.addEventListener('click', removeMarks);
    restartGameButton.addEventListener('click', () => {
        removeMarks();
        ticTacToe.resetScores();
    });

    function removeMarks() {
         // Select all the buttons in the grid and remove their inner text.
         document.querySelectorAll('#cell-grid > button').forEach((button) => button.innerText = '');
        //  Hide buttons
        newRoundButton.classList.toggle('hidden');
        restartGameButton.classList.toggle('hidden');
    }

    function Play(event) {
        const activePlayer = ticTacToe.getActivePlayer();
        const playerMark = activePlayer.mark;
        // Get the index of the row and column that the player clicked.
        const indecies = {
            row: event.target.dataset.row,
            column: event.target.dataset.column
        };
        // console.log(ticTacToe.getScores());
        const validPlay = ticTacToe.MakePlay(indecies.row, indecies.column, activePlayer);
        if (validPlay) markCell(playerMark, event);

        function markCell (playerMark, event) {
            const cell = event.target;
            cell.innerText = playerMark;
        }

        if (ticTacToe.getFinalMove()) {
            newRoundButton.classList.toggle('hidden');
            restartGameButton.classList.toggle('hidden');
        }
    }
}

function StartGame() { 
    const startButton = document.querySelector('#start-game')
    const gameGrid = document.querySelector('#cell-grid');
    startButton.addEventListener('click', Start);

    function Start(event) {
        const [players] = [Array.from(document.querySelectorAll('.player-name'))];
        GameController(players[0].value, players[1].value);
        // Display the grid
        gameGrid.style.display = 'grid';
        event.preventDefault();
    }
}

function ScoreBoard() {

}
// Load CSV file and parse it
function loadSolutions(callback) {
    Papa.parse('8_queens_solutions.csv', {
        download: true,
        complete: function(results) {
            // Convert each row to an array of numbers
            const solutions = results.data.map(row => row.map(Number));
            console.log("Solutions Loaded:", solutions); // Debugging: Check if solutions are loaded
            callback(solutions);
        }
    });
}

// Function to filter solutions based on the current board state
function filterSolutions(solutions, currentQueens) {
    return solutions.filter(solution => {
        for (let i = 0; i < currentQueens.length; i++) {
            if (currentQueens[i] !== -1 && currentQueens[i] !== solution[i]) {
                return false; // Filter out solutions that don't match the current placements
            }
        }
        return true;
    });
}

// Function to highlight valid moves based on filtered solutions
function highlightValidMoves(filteredSolutions, currentRow) {
    const validColumns = new Set();
    filteredSolutions.forEach(solution => validColumns.add(solution[currentRow]));
    
    // Clear existing highlights
    clearHighlights();

    // Highlight valid columns for the current row
    validColumns.forEach(col => {
        const square = document.querySelector(`#square-${currentRow}-${col}`);
        if (square) {
            square.classList.add('highlight'); // Add your highlight CSS class
        }
    });
}

// Clear all highlighted squares
function clearHighlights() {
    const highlightedSquares = document.querySelectorAll('.highlight');
    highlightedSquares.forEach(square => square.classList.remove('highlight'));
}

// Initialize the AI-assisted board
function initializeBoard() {
    loadSolutions(solutions => {
        const n = 8; // 8x8 board
        const currentQueens = Array(n).fill(-1); // Initialize queens' positions
        console.log("Initializing Board..."); // Debugging: Check if board initialization starts

        // Create the chessboard
        const chessboard = document.getElementById('chessboard');
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                const square = document.createElement('div');
                square.id = `square-${row}-${col}`;
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.addEventListener('click', function() {
                    if (currentQueens[row] === col) { // If the queen is already placed here
                        currentQueens[row] = -1; // Remove the queen
                        this.innerHTML = ''; // Clear the square
                        clearHighlights(); // Clear any highlights
                        // Recalculate possible moves after removal
                        const filteredSolutions = filterSolutions(solutions, currentQueens);
                        if (row + 1 < n) { // Highlight for the next row if it exists
                            highlightValidMoves(filteredSolutions, row + 1);
                        }
                    } else if (currentQueens[row] === -1) { // If the square is empty
                        currentQueens[row] = col; // Place queen
                        this.innerHTML = '<img src="queen_img.png" alt="Queen">'; // Show the queen
                        const filteredSolutions = filterSolutions(solutions, currentQueens);
                        console.log("Filtered Solutions:", filteredSolutions); // Debugging: Check filtered solutions
                        if (row + 1 < n) { // Highlight for the next row if it exists
                            highlightValidMoves(filteredSolutions, row + 1);
                        } else {
                            clearHighlights(); // Clear highlights if it's the last row
                        }
                    }
                });
                chessboard.appendChild(square);
            }
        }
    });
}

initializeBoard();
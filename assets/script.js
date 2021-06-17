let board = [
  null, 0, null, 1, null, 2, null, 3, 
  4, null, 5, null, 6, null, 7, null, 
  null, 8, null, 9, null, 10, null, 11,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  12, null, 13, null, 14, null, 15, null,
  null, 16, null, 17, null, 18, null, 19, 
  20, null, 21, null, 22, null, 23, null
]

// Game variables 
const spaces = document.querySelectorAll(".dark-space");
let whiteTurn = true;
let selectedPieceId;
let whiteScore = 12;
let blackScore = 12;

function setUpBoard() {
  // Clear the board if not empty
  spaces.forEach(space => {
    if (space.firstChild) {
      space.firstChild.remove();
    }
  });
  // Set 12 black pieces
  for (let i = 0; i <= 11; i++) {
    const blackPiece = document.createElement("div");
    blackPiece.classList.add("black-piece", "piece");
    blackPiece.id = `piece-${i}`;
    blackPiece.setAttribute("onclick", "handlePieceSelect()");
    spaces[i].append(blackPiece);
  }
  // Set 12 white pieces
  for (let i = 20; i <= 31; i++) {
    const whitePiece = document.createElement("div");
    whitePiece.classList.add("white-piece", "piece");
    whitePiece.id = `piece-${i - 8}`;
    whitePiece.setAttribute("onclick", "handlePieceSelect()");
    spaces[i].append(whitePiece);
  }
}
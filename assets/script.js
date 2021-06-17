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
let whitePieces;
let blackPieces;
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
  blackPieces = document.querySelectorAll(".dark-piece");
  whitePieces = document.querySelectorAll(".white-piece");
  determineTurn();
}

// Set pointer styles of pieces depending on turn
function determineTurn() {
  if (whiteTurn) {
    for (let i = 0; i < whitePieces.length; i++) {
      if (whitePieces[i]) {
        whitePieces[i].style.cursor = "pointer";
      }
      if (blackPieces[i]) {
        blackPieces[i].style.cursor = "context-menu";
      }
    }
  } else {
    for (let i = 0; i < blackPieces.length; i++) {
      if (whitePieces[i]) {
        whitePieces[i].style.cursor = "context-menu";
      }
      if (blackPieces[i]) {
        blackPieces[i].style.cursor = "pointer";
      }
    }
  }
}

function handlePieceSelect() {
  selectedPieceId = parseInt(event.target.id.split("-")[1]);
  // If a white piece is selected on white's turn
  if (whiteTurn && event.target.classList.contains("white-piece")) {
    for (let i = 0; i < whitePieces.length; i++) {
      whitePieces[i].style.border = "none";
    }
    event.target.style.border = "3px solid red";
  // If a black piece is selected on black's turn
  } else if (!whiteTurn && event.target.classList.contains("black-piece")) {
    for (let i = 0; i < blackPieces.length; i++) {
      blackPieces[i].style.border = "none";
    }
    event.target.style.border = "3px solid red";
  } else {
    return;
  }
}

// Remove selected piece border on click away  
document.addEventListener("click", (event) => {
  if (!selectedPieceId) {
    return;
  }
  if (!event.target.matches("div") || event.target.id.split("-")[1] != selectedPieceId) {
    document.getElementById(`piece-${selectedPieceId}`).style.border = "none";
  }
})

setUpBoard();
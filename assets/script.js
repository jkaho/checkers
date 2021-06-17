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
let possibleMoves = [];
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
  determinePossibleMoves(selectedPieceId);
}

// Remove selected piece border on click away  
document.addEventListener("click", (event) => {
  if (!selectedPieceId) {
    return;
  }
  if (!event.target.matches("div") || event.target.id.split("-")[1] != selectedPieceId) {
    document.getElementById(`piece-${selectedPieceId}`).style.border = "none";
    removeWhiteOut();
  }
})

// Determine possible moves after piece selection
function determinePossibleMoves(pieceId) {
  const currentSpace = board.indexOf(pieceId);
  const currentRow = Math.ceil(currentSpace / 8);
  const selectedPiece = document.getElementById(`piece-${pieceId}`);
  possibleMoves = [];
  let opponent = "black";
  if (!whiteTurn) { opponent = "white" };
  // Determine moves for a king piece 
  if (selectedPiece.classList.contains("king")) {
    // If in row 1 
    if (currentRow === 1) {
      determineOnePossibleMove(currentSpace, 7, opponent);
      if (currentSpace !== 7) {
        determineOnePossibleMove(currentSpace, 9, opponent);
      }
    } else if (currentRow === 8) {
      determineOnePossibleMove(currentSpace, -7, opponent);
      if (currentSpace !== 56) {
        determineOnePossibleMove(currentSpace, -9, opponent);
      }
    } else {
      determineOnePossibleMove(currentSpace, 7, opponent);
      determineOnePossibleMove(currentSpace, 9, opponent);
      determineOnePossibleMove(currentSpace, -7, opponent);
      determineOnePossibleMove(currentSpace, -9, opponent);
    }
  } else {  
    if (selectedPiece.classList.contains("white-piece") && currentRow !== 1) {
      determineOnePossibleMove(currentSpace, -7, opponent);
      determineOnePossibleMove(currentSpace, -9, opponent);
    } else {
      determineOnePossibleMove(currentSpace, 7, opponent);
      determineOnePossibleMove(currentSpace, 9, opponent);
    }
  }
  // Remove light spaces from possible moves
  possibleMoves.forEach(move => {
    if (document.getElementById(`space-${move.spaceToJump}`).classList.contains("light-space")) {
      possibleMoves.splice(possibleMoves.indexOf(move), 1);
    }
  })
  // Alert if there are no moves for a piece
  if (!possibleMoves.length) {
    alert("This piece can't move!");
  } else {
    // Remove style on previously whited out spaces 
    removeWhiteOut();
    // White out spaces that piece can move to 
    possibleMoves.forEach(move => {
      let spaceToMoveTo = document.getElementById(`space-${move.spaceToJump}`);
      spaceToMoveTo.classList.add("possible-move");
      spaceToMoveTo.setAttribute("onclick", `handlePieceMove(${move.spaceToJump}, ${pieceId}, [${move.spacesToJumpOver}])`);
    })
  }
}

// Remove whited out effect on possible move spaces
function removeWhiteOut() {
  spaces.forEach(space => {
    space.classList.remove("possible-move");
  })
}

function determineOnePossibleMove(currentSpace, numOfSpacesToMove, opponent) {
  // Closest move 
  if (board[currentSpace + numOfSpacesToMove] === null) {
    possibleMoves.push({ 
      spaceToJump: currentSpace + numOfSpacesToMove, 
      spacesToJumpOver: []
    });
  // Possible jumps
  } else if (document.getElementById(`piece-${board[currentSpace + numOfSpacesToMove]}`).classList.contains(`${opponent}-piece`) 
    && board[currentSpace + (numOfSpacesToMove * 2)] === null) {
      possibleMoves.push({ 
        spaceToJump: currentSpace + (numOfSpacesToMove * 2), 
        spacesToJumpOver: [currentSpace + numOfSpacesToMove]
      });
    if (board[currentSpace + (numOfSpacesToMove * 3)] !== null 
    && document.getElementById(`piece-${board[currentSpace + (numOfSpacesToMove * 3)]}`).classList.contains(`${opponent}-piece`)) {
      if (board[currentSpace + (numOfSpacesToMove * 4)] === null) {
        possibleMoves.push({ 
          spaceToJump: currentSpace + (numOfSpacesToMove * 4), 
          spacesToJumpOver: [currentSpace + numOfSpacesToMove, currentSpace + (numOfSpacesToMove * 3)]
        });
      }
    }
    let num;
    if (numOfSpacesToMove === 7 || numOfSpacesToMove === -9) {
      num = 2;
    } else {
      num = -2;
    }
    if (board[currentSpace + (numOfSpacesToMove * 3 + num)] !== null 
    && document.getElementById(`piece-${board[currentSpace + (numOfSpacesToMove * 3 + 2)]}`).classList.contains(`${opponent}-piece`)) {
      if (board[currentSpace + (numOfSpacesToMove * 4 + 2(num))] === null) {
        possibleMoves.push({ 
          spaceToJump: currentSpace + (numOfSpacesToMove * 4 + 2(num)), 
          spacesToJumpOver: [currentSpace + numOfSpacesToMove, currentSpace + (numOfSpacesToMove * 3 + num)]
        });
      }
    }
  } 
}

function handlePieceMove(newSpaceId, selectedPieceId, spacesJumped) {
  // Remove onclick event from spaces
  spaces.forEach(space => {
    space.removeAttribute("onclick");
  })
  // Move piece to new position / update JS board
  board.splice(board.indexOf(selectedPieceId), 1, null); // Set prev space to null
  board.splice(newSpaceId, 1, selectedPieceId); // Set new space to selected piece id
  spacesJumped.forEach(space => {
    board.splice(space, 1, null); // Set space(s) with jumped opponents to null
  })
  // Move piece to new position / update DOM 
  const movedPiece = document.getElementById(`piece-${selectedPieceId}`);
  const newSpace = document.getElementById(`space-${newSpaceId}`);
  newSpace.append(movedPiece);
  spacesJumped.forEach(space => {
    document.getElementById(`space-${space}`).firstChild.remove();
  });
}

setUpBoard();
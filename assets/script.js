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

// DOM references
const spaces = document.querySelectorAll(".dark-space");
const whiteBox = document.getElementById("white-box");
const whitePiecesLeft = document.getElementById("white-pieces-left");
const piecesTakenByWhite = document.getElementById("white-pieces-taken");
const blackBox = document.getElementById("black-box");
const blackPiecesLeft = document.getElementById("black-pieces-left");
const piecesTakenByBlack = document.getElementById("black-pieces-taken");

// Game variables 
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
  blackPieces = document.querySelectorAll(".black-piece");
  whitePieces = document.querySelectorAll(".white-piece");
  determineTurn();
  updateTurnIndicator();
}

function updateTurnIndicator() {
  // Empty values 
  whitePiecesLeft.textContent = "";
  blackPiecesLeft.textContent = "";
  piecesTakenByWhite.textContent = "";
  piecesTakenByBlack.textContent = "";

  // Set new values 
  whitePiecesLeft.append(whiteScore);
  blackPiecesLeft.append(blackScore);
  piecesTakenByWhite.append(12 - blackScore);
  piecesTakenByBlack.append(12 - whiteScore);
}

// Set pointer styles of pieces depending on turn
function determineTurn() {
  if (whiteTurn) {
    whitePieces.forEach(whitePiece => { whitePiece.style.cursor = "pointer" })
    blackPieces.forEach(blackPiece => { blackPiece.style.cursor = "context-menu" })
    blackBox.classList.add("not-turn");
    whiteBox.classList.remove("not-turn");
  } else {
    blackPieces.forEach(blackPiece => { blackPiece.style.cursor = "pointer" })
    whitePieces.forEach(whitePiece => { whitePiece.style.cursor = "context-menu" })
    whiteBox.classList.add("not-turn");
    blackBox.classList.remove("not-turn");
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
  // const currentRow = Math.ceil(currentSpace / 8);
  const selectedPiece = document.getElementById(`piece-${pieceId}`);
  possibleMoves = [];
  let opponent = "black";
  if (!whiteTurn) { opponent = "white" };
  // Determine moves for a king piece 
  let moves;
  if (selectedPiece.classList.contains("king")) {
    moves = [7, 9, -7, -9];
  } else {
    if (selectedPiece.classList.contains("white-piece")) {
      moves = [-7, -9];
    } else {
      moves = [7, 9];
    }
  }
  determineOnePossibleMove(currentSpace, moves, opponent);
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
// // Determine possible moves after piece selection
// function determinePossibleMoves(pieceId) {
//   const currentSpace = board.indexOf(pieceId);
//   const currentRow = Math.ceil(currentSpace / 8);
//   const selectedPiece = document.getElementById(`piece-${pieceId}`);
//   possibleMoves = [];
//   let opponent = "black";
//   if (!whiteTurn) { opponent = "white" };
//   // Determine moves for a king piece 
//   if (selectedPiece.classList.contains("king")) {
//     // If in row 1 
//     if (currentRow === 1) {
//       determineOnePossibleMove(currentSpace, 7, opponent);
//       if (currentSpace !== 7) {
//         determineOnePossibleMove(currentSpace, 9, opponent);
//       }
//     } else if (currentRow === 8) {
//       determineOnePossibleMove(currentSpace, -7, opponent);
//       if (currentSpace !== 56) {
//         determineOnePossibleMove(currentSpace, -9, opponent);
//       }
//     } else {
//       determineOnePossibleMove(currentSpace, 7, opponent);
//       determineOnePossibleMove(currentSpace, 9, opponent);
//       determineOnePossibleMove(currentSpace, -7, opponent);
//       determineOnePossibleMove(currentSpace, -9, opponent);
//     }
//   } else {  
//     if (selectedPiece.classList.contains("white-piece") && currentRow !== 1) {
//       determineOnePossibleMove(currentSpace, -7, opponent);
//       determineOnePossibleMove(currentSpace, -9, opponent);
//     } else {
//       determineOnePossibleMove(currentSpace, 7, opponent);
//       determineOnePossibleMove(currentSpace, 9, opponent);
//     }
//   }
//   // Remove light spaces from possible moves
//   possibleMoves.forEach(move => {
//     if (document.getElementById(`space-${move.spaceToJump}`).classList.contains("light-space")) {
//       possibleMoves.splice(possibleMoves.indexOf(move), 1);
//     }
//   })
//   // Alert if there are no moves for a piece
//   if (!possibleMoves.length) {
//     alert("This piece can't move!");
//   } else {
//     // Remove style on previously whited out spaces 
//     removeWhiteOut();
//     // White out spaces that piece can move to 
//     possibleMoves.forEach(move => {
//       let spaceToMoveTo = document.getElementById(`space-${move.spaceToJump}`);
//       spaceToMoveTo.classList.add("possible-move");
//       spaceToMoveTo.setAttribute("onclick", `handlePieceMove(${move.spaceToJump}, ${pieceId}, [${move.spacesToJumpOver}])`);
//     })
//   }
// }

// Remove whited out effect on possible move spaces
function removeWhiteOut() {
  spaces.forEach(space => {
    space.classList.remove("possible-move");
  })
}

function determineOnePossibleMove(currentSpace, moves, opponent) {
  console.log(moves)
  moves.forEach(move => {
    // If diagonal space is within board and unoccupied
    console.log(board[currentSpace + move])
    if (currentSpace + move > 0 && currentSpace + move < 63) {
      if (board[currentSpace + move] === null) {
        possibleMoves.push({ 
          spaceToJump: currentSpace + move, 
          spacesToJumpOver: []
        });
      // If diagonal space is occupied by an opponent, check for jumps
      } else if (board[currentSpace + move] !== null
        && document.getElementById(`piece-${board[currentSpace + move]}`).classList.contains(`${opponent}-piece`)) {
        determinePossibleJumps(currentSpace, move);
      }
    }
  })
}

function checkAdjacentSpaces(currentSpace, move) {
  if (currentSpace + move > 0 && 
    currentSpace + move < 63 &&  
    board[currentSpace + move] === null) {
    possibleMoves.push({ 
      spaceToJump: currentSpace + move, 
      spacesToJumpOver: []
    });
  }
}

function determinePossibleJumps(currentSpace, move) {
  // while condition 
  // If next space is on the board and unoccupied
  if (board[currentSpace + (move * 2)] === null &&
  currentSpace + (move * 2) > 0 &&
  currentSpace + (move * 2) < 63) {
    possibleMoves.push({ 
      spaceToJump: currentSpace + (move * 2), 
      spacesToJumpOver: [currentSpace + move]
    });
    // Check surrounding spaces
    checkAdjacentSpaces(currentSpace, move);
  } 
}
// function determineOnePossibleMove(currentSpace, numOfSpacesToMove, opponent) {
//   // Closest move 
//   if (board[currentSpace + numOfSpacesToMove] === null) {
//     possibleMoves.push({ 
//       spaceToJump: currentSpace + numOfSpacesToMove, 
//       spacesToJumpOver: []
//     });
//   // Possible jumps
//   } else if (document.getElementById(`piece-${board[currentSpace + numOfSpacesToMove]}`).classList.contains(`${opponent}-piece`) 
//     && board[currentSpace + (numOfSpacesToMove * 2)] === null) {
//       possibleMoves.push({ 
//         spaceToJump: currentSpace + (numOfSpacesToMove * 2), 
//         spacesToJumpOver: [currentSpace + numOfSpacesToMove]
//       });
//     if (board[currentSpace + (numOfSpacesToMove * 3)] !== null 
//     && document.getElementById(`piece-${board[currentSpace + (numOfSpacesToMove * 3)]}`).classList.contains(`${opponent}-piece`)) {
//       if (board[currentSpace + (numOfSpacesToMove * 4)] === null) {
//         possibleMoves.push({ 
//           spaceToJump: currentSpace + (numOfSpacesToMove * 4), 
//           spacesToJumpOver: [currentSpace + numOfSpacesToMove, currentSpace + (numOfSpacesToMove * 3)]
//         });
//       }
//     }
//     let num;
//     if (numOfSpacesToMove === 7 || numOfSpacesToMove === -9) {
//       num = 2;
//     } else {
//       num = -2;
//     }
//     if (board[currentSpace + (numOfSpacesToMove * 3 + num)] !== null 
//     && document.getElementById(`piece-${board[currentSpace + (numOfSpacesToMove * 3 + num)]}`).classList.contains(`${opponent}-piece`)) {
//       if (board[currentSpace + (numOfSpacesToMove * 4 + (num * 2))] === null) {
//         possibleMoves.push({ 
//           spaceToJump: currentSpace + (numOfSpacesToMove * 4 + (num * 2)), 
//           spacesToJumpOver: [currentSpace + numOfSpacesToMove, currentSpace + (numOfSpacesToMove * 3 + num)]
//         });
//       }
//     }
//   } 
// }

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
  // Determine whether or not the moved piece has reached the other side of the board
  if (!movedPiece.classList.contains("king")) {
    if (movedPiece.classList.contains("white-piece")) {
      if (newSpaceId >= 0 && newSpaceId <= 7) {
        movedPiece.classList.add("king");
        crownPiece(selectedPieceId);
      }
    } else {
      if (newSpaceId >= 56 && newSpaceId <= 63) {
        movedPiece.classList.add("king");
        crownPiece(selectedPieceId);
      }
    }
  }
  // Determine score and check for winner
  checkScore();
  if (whiteTurn) {
    if (blackScore === 0) {
      alert("White wins!");
    }
  } else {
    if (whiteScore === 0) {
      alert("Black wins!");
    }
  }
  switchTurns();
  determineTurn();
  updateTurnIndicator();
}

// Determine num of opponent pieces left
function checkScore() {
  if (whiteTurn) {
    blackScore = document.querySelectorAll(".black-piece").length;
  } else {
    whiteScore = document.querySelectorAll(".white-piece").length;
  }
}

function switchTurns() {
  if (whiteTurn) {
    whiteTurn = false;
  } else {
    whiteTurn = true;
  }
}

// Change colour of piece if it becomes king
function crownPiece(selectedPieceId) {
  const pieceToCrown = document.getElementById(`piece-${selectedPieceId}`);
  if (pieceToCrown.classList.contains("black-piece")) {
    pieceToCrown.style.background = "blue";
  } else {
    pieceToCrown.style.background = "green";
  }
}

setUpBoard();
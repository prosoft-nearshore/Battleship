/// <reference path="AI.Core.js" />
/// <reference path="Battleship.Core.js" />

function fireboat() { }
AI.subClass(fireboat);

fireboat.prototype.setupBoard = function setupBoard(ships) {
    var board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        placements = [],
        myShips = [],
        currentShip,
        placeVertical,
        xBoardLength, yBoardLength,
        valid,
        x, y,
        start, end,
        i, j;

    // ships = 2, 3, 3, 4, 5
    for (i = 0; i < ships.length; i++) {
        myShips.push(ships[i]);
    }

    // place the longest ship remaining randomly
    while (myShips.length > 0) {
        currentShip = 0;
        for (i = 0; i < myShips.length; i++) {
            currentShip = Math.max(currentShip, myShips[i]);
        }
        myShips.splice(myShips.indexOf(currentShip), 1);

        // decide whether to place ship vertically or horizontally
        placeVertical = Math.floor(Math.random() * 2);
        xBoardLength = 10;
        yBoardLength = 10;

        if (placeVertical) yBoardLength -= (currentShip - 1);
        else xBoardLength -= (currentShip - 1);

        // try placing the ship 5 times before giving up
        for (i = 0; i < 5; i++) {
            valid = true;

            x = Math.floor(Math.random() * xBoardLength);
            y = Math.floor(Math.random() * yBoardLength);

            start = new Battleship.Point(x, y);

            for (j = 0; j < currentShip; j++) {
                if (placeVertical) {
                    if (board[x][y + j] === 1) valid = false;
                } else {
                    if (board[x + j][y] === 1) valid = false;
                }
            }

            if (valid) {
                if (placeVertical) end = new Battleship.Point(x, y + j - 1);
                else end = new Battleship.Point(x + j - 1, y);

                for (j = 0; j < currentShip; j++) {
                    if (placeVertical) board[x][y + j] = 1;
                    else board[x + j][y] = 1;
                }

                placements.push(new Battleship.Placement(start, end));
                break;
            }
        }

        if (!valid) {
            throw new Error("Failed to place all pieces!");
        }
    }

    return placements;
};

fireboat.myPreviousLastMove = null;
fireboat.myLastMove = null;

fireboat.prototype.fire = function fire(myMoves, theirMoves) {
  try {
    console.log('Playing turn ' + (myMoves.length + 1));

    var myMovesBoard = [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null]
    ];

    var isWaterOrSunkHit = function(x, y) {
      return myMovesBoard[x][y] != null && (!myMovesBoard[x][y].isHit || myMovesBoard[x][y].isSunk);
    };
    var isUnsunkHit = function(x, y) {
      return myMovesBoard[x][y] != null && myMovesBoard[x][y].isHit && !myMovesBoard[x][y].isSunk;
    };
    var isThereMove = function (x, y) {
      return myMovesBoard[x][y] != null;
    };
    var getMovementByRowAndColumn = function(moves, x, y) {
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].x == x && moves[i].y == y)
          return moves[i];
      }
      return null;
    };

    var board = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    // raise scores on zigzag
    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        if ((x % 2 == 0 && y % 2 == 1)
          || (x % 2 == 1 && y % 2 == 0))
          board[x][y] += 0.5;
      }
    }

    for (var myMoveIdx = 0; myMoveIdx < myMoves.length; myMoveIdx++) {
      var myMove = myMoves[myMoveIdx];
      myMovesBoard[myMove.x][myMove.y] = myMove;
      // cancel all spots that i've already played (hit or water)
      board[myMove.x][myMove.y] = -1000000;

      // raise score if next to a hit that is not sunk
      if (myMove.isHit && !myMove.isSunk) {
        if (myMove.x > 0) board[myMove.x - 1][myMove.y] += 1;
        if (myMove.x < 9) board[myMove.x + 1][myMove.y] += 1;
        if (myMove.y > 0) board[myMove.x][myMove.y - 1] += 1;
        if (myMove.y < 9) board[myMove.x][myMove.y + 1] += 1;
      }
    }

    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        // rule out spots of length 1
        if ((x == 0 || isWaterOrSunkHit(x - 1, y))
          && (x == 9 || isWaterOrSunkHit(x + 1, y))
          && (y == 0 || isWaterOrSunkHit(x, y - 1))
          && (y == 9 || isWaterOrSunkHit(x, y + 1))) {
          board[x][y] = -1000000;
          continue;
        }

        // further raise score if 2 hits in a row (that are not sunk)
        if (isUnsunkHit(x, y)) {
          if (x > 0 && x < 9 && isUnsunkHit(x + 1, y)) board[x - 1][y] += 1;
          if (x > 0 && x < 9 && isUnsunkHit(x - 1, y)) board[x + 1][y] += 1;
          if (y > 0 && y < 9 && isUnsunkHit(x, y + 1)) board[x][y - 1] += 1;
          if (y > 0 && y < 9 && isUnsunkHit(x, y - 1)) board[x][y + 1] += 1;
        }
      }
    }


    // get previous move of last move
    var previousLastMove;
    if (fireboat.myPreviousLastMove != null) {
      previousLastMove = getMovementByRowAndColumn(myMoves, fireboat.myPreviousLastMove.x, fireboat.myPreviousLastMove.y);
    }

    // get last move
    var lastMove;
    if (fireboat.myLastMove != null) {
      lastMove = getMovementByRowAndColumn(myMoves, fireboat.myLastMove.x, fireboat.myLastMove.y);
    }

    // add points to near points previous last move
    if (previousLastMove != null && previousLastMove.isHit && !previousLastMove.isSunk) {
      if (previousLastMove.x > 0 && !isThereMove(previousLastMove.x - 1, previousLastMove.y))
        board[previousLastMove.x - 1][previousLastMove.y] += 1;
      if (previousLastMove.x < 9 && !isThereMove(previousLastMove.x + 1, previousLastMove.y))
        board[previousLastMove.x + 1][previousLastMove.y] += 1;
      if (previousLastMove.y > 0 && !isThereMove(previousLastMove.x, previousLastMove.y - 1))
        board[previousLastMove.x][previousLastMove.y - 1] += 1;
      if (previousLastMove.y < 9 && !isThereMove(previousLastMove.x, previousLastMove.y + 1))
        board[previousLastMove.x][previousLastMove.y + 1] += 1;
    }

    if (previousLastMove != null && lastMove != null
      && !lastMove.isHit && previousLastMove.isHit && !previousLastMove.isSunk) {
      if (lastMove.x == previousLastMove.x) {
        if (previousLastMove.y > 0 && !isThereMove(previousLastMove.x, previousLastMove.y - 1))
          board[previousLastMove.x][previousLastMove.y - 1] += 1;
        if (previousLastMove.y < 9 && !isThereMove(previousLastMove.x, previousLastMove.y + 1))
          board[previousLastMove.x][previousLastMove.y + 1] += 1;
      } else {
        if (previousLastMove.x > 0 && !isThereMove(previousLastMove.x - 1, previousLastMove.y))
          board[previousLastMove.x - 1][previousLastMove.y] += 1;
        if (previousLastMove.x < 9 && !isThereMove(previousLastMove.x + 1, previousLastMove.y))
          board[previousLastMove.x + 1][previousLastMove.y] += 1;
      }
    }

    // Check two previous moves
    if (lastMove != null && previousLastMove != null
      && lastMove.isHit && !lastMove.isSunk && previousLastMove.isHit && !previousLastMove.isSunk) {
      if (lastMove.x == previousLastMove.x) {
        if (lastMove.y < 9 && !isThereMove(lastMove.x, lastMove.y + 1))
          board[lastMove.x][lastMove.y + 1] += 2;
        if (lastMove.y > 0 && !isThereMove(lastMove.x, lastMove.y - 1))
          board[lastMove.x][lastMove.y - 1] += 2;
        if (previousLastMove.y < 9 && !isThereMove(previousLastMove.x, previousLastMove.y + 1))
          board[previousLastMove.x][previousLastMove.y + 1] += 2;
        if (previousLastMove.y > 0 && !isThereMove(previousLastMove.x, previousLastMove.y - 1))
          board[previousLastMove.x][previousLastMove.y - 1] += 2;
      } else {
        if (lastMove.x < 9 && !isThereMove(lastMove.x + 1, lastMove.y))
          board[lastMove.x + 1][lastMove.y] += 2;
        if (lastMove.x > 0 && !isThereMove(lastMove.x - 1, lastMove.y))
          board[lastMove.x - 1][lastMove.y] += 2;
        if (previousLastMove.x < 9 && !isThereMove(previousLastMove.x + 1, previousLastMove.y))
          board[previousLastMove.x + 1][previousLastMove.y] += 2;
        if (previousLastMove.x > 0 && !isThereMove(previousLastMove.x - 1, previousLastMove.y))
          board[previousLastMove.x - 1][previousLastMove.y] += 2;
      }
    }

    // find highest scores and randomly pick from highest scores
    //console.log('   finding highest score...');
    var highest = {
      score: 0.0,
      coordinates: [{ x: 0, y: 0 }]
    };
    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        if (board[x][y] > highest.score) {
          highest.coordinates = [];
          highest.score = board[x][y];
        }
        if (board[x][y] >= highest.score) {
          highest.coordinates.push({ x: x, y: y });
        }
      }
    }

    console.log(highest.coordinates.length + ' moves with highest score ' + highest.score);
    var highestPoint = highest.coordinates[Math.floor((Math.random() * 100) % highest.coordinates.length)];
    console.log('Playing (' + highestPoint.x + ',' + highestPoint.y + ')');

    if (fireboat.myLastMove != null) {
      fireboat.myPreviousLastMove = new Battleship.Point(fireboat.myLastMove.x, fireboat.myLastMove.y);
    }

    fireboat.myLastMove = new Battleship.Point(highestPoint.x, highestPoint.y);

    return new Battleship.Point(highestPoint.x, highestPoint.y);
  } catch (e) {
    console.log('Error!!');
    console.log(e);
    throw e;
  }
};
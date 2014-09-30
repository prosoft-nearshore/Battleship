/// <reference path="Battleship.Core.js" />

function E1v2 () { };

E1v2.prototype.setupBoard = function setupBoard(ships) {
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

E1v2.prototype.fire = function fire(myMoves, theirMoves) {
    if (!myMoves || !myMoves.length) {
        return new Battleship.Point(0, 0);
    }

    var myLastMove = myMoves[myMoves.length - 1],
        myNewMove = new Battleship.Point(0, 0);

    if (myLastMove.x !== 9 && myLastMove.y !== 9) {
        myNewMove.x = myLastMove.x + 1;
        myNewMove.y = myLastMove.y;
    }
    else if (myLastMove.x === 9 && myLastMove.y !== 9) {
        myNewMove.x = 0;
        myNewMove.y = myLastMove.y + 1;
    }
    else if (myLastMove.y === 9 && myLastMove.x !== 9) {
        myNewMove.x = myLastMove.x + 1;
        myNewMove.y = myLastMove.y;
    }

    return myNewMove;

};

AI.subClass = function subClass(obj) {
    obj.prototype = new AI();
};
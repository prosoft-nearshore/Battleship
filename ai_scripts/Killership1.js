/// <reference path="AI.Core.js" />
/// <reference path="Battleship.Core.js" />

function Killership1() { }
AI.subClass(Killership1);

Killership1.prototype.setupBoard = function setupBoard(ships) {
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

Killership1.prototype.getDefaultMove = function getDefaultMove(myMoves, theirMoves) {
    return Math.floor(Math.random() * this._openMoves.length);
}

Killership1.prototype.getNextValidMove = function getNextValidMove(myMoves, theirMoves, myLastMove) {
    for (var i = 0; i <= 3; i++) {
        var x = myLastMove.x + this._directions[i][0];
        var y = myLastMove.y + this._directions[i][1];
        for (var j = 0; j < this._openMoves.length; j++) {
           if(x == this._openMoves[j].x && y == this._openMoves[j].y){
               return j;
           }
        }
    }
    return -1;
}

Killership1.prototype.getNextMoveHit = function getNextMoveHit(myMoves, theirMoves, myLastMove) {
    var index = this.getNextValidMove(myMoves, theirMoves, myLastMove);
    if (index != -1 ){
        return index;
    }
    return this.getDefaultMove(myMoves, theirMoves);
    //return Math.floor(Math.random() * this._openMoves.length);
}

Killership1.prototype.getNextMove = function getNextMove(myMoves, theirMoves) {
    if(!myMoves || myMoves.length == 0){
        return this.getDefaultMove(myMoves, theirMoves);
    }
    var myLastMove = myMoves[myMoves.length - 1];

    if(myLastMove.isHit){
        return this.getNextMoveHit(myMoves, theirMoves, myLastMove);
    }
    return this.getDefaultMove(myMoves, theirMoves);
}

Killership1.prototype.fire = function fire(myMoves, theirMoves) {

    var i, j,
        moveIndex,
        move;

    if (!myMoves || !myMoves.length) {
        this._openMoves = [];
        this._directions = [[0,-1],[1,0],[0,1],[-1,0]];
        for (i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++) {
                this._openMoves.push(new Battleship.Point(i, j));
            }
        }
    }

    moveIndex = this.getNextMove(myMoves, theirMoves);
   //moveIndex = Math.floor(Math.random() * this._openMoves.length);
    move = this._openMoves[moveIndex];

    this._openMoves.splice(moveIndex, 1);

   return move;

};
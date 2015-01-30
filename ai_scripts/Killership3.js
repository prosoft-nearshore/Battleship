/// <reference path="AI.Core.js" />
/// <reference path="Battleship.Core.js" />

function Killership3() { }
AI.subClass(Killership3);

Killership3.prototype.setupBoard = function setupBoard(ships) {
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

Killership3.prototype.getDefaultMove = function getDefaultMove(myMoves, theirMoves) {
    return Math.floor(Math.random() * this._openMoves.length);
}

Killership3.prototype.getNextValidMove = function getNextValidMove(myMoves, theirMoves, myLastMove) {
    for (var i = 0; i <= 3; i++) {
        var index = this.followDir(myMoves, theirMoves, myLastMove, i);

        if (index != -1) {
            return index;
        }
    }
    return -1;
}

Killership3.prototype.followDir = function followDir(myMoves, theirMoves, myLastMove, myDir) {
    var x = myLastMove.x + this._directions[myDir][0];
    var y = myLastMove.y + this._directions[myDir][1];
    for (var j = 0; j < this._openMoves.length; j++) {
       if(x == this._openMoves[j].x && y == this._openMoves[j].y){
           return j;
       }
    }
    
    return -1;
}

Killership3.prototype.getNextDir = function getNextDir(myMoves, theirMoves, myLastMove, dir) {
    return dir < 3 ? dir + 1 : 0;
}

Killership3.prototype.getOpDir = function getOpDir(dir) {
    switch (dir) {
        case 0 :
            return 2;
        case 1 :
            return 3;
        case 2:
            return 0;
        case 3:
            return 1;
    }

    // This should never being hit
    return 0;
}

Killership3.prototype.getNextMoveHit = function getNextMoveHit(myMoves, theirMoves, myLastMove) {
    var index = this.followDir(myMoves, theirMoves, myLastMove, this._prevDir);
    console.log('info1:' + index);
    //var index = this.getNextValidMove(myMoves, theirMoves, myLastMove);
    if (index != -1) {
        return index;
    } else {

        // try going back from the first hit in the opposite direction
        var localDir = this.getOpDir(this._firstDir);
        index = this.followDir(myMoves, theirMoves, this._firstHit, localDir);
        console.log('info2:' + index);

        if (index != -1) {
            this._prevDir = localDir;
            this._firstDir = localDir;
            return index;
        }

        localDir = this._prevDir;
        for (i = 0; i < 4; i++) {
            console.log('localDir' + localDir);
            localDir = this.getNextDir(myMoves, theirMoves, this._firstHit, localDir);
            index = this.followDir(myMoves, theirMoves, this._firstHit, localDir);
            console.log('info3:' + index);
            if (index != -1) {
                this._prevDir = localDir;
                return index;
            }
        }
    }

    this.initDir();
    return this.getDefaultMove(myMoves, theirMoves);
    //return Math.floor(Math.random() * this._openMoves.length);
}

Killership3.prototype.initDir = function initDir() {
    this._prevDir = 0;
    this._firstHit = undefined;
    this._firstDir = 0;
}

Killership3.prototype.getNextMove = function getNextMove(myMoves, theirMoves) {
    if(!myMoves || myMoves.length == 0){
        this.initDir();
        return this.getDefaultMove(myMoves, theirMoves);
    }
    var myLastMove = myMoves[myMoves.length - 1];

    if(myLastMove.isHit && !myLastMove.isSunk){
        if (typeof this._firstHit === "undefined") {
            this._firstHit = myLastMove;
            this._firstDir = this._prevDir;
        }
        console.log('info0:' + myLastMove);
        return this.getNextMoveHit(myMoves, theirMoves, myLastMove);
    }

    if (typeof this._firstHit !== "undefined") {
        var index = this.getNextMoveHit(myMoves, theirMoves, this._firstHit);
        if (index != -1) {
            return index;
        }
    }

    this.initDir();
    return this.getDefaultMove(myMoves, theirMoves);
}

Killership3.prototype.fire = function fire(myMoves, theirMoves) {

    var i, j,
        moveIndex,
        move;

    if (!myMoves || !myMoves.length) {
        this._openMoves = [];
        this.initDir();
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
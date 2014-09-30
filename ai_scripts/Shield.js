/// <reference path="AI.Core.js" />
/// <reference path="Battleship.Core.js" />

function Shield() { }
AI.subClass(Shield);

Shield.prototype.setupBoard = function setupBoard(ships) {
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


function trackingShip(dir){
    this.direction = -1;
}

Shield.prototype.fire = function fire(myMoves, theirMoves) {
    var i, j,
        moveIndex,
        move;

    if (!myMoves || !myMoves.length) {
        this._openMoves = [];
        this._trackingShip = false;
        for (i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++) {
                this._openMoves.push(new Battleship.Point(i, j));
            }
        }
    }


    if(myMoves && myMoves.length > 0 && (this._trackingShip || (myMoves[myMoves.length-1].isHit && !(myMoves[myMoves.length-1].isSunk))))
    {
        lastMove = myMoves[myMoves.length-1];
        refMove = lastMove;

        if(this._trackingShip){

            if(!refMove.isHit){
                for (i = myMoves.length-1; i >= 0; i--){
                        if(myMoves[i].isHit){
                            refMove = myMoves[i];
                            break;
                        }
                }
                this._trackingShip = new trackingShip(-1);
            }

            if(refMove.isHit){
                nextPoint = findNextMove(myMoves, refMove, this._trackingShip)
                if(nextPoint){
                    move = findMove(this._openMoves, nextPoint.x, nextPoint.y);
                }
            }
        }
        else{
          
            this._trackingShip = new trackingShip(-1);
            nextPoint = findNextMove(myMoves, refMove, this._trackingShip)
            if(nextPoint){
                move = findMove(this._openMoves, nextPoint.x, nextPoint.y);
            }
        }

    }

    if(move){}
    else {

        moveIndex = Math.floor(Math.random() * this._openMoves.length);
        move = this._openMoves[moveIndex];
        this._openMoves.splice(moveIndex, 1);
    }

    return move;
};

function findMove(myMoves, x, y) {

    for (i = 0; i < myMoves.length-1; i++){
        move = myMoves[i];

        if(move.x == x && move.y == y)
            return move
    }

    return false;
}

function findNextMove(myMoves, refMove, trackingShip){

    if((trackingShip.direction == -1 || trackingShip.direction == 0)  && refMove.x > 0 && !findMove(myMoves, refMove.x -1, refMove.y)){
        nextMove = new Battleship.Point(refMove.x -1, refMove.y);
        trackingShip.direction = 0;
    }
    else if((trackingShip.direction == -1 || trackingShip.direction == 1)  && refMove.y > 0 && !findMove(myMoves, refMove.x, refMove.y - 1)){
        nextMove = new Battleship.Point(refMove.x, refMove.y - 1);
        trackingShip.direction = 1;
    }
    else if((trackingShip.direction == -1 || trackingShip.direction == 2)  && refMove.x <  9 && !findMove(myMoves, refMove.x + 1, refMove.y)){
        nextMove = new Battleship.Point(refMove.x + 1, refMove.y);
        trackingShip.direction = 2;
    }
    else if((trackingShip.direction == -1 || trackingShip.direction == 3)  && refMove.y < 9 && !findMove(myMoves, refMove.x, refMove.y + 1)){
        nextMove = new Battleship.Point(refMove.x, refMove.y + 1);
        trackingShip.direction = 3;
    }
    else
        return null

    return nextMove;
}
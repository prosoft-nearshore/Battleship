/// <reference path="AI.Core.js" />
/// <reference path="Battleship.Core.js" />

function noname() { }
AI.subClass(noname);

noname.prototype.setupBoard = function setupBoard(ships) {
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


function canGoUp(x,y)
{
	return (y>0);
}

function canGoLeft(x,y)
{
	return (x>0);
}

function canGoRight(x,y)
{
	return (x<9);
}

function canGoDown(x,y)
{
	return (y<9);
}

function isInOpenMoves(x,y,defaultValue, openMoves)
{
	for(c=0; c<openMoves.length-1;c++){
		if (openMoves[c].x == x && openMoves[c].y == y){
			return c;
		}
	}
	return defaultValue;
}

noname.prototype.fire = function fire(myMoves, theirMoves) {
    var i, j,
        moveIndex,
        move;

    if (!myMoves || !myMoves.length) {
        this._openMoves = [];
        for (i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++) {
                this._openMoves.push(new Battleship.Point(i, j));
            }
        }
    }
    moveIndex = Math.floor(Math.random() * this._openMoves.length);

	if(myMoves.length > 0)
	{	
		console.log(myMoves[myMoves.length-1].isHit);
		if(myMoves[myMoves.length-1].isHit)
		{
			if (canGoUp){
				var y= myMoves[myMoves.length-1].y - 1;
				var x=myMoves[myMoves.length-1].x;
				moveIndex = isInOpenMoves(x,y,moveIndex,this._openMoves);
			}
			if (canGoDown){
				var y= myMoves[myMoves.length-1].y + 1;
				var x=myMoves[myMoves.length-1].x;
				moveIndex = isInOpenMoves(x,y,moveIndex,this._openMoves);
			}
			if (canGoLeft){
				var y= myMoves[myMoves.length-1].y;
				var x=myMoves[myMoves.length-1].x-1;
				moveIndex = isInOpenMoves(x,y,moveIndex,this._openMoves);
			}
			if (canGoRight){
				var y= myMoves[myMoves.length-1].y;
				var x=myMoves[myMoves.length-1].x+1;
				moveIndex = isInOpenMoves(x,y,moveIndex,this._openMoves);
			}
		}
	}

    move = this._openMoves[moveIndex];
	
	

    this._openMoves.splice(moveIndex, 1);
	
	

    return move;
};
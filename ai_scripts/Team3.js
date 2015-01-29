/// <reference path="AI.Core.js" />
/// <reference path="Battleship.Core.js" />

function Team3() { }
AI.subClass(Team3);

Team3.prototype.setupBoard = function setupBoard(ships) {
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

Team3.prototype.fire = function fire(myMoves, theirMoves) {
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
		var isWaterOrSunkHit = function (x, y) {
			return myMovesBoard[x][y] != null && (!myMovesBoard[x][y].isHit || myMovesBoard[x][y].isSunk);
		};
		var isUnsunkHit = function (x, y) {
			return myMovesBoard[x][y] != null && myMovesBoard[x][y].isHit && !myMovesBoard[x][y].isSunk;
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


		var attack = ["4,4","5,3","3,3","3,5","5,5","6,4","6,2","4,2","2,2","2,4","2,6","4,6","6,6","5,7","3,7","1,7","1,5","1,3","1,1","3,1","5,1","7,1","7,3","7,5","7,7","6,8","4,8","2,8","0,8","0,6"
		,"0,4","0,2","0,0","2,0","4,0","6,0","8,0","8,2","8,4","8,6","8,8","7,9","5,9","3,9","1,9","9,1","9,3","9,5","9,7","9,9"];


		// raise scores on zigzag
		for (var x = 0; x < 10; x++) {
			for (var y = 0; y < 10; y++) {

				for(var i = 0;i < 49;i++)
				{
					board[atack[i].split(',')[0]][atack[i].split(',')[1]] += 0.5;
				}
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
				if ((x == 0 || isWaterOrSunkHit(x-1,y))
					&& (x == 9 || isWaterOrSunkHit(x+1,y))
					&& (y == 0 || isWaterOrSunkHit(x,y-1))
					&& (y == 9 || isWaterOrSunkHit(x,y+1))) {
					board[x][y] = -1000000;
					continue;
				}

				// further raise score if 2 hits in a row (that are not sunk)
				if (isUnsunkHit(x,y)) {
					if (x > 0 && x < 9 && isUnsunkHit(x + 1,y)) board[x - 1][y] += 1;
					if (x > 0 && x < 9 && isUnsunkHit(x - 1,y)) board[x + 1][y] += 1;
					if (y > 0 && y < 9 && isUnsunkHit(x,y + 1)) board[x][y - 1] += 1;
					if (y > 0 && y < 9 && isUnsunkHit(x,y - 1)) board[x][y + 1] += 1;
				}
			}
		}

		// find highest scores and randomly pick from highest scores
		//console.log('   finding highest score...');
		var highest = {
			score: 0.0,
			coordinates: [{x: 0, y: 0}]
		};
		for (var x = 0; x < 10; x++) {
			for (var y = 0; y < 10; y++) {
				if (board[x][y] > highest.score) {
					highest.coordinates = [];
					highest.score = board[x][y];
				}
				if (board[x][y] >= highest.score) {
					highest.coordinates.push({x: x, y: y});
				}
			}
		}
		console.log(highest.coordinates.length + ' moves with highest score ' + highest.score);
		var highestPoint = highest.coordinates[Math.floor((Math.random() * 100) % highest.coordinates.length)];
		console.log('Playing (' + highestPoint.x + ',' + highestPoint.y + ')');
		return new Battleship.Point(highestPoint.x, highestPoint.y);
	} catch (e) {
		console.log('Error!!');
		console.log(e);
		throw e;
	}
};
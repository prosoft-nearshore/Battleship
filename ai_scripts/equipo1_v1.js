/// <reference path="AI.Core.js" />
/// <reference path="Battleship.Core.js" />

function equipo1_v1() { }
AI.subClass(equipo1_v1);

equipo1_v1.prototype.setupBoard = function setupBoard(ships) {
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
    // while (myShips.length > 0) {
    //     currentShip = 0;
    //     for (i = 0; i < myShips.length; i++) {
    //         currentShip = Math.max(currentShip, myShips[i]);
    //     }
    //     myShips.splice(myShips.indexOf(currentShip), 1);


        // // decide whether to place ship vertically or horizontally
        // placeVertical = Math.floor(Math.random() * 2);
        // xBoardLength = 10;
        // yBoardLength = 10;

        // if (placeVertical) yBoardLength -= (currentShip - 1);
        // else xBoardLength -= (currentShip - 1);

        // try placing the ship 5 times before giving up
        // for (i = 0; i < 5; i++) {
        //     valid = true;

        //     x = Math.floor(Math.random() * xBoardLength);
        //     y = Math.floor(Math.random() * yBoardLength);

        //     start = new Battleship.Point(x, y);

        //     for (j = 0; j < currentShip; j++) {
        //         if (placeVertical) {
        //             if (board[x][y + j] === 1) valid = false;
        //         } else {
        //             if (board[x + j][y] === 1) valid = false;
        //         }
        //     }

        //     if (valid) {
        //         if (placeVertical) end = new Battleship.Point(x, y + j - 1);
        //         else end = new Battleship.Point(x + j - 1, y);

        //         for (j = 0; j < currentShip; j++) {
        //             if (placeVertical) board[x][y + j] = 1;
        //             else board[x + j][y] = 1;
        //         }

        //         placements.push(new Battleship.Placement(start, end));
        //         break;
        //     }
        // }

    //     if (!valid) {
    //         throw new Error("Failed to place all pieces!");
    //     }

    // }
placements.push(new Battleship.Placement(new Battleship.Point(1, 1), new Battleship.Point(1, 5)));
placements.push(new Battleship.Placement(new Battleship.Point(4, 1), new Battleship.Point(4, 4)));
placements.push(new Battleship.Placement(new Battleship.Point(7, 1), new Battleship.Point(7, 3)));
placements.push(new Battleship.Placement(new Battleship.Point(2, 7), new Battleship.Point(4, 7)));
placements.push(new Battleship.Placement(new Battleship.Point(7, 5), new Battleship.Point(8, 5)));

    return placements;
};

equipo1_v1.prototype.fire = function fire(myMoves, theirMoves) {
    try {
        console.log('Playing turn ' + (myMoves.length + 1));
        
        // coordinate board of my previous moves for quick reference
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
        // helper function to determine if a coordinate is (confirmed) Water or a Hit that sank a boat
        var isWaterOrSunkHit = function (x, y) {
            return myMovesBoard[x][y] != null && (!myMovesBoard[x][y].isHit || myMovesBoard[x][y].isSunk);
        };
        // helper function to determine if a coordinate is a hit that didn't yet sink a boat
        var isUnsunkHit = function (x, y) {
            return myMovesBoard[x][y] != null && myMovesBoard[x][y].isHit && !myMovesBoard[x][y].isSunk;
        };

        // weight scores board
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
            
        // raise scores on zigzag (intermitent coords)
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                if ((x % 2 == 0 && y % 2 == 1)
                    || (x % 2 == 1 && y % 2 == 0))
                    board[x][y] += 0.5;
            }
        }
        
        // loop and analyze my previous moves
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
        
        // loop thru my previous moves to apply further rules
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                // rule out spots of size 1
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
        // pick random point from set of highest scores
        var highestPoint = highest.coordinates[Math.floor((Math.random() * 100) % highest.coordinates.length)];
        console.log('Playing (' + highestPoint.x + ',' + highestPoint.y + ')');
        return new Battleship.Point(highestPoint.x, highestPoint.y);
    } catch (e) {
        console.log('Error!!');
        console.log(e);
        throw e;
    }
};
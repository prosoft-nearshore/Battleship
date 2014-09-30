function Pescador() { }
AI.subClass(Pescador);
 
Pescador.prototype.setupBoard = function setupBoard(ships) {
	
	var placements = [];
	var yPositionsSet = [];
	
	for (i = 0; i < ships.length; i++) {
		console.log("Ships to allocate "+ships[i]);
		var pickedCol = 0;
		var alreadyPicked = true;		
		
		while(alreadyPicked)
		{
			alreadyPicked = false;
			pickedCol = Math.floor(Math.random() * 10);
			for(j =0; j< yPositionsSet.length; j++)
			{
				if (yPositionsSet[j] == pickedCol)
				{
					alreadyPicked = true;
					break;
				}
			}
		}
		yPositionsSet.push(pickedCol);
		
		var rowPicked = 0;
		var isRowPicked = false;
		
		while(!isRowPicked)
		{
			isRowPicked = false;
			rowPicked = Math.floor(Math.random() * 9);
			var testCondition = rowPicked + ships[i]-1;
			console.log("Row picked "+rowPicked +" ship size "+ships[i] +" test condition "+testCondition);			
			
			if (testCondition < 10)
			{
				isRowPicked = true;
			}			
		}	
			
        placements.push(new Battleship.Placement(new Battleship.Point(pickedCol, rowPicked), new Battleship.Point(pickedCol, rowPicked+ships[i]-1)));
		//placements.push(new Battleship.Placement(new Battleship.Point(i, 0), new Battleship.Point(i, ships[i]-1)));
    }
	
	for(i = 0; i < placements.length; i++)
	{
		console.log("Ship positions "+placements[i]);
	}
	return placements;
};
 
var counter = 0;
Pescador.prototype.fire = function fire(myMoves, theirMoves) {
    var i, j,
        moveIndex,
        move;

    if (!myMoves || !myMoves.length) {
        console.log('initialize');
        this._openMoves = [];
        this._alreadyFired = [];
        for (i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++) {
              this._openMoves.push(new Battleship.Point(i, j));
            }
        }
    }
  
    
  
    moveIndex = -1;
    if(this.lastHit) {
      console.log(1);
      if(CheckIfAvailable(this._openMoves, this.lastHit.x, this.lastHit.y + 1)){
        moveIndex = GetIndex(this._openMoves, this.lastHit.x, this.lastHit.y + 1);
      }
      console.log("Derecha: " + this._openMoves[moveIndex].x + ", " + this._openMoves[moveIndex].y);
      console.log(2);
      if(moveIndex === -1 && CheckIfAvailable(this._openMoves, this.lastHit.x, this.lastHit.y - 1)){
        moveIndex = GetIndex(this._openMoves, this.lastHit.x, this.lastHit.y - 1);
      }
      console.log("Izq: " + moveIndex);
      console.log(3);
      if(moveIndex === -1 && CheckIfAvailable(this._openMoves, this.lastHit.x + 1, this.lastHit.y)){
        moveIndex = GetIndex(this._openMoves, this.lastHit.x + 1, this.lastHit.y)
      }
      console.log("Abajo: " + moveIndex);
      console.log(4);
      if(moveIndex === -1 && CheckIfAvailable(this._openMoves, this.lastHit.x - 1, this.lastHit.y)){
        moveIndex = GetIndex(this._openMoves, this.lastHit.x - 1, this.lastHit.y);
      }
      console.log("Arriba: " + moveIndex);
    }
 
  if(moveIndex === -1)
    {
    this.lastHit = null;
    moveIndex = Math.floor(Math.random() * this._openMoves.length);
    }
       
  move = this._openMoves[moveIndex];
  Remove(moveIndex, 1);
    
    if(myMoves.length > 0){
      console.log(myMoves[myMoves.length - 1]);
      if(myMoves[myMoves.length - 1].isHit){
        this.lastHit = myMoves[myMoves.length - 1];
      }
    }
  
    counter = counter + 1;
    return move;
};

function CheckIfAvailable(moves, x, y){
  for (i = 0; i < moves.length; i++) {
    if(moves[i].x === x && moves[i].y === y)
      return true;
  }
  return false;
};
  
function GetIndex(moves, x, y){
  for (i = 0; i < moves.length; i++) {
    if(moves[i].x === x && moves[i].y === y)
      return i;
  }
  return -1;
};
  
function Remove(moves, x, y){
  for (i = 0; i < moves.length; i++) {
    if(moves[i].x === x && moves[i].y === y){
      moves.splice(i, 1) ;
      console.log('removed');
    }
    
  }
};
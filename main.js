import Point from './point.js';
import PriorityQueue from './priorityqueue.js';

class PathFind {
  constructor() {
    this.canvasWidth = 800;
    this.canvasHeight = 800;
    this.cellSize = 20;
    this.rows = this.canvasWidth/this.cellSize;
    this.columns = this.canvasHeight/this.cellSize;
    this.board = [];
    this.jboard = $('#board');
    this.start = null;
    this.destination = null;
    this.createEmptyBoard();
    this.start = this.board[0][0];
    this.destination = this.board[this.rows-1][this.columns-1];
    $(`#${this.start.x * this.rows + this.start.y}`).css('background-color','yellow');
    $(`#${this.destination.x * this.rows + this.destination.y}`).css('background-color','purple');
    this.clear = true;
    this.isRunning = false;
  }

  createEmptyBoard() {
    let counter = 0;
    for (let i = 0; i < this.rows;i++) {
      let row = [];
      let jrow = $('<div>').addClass('row');
      for (let j = 0; j < this.columns; j++) {
        let col = $('<div>').addClass('column');
        col.attr('id',`${counter}`);
        col.attr('x',i);
        col.attr('y',j);
        let l = this;
        jrow.append(col);
        row.push(new Point(i,j)); // 0 represents an empty cell
        counter++;
      }
      this.jboard.append(jrow);
      this.board.push(row);
    }
  }
  makeWall(x,y) {
    if (this.board[x][y] != this.start && this.board[x][y] != this.destination) {
      this.board[x][y].value = 3;
      $(`#${x * this.rows + y}`).css('background-color','red');
    }
  }

  destroyWall(x,y) {
    if (this.board[x][y] != this.start && this.board[x][y] != this.destination) {
      this.board[x][y].value = 0;
      $(`#${x * this.rows + y}`).css('background-color','blue');
    }
  }

  clearBoard() {
    let counter = 0;
    for (let i = 0; i < this.rows;i++) {
      for (let j = 0; j < this.columns; j++) {
        this.board[i][j].value = 0; // 0 represents an empty cell
        let rect = $(`#${counter}`);
        if (this.board[i][j] === this.start){
          rect.css('background-color','yellow');
        }
        else if (this.board[i][j] === this.destination){
          rect.css('background-color','purple');
        }
        else {
          rect.css('background-color','blue');
        }
        counter++;
      }
    }
    this.clear = true;
  }

  printBoard() {
    //document.getElementById("message").innerHTML = "";
    for (let i = 0; i < this.rows;i++) {
      for (let j = 0; j < this.columns; j++) {
        document.write(`${this.board[i][j].value} `);
      }
      document.write("<br/>");
    }
  }
  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  async aStar() {
    if (this.isRunning){
      return; //Do not run while other visualization in progress
    }
    if (this.clear === false){
      this.clearBoard();
      console.log("Board is clear");
    }
    this.clear = false;
    this.isRunning = true;

    let open = new PriorityQueue();
    this.start.g = 0;
    this.start.h = this.ManhattanDistance(this.destination,this.start);
    this.start.f = 0;
    this.start.value = 1;
    open.insert(this.start);
    let counter = 0;
    while(open.length() > 0) {
      let q = open.extractMin();
      //q.value = 1; //Marked as visited
      if (this.isDestination(q)){
        break;
      }
      let successors = this.findSuccessors(q.x,q.y);
      for (let i = 0; i < successors.length; i++) {
        let tempg = q.g + 1;
        if(successors[i].value != 1 || tempg < q.g){
            if (open.heap.includes(successors[i])){
              open.remove(open.indexOf(successors[i]));
            }
            successors[i].g = tempg
            successors[i].parent = q;
            successors[i].value = 1;
            if (successors[i] != this.destination) {
              $(`#${successors[i].x * this.rows + successors[i].y}`).css('background-color','black');
            }
            successors[i].h = this.ManhattanDistance(this.destination,successors[i]);
            successors[i].f = successors[i].g + successors[i].h;
            open.insert(successors[i])
        }
      }
      await this.sleep(10);

    }
    this.markPath();
    this.isRunning = false;
  }

  async bfs() {
    if (this.isRunning){
      return; //Do not run while other visualization in progress
    }
    if (this.clear === false){
      this.clearBoard();
    }
    this.clear = false;
    this.isRunning = true;

    let openList = [];
    let visited = [];
    openList.push(this.start);
    visited.push(this.start);

    while(openList.length > 0) {
      //l.printBoard();
      let current = openList.shift();
      current.value = 1;
      if (current != this.start && current != this.destination){ 
        $(`#${current.x * this.rows + current.y}`).css('background-color','black');
      }
      if (this.isDestination(current)){
        break;
      }
      let successors = this.findSuccessors(current.x,current.y);
      for (let i = 0; i < successors.length; i++){
        if (!visited.includes(successors[i])) {
          openList.push(successors[i]);
          visited.push(successors[i]);
          successors[i].parent = current;
        }
      }
      await this.sleep(10);
    }
    this.markPath();
    this.isRunning = false;
  }

  async dfs() {
    if (this.isRunning){
      return; //Do not run while other visualization in progress
    }
    if (this.clear === false){
      this.clearBoard();
    }
    this.clear = false;
    this.isRunning = true;

    let openList = [];
    let visited = [];
    openList.push(this.start);
    visited.push(this.start);
    this.clear = false;
    while(openList.length > 0) {
      let current = openList.pop();
      current.value = 1;
      if (current != this.start && current != this.destination) {
        $(`#${current.x * this.rows + current.y}`).css('background-color','black');
      }
      if (this.isDestination(current)){
        break;
      }
      let successors = this.findSuccessors(current.x,current.y);
      for (let i = 0; i < successors.length; i++){
        if (!visited.includes(successors[i])) {
          openList.push(successors[i]);
          visited.push(successors[i]);
          successors[i].parent = current;
        }
      }
      await this.sleep(10);
    }
    this.markPath();
    this.isRunning = false;
  }

  async djikstras() {
    if (this.isRunning){
      return; //Do not run while other visualization in progress
    }
    if (this.clear === false){
      this.clearBoard();
    }
    this.clear = false;
    this.isRunning = true;

    let frontier = new PriorityQueue();
    this.start.f = 0;
    this.start.value = 1;
    let closed = [];
    frontier.insert(this.start);
    while (frontier.length() > 0) {
      let current = frontier.extractMin();

      if (this.isDestination(current)){
        break;
      }

      let neighbors = this.findSuccessors(current.x,current.y) 
      for (let i = 0; i < neighbors.length; i++) {
        let new_cost = current.f + 1;
        if (neighbors[i].value != 1 || new_cost < neighbors[i].f) {
          neighbors[i].value = 1;
          if (neighbors[i] != this.destination) {
            $(`#${neighbors[i].x * this.rows + neighbors[i].y}`).css('background-color','black');
          }
          neighbors[i].f = new_cost;
          frontier.insert(neighbors[i]);
          neighbors[i].parent = current;
        }
      }
      await this.sleep(10);
    }
    this.markPath();
    this.isRunning = false;
  }

  async bestFirstSearch() {
    if (this.isRunning){
      return; //Do not run while other visualization in progress
    }
    if (this.clear === false){
      this.clearBoard();
    }
    this.clear = false;
    this.isRunning = true;
    //For this I am using f to to represent the h value because the Priority makes comparisons using f
    let open = new PriorityQueue();
    this.start.f = this.ManhattanDistance(this.destination,this.start);
    this.start.value = 1;
    open.insert(this.start);
    while(open.length() > 0) {
      let current = open.extractMin();
      if (this.isDestination(current)){
        break;
      }
      let successors = this.findSuccessors(current.x,current.y);
      for (let i = 0; i < successors.length; i++) {
        let heuristic = this.ManhattanDistance(successors[i],this.destination);
        if(successors[i].value != 1){
            successors[i].value = 1;
            if (successors[i] != this.start && successors[i] != this.destination) {
              $(`#${successors[i].x * this.rows + successors[i].y}`).css('background-color','black');
            }
            successors[i].parent = current;
            successors[i].f = heuristic;
            open.insert(successors[i])
        }
      }
      await this.sleep(10);
    }
    this.markPath();
    this.isRunning = false;
  }



  markPath() {
    let current = this.destination;
    while(current !== null) {
      current.value = 2;
      if (current != this.start && current != this.destination) {
        $(`#${current.x * this.rows + current.y}`).css('background-color','green');
      }
      //console.log(current);
      current = current.parent;
    }
  }

  isDestination(cell) {
    if (cell === this.destination){
      return true;
    }
    return false;
  }

  setDestination(x, y) {
    if (x > 0 && x < this.rows && y > 0 && y < this.columns)
      this.destination = this.board[x][y];
  }

  setStart(x, y) {
      if (x > 0 && x < this.rows && y > 0 && y < this.columns)
        this.start = this.board[x][y];
  }


  isWall(cell) {
      if (cell.value === 3) { // value 3 means wall
        return true;
      }
      return false;
    }

  ManhattanDistance(dest, src) {
    //console.log(dest.x);
    //console.log(dest.y);
    return (Math.abs(src.x - dest.x) + Math.abs(src.y - dest.y));
  }

    findSuccessors(x, y) {
      let successors = [];
      if (x > 0) { // North Neighbor
        if (!this.isWall(this.board[x-1][y])){
          successors.push(this.board[x-1][y]);
        }
      }
      if (y > 0) { // East Neighbor
        if (!this.isWall(this.board[x][y-1])){
          successors.push(this.board[x][y-1]);
        }

      }
      if (x + 1 < this.rows) { // South Neighbor
        if (!this.isWall(this.board[x+1][y])){
          successors.push(this.board[x+1][y]);
        }
      }
      if (y + 1 < this.columns) { // West Neighbor
        if (!this.isWall(this.board[x][y+1])){
          successors.push(this.board[x][y+1]);
        }
      }
      
      return successors;
    }

  }
 

  let button = document.getElementById('submit');
  console.log(button);
  button.onclick = function(e) {
    e.preventDefault();
    let value = parseInt(document.getElementById("algs").value);
    console.log(value);
    switch(value){
      case 0:
        l.aStar();
        break;
      case 1:
        l.bfs();
        break;
      case 2:
        l.dfs();
        break;
      case 3:
        l.djikstras();
        break;
      case 4:
        l.bestFirstSearch();
        break;

    }
  }

  let clear = document.getElementById('clear');
  clear.onclick = function(e) {
    e.preventDefault();
    if (!l.isRunning){
      l.clearBoard();
    }
  }

  $(document).ready(function(){

    var isDown = false;   
  
    $(document).mousedown(function() {
      isDown = true;      
    })
    .mouseup(function() {
      isDown = false;   
    });
  
    $(".column").mouseover(function(){
      if(isDown) {        // Only change css if mouse is down
        let x = parseInt($(this).attr('x'));
        let y = parseInt($(this).attr('y'));  
        if (l.isWall(l.board[x][y])) {
          l.destroyWall(x,y);
        }
        else { 
          l.makeWall(x,y);
        }
      }
    });
  });
let l = new PathFind();


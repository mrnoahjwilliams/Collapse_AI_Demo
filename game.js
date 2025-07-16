// game.js

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.owner = 0;
    this.pips = 0;
  }

  copy() {
    const cell = new Cell(this.x, this.y);
    cell.owner = this.owner;
    cell.pips = this.pips;
    return cell;
  }
}

class Player {
  constructor(playerNumber, type = 'human') {
    this.playerNumber = playerNumber;
    this.type = type; // 'human' or 'ai'
    this.score = 0;
  }

  copy() {
    const p = new Player(this.playerNumber, this.type);
    p.score = this.score;
    return p;
  }
}

class Move {
  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
  }
}

class GameBoard {
  constructor(width, height, playerTypes) {
    this.width = width;
    this.height = height;
    this.state = 'CHOOSING_STARTING_LOCATIONS';
    this.board = this.generateEmptyBoard(width, height);
    this.players = playerTypes.map((type, index) => new Player(index, type));
    this.whoseTurnIsIt = 0;
  }

  generateEmptyBoard(w, h) {
    const board = [];
    for (let x = 0; x < w; x++) {
      board[x] = [];
      for (let y = 0; y < h; y++) {
        board[x][y] = new Cell(x, y);
      }
    }
    return board;
  }

  copy() {
    const newBoard = new GameBoard(this.width, this.height, this.players.map(p => p.type));
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        newBoard.board[x][y] = this.board[x][y].copy();
      }
    }
    newBoard.players = this.players.map(p => p.copy());
    newBoard.state = this.state;
    newBoard.whoseTurnIsIt = this.whoseTurnIsIt;
    return newBoard;
  }

  getOtherPlayers(playerNumber) {
    return this.players.filter(p => p.playerNumber !== playerNumber);
  }

  getCurrentPlayer() {
    return this.players[this.whoseTurnIsIt];
  }

  getPossibleMoves(playerNum) {
    const moves = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const cell = this.board[x][y];
        if (this.state === 'CHOOSING_STARTING_LOCATIONS') {
          if (cell.owner === 0) moves.push(new Move(x, y, playerNum));
        } else if (this.state === 'NORMAL_PLAY') {
          if (cell.owner - 1 === playerNum) moves.push(new Move(x, y, playerNum));
        }
      }
    }
    return moves;
  }

  makeMove(move) {
    if (this.state === 'CHOOSING_STARTING_LOCATIONS') {
      this.updateCell(move.x, move.y, move.player);
      this.updateCell(move.x, move.y, move.player);
      this.updateCell(move.x, move.y, move.player);
    } else if (this.state === 'NORMAL_PLAY') {
      this.updateCell(move.x, move.y, move.player);
    }
    this.updateScores();
    this.updateState();
    this.updatePlayerTurn();
  }

  updateCell(x, y, player) {
    const cell = this.board[x][y];
    cell.owner = player + 1;
    cell.pips++;

    if (cell.pips > 3) {
      cell.owner = 0;
      cell.pips = 0;
      if (x > 0) this.updateCell(x - 1, y, player);
      if (y > 0) this.updateCell(x, y - 1, player);
      if (x < this.width - 1) this.updateCell(x + 1, y, player);
      if (y < this.height - 1) this.updateCell(x, y + 1, player);
    }
  }

  updateScores() {
    const scores = new Array(this.players.length).fill(0);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const owner = this.board[x][y].owner;
        if (owner !== 0) scores[owner - 1]++;
      }
    }
    this.players.forEach((p, i) => p.score = scores[i]);
  }

  updateState() {
    const playersOut = this.players.filter(p => p.score === 0).length;
    if (this.state === 'CHOOSING_STARTING_LOCATIONS' && playersOut === 0) {
      this.state = 'NORMAL_PLAY';
    }
    if (this.state === 'NORMAL_PLAY' && playersOut >= this.players.length - 1) {
      this.state = 'GAME_OVER';
    }
  }

  updatePlayerTurn() {
    if (this.state === 'CHOOSING_STARTING_LOCATIONS') {
      this.whoseTurnIsIt = (this.whoseTurnIsIt + 1) % this.players.length;
    } else if (this.state === 'NORMAL_PLAY') {
      do {
        this.whoseTurnIsIt = (this.whoseTurnIsIt + 1) % this.players.length;
      } while (this.players[this.whoseTurnIsIt].score === 0);
    }
  }
}

class Game {
  constructor(gridSize, aiDepth) {
    this.board = new GameBoard(gridSize, gridSize, ['human', 'ai']);
    this.aiDepth = aiDepth;
    this.cellSize = min(width, height) / gridSize;
    this.isHumanTurn = true;
    this.aiThinking = false;
    this.winner = null;
  }

  draw() {
    for (let x = 0; x < this.board.width; x++) {
      for (let y = 0; y < this.board.height; y++) {
        const cell = this.board.board[x][y];
        stroke(0);
        fill(cell.owner === 0 ? 255 : this.getPlayerColor(cell.owner - 1));
        rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);

        if (cell.pips > 0) {
          fill(0);
          textAlign(CENTER, CENTER);
          textSize(16);
          text(cell.pips, x * this.cellSize + this.cellSize / 2, y * this.cellSize + this.cellSize / 2);
        }
      }
    }

    if (this.board.state === 'GAME_OVER') {
      fill(0, 180);
      rect(0, 0, width, height);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(32);
      const winner = this.board.players.find(p => p.score > 0);
      text(winner ? `Player ${winner.playerNumber + 1} Wins!` : 'Draw!', width / 2, height / 2);
    }

    if (!this.isHumanTurn && !this.aiThinking && this.board.state !== 'GAME_OVER') {
      this.aiThinking = true;
      setTimeout(() => {
        const move = minimax(this.board, this.aiDepth, -Infinity, Infinity, true, 1).move;
        this.board.makeMove(move);
        this.isHumanTurn = true;
        this.aiThinking = false;
      }, 10);
    }
  }

  handleClick(mx, my) {
    if (!this.isHumanTurn || this.board.state === 'GAME_OVER') return;

    const x = floor(mx / this.cellSize);
    const y = floor(my / this.cellSize);
    const move = new Move(x, y, 0);
    const validMoves = this.board.getPossibleMoves(0);
    if (validMoves.some(m => m.x === move.x && m.y === move.y)) {
      this.board.makeMove(move);
      this.isHumanTurn = false;
    }
  }

  getPlayerColor(index) {
    return [color('#E74C3C'), color('#3498DB'), color('#2ECC71'), color('#F1C40F')][index % 4];
  }
}

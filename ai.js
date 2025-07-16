// ai.js

function evaluate(board, aiPlayer) {
  const myScore = board.players[aiPlayer].score;
  const othersScore = board.players.reduce((acc, p, i) => i !== aiPlayer ? acc + p.score : acc, 0);
  return myScore - othersScore;
}

function minimax(board, depth, alpha, beta, isMaximizing, aiPlayer) {
  if (depth === 0 || board.state === 'GAME_OVER') {
    return { move: null, score: evaluate(board, aiPlayer) };
  }

  const moves = board.getPossibleMoves(board.whoseTurnIsIt);
  shuffle(moves); // adds randomness among equally scored moves

  let bestMove = null;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let move of moves) {
      const copy = board.copy();
      copy.makeMove(move);
      const result = minimax(copy, depth - 1, alpha, beta, false, aiPlayer);
      if (result.score > maxEval) {
        maxEval = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break;
    }
    return { move: bestMove, score: maxEval };
  } else {
    let minEval = Infinity;
    for (let move of moves) {
      const copy = board.copy();
      copy.makeMove(move);
      const result = minimax(copy, depth - 1, alpha, beta, true, aiPlayer);
      if (result.score < minEval) {
        minEval = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, result.score);
      if (beta <= alpha) break;
    }
    return { move: bestMove, score: minEval };
  }
}

// Fisher-Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

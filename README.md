# An Exploding Grid Game with Minimax AI

A turn-based strategy game inspired by chain-reaction mechanics, built using [p5.js](https://p5js.org) and hosted on GitHub Pages. Play against a smart AI that uses the **Minimax algorithm with alpha-beta pruning** to make decisions.

## 🎮 How to Play

- Click on cells to place your orbs.
- Once a cell has 4 orbs, it explodes, spreading to adjacent cells and potentially triggering chain reactions.
- A player is eliminated when they no longer control any cells.
- The last player standing wins!

## 🧠 AI Logic

The AI:
- Uses **Minimax with alpha-beta pruning** for deep decision making.
- Evaluates board states based on score difference.
- Randomizes among equally good moves to avoid repetitive patterns.
- Can be configured with different search depths (e.g. `minimax-5`, `minimax-7`).

## 🛠 Features

- Pure JavaScript and [p5.js](https://p5js.org)
- Runs directly in browser
- Adjustable grid size and AI difficulty
- Restart and end game screens
- Fully playable on desktop and mobile

## 📜 License

MIT License – use freely, modify, and share!

---

Made with ❤️ and JavaScript (and a lot of ChatGPT!)

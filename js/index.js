const startButton = document.querySelector("#start-game");
const restartButton = document.querySelector("#restart-game");

const displayController = (() => {
	const renderMessage = (message) => {
		document.querySelector("#message").innerHTML = message;
	};
	return { renderMessage };
})();
const Gameboard = (() => {
	let gameboard = ["", "", "", "", "", "", "", "", ""];

	const render = () => {
		let boardHTML = "";
		gameboard.forEach((square, index) => {
			boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
		});
		document.querySelector("#gameboard").innerHTML = boardHTML;
		const squares = document.querySelectorAll(".square");
		squares.forEach((square) => {
			square.addEventListener("click", Game.handleClick);
		});
	};

	const update = (index, value) => {
		gameboard[index] = value;
		render();
	};

	const getGameBoard = () => {
		return gameboard;
	};
	return { render, update, getGameBoard };
})();

const createPlayer = (name, mark) => {
	return { name, mark };
};

const Game = (() => {
	let players = [];
	let currentPlayerIndex = 0;
	let gameOver;
	const start = () => {
		players = [
			createPlayer(document.querySelector("#player1").value, "X"),
			createPlayer(document.querySelector("#player2").value, "O"),
		];
		currentPlayerIndex = 0;
		gameOver = false;
		Gameboard.render();
		const squares = document.querySelectorAll(".square");
		squares.forEach((square) => {
			square.addEventListener("click", handleClick);
		});
	};
	const restart = () => {
		document.querySelector("#message").innerHTML = "";
		for (let index = 0; index < 9; index++) {
			Gameboard.update(index, "");
		}
		gameOver = false;
		Gameboard.render();
	};

	const handleClick = (event) => {
		if (gameOver) return;
		const index = parseInt(event.target.id.split("-")[1]);
		// if (event.target.innerHTML) return;
		if (Gameboard.getGameBoard()[index] !== "") return;
		Gameboard.update(index, players[currentPlayerIndex].mark);
		if (
			checkForWin(Gameboard.getGameBoard(), players[currentPlayerIndex].mark)
		) {
			gameOver = true;
			displayController.renderMessage(
				`${players[currentPlayerIndex].name} won!`
			);
		} else if (checkForTie(Gameboard.getGameBoard())) {
			gameOver = true;
			displayController.renderMessage(`it's a tie!`);
		}
		currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
	};
	return { start, handleClick, restart };
})();

function checkForWin(board) {
	const winingCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < winingCombinations.length; i++) {
		const [a, b, c] = winingCombinations[i];
		if (board[a] && board[a] === board[b] && board[b] === board[c]) {
			return true;
		}
	}
	return false;
}

function checkForTie(board) {
	return board.every((cell) => cell != "");
}
startButton.addEventListener("click", () => {
	Game.start();
});
restartButton.addEventListener("click", () => {
	Game.restart();
});

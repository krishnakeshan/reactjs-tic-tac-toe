import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    //method to render individual squares
    renderSquare(index) {
        return (
            <Square
                value={this.props.squares[index]}
                onClick={() => this.props.onClick(index)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: new Array(9).fill(null),
            }],
            stepNumber: 0,
            isXNext: true,
        }
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = decideWinner(current.squares)

        const moves = history.map((step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";

            return (
                <li
                    key={move}
                >
                    <button onClick={() => this.jumpToStep(move)}>{desc}</button>
                </li>
            );
        })

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next Player: " + (this.state.isXNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div> {status} </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    //function to handle clicks
    handleClick(index) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if (decideWinner(squares) || squares[index]) {
            return;
        }

        squares[index] = this.state.isXNext ? "X" : "O";

        //push current board setup onto history array
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            isXNext: !this.state.isXNext,
        })
    }

    //to jump to a specific step
    jumpToStep(step) {
        this.setState({
            stepNumber: step,
            isXNext: step % 2 === 0,
        })
    }
}

//function to determine the winner
function decideWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
    ]

    //check if any pattern exists
    for (var i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            //winder found, return it
            return squares[a];
        }
    }

    //no winnder found, return null
    return null
}

ReactDOM.render(<Game />, document.getElementById("root"));

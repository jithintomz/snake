import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  constructor() {
    super()
    this.state = { score: 0 }
  }

  componentDidMount() {
    this.canvas = this.refs.canvas
    this.canvasDimentions = [this.canvas.width, this.canvas.height]
    this.ctx = this.canvas.getContext('2d')
    this.length_of_snake = 100
    this.snake_points = [[100, 30], [0, 30]]
    this.snake_directions = [[0, 1]]
    this.currentDirection = [0, 1]
    this.speed = 10
    this.drawApple(true)
    this.gameOver = false
    setInterval(this.moveSnakeForward, 200)
    document.addEventListener("keydown", this.handleKeyDown)
  }

  drawApple = (should_redraw) => {
    if (should_redraw) {
      this.apple_location = [Math.ceil((Math.random() * this.canvas.width) / 10) * 10, Math.ceil((Math.random() * this.canvas.height) / 10) * 10]
    }
    this.ctx.beginPath()
    this.ctx.arc(this.apple_location[0], this.apple_location[1], 5, 0, 2 * Math.PI)
    this.ctx.stroke();
  }

  directionArithmetic = (current, newArrow) => {
    var directionsMap = {
      "ArrowUp": [1, -1],
      "ArrowDown": [1, 1],
      "ArrowRight": [0, 1],
      "ArrowLeft": [0, -1]
    }
    var arrowDirection = directionsMap[newArrow]
    if (arrowDirection[0] === current[0]) {
      return current
    }
    else {
      return arrowDirection
    }
  }

  handleKeyDown = (event) => {
    if (["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].indexOf(event.key) === -1) {
      return
    }
    var newDirection = this.directionArithmetic(this.currentDirection, event.key)
    if (JSON.stringify(newDirection) !== JSON.stringify(this.currentDirection)) {
      this.currentDirection = newDirection
      this.snake_directions.unshift(newDirection)
      this.snake_points.splice(1, 0, [this.snake_points[0][0], this.snake_points[0][1]])

    }
  }

  increaseSpeed = () => {
    this.speed += this.speed
  }

  distanceBetween = (p1, p2) => {
    var distance = Math.sqrt((Math.pow(p1[0] - p2[0], 2)) + (Math.pow(p1[1] - p2[1], 2)))
    return distance
  }

  checkIfInline = (p1, p2, intermediate) => {
    if (this.distanceBetween(p1, p2) === (this.distanceBetween(p1, intermediate) + this.distanceBetween(intermediate, p2))) {
      return true
    }
  }

  checkGameOver = (head) => {
    var gameOver = false
    if ((head[0] >= this.canvas.width) || (head[1] >= this.canvas.height)) {
      return true
    }
    if ((head[0] <= 0) || (head[1] <= 0)) {
      return true
    }

    for (let index = 2; index < this.snake_points.length; index++) {
      const p1 = this.snake_points[index];
      const p2 = this.snake_points[index - 1];
      gameOver = this.checkIfInline(p1, p2, head)
      if (gameOver) {
        return gameOver
      }
    }
    return gameOver
  }

  moveSnakeForward = () => {

    if (this.gameOver) {
      return
    }
    else {
      this.snake_points[0][this.snake_directions[0][0]] += this.snake_directions[0][1] * this.speed
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.gameOver = this.checkGameOver(this.snake_points[0])
    this.ctx.beginPath()
    this.ctx.moveTo(this.snake_points[0][0], this.snake_points[0][1])
    var length_left = this.length_of_snake
    for (let index = 0; index < this.snake_points.length - 1; index++) {
      if (this.distanceBetween(this.snake_points[index], this.snake_points[index + 1]) > length_left) {
        this.snake_points[index + 1][this.snake_directions[index][0]] = this.snake_points[index][this.snake_directions[index][0]] -
          length_left * this.snake_directions[index][1]
        this.ctx.lineTo(this.snake_points[index + 1][0], this.snake_points[index + 1][1])
        this.snake_points.splice(index + 2)
        break
      }
      else {
        this.ctx.lineTo(this.snake_points[index + 1][0], this.snake_points[index + 1][1])
        length_left -= this.distanceBetween(this.snake_points[index], this.snake_points[index + 1])
      }

    }
    this.ctx.strokeStyle = "#ffffff"
    this.ctx.stroke()
    if (JSON.stringify(this.snake_points[0]) === JSON.stringify(this.apple_location)) {
      this.drawApple(true)
      this.length_of_snake += 10
      this.state.score += 10
      this.setState(this.state)
    }
    else {
      this.drawApple(false)
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            Score {this.state.score}
          </div>
          <canvas tabIndex="0" ref="canvas" width={640} height={430} ></canvas>
        </header>
      </div>
    );
  }
}

export default App;

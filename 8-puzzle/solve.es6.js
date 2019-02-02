const _ = require('lodash')

class Puzzle {
  constructor () {
    this.board = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
    this.path = []
    this.moves = []
    this.lastMove = null
  }

  randomize () {
    const flat = _.flatten(this.board)
    const rflat = _.shuffle(flat)
    this.board = _.chunk(rflat, 3)
  }

  print (board = this.board) {
    const str = board.map(row => row.join(' ')).join('\n')
    console.log(str)
  }

  printAll (moves) {
    for (let i = 0; i < moves.length; i++) {
      const board = moves[i]
      this.print(board)
      console.log('---')
    }
  }

  getBlankSpacePosition () {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const element = this.board[i][j]
        if (element === 0) return [i, j]
      }
    }
  }

  swap (i1, j1, i2, j2) {
    const _ = this.board[i1][j1]
    this.board[i1][j1] = this.board[i2][j2]
    this.board[i2][j2] = _
  }

  getMove (piece) {
    const [line, column] = this.getBlankSpacePosition()
    if (line > 0 && piece === this.board[line - 1][column]) {
      return 'D'
    } else if (line < 2 && piece === this.board[line + 1][column]) {
      return 'U'
    } else if (column > 0 && piece === this.board[line][column - 1]) {
      return 'R'
    } else if (column < 2 && piece === this.board[line][column + 1]) {
      return 'L'
    }
  }

  move (piece) {
    const move = this.getMove(piece)
    if (move) {
      const [line, column] = this.getBlankSpacePosition()
      switch (move) {
        case 'L':
          this.swap(line, column, line, column + 1)
          break
        case 'R':
          this.swap(line, column, line, column - 1)
          break
        case 'U':
          this.swap(line, column, line + 1, column)
          break
        case 'D':
          this.swap(line, column, line - 1, column)
          break
      }
      if (move) this.lastMove = piece
      return move
    }
  }

  isGoalState () {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const piece = this.board[i][j]
        if (piece > 0) {
          const line = Math.floor((piece - 1) / 3)
          const column = (piece - 1) % 3
          return i === line && j === column
        }
      }
      return true
    }
  }

  getCopy () {
    const nPuzzle = new Puzzle()
    nPuzzle.board = Array.from(this.board, row => row.slice())

    for (let i = 0; i < this.path.length; i++) {
      nPuzzle.path.push(this.path[i])
      nPuzzle.moves.push(this.moves[i])
    }

    return nPuzzle
  }

  getAllowedMoves () {
    const moves = []
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const piece = this.board[i][j]

        if (this.getMove(piece)) moves.push(piece)
      }
    }

    return moves
  }

  visit () {
    const children = []
    const amoves = this.getAllowedMoves()
    for (let i = 0; i < amoves.length; i++) {
      const move = amoves[i]
      if (move !== this.lastMove) {
        const newBoard = this.getCopy()
        newBoard.move(move)
        newBoard.path.push(move)
        newBoard.moves.push(_.cloneDeep(this.board))
        children.push(newBoard)
      }
    }
    return children
  }

  solve (print = false) {
    const start = this.getCopy()
    start.path = []
    let states = [start]
    while (states.length > 0) {
      const state = states.shift()
      if (state.isGoalState()) {
        if (print) this.printAll(state.moves)
        return state.path
      }
      states = states.concat(state.visit())
    }
  }
}

module.exports = Puzzle

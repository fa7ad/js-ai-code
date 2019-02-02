const Puzzle = require('./solve.es6')

const p = new Puzzle()

console.log('Initial')
p.print()

console.log('Randomized')
p.randomize()
p.print()

console.log('')
console.log('')
console.log('')

console.log('Solution')
p.solve(true)

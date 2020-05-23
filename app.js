document.addEventListener('DOMContentLoaded', () =>{
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const displayMiniSquares = document.querySelectorAll('.mini-grid div')
  const width = 10
  let timerId = 0
  let score = 0

  const lShape = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2]
  ]

  const zShape = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tShape = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oShape = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iShape = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theShapes = [lShape, zShape, tShape, oShape, iShape]

  let randomShape
  let currentPosition
  let currentRotation
  let currentShape
  let nextShape = 0

  const displayWidth = 4
  let displayIndex = 0


  //create smaller shapes for the mini-grid, this shapes dont need rotation
  const incomingShape = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  function displayIncomingShape(){
    displayMiniSquares.forEach(miniSquare => {
      miniSquare.classList.remove('shape')
    })

    incomingShape[nextShape].forEach( index => {
      displayMiniSquares[displayIndex + index].classList.add('shape')
    })
  }


  //select shape
  function createShape(){
    randomShape = nextShape
    nextShape = Math.floor(Math.random() * theShapes.length)
    currentPosition = 4
    currentRotation = 0
    currentShape = theShapes[randomShape][currentRotation]
    displayIncomingShape()
  }

  createShape()

  //draw shape
  function drawShape(){
    currentShape.forEach(index => {
      squares[currentPosition + index].classList.add('shape')
    })
  }

  //erase shape
  function eraseShape(){
    currentShape.forEach(index => {
      squares[currentPosition + index].classList.remove('shape')
    })
  }

  function controlShapes(e){
    if(e.keyCode === 37) //move left
      moveLeft()
    else if(e.keyCode === 39) //move right
      moveRight()
    else if(e.keyCode === 40)
      moveLeft()
    else if(e.keyCode === 38) //rotate
      rotate()
  }
  document.addEventListener('keyup', controlShapes)

  //timerId = setInterval(moveShapeDown, 200)


  function freeze(){
    if(currentShape.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
      currentShape.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start new shape

      createShape()
      drawShape()
      addScore()
      gameOver()
    }
  }

  function moveDown(){
    eraseShape()
    currentPosition += width
    drawShape()
    freeze()
  }

  function moveLeft(){
    eraseShape()
    //check if its at the corner
    const isAtLeftCorner = currentShape.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftCorner)
      currentPosition -= 1

    if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken')))
      currentPosition += 1

    drawShape()
  }

  function moveRight(){
    eraseShape()
    //check if its at the corner
    const isAtRightCorner = currentShape.some(index => (currentPosition + index) % width === width - 1)

    if(!isAtRightCorner)
      currentPosition += 1

    if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken')))
      currentPosition += 1

    drawShape()
  }

  function rotate(){
    eraseShape()
    currentRotation++
    if(currentRotation > 3)
      currentRotation = 0
    currentShape = theShapes[randomShape][currentRotation]
    drawShape()
  }

  //button funcionality
  startBtn.addEventListener('click', () => {
    if(timerId){
      clearInterval(timerId)
      timerId = null
    }
    else{
      drawShape()
      timerId = setInterval(moveDown, 200)
      nextShape = Math.floor(Math.random()*theShapes.length)
      displayIncomingShape()
    }
  })

  //add score
  function addScore()
  {
    for(let i = 0; i < 199; i+=width)
    {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]


      if(row.every(index => squares[index].classList.contains('taken'))) { //if all row is marked as taken
        score += 10 //increase score
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('shape') //remove shape from block
          squares[index].classList.remove('taken') //remove the tag "taken" since this row will be removed
        })
        const squaresRemoved = squares.splice(i, width) //remove items starting from index "i" until width, so all the row
        squares = squaresRemoved.concat(squares) //create a new row to replace the deleted onw
        squares.forEach(cell => grid.appendChild(cell)) //add it to the grid
      }
    }
  }

  function gameOver(){
    if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))){
      scoreDisplay.innerHTML = 'Game Over :( )'
      clearInterval(timerId)
    }
  }


































  console.log(squares)
})

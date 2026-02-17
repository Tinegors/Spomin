let size = 10;
let mineCount = 8;
let board = [];
let revealed = [];
let flags = 0;
let open1=0;
let timer;
let seconds = 0;

function newGame() {
  open1=0;
  clearInterval(timer);
  seconds = 0;
  document.getElementById("time").textContent = "00:00";

  size = parseInt(document.getElementById("size").value);
  mineCount = size === 10 ? 8 : 20;
  document.getElementById("mineCount").textContent = mineCount;

  flags = 0;
  document.getElementById("flags").textContent = flags;

  board = [];
  revealed = [];

  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  boardDiv.style.gridTemplateColumns = `repeat(${size}, 30px)`;

  for (let i = 0; i < size * size; i++) {
    board.push(0);
    revealed.push(false);
  }

  let placed = 0;
  while (placed < mineCount) {
    let r = Math.floor(Math.random() * board.length);
    if (board[r] !== "M") {
      board[r] = "M";
      placed++;
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "M") continue;
    board[i] = countMines(i);
  }

  for (let i = 0; i < board.length; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.onclick = () => reveal(i, cell);
    cell.oncontextmenu = e => {
      e.preventDefault();
      toggleFlag(cell);
    };

    boardDiv.appendChild(cell);
  }

  timer = setInterval(updateTime, 1000);
}

function updateTime() {
  seconds++;
  let m = String(Math.floor(seconds / 60)).padStart(2, "0");
  let s = String(seconds % 60).padStart(2, "0");
  document.getElementById("time").textContent = `${m}:${s}`;
}

function countMines(i) {
  return neighbors(i).filter(n => board[n] === "M").length;
}

function neighbors(i) {
  let arr = [];
  let x = i % size;
  let y = Math.floor(i / size);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (!dx && !dy) continue;
      let nx = x + dx;
      let ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size)
        arr.push(ny * size + nx);
    }
  }
  return arr;
}

function reveal(i, cell) {
  if (revealed[i] || cell.innerHTML) return;

  revealed[i] = true;
  cell.classList.add("revealed");
  cell.style.backgroundImage = "none";

  if (board[i] === "M") {
    cell.innerHTML = `<img src="items/mina.png">`;
    alert("Konec igre!");
    open1==0;
    clearInterval(timer);
    return;
  }
  if(board[i] != "M"){
    open1++;
    document.getElementById("open").textContent = open1;}

  if (board[i] > 0) {
    cell.textContent = board[i];
  } else {
    neighbors(i).forEach(n => {
      reveal(n, document.getElementsByClassName("cell")[n]);
    });
  }

  if(open1+flags==100){
    clearInterval(timer);
    setTimeout(() => {
        alert("Bravooo!!! ");
      }, 50);
  }
}

function toggleFlag(cell) {
  if (cell.classList.contains("revealed")) return;

  if (!cell.innerHTML) {
    cell.innerHTML = `<img src="items/zastavica.png">`;
    flags++;
  } else {
    cell.innerHTML = "";
    flags--;
  }
  document.getElementById("flags").textContent = flags;
}

newGame();

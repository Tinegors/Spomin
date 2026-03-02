let size = 2;
let timer;
let sekunde = 0;
let board = [];
let revealed = [];
let revelCount = 0;
let reveledIndex1 = 0;
let reveledIndex2 = 0;
let resene = 0;
let kliki=0;

let slike8 = [
    ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2],
    ["🌊", 2], ["🔥", 2], ["🌙", 2], ["🎭", 2]
];

let slike6 = [
    ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2],
    ["🌊", 2], ["🔥", 2]
];

let slike4 = [
    ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2]
];

let slike = {
    8: slike8,
    6: slike6,
    4: slike4
};

function zamenjajTemo() {
    const jeTemna = document.body.classList.toggle("dark-theme");
    const karticaIgre = document.querySelector(".vse");
    karticaIgre.classList.toggle("temno", jeTemna);

    const gumbTema = document.getElementById("tema");
    gumbTema.textContent = jeTemna ? "☀️ Svetla tema" : "🌙 Temna tema";
}

function NaloziIgro() {

    slike[8] = [
        ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2],
        ["🌊", 2], ["🔥", 2], ["🌙", 2], ["🎭", 2]
    ];

    slike[6] = [
        ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2],
        ["🌊", 2], ["🔥", 2]
    ];

    slike[4] = [
        ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2]
    ];

    document.getElementById("timer").textContent = "00:00";
    document.getElementById("konec").textContent = "";

    clearInterval(timer);
    sekunde = 0;
    resene = 0;

    timer = setInterval(cas, 1000);

    size = parseInt(document.getElementById("size").value);

    board = [];
    revealed = [];
    revelCount = 0;
    kliki=0;

    const igraDiv = document.getElementById("igra");
    igraDiv.innerHTML = "";
    
    igraDiv.style.gridTemplateColumns = `repeat(${4}, 1fr)`;


    let izbraneSlike = slike[size];

    for (let i = 0; i < size * 2;) {
        let rnd = Math.floor(Math.random() * izbraneSlike.length);

        if (izbraneSlike[rnd][1] > 0) {
            revealed.push(false);
        

            const card = document.createElement("div");
            card.classList.add("card");
            card.textContent = "KER spomin";
        

            board[i] = izbraneSlike[rnd][0];
            izbraneSlike[rnd][1] -= 1;
        

            let index = i;
            card.onclick = () => reveal(index, card);
        

            igraDiv.appendChild(card);
        

            i++;
        }
    }
    zazeniGlasbo();
}
    

function cas() {
    sekunde++;
    let m = String(Math.floor(sekunde / 60)).padStart(2, "0");
    let s = String(sekunde % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${m}:${s}`;
}

function reveal(i, card) {
    kliki++;
    document.getElementById("kliki").textContent = "Število klikov: " + kliki;
    if (revealed[i]) return;

    revealed[i] = true;
    card.textContent = board[i];
    card.classList.add("odkrito");

    if (revelCount == 0) {
        reveledIndex1 = i;
        revelCount = 1;
        
    } 
    else {
        reveledIndex2 = i;

        if (board[reveledIndex1] !== board[reveledIndex2]) {
            
            setTimeout(() => {

                let cards = document.querySelectorAll(".card");

                cards[reveledIndex1].textContent = "KER spomin";
                cards[reveledIndex2].textContent = "KER spomin";

                cards[reveledIndex1].classList.remove("odkrito");
                cards[reveledIndex2].classList.remove("odkrito");

                revealed[reveledIndex1] = false;
                revealed[reveledIndex2] = false;
            }, 2000);
        
        } 
        else {
            resene += 1;
            document.getElementById("pari").textContent = "Število rešenih parov: " + resene;

            setTimeout(() => {
                let cards = document.querySelectorAll(".card");
                cards[reveledIndex1].classList.add("resen");
                cards[reveledIndex2].classList.add("resen");
                cards[reveledIndex1].textContent = "";
                cards[reveledIndex2].textContent = "";
                cards[reveledIndex1].classList.remove("odkrito");
                cards[reveledIndex2].classList.remove("odkrito");
                cards[reveledIndex1].onclick="";
                cards[reveledIndex2].onclick="";
                cards[reveledIndex1].style.pointerEvents = "none";
                cards[reveledIndex2].style.pointerEvents = "none";
            }, 2000);
            


            if (resene == size) {
                document.getElementById("konec").textContent = "BRAVO!!!!!! Rešil si spomin.";
                clearInterval(timer);
                ustaviGlasbo();
                document.getElementById("igraj").textContent = "Glasba: OFF";
            }
        }

        revelCount = 0;
    }
}


let glasbaVklop = false;

function preklopiGlasbo() {
  glasbaVklop = !glasbaVklop;
  const el = document.getElementById("glasba");
  if (el) el.textContent = glasbaVklop ? "Glasba: ON" : "Glasba: OFF";
  if (glasbaVklop) {
    zazeniGlasbo();
  } else {
    ustaviGlasbo();
  }
}

function zazeniGlasbo() {
    document.getElementById("igraj").play();
    document.getElementById("glasba").textContent = "Glasba: ON";
    glasbaVklop=true;
}
  
function ustaviGlasbo() {
    document.getElementById("igraj").pause();
    document.getElementById("glasba").textContent = "Glasba: OFF";
    glasbaVklop=false;
}

function nastaviGlasnost(v) {
    const audio = document.getElementById("igraj");
    if (audio) {
      audio.volume = v;
    }
}
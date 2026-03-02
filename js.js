const slike = [
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=300&auto=format&fit=crop"
];

const hrbet = "https://images.unsplash.com/photo-1557683316-973673baf926?w=300&auto=format&fit=crop";

let board = [];
let odprte = [];
let prviIndex = null;
let drugiIndex = null;
let zaklenjeno = false;

let sekunde = 0;
let timer = null;
let timerZagnan = false;

let pariNajdeni = 0;
let poskusi = 0;
let pariSkupaj = 6;

let glasbaVklop = true;
let audioCtx = null;
let osc = null;
let gainNode = null;

function premesaj(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function posodobiIzpis() {
    document.getElementById("timer").textContent = formatCas(sekunde);
    document.getElementById("kliki").textContent = poskusi;
    document.getElementById("pari").textContent = pariNajdeni;
}

function formatCas(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
}

function zagonTimerjaObPrvemKliki() {
    if (timerZagnan) return;
    timerZagnan = true;
    timer = setInterval(() => {
        sekunde += 1;
        document.getElementById("timer").textContent = formatCas(sekunde);
    }, 1000);
}

function zamenjajTemo() {
    const jeTemna = document.body.classList.toggle("dark-theme");
    document.getElementById("panel").classList.toggle("dark-panel", jeTemna);
    document.getElementById("tema").textContent = jeTemna ? "☀️ Svetla tema" : "🌙 Temna tema";
}

function inicializirajGlasbo() {
    if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        audioCtx = new Ctx();
    }

    if (!gainNode) {
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.02;
        gainNode.connect(audioCtx.destination);
    }
}

function zazeniGlasbo() {
    if (!glasbaVklop) return;
    inicializirajGlasbo();

    if (osc) {
        return;
    }

    osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 220;
    osc.connect(gainNode);
    osc.start();
}

function ustaviGlasbo() {
    if (!osc) return;
    osc.stop();
    osc.disconnect();
    osc = null;
}

function preklopiGlasbo() {
    glasbaVklop = !glasbaVklop;
    const g = document.getElementById("glasba");

    if (glasbaVklop) {
        g.textContent = "🔈 Glasba: ON";
        zazeniGlasbo();
    } else {
        g.textContent = "🔇 Glasba: OFF";
        ustaviGlasbo();
    }
}

function naloziIgro() {
    pariSkupaj = parseInt(document.getElementById("size").value, 10);

    clearInterval(timer);
    timer = null;
    timerZagnan = false;
    sekunde = 0;

    pariNajdeni = 0;
    poskusi = 0;
    prviIndex = null;
    drugiIndex = null;
    zaklenjeno = false;

    document.getElementById("konec").textContent = "";

    const izbor = [...slike].slice(0, pariSkupaj);
    board = [...izbor, ...izbor];
    premesaj(board);

    odprte = Array(board.length).fill(false);

    const igraDiv = document.getElementById("igra");
    igraDiv.innerHTML = "";

    board.forEach((_, i) => {
        const card = document.createElement("button");
        card.className = "card";
        card.type = "button";
        card.style.backgroundImage = `url('${hrbet}')`;
        card.onclick = () => reveal(i);
        igraDiv.appendChild(card);
    });

    posodobiIzpis();

    ustaviGlasbo();
    zazeniGlasbo();
}

function reveal(i) {
    if (zaklenjeno || odprte[i]) return;

    zagonTimerjaObPrvemKliki();

    const cards = document.querySelectorAll(".card");
    cards[i].style.backgroundImage = `url('${board[i]}')`;
    cards[i].classList.add("revealed");
    odprte[i] = true;

    if (prviIndex === null) {
        prviIndex = i;
        return;
    }

    drugiIndex = i;
    zaklenjeno = true;
    poskusi += 1;
    document.getElementById("kliki").textContent = poskusi;

    const jePar = board[prviIndex] === board[drugiIndex];

    setTimeout(() => {
        if (jePar) {
            cards[prviIndex].classList.add("hidden");
            cards[drugiIndex].classList.add("hidden");
            pariNajdeni += 1;
            document.getElementById("pari").textContent = pariNajdeni;

            if (pariNajdeni === pariSkupaj) {
                clearInterval(timer);
                document.getElementById("konec").textContent = `Bravo! Končal si v ${formatCas(sekunde)} in ${poskusi} poskusih.`;
            }
        } else {
            cards[prviIndex].style.backgroundImage = `url('${hrbet}')`;
            cards[drugiIndex].style.backgroundImage = `url('${hrbet}')`;
            cards[prviIndex].classList.remove("revealed");
            cards[drugiIndex].classList.remove("revealed");
            odprte[prviIndex] = false;
            odprte[drugiIndex] = false;
        }

        prviIndex = null;
        drugiIndex = null;
        zaklenjeno = false;
    }, 2000);
}

const HRBTNA_STRAN = "🂠";
const VSI_SIMBOLI = ["🍀", "🎯", "🧩", "🚲", "🎲", "🎸", "🌈", "⭐"];

let igra = {
    pari: 6,
    timer: null,
    sekunde: 0,
    kliki: 0,
    reseniPari: 0,
    cakaj: false,
    prviIndex: null,
    drugiIndex: null,
    deck: [],
    odprto: [],
    vezano: false
};

let glasbaVklop = false;

function zamenjajTemo() {
    const jeTemna = document.body.classList.toggle("dark-theme");
    document.querySelector(".vse").classList.toggle("temno", jeTemna);
    document.getElementById("tema").textContent = jeTemna ? "☀️ Svetla tema" : "🌙 Temna tema";
}

function NaloziIgro() {
    resetStanjaIgre();
    pripraviDeck();
    narisiPlosco();
    if (!igra.vezano) {
        poveziKlikNaPlosci();
        igra.vezano = true;
    }
    igra.timer = setInterval(cas, 1000);
    zazeniGlasbo();
}

function resetStanjaIgre() {
    clearInterval(igra.timer);

    igra.pari = parseInt(document.getElementById("size").value, 10);
    igra.sekunde = 0;
    igra.kliki = 0;
    igra.reseniPari = 0;
    igra.cakaj = false;
    igra.prviIndex = null;
    igra.drugiIndex = null;
    igra.deck = [];
    igra.odprto = [];

    document.getElementById("timer").textContent = "00:00";
    document.getElementById("kliki").textContent = "Število klikov: 0";
    document.getElementById("pari").textContent = "Število rešenih parov: 0";
    document.getElementById("konec").textContent = "";
}

function pripraviDeck() {
    let aktivni = VSI_SIMBOLI.slice(0, igra.pari);
    let podvojen = [];

    for (let i = 0; i < aktivni.length; i++) {
        podvojen.push(aktivni[i]);
        podvojen.push(aktivni[i]);
    }

    for (let i = podvojen.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = podvojen[i];
        podvojen[i] = podvojen[j];
        podvojen[j] = tmp;
    }

    igra.deck = podvojen;
    igra.odprto = new Array(podvojen.length).fill(false);
}

function narisiPlosco() {
    const igraDiv = document.getElementById("igra");
    igraDiv.innerHTML = "";
    igraDiv.style.gridTemplateColumns = "repeat(4, 1fr)";

    for (let i = 0; i < igra.deck.length; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = HRBTNA_STRAN;
        card.dataset.index = String(i);
        igraDiv.appendChild(card);
    }
}

function poveziKlikNaPlosci() {
    const igraDiv = document.getElementById("igra");

    igraDiv.addEventListener("click", function (e) {
        const card = e.target.closest(".card");
        if (!card) return;
        const index = Number(card.dataset.index);
        reveal(index, card);
    });
}

function cas() {
    igra.sekunde += 1;
    const m = String(Math.floor(igra.sekunde / 60)).padStart(2, "0");
    const s = String(igra.sekunde % 60).padStart(2, "0");
    document.getElementById("timer").textContent = m + ":" + s;
}

function reveal(index, card) {
    igra.kliki += 1;
    document.getElementById("kliki").textContent = "Število klikov: " + igra.kliki;

    if (igra.cakaj) return;
    if (igra.odprto[index]) return;

    igra.odprto[index] = true;
    card.classList.add("odkrito");
    card.textContent = igra.deck[index];

    if (igra.prviIndex === null) {
        igra.prviIndex = index;
        return;
    }

    igra.drugiIndex = index;
    igra.cakaj = true;

    const jePar = igra.deck[igra.prviIndex] === igra.deck[igra.drugiIndex];

    if (jePar) {
        obdelajPar();
    } else {
        obdelajNapacenPar();
    }
}

function obdelajNapacenPar() {
    setTimeout(function () {
        const cards = document.querySelectorAll(".card");
        const i1 = igra.prviIndex;
        const i2 = igra.drugiIndex;

        cards[i1].classList.remove("odkrito");
        cards[i2].classList.remove("odkrito");
        cards[i1].textContent = HRBTNA_STRAN;
        cards[i2].textContent = HRBTNA_STRAN;

        igra.odprto[i1] = false;
        igra.odprto[i2] = false;

        resetOdprtPar();
    }, 2000);
}

function obdelajPar() {
    igra.reseniPari += 1;
    document.getElementById("pari").textContent = "Število rešenih parov: " + igra.reseniPari;

    setTimeout(function () {
        const cards = document.querySelectorAll(".card");
        const i1 = igra.prviIndex;
        const i2 = igra.drugiIndex;

        cards[i1].classList.remove("odkrito");
        cards[i2].classList.remove("odkrito");
        cards[i1].classList.add("resen");
        cards[i2].classList.add("resen");
        cards[i1].textContent = "";
        cards[i2].textContent = "";
        cards[i1].style.pointerEvents = "none";
        cards[i2].style.pointerEvents = "none";

        resetOdprtPar();
    }, 2000);

    if (igra.reseniPari === igra.pari) {
        document.getElementById("konec").textContent = "BRAVO!!!!!! Rešil si spomin.";
        clearInterval(igra.timer);
        ustaviGlasbo();
        document.getElementById("igraj").textContent = "Glasba: OFF";
    }
}

function resetOdprtPar() {
    igra.prviIndex = null;
    igra.drugiIndex = null;
    igra.cakaj = false;
}

function preklopiGlasbo() {
    glasbaVklop = !glasbaVklop;
    const gumb = document.getElementById("glasba");
    gumb.textContent = glasbaVklop ? "Glasba: ON" : "Glasba: OFF";

    if (glasbaVklop) {
        zazeniGlasbo();
    } else {
        ustaviGlasbo();
    }
}

function zazeniGlasbo() {
    document.getElementById("igraj").play();
    document.getElementById("glasba").textContent = "Glasba: ON";
    glasbaVklop = true;
}

function ustaviGlasbo() {
    document.getElementById("igraj").pause();
    document.getElementById("glasba").textContent = "Glasba: OFF";
    glasbaVklop = false;
}

function nastaviGlasnost(v) {
    const audio = document.getElementById("igraj");
    if (audio) audio.volume = v;
}

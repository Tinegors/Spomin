    let size =2;
    let timer;
    let sekunde=0;
    let board = [];
    let revealed = [];
    let revelCount=0;
    let reveledIndex1=0;
    let reveledIndex2=0;
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

      let izbraneSlike = slike[size];



function NaloziIgro() {

    slike8 = [
        ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2],
        ["🌊", 2], ["🔥", 2], ["🌙", 2], ["🎭", 2]
    ];

    slike6 = [
        ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2],
        ["🌊", 2], ["🔥", 2]
    ];

    slike4 = [
        ["🎨", 2], ["🎧", 2], ["🌍", 2], ["🚀", 2]
    ];

    document.getElementById("timer").textContent = "00:00";

    clearInterval(timer);
    sekunde = 0;

    timer = setInterval(cas, 1000);

    size = parseInt(document.getElementById("size").value);

    board = [];
    revealed = [];

    const igraDiv = document.getElementById("igra");
    igraDiv.innerHTML = "";

    igraDiv.style.gridTemplateColumns = `repeat(${4}, 1fr)`;


    let izbraneSlike = slike[size];

    for (let i = 0; i < size *2;) {

        let rnd = Math.floor(Math.random() * izbraneSlike.length);
        
        if(izbraneSlike[rnd][1]>0){
            revealed.push(false);

            const card = document.createElement("div");
            card.classList.add("card");
            card.textContent = "?";
            board[i] = izbraneSlike[rnd][0];
            izbraneSlike[rnd][1]-=1;
            igraDiv.appendChild(card);


            card.onclick = () => reveal(i-1, card);
            card.oncontextmenu = e => {
                e.preventDefault();
                toggleFlag(cell);
            };
            i++;
        }
    }
}
    

function cas() {
    sekunde++;
    let m = String(Math.floor(sekunde / 60)).padStart(2, "0");
    let s = String(sekunde % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${m}:${s}`;
}

function reveal(i, card) {
    revelCount++
    if(revelCount==0){
        if (revealed[i]) return;
        revealed[i] = true;
        card.textContent=board[i]

        card.classList.add("revealed");
        reveledIndex1=i;

    }
    else if(revelCount==1){
        if (revealed[i]) return;

        revealed[i] = true;
        card.textContent=board[i]

        card.classList.add("revealed");
        reveledIndex2=i;



        if(board[reveledIndex1!=reveledIndex2]){
            revealed[reveledIndex1] = false;
            revealed[reveledIndex2]=false

            //card.classList.add("revealed"); za oba morm nastudirat kk bom setu nazaj
        }

    }
    else revelCount=0; 
    

}
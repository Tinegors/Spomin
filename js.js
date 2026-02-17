    let size =2;
    let timer;
    let sekunde=0;
    let board = [];

    function NaloziIgro() {

        document.getElementById("timer").textContent = "00:00";
    
        clearInterval(timer);
        sekunde = 0;
    
        timer = setInterval(cas, 1000);
    
        size = parseInt(document.getElementById("size").value);
    
        board = [];
        revealed = [];
    
        const igraDiv = document.getElementById("igra");
        igraDiv.innerHTML = "";
    
        // grid velikost
        igraDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
        for (let i = 0; i < size * size; i++) {
    
            board.push(i);
            revealed.push(false);
    
            // ustvari kartico
            const card = document.createElement("div");
            card.classList.add("card");
            card.textContent = i + 1; // začasno da vidiš da dela
    
            igraDiv.appendChild(card);
        }
    }
    

function cas() {
    sekunde++;
    let m = String(Math.floor(sekunde / 60)).padStart(2, "0");
    let s = String(sekunde % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${m}:${s}`;
  }
class GameModel {
  constructor() {
    this.last_card = null;
    this.reveal_count = 0;

    // indicates if waiting after reveal to prevent more taps
    this.reveal_waiting = false;
  }

  init_cards(box, cols, rows) { 
    const len = cols * rows;
    // length must not be odd number
    if (len % 2 != 0) throw `VCardMatchErr: The number of cards must be even; found ${len} cards.`;

    const values = [];

    // generate pairs
    for (let i = 0; i < len / 2; i++) {
      values.push(String.fromCharCode(65 + i));
      values.push(String.fromCharCode(65 + i));
    }

    // shuffle 
    values.sort(() => Math.random() - 0.5);

    // this is for ratio display 
    let cr = Math.max(rows, cols);
    let wh = Math.max(box.clientWidth, box.clientHeight)
   
    // generate cards
    for (let i = 0; i < len; i++) {
      const card = document.createElement('button');
      card.classList.add('card');
      card.style.fontSize = `${wh/(cr*2)}px`;

      card.onclick = () => {
        this.reveal(card);
      };

      card._value = values[i]; 
      card._revealed = false;

      card.innerText = '?';

      box.appendChild(card); 
    }
    
  }

  reveal(card) {
    //console.log(`reveal: ${JSON.stringify(card)}`);
    if (card._revealed || this.reveal_waiting) return;

    card.innerText = card._value;
    card._revealed = true;


    // if we have last card
    if (this.last_card) {
      if (this.last_card._value === card._value) {
        this.reveal_count++;

        this.last_card.classList.add("matched_card");
        card.classList.add("matched_card");

        this.last_card = null;
      }
      else {
        // this is to fix an issue that comes when user types fast and there is a match
        //  the last_card becomes null, and the timeout want to use it
        const saved_last_card = this.last_card;
        this.last_card = null;

        // when for animation 
        this.reveal_waiting = true;

        setTimeout(() => {
          // in case user typed so fast, last_card becomes null if matched
          saved_last_card._revealed = false;
          saved_last_card.innerText = "?";
          card._revealed = false;
          card.innerText = "?";

          // done veiling
          this.reveal_waiting = false;
        }, 1000);
      }
    } else {
      // this card is last card
      this.last_card = card;
    }
  }

}
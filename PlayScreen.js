class PlayScreen extends BaseScreen {
  constructor(view) {
    super('play screen', view);

    // level manager 
    this.game_level = new GameLevel();
    this.game_level.current_lvl = this.game_level.levels[GameStorage.read('last_level_index', 0)];

    this.is_running = true;

    this.did_init_cards = false;

    //%Start A: settings for reveal and init of cards
    this.last_card = null;
    this.reveal_count = 0;
    this.wrong_reveal_count = 0;
    this.play_time = 0;
    // indicates if waiting after reveal to prevent more taps
    this.is_reveal_waiting = false;
    //%End A

    this.cards_box = document.createElement('div');
    this.cards_box.classList.add('cards_box');
    this.cards_box.id = 'cards_box_' + this.view.el_id_count++;

    // style for this
    this.cards_box.style.gridGap = '1em';
    this.cards_box.style.display = 'grid';

    this.add_gui();
  }

  add_gui() {
    this.gui_box = document.createElement('div');
    this.gui_box.style.width = "100%";
    this.gui_box.style.display = 'flex';
    this.gui_box.style.paddingTop = '0.5em';
    this.gui_box.style.paddingBottom = '0.5em';
    this.gui_box.style.alignContent = 'center';
    this.gui_box.style.justifyContent = 'center';
    this.gui_box.style.backgroundColor = 'rgba(120,0,80,0.08)';

    // the pause button
    let pause_btn = document.createElement('button');
    pause_btn.classList.add('mm_btn', );
    pause_btn.innerText = 'Pause';
    pause_btn.style.fontSize = '14px';
    pause_btn.onclick = () => {
      this.view.sound.click.play();
      setTimeout(() =>
        this.view.switch_to('mainmenu'), 200);
    }
    
    this.gui_box.appendChild(pause_btn);

    let lvl_shower = document.createElement('button');
    lvl_shower.classList.add('gui_txt');
    lvl_shower.innerText = `lvl ${1+this.game_level.levels.indexOf(this.game_level.current_lvl)}`;
    lvl_shower.style.fontSize = '14px';
    this.gui_box.appendChild(lvl_shower);

    this.time_shower = document.createElement('button');
    this.time_shower.classList.add('gui_txt');
    this.time_shower.innerText = 'time: 0 sec';
    this.time_shower.style.fontSize = '14px';
    this.gui_box.appendChild(this.time_shower);
  }

  hide() {
    this.is_running = false;
    this.cards_box.remove();
    this.gui_box.remove();
  }

  show() {
    this.is_running = true;
    el_main.appendChild(this.gui_box);
    el_main.appendChild(this.cards_box);

    // add the cards
    if (!this.did_init_cards) {
      this.did_init_cards = true;
      this.load_level(this.game_level.current_lvl);
    }
  }

  // refresh the view
  refresh(level_index) {
    // hide old view 
    this.hide();

    // trigger to init again
    this.did_init_cards = false;

    // get the level 
    if (level_index === undefined)
      this.game_level.current_lvl = this.game_level.levels[GameStorage.read('last_level_index', 0)];
    else
      this.game_level.current_lvl = this.game_level.levels[level_index];

    // we haven't cleared any card
    this.reveal_count = 0;
    this.wrong_reveal_count = 0;
    this.last_card = null;
    this.play_time = 0; // reset

    // clear the cards_box
    this.cards_box.innerHTML = '';

    // add the button, since it got cleared together 
    this.add_gui();

    // render
    this.show();
  }

  // gets called every some milliseconds 
  update(delta_time) {
    if (!this.is_running) return;

    this.play_time += delta_time;
    this.time_shower.innerText = `time: ${Math.floor(this.play_time/1000)} sec`;

    // check for win
    if (this.reveal_count === (this.game_level.current_lvl.rows * this.game_level.current_lvl.cols) / 2) {
      this.win();
      // pause
      this.is_running = false;
    }
  }

  // called when a level is won
  win() {
    // el_main.innerHTML = '';
    VisualEffects.confetti(el_main);

    // save level if this level is higher than any other won levels
    if (this.game_level.levels.indexOf(this.game_level.current_lvl) >= Number(GameStorage.read('last_level_index', 0)))
      GameStorage.save('last_level_index', 1 + this.game_level.levels.indexOf(this.game_level.current_lvl));

    // save total reveals
    GameStorage.save('total_reveals', this.reveal_count + Number(GameStorage.read('total_reveals', 0)));

    // save wrong reveals 
    GameStorage.save('total_wrong_reveals', this.wrong_reveal_count + Number(GameStorage.read('total_wrong_reveals', 0)));

    // save total time from first level
    GameStorage.save('total_time', this.play_time + Number(GameStorage.read('total_time', 0)));




    // save accuracy  
    // 1-(x-y)/y
    let accuracy = 1 - ((this.wrong_reveal_count - this.reveal_count) / this.reveal_count);

    // bounding 
    accuracy = Math.min(Math.max(accuracy, 0), 1);

    const db_acc = Number(GameStorage.read('accuracy', 1));
    GameStorage.save('accuracy', (accuracy + db_acc) / 2);


    // delay a bit before showing the message 
    setTimeout(() => {
      this.view.popups.notice.show('Won!',
        `<p>You have revealed a total of ${this.reveal_count*2} cards in ${this.play_time/1000} seconds. And wrong reveals count is ${this.wrong_reveal_count*2}. Therefore, accuracy is ${Math.floor(accuracy*100)}%. Click 'Next Level' to proceed!</p>`,
        [
          {
            name: 'Next Level',
            action: () =>
              this.refresh(1 + this.game_level.levels.indexOf(this.game_level.current_lvl))
          }
        ]
      );
    }, 500);
  }

  load_level(lvl) {
    // style the container
    this.cards_box.style.gridTemplateColumns = `repeat(${lvl.cols}, 1fr)`;
    this.cards_box.style.gridTemplateRows = `repeat(${lvl.rows}, 1fr)`;


    const len = lvl.cols * lvl.rows;
    // length must not be odd number
    if (len % 2 != 0) throw `VCardMatchErr: The number of cards must be even; found ${len} cards.`;

    const values = [];

    // generate pairs
    for (let i = 0; i < len / 2; i++) {
      values.push(lvl.data[i % lvl.data.length]);
      values.push(lvl.data[i % lvl.data.length]);
    }

    // shuffle 
    values.sort(() => Math.random() - 0.5);

    // this is for ratio display 
    let cr = Math.max(lvl.rows, lvl.cols);
    let wh = Math.max(this.cards_box.clientWidth, this.cards_box.clientHeight)

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

      this.cards_box.appendChild(card);
    }

  }

  reveal(card) {
    //console.log(`reveal: ${JSON.stringify(card)}`);
    if (card._revealed || this.is_reveal_waiting) return;

    card.innerHTML = `<span class="fas fa-${card._value}"></span>`;
    card._revealed = true;

    // sound 
    this.view.sound.flip.play();

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
        this.is_reveal_waiting = true;

        setTimeout(() => {
          // in case user typed so fast, last_card becomes null if matched
          saved_last_card._revealed = false;
          saved_last_card.innerText = "?";
          card._revealed = false;
          card.innerText = "?";

          this.wrong_reveal_count++;

          // done veiling
          this.is_reveal_waiting = false;

          // sound 
          this.view.sound.flip.play();
        }, 1000);
      }
    } else {
      // this card is last card
      this.last_card = card;
    }
  }
}
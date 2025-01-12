class StatsScreen extends BaseScreen {
  constructor(view) {
    super('map screen', view);

    // [Stat] [Stat]
    this.cols = 2;

    this.did_init_cards = false;

    this.cards_box = document.createElement('div');
    this.cards_box.classList.add('cards_box');
    this.cards_box.id = 'cards_box_' + this.view.el_id_count++;
    this.cards_box.style.overflowY = 'auto';
    this.cards_box.style.borderTop = '1px solid #750055';
    this.cards_box.style.borderBottom = '1px solid #750055';
    this.cards_box.style.padding = '1em';

    // style the container
    this.cards_box.style.gridGap = '1em';
    this.cards_box.style.display = 'grid';
    this.cards_box.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    this.cards_box.style.gridTemplateRows = `repeat(${this.cols}, 1fr)`;

    this.add_gui();
  }

  add_gui() {
    this.gui_box = document.createElement('div');
    this.gui_box.style.width = "100%";
    this.gui_box.style.display = 'flex';
    this.gui_box.style.alignContent = 'center';
    this.gui_box.style.justifyContent = 'center';
    this.gui_box.style.backgroundColor = 'rgba(120,0,80,0.08)';

    // the pause button
    let pause_btn = document.createElement('button');
    pause_btn.classList.add('mm_btn', 'back_to_menu_btn');
    pause_btn.innerText = 'Back';
    pause_btn.style.fontSize = '14px';
    pause_btn.onclick = () => setTimeout(() => {
      this.view.switch_to('mainmenu');
    }, 200);
    this.gui_box.appendChild(pause_btn);

  }

  hide() {
    this.is_running = false;

    this.cards_box.remove();
    // clear
    this.cards_box.innerHTML = '';
    this.did_init_cards = false;

    this.gui_box.remove();
  }

  show() {
    el_main.appendChild(this.gui_box);
    el_main.appendChild(this.cards_box);

    // add the cards
    if (!this.did_init_cards) {
      this.did_init_cards = true;
      this.load_map();
    }
  }

  load_map() {
    const data = [
      { name: 'Highest Level', value: GameStorage.read('last_level_index', 0), desc: 'This shows how far you are by indicating the highest level so far.' },
      { name: 'Total Reveals', value: GameStorage.read('total_reveals', 0), desc: 'This shows how many pairs of cards you have revealed in total.' },
      { name: 'Total Time', value: Utils.parse_time(GameStorage.read('total_time', 0)), desc: 'This shows total time you have used playing this game.' },

      ];

    // this is for ratio display 
    const wh = Math.max(this.cards_box.clientWidth, this.cards_box.clientHeight)

    // generate cards
    data.forEach((v, i, a) => {
      const card = document.createElement('div');
      card.classList.add('stats_card');

      card.innerHTML = `<h4>${v.name}:<br> = ${v.value}</h4>`;
      card.innerHTML += `<p>${v.desc}</p>`;

      this.cards_box.appendChild(card);
    });

  }
}
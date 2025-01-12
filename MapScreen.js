class MapScreen extends BaseScreen {
  constructor(view) {
    super('map screen', view);

    this.cols = 4;

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
    pause_btn.innerText = 'To Menu';
    pause_btn.style.fontSize = '14px';
    pause_btn.onclick = () => setTimeout(() => {
      this.view.switch_to('mainmenu');
    }, 200);
    this.gui_box.appendChild(pause_btn);

    let outof = document.createElement('span');
    outof.classList.add('gui_txt');
    outof.innerText = `levels count: ${GameStorage.read('last_level_index', 0)} out of ${GameStorage.read('total_levels', 0)}`;
    outof.style.fontSize = '14px';
    this.gui_box.appendChild(outof);
  }

  hide() {
    this.cards_box.remove();
    this.cards_box.innerHTML = '';
    this.did_init_cards = false;

    this.gui_box.remove();
  }

  show() {
    // update gui
    this.add_gui();
    el_main.appendChild(this.gui_box);
    el_main.appendChild(this.cards_box);

    // add the cards
    if (!this.did_init_cards) {
      this.did_init_cards = true;
      this.load_map();
    }
  }

  load_map() {
    const len = GameStorage.read('last_level_index', 0);

    // this is for ratio display 
    let wh = Math.max(this.cards_box.clientWidth, this.cards_box.clientHeight)

    // generate cards
    for (let i = 0; i < len; i++) {
      const card = document.createElement('button');
      card.classList.add('card');
      card.style.fontSize = `${wh/(this.cols*6)}px`;

      card._value = i;

      card.onclick = () => setTimeout(() => {
        this.view.screens.play.refresh(i);
        this.view.switch_to('play');
      }, 200);

      card.innerText = `lvl ${i+1}`;

      this.cards_box.appendChild(card);
    }


  }

}
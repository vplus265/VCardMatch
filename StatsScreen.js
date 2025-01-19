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
    this.gui_box.style.paddingTop = '0.5em';
    this.gui_box.style.paddingBottom = '0.5em';
    this.gui_box.style.alignContent = 'center';
    this.gui_box.style.justifyContent = 'center';
    this.gui_box.style.backgroundColor = 'rgba(120,0,80,0.08)';

    // the pause button
    let pause_btn = document.createElement('button');
    pause_btn.classList.add('mm_btn');
    pause_btn.innerText = 'Back';
    pause_btn.style.fontSize = '14px';
    pause_btn.onclick = () => setTimeout(() => {
      this.view.switch_to('mainmenu');
    }, 200);
    this.gui_box.appendChild(pause_btn);

    // the reset button
    let reset_btn = document.createElement('button');
    reset_btn.classList.add('mm_btn');
    reset_btn.innerText = 'Reset all';
    reset_btn.style.fontSize = '14px';
    reset_btn.onclick = () => setTimeout(() => {
      this.view.popups.notice.show(
        'WARNING!',
        '<p>Resetting will delete your whole progress, everything you have done so far.</p><p>Are you sure you want to delete?</p>',
        [
          { name: 'Cancel', action: () => 0 },

          {
            name: 'Yes, Delete!',
            action: () => {
              GameStorage.clear();

              // refresh the play screen 
              this.view.screens.play.refresh();
              // and hide it, since refresh will show it
              this.view.screens.play.hide();

              // refresh this stats screen 
              this.hide();
              this.show();
            }
          }, // Yes button
        ]
      );
    }, 200);
    this.gui_box.appendChild(reset_btn);
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
      { name: 'Highest Level', def_value: 0, value: GameStorage.read('last_level_index', 0), id: 'last_level_index', desc: 'This shows how far you are by indicating the highest level so far.' },

      { name: 'Total Reveals', def_value: 0, value: GameStorage.read('total_reveals', 0), id: 'total_reveals', desc: 'This shows how many pairs of cards you have revealed in total.' },
      { name: 'Total Wrong Reveals', def_value: 0, value: GameStorage.read('total_wrong_reveals', 0), id: 'total_wrong_reveals', desc: 'This shows how many pairs of cards you have revealed WRONGLY in total.' },
      { name: 'Overall Accuracy', def_value: '0%', value: Math.floor(100 * Number(GameStorage.read('accuracy', 0))) + "%", id: 'accuracy', desc: 'This shows the overall accuracy of the gameplay.' },

      { name: 'Total Time', def_value: 0, value: Utils.parse_time(GameStorage.read('total_time', 0)), id: 'total_time', desc: 'This shows total time you have used playing this game.' },

      ];

    // this is for ratio display 
    const wh = Math.max(this.cards_box.clientWidth, this.cards_box.clientHeight)

    // generate cards
    data.forEach((v, i, a) => {
      const card = document.createElement('div');
      card.classList.add('stats_card');
      this.cards_box.appendChild(card);

      const h4 = document.createElement('h4');
      h4.innerHTML = `${v.name}:<br> = ${v.value}`;
      card.appendChild(h4);

      const p = document.createElement('p');
      p.innerHTML += `${v.desc}`;
      card.appendChild(p);

      const reset_btn = document.createElement('button');
      reset_btn.classList.add('mm_btn');
      reset_btn.innerText = 'Reset';
      reset_btn.style = 'padding:0.5em; font-size: inherit';

      // perform the reset after 200 milliseconds
      reset_btn.onclick = () => setTimeout(() => {
        this.view.popups.notice.show(
          'WARNING!',
          `<p>Resetting '${v.name}' will reset whole thing from database to it's default value; You cannot undo.</p> <p>This will also reset the Play Screen.</p> <p>Are you sure you want to delete?</p>`,
        [
            // cancel does nothing 
            { name: 'Cancel', action: _ => _ },

            {
              name: 'Yes, Reset!',
              action: () => {
                // reset to default
                GameStorage.save(v.id, v.def_value);

                // refresh the play screen 
                this.view.screens.play.refresh();
                // and hide it, since refresh will show it
                this.view.screens.play.hide();

                // refresh this stats screen 
                this.hide();
                this.show();
              }
          }, // Yes button
        ]
        );
      }, 200);

      card.appendChild(reset_btn);

    });


  }
}
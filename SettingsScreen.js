class SettingsScreen extends BaseScreen {
  constructor(view) {
    super('settings screen', view);
    this.cols = 1;

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
    pause_btn.onclick = () => {
      this.view.sound.play('click');
      setTimeout(() =>
        this.view.switch_to('mainmenu'), 200);
    }
    this.gui_box.appendChild(pause_btn);

    // the reset button
    let reset_btn = document.createElement('button');
    reset_btn.classList.add('mm_btn');
    reset_btn.innerText = 'Reset all';
    reset_btn.style.fontSize = '14px';
    reset_btn.onclick = () => {
      this.view.sound.play('click');
      setTimeout(() => {
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
    }

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

      this.show_bg_vol();
      this.show_effects_toggle();
    }
  }

  show_effects_toggle() {
    // container
    const card = document.createElement('div');
    card.classList.add('stats_card');
    this.cards_box.append(card);

    // the label
    const name = document.createElement('h4');
    name.innerText = 'Enable sound effects: ';
    card.appendChild(name);

    // the toggle
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = (Number(GameStorage.read('sound_effects_play', 1)) === 1) ? true : false;
    toggle.addEventListener('change', () => {
      console.log('checked', toggle.checked)
      if (!toggle.checked) {
        this.view.sound.disable_effects();
      } else {
        this.view.sound.enable_effects();
      }
    });

    card.appendChild(toggle);
  }

  // volume
  show_bg_vol() {
    const card = document.createElement('div');
    card.classList.add('stats_card');
    this.cards_box.append(card);

    // the label
    const name = document.createElement('h4');
    name.innerText = 'Background music volume: ';
    card.appendChild(name);
    // the value 
    const name_value = document.createElement('span');
    name_value.innerText = this.view.sound.bg01.volume * 100;
    name.appendChild(name_value);

    // the slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.value = this.view.sound.bg01.volume * 100;
    slider.min = 0;
    slider.max = 100;
    slider.classList.add('volume-slider');
    // update on touch end
    slider.addEventListener('touchend', (e) => {
      GameStorage.save('sound_bg_volume', e.target.value / 100);
      this.view.sound.bg01.volume = e.target.value / 100;
      name_value.innerText = e.target.value;
    });
    // update on move
    slider.addEventListener('touchmove', (e) => {
      name_value.innerText = e.target.value;
    });
    // add the slider into the card
    card.appendChild(slider);
  }


}
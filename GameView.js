class GameView {
  constructor(model) {
    this.model = model;

    this.el_id_count = 0;

    this.did_switch_scrn = false;

    this.screens = {
      'about': new AboutScreen(this),
      'play': new PlayScreen(this),
      'mainmenu': new MainMenuScreen(this),
      'map': new MapScreen(this),
      'stats': new StatsScreen(this)
    };

    this.popups = {
      'notice': new NoticePopup(this)
    };

    this.current_screen = this.screens.mainmenu;
  }

  switch_to(scrn_name = 'mainmenu') {
    // hide the last one
    this.current_screen.hide();

    // get and show the new one
    this.current_screen = this.screens[scrn_name];
    this.current_screen.show();

    this.did_switch_scrn = true;
  }

  show() {
    this.current_screen.show();
  }

  // gets called every some milliseconds 
  update(delta_time) {
    this.current_screen.update(delta_time);
  }
}

class BaseScreen {
  constructor(name, view) {
    this.name = name;
    this.view = view;
  }
  update(delta_time) {}
  show() {}
  hide() {}
}

class AboutScreen extends BaseScreen {
  constructor(view) {
    super('about screen', view);

    this.about_box = document.createElement('div');
    this.about_box.classList.add('about_box');
    this.about_box.id = 'about_box_' + this.view.el_id_count++;

    this.about_box.innerHTML =
      `
<h1>About VCardMatch</h1>
<p>This is an html5 game based on the classic Card Matching game.</p>
<p>Created by <a href="https://github.com/vplus265">@Vplus265</a></p>
`;
    this.to_menu_btn = document.createElement('button');
    this.to_menu_btn.classList.add('mm_btn', 'back_to_menu_btn');
    this.to_menu_btn.innerText = 'To Menu';
    this.to_menu_btn.style.fontSize = '14px';
    this.to_menu_btn.onclick = () => setTimeout(() => this.view.switch_to('mainmenu'), 200);
    this.about_box.appendChild(this.to_menu_btn);
  }

  hide() {
    this.about_box.remove();
  }

  show() {
    document.getElementById('el_main').append(this.about_box);
  }
}

class NoticePopup extends BaseScreen {
  constructor(view) {
    super('notice popup', view);

    this.elements = []; // elements currently showing 
  }

  hide() {
    if (this.elements.length < 1) return;

    // make them disappear 
    this.elements.forEach((v, i, a) => v.style.opacity = '0');

    setTimeout(() => {
        // remove them from the body
        this.elements.forEach((v, i, a) => {
          v.remove();
        });

        this.elements = [];
      },
      500
    );
  }

  show(title, message, action_btn_data) {
    const info_box = document.createElement('div');
    info_box.classList.add('infobox');

    const title_element = document.createElement('span');
    title_element.innerText = title;
    title_element.classList.add('infobox_title');
    info_box.append(title_element);

    const info_element = document.createElement('div');
    info_element.innerHTML = message;
    info_element.classList.add('infobox_info');
    info_box.append(info_element);

    const ok_btn = document.createElement('button');
    ok_btn.innerText = action_btn_data.name;
    ok_btn.classList.add('popup_btn');
    ok_btn.onclick = () => {
      setTimeout(() => {
        this.hide();
        action_btn_data.action();
      }, 200);
    };

    info_box.append(ok_btn);

    const scrn_fill_box = document.createElement('div');
    scrn_fill_box.classList.add('scrn_fill_box');
    scrn_fill_box.innerHTML = '...';
    document.getElementById('el_main').append(scrn_fill_box);

    document.getElementById('el_main').append(info_box);
    this.elements = [info_box, scrn_fill_box];
  }

}
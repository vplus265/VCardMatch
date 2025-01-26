class MainMenuScreen extends BaseScreen {
  constructor(view) {
    super('main menu screen', view);

    // for menu itemz
    this.cols = 2;

    // sets `this.bg` property
    this.set_bg();

    this.mm_box = document.createElement('div');
    this.mm_box.classList.add('mm_box');
    this.mm_box.id = 'mm_box_' + this.view.el_id_count++;

    // style for this
    this.mm_box.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    this.mm_box.style.gridGap = '1em';
    this.mm_box.style.display = 'grid';

    // the title 
    this.title = document.createElement('h1');
    this.title.innerText = 'VCardMatch';
    this.title.style = 'background-color: white; color: #00aaff; padding: 0.2em; border-radius: 0.2em; font-size: 300%';

    // the data for the menu 
    this.data = [
      { name: 'Play', scrn_name: 'play' },
      { name: 'Map', scrn_name: 'map' },
      { name: 'Stats', scrn_name: 'stats' },
      { name: 'Setting', scrn_name: 'settings' },
      { name: 'About', scrn_name: 'about' },
      ];

    this.data.forEach((v, i, a) => {
      let btn = document.createElement('button');
      btn.innerText = v.name;
      btn.classList.add('mm_btn');
      // delay a bit, the run action 
      btn.onclick = () => {
        this.view.sound.play('click') ;
        setTimeout(() => this.view.switch_to(v.scrn_name), 200);
      };
      this.mm_box.append(btn);
    });
  }

  hide() {
    this.mm_box.remove();
    this.title.remove();
    this.bg.remove();
  }

  show() {
    el_main.append(this.bg)
    el_main.append(this.title)
    el_main.append(this.mm_box);
  }

  set_bg() {
    this.bg = document.createElement('canvas');
    this.bg.width = window.innerWidth;
    this.bg.height = window.innerHeight;
    this.bg.classList.add('anm_bg');

    this.bg._ctx = this.bg.getContext('2d');

    this.bg._objs = [];
    for (let i = 0; i < 20; i++) {
      this.bg._objs.push(
      {
        x: Math.random() * this.bg.width,
        y: Math.random() * this.bg.height,
        w: 50,
        h: 50,
        vel_x: Utils.random(-1, 1),
        vel_y: Utils.random(-1, 1),
        hue: Math.random() * 360,
        angle: 0
      });
    }
  }


  // gets called every some milliseconds 
  update(delta_time) {
    // bg
    this.bg._ctx.fillStyle = 'rgba(250,250,250,0.05) ';
    this.bg._ctx.fillRect(0, 0, this.bg.width, this.bg.height);
    // the objects 

    this.bg._objs.forEach((v, i, a) => {
      // store previous pos
      v.prev_x = v.x;
      v.prev_y = v.y;

      // update velocity 
      v.vel_y += Utils.random(-2, 2) * 0.1; // 0.1: smooth factor
      v.vel_y *= 0.9; // friction 
      v.vel_x += Utils.random(-2, 2) * 0.1;
      v.vel_x *= 0.9; // friction 

      // update position 
      v.y += v.vel_y * delta_time;
      v.x += v.vel_x * delta_time;
      // smooth angle update
      v.angle = (v.angle + 45) % 360; //(v.vel_x + v.vel_y) / 2 * 0.1;

      // interpolation of prev and current 
      v.x = v.prev_x + (v.x - v.prev_x) * 0.2;
      v.y = v.prev_y + (v.y - v.prev_y) * 0.2;

      // check boundaries 
      if (v.y > this.bg.height) v.y = -v.h;
      else if (v.y < -v.h) v.y = this.bg.height;
      if (v.x > this.bg.width) v.x = -v.w;
      else if (v.x < -v.w) v.x = this.bg.width;

      // save state of ctx
      this.bg._ctx.save();
      this.bg._ctx.translate(v.x + v.w / 2, v.y + v.h / 2);
      this.bg._ctx.rotate(v.angle);

      this.bg._ctx.fillStyle = `hsl(${v.hue}, 40%, 80%)`;
      this.bg._ctx.fillRect(-v.w / 2, -v.h / 2, v.w, v.h);
      this.bg._ctx.restore();

      this.bg._ctx.fillStyle = `hsl(${v.hue}, 70%, 80%)`;
      this.bg._ctx.fillRect(v.x + (v.w * 0.2), v.y + (v.h * 0.2), v.w - (v.w * 0.4), v.h - (v.h * 0.4));

    });

  }

}
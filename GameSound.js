class GameSound {
  constructor() {
    this.click = new Audio('sounds/click.ogg');
    this.flip = new Audio('sounds/flip.mp3');

    this.win = new Audio('sounds/win.mp3');
    
    // bg sounds
    this.bg01 = new Audio('sounds/bg01.mp3');
    this.bg01.loop = true;
  }
}
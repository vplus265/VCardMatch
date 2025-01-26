class GameSound {
  constructor() {
    this.click = new Audio('sounds/click.ogg');
    this.flip = new Audio('sounds/flip.mp3');

    this.win = new Audio('sounds/win.mp3');
    
    // bg sounds
    this.bg01 = new Audio('sounds/Velvet Serenity.mp3');
    this.bg01.volume = 0.5;
    this.bg01.loop = true;
  }
}
class GameSound {
  constructor() {
    // sound effect flag
    this.play_sounds = Number(GameStorage.read('sound_effects_play', 1));
    console.log(this.play_sounds)
    // the sound effects 
    this._ = {
      click: new Audio('sounds/click.ogg'),
      flip: new Audio('sounds/flip.mp3'),
      win: new Audio('sounds/win.mp3'),
    };

    // bg sounds
    this.bg01 = new Audio('sounds/Velvet Serenity.mp3');
    this.bg01.volume = Number(GameStorage.read('sound_bg_volume', 0.5));
    this.bg01.loop = true;
  }

  disable_effects() {
    this.play_sounds = 0;
    GameStorage.save('sound_effects_play', 0)
  }

  enable_effects() {
    this.play_sounds = 1;
    GameStorage.save('sound_effects_play', 1)
  }


  play(name) {
    if (this.play_sounds === 1)
      this._[name].play();
  }
}
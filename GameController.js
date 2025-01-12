class GameController {
  constructor() {
    this.STATE_START_RUNNING = 0;
    this.STATE_RUNNING = 1;

    this.STATE_PAUSED = 2;

    this.state = this.STATE_START_RUNNING;

    this.model = new GameModel();
    this.view = new GameView(this.model);

    this.prev_time = Date.now();
    this.delta_time = 0;
  }

  run() {
    const time = Date.now();
    this.delta_time = time - this.prev_time;
    this.prev_time = time;

    switch (this.state) {
      // this should be once 
      case this.STATE_START_RUNNING: {
        // reset

        // draw the graphics once
        this.view.show();

        // move to running state
        this.state = this.STATE_RUNNING;

        break;
      }

      case this.STATE_RUNNING: {
        this.view.update(this.delta_time);
        break;
      }

      default:
        throw `VCardMatchErr: Unknown state ${this.state}.`;

    }

    requestAnimationFrame(() => this.run());
  }
}
class GameLevel {
  constructor() {
    // current level
   this.current_lvl = null;

    // acceptable sizes
    this.sizes = [
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 3],
        [4, 4],
        [5, 4],
        [6, 5],
        [6, 6],
        [7, 6],
        [8, 7],
        [8, 8],
        [9, 8],
        [10, 9]
      ];

    this.levels = [ 
      ...(this.make_lvls('.N1$X,A2&Y-B3%X+C4@')),
      ...(this.make_lvls('AB')),
      ...(this.make_lvls('XYMN')),
      ...(this.make_lvls('AXBYCZDMN')),
      ...(this.make_lvls('@#AXBYCZDMN')),
      ...(this.make_lvls('12AX')),
      ...(this.make_lvls('Q1A2B3C4')),
      ...(this.make_lvls('PH1XA2YB3XC4@')),
      ...(this.make_lvls('1$XA2&YB3%XC4@')),
      ...(this.make_lvls('N1$XA2&YB3%XC4@')),
      ...(this.make_lvls('.N1$X,A2&Y-B3%X+C4@')),
    ]; 
    
    // save stats
    GameStorage.save('total_levels', this.levels.length);
  }

  make_lvls(data) {
    const arr = [];

    this.sizes.forEach((size, i, a) => {
      arr.push({
        name: `lvl_${size[0]}x${size[1]}`,
        cols: size[0],
        rows: size[1],
        data
      })
    });

    return arr;
  }
}
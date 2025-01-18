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

    // Initialize Font Awesome icon lists
    this.icons = {
      animals: [
        "dog", "cat", "fish", "dove", "dragon", "horse", "spider",
        "frog", "paw", "otter", "elephant", "hippo", "kiwi-bird", "rabbit"
      ].sort((a, b) => Math.random() - 0.5),

      shapes: [
        "heart", "star", "circle", "square", "gem", "cube",
        "exclamation-triangle", "play", "stop", "pause", "angle-right", "angle-left"
      ].sort((a, b) => Math.random() - 0.5),

      objects: [
        "car", "apple-alt", "music", "anchor", "bicycle", "book",
        "camera", "chess", "cloud", "coffee", "envelope", "flask",
        "guitar", "laptop", "mobile", "pencil-alt"
      ].sort((a, b) => Math.random() - 0.5),

      symbols: [
        "smile", "sun", "moon", "bolt", "cloud", "snowflake",
        "umbrella", "feather", "leaf", "water", "fire", "rainbow",
        "yin-yang", "peace", "infinity"
      ].sort((a, b) => Math.random() - 0.5),
    };

    this.mixed_icons = {
      anim_sym: [...this.icons.animals, ...this.icons.symbols].sort((a, b) => Math.random() - 0.5),
      anim_shap: [...this.icons.animals, ...this.icons.shapes].sort((a, b) => Math.random() - 0.5),
      shap_obj: [...this.icons.shapes, ...this.icons.objects].sort((a, b) => Math.random() - 0.5),
      obj_sym: [...this.icons.objects, ...this.icons.shapes].sort((a, b) => Math.random() - 0.5),
    };

    this.levels = [
      ...(this.make_lvls(this.icons.shapes)),
      ...(this.make_lvls(this.icons.symbols)),
      ...(this.make_lvls(this.icons.objects)),
      ...(this.make_lvls(this.icons.animals)),
      ...(this.make_lvls(this.mixed_icons.anim_sym)),
      ...(this.make_lvls(this.mixed_icons.anim_shap)),
      ...(this.make_lvls(this.mixed_icons.shap_obj)),
      ...(this.make_lvls(this.mixed_icons.obj_sym)),
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
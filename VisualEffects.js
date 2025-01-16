class VisualEffects {
  static confetti(container) {
    const canv = document.createElement('canvas');
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    canv.style.opacity = '0.8';
    canv.style.zIndex = '99'; // in front
    canv.style.position = 'absolute';
    container.appendChild(canv);

    const ctx = canv.getContext('2d');
    const particles = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canv.width / 2,
        y: 80,
        w: Utils.random(10, 30),
        h: Utils.random(5, 15),
        vx: Utils.random(-3, 3),
        vy: Utils.random(-6, 0.5),
        rot: Math.random() * Math.PI * 2, // rotation 
        rot_speed: Utils.random(-0.05, 0.05),
        color: `hsl(${Math.random()*360},80%,70%)`
      });
    }

    run();

    function run() {
      // end animation 
      if (particles.length == 0) {
        canv.remove();
        return;
      };

      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(0, 0, canv.width, canv.height);

      for (let i = 0; i < particles.length; i++) {
        const v = particles[i];

        // update 

        v.x += v.vx;
        v.y += v.vy;

        v.vy += 0.1; // gravity
        v.rot += v.rot_speed;

        // draw 
        ctx.save();
        ctx.translate(v.x, v.y);
        ctx.rotate(v.rot);
        ctx.fillStyle = v.color;
        ctx.fillRect(-v.w, -v.h, v.w, v.h);
        ctx.restore();

        if (v.y > canv.height) particles.splice(i, 1);
      }

      requestAnimationFrame(run);
    }
  }
}
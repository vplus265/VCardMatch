class GameImage {
  static load_svg(svg_path, container_id) {
    fetch(svg_path)
      .then(response => response.text())
      .then(svg_content => {
        const container = document.getElementById(container_id);
        container.innerHTML = svg_content;

        const svg = container.querySelector('svg');
        if (svg) {
          svg.style = 'max-width:100%; max-height:100%;'
        }
      })
      .catch(error => console.error('Error loading SVG:', error));
  }

  static get_svgs(svg_path, count, arr) {
    while (count-- > 0) {
      fetch(`${svg_path}_${count-1}.svg`)
        .then(response => response.text())
        .then(svg_content => {
          //console.log(svg_content)
          arr.push(svg_content);
        })
        .catch(error => console.error('Error loading SVG:', error));
    }
  }
}
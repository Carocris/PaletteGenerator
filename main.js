const colors = document.querySelectorAll('.color');
const refreshBtn = document.querySelector('.refresh-btn');
const paletteList = document.querySelector('.palette-list');
let paletteHistory = JSON.parse(localStorage.getItem('paletteHistory')) || [];

function generateColor() {
  const hexValues = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += hexValues[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generatePalette() {
  let palette = [];
  colors.forEach((color) => {
    let hexValue = generateColor();

    while (palette.includes(hexValue)) {
      hexValue = generateColor();
    }
    color.querySelector('.rect-box').style.backgroundColor = hexValue;
    color.querySelector('.hex-value').textContent = hexValue;
    palette.push(hexValue);
  });
  return palette;
}

function savePalette(paletteName, paletteColors) {
  paletteHistory.push({ name: paletteName, colors: paletteColors });
  localStorage.setItem('paletteHistory', JSON.stringify(paletteHistory));
  renderPaletteList();
}

function renderPaletteList() {
  paletteList.innerHTML = '';
  paletteHistory.forEach((palette, index) => {
    const paletteItem = document.createElement('li');
    paletteItem.classList.add('palette-item');
    const paletteName = document.createElement('span');
    paletteName.textContent = palette.name;
    paletteName.classList.add('palette-name');
    const paletteColors = document.createElement('div');
    paletteColors.classList.add('palette-colors');
    palette.colors.forEach((color) => {
      const colorBox = document.createElement('div');
      colorBox.style.backgroundColor = color;
      colorBox.classList.add('palette-color-box');

      colorBox.addEventListener('click', () => {
        showPalette(palette, colorBox.style.backgroundColor);
      });
      paletteColors.appendChild(colorBox);
    });
    paletteItem.appendChild(paletteName);
    paletteItem.appendChild(paletteColors);
    paletteList.appendChild(paletteItem);
  });
}

function showPalette(palette, selectedColor) {
  colors.forEach((color) => {
    color.style.display = 'flex';
    const hexValue = color.querySelector('.hex-value').textContent;
    if (palette.colors.includes(hexValue)) {
      color.style.display = 'none';
    }
    if (selectedColor && selectedColor === hexValue) {
      color.querySelector('.rect-box').style.backgroundColor = hexValue;
    }
  });
}

function clearHistory() {
  paletteHistory = [];
  localStorage.removeItem('paletteHistory');
  renderPaletteList();
}

refreshBtn.addEventListener('click', generatePalette);

colors.forEach((color) => {
  color.addEventListener('click', () => {
    const paletteName = prompt('Ingrese un nombre para su paleta:');
    if (paletteName) {
      const paletteColors = Array.from(colors).map((color) => color.querySelector('.hex-value').textContent);
      savePalette(paletteName, paletteColors);
    }
  });
});

const clearHistoryBtn = document.querySelector('.clear-history-btn');
clearHistoryBtn.addEventListener('click', clearHistory);

renderPaletteList();

generatePalette();

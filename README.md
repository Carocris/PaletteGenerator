# PaletteGenerator
Palette


const colors = document.querySelectorAll('.color');
const refreshBtn = document.querySelector('.refresh-btn');
const paletteList = document.querySelector('.palette-list');
let paletteHistory = JSON.parse(localStorage.getItem('paletteHistory')) || [];

// Function to generate random hex color code
function generateColor() {
  const hexValues = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += hexValues[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to generate a new palette
function generatePalette() {
  let palette = [];
  colors.forEach((color) => {
    let hexValue = generateColor();
    // Check if the hexValue is already in the palette
    while (palette.includes(hexValue)) {
      hexValue = generateColor();
    }
    color.querySelector('.rect-box').style.backgroundColor = hexValue;
    color.querySelector('.hex-value').textContent = hexValue;
    palette.push(hexValue);
  });
  return palette;
}

// Function to save a palette to local storage
function savePalette(paletteName, paletteColors) {
  paletteHistory.push({ name: paletteName, colors: paletteColors });
  localStorage.setItem('paletteHistory', JSON.stringify(paletteHistory));
  renderPaletteList();
}

// Function to render the palette list
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
      // Add event listener to show the palette when clicked
      colorBox.addEventListener('click', () => {
        showPalette(palette, colorBox);
      });
      paletteColors.appendChild(colorBox);
    });
    paletteItem.appendChild(paletteName);
    paletteItem.appendChild(paletteColors);
    paletteList.appendChild(paletteItem);
  });
}

// Function to show a palette when clicked in the palette list
function showPalette(palette, excludedColorBox) {
  colors.forEach((color) => {
    color.style.display = 'flex';
    const hexValue = color.querySelector('.hex-value').textContent;
    if (palette.colors.includes(hexValue)) {
      color.style.display = 'none';
    }
    if (excludedColorBox && excludedColorBox.style.backgroundColor === hexValue) {
      color.style.display = 'none';
    }
  });
}

// Event listener for the refresh button
refreshBtn.addEventListener('click', generatePalette);

// Event listener for clicking on a color
colors.forEach((color) => {
  color.addEventListener('click', (event) => {
    const paletteName = prompt('Ingrese un nombre para su paleta:');
    if (paletteName) {
      const paletteColors = Array.from(colors).map((color) => color.querySelector('.hex-value').textContent);
      savePalette(paletteName, paletteColors);
    }
  });
});

// Event listener for clicking on a palette in the palette list
paletteList.addEventListener('click', (event) => {
  const paletteItem = event.target.closest('.palette-item');
  if (paletteItem) {
    const paletteName = paletteItem.querySelector('.palette-name').textContent;
    const paletteColors = Array.from(paletteItem.querySelectorAll('.palette-color-box')).map((colorBox) => colorBox.style.backgroundColor);
    colors.forEach((color) => {
      const hexValue = color.querySelector('.hex-value').textContent;
      if (paletteColors.includes(hexValue)) {
        color.querySelector('.rect-box').style.backgroundColor = hexValue;
      }
    });
  }
});

// Initial render of the palette list
renderPaletteList();

// Generate initial palette
generatePalette();

const clearHistoryBtn = document.querySelector('.clear-history-btn');
clearHistoryBtn.addEventListener('click', clearHistory);

function clearHistory() {
    paletteHistory = [];
    localStorage.removeItem('paletteHistory');
    renderPaletteList();
  }
  
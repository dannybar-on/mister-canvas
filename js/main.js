'use strict';

const gCanvas = document.getElementById('canvas');
const gCtx = gCanvas.getContext('2d');

const gOptions = {
  bgColor: '#ffffff',
  fillColor: {
    hex: '#000000',
    r: 0,
    g: 0,
    b: 0,
  },
  shape: '0',
};

const gMouse = {
  x: 0,
  y: 0,
  isDown: false,
};

const gPosition = {
  x: 0,
  y: 0,
};

const gFont = {
  minFontSize: 5,
  counter: 0,
};

const letters =
  'My mother told me, someday I will buy, galleys with good oars, sail to distant shores.';

function onInit() {
  onResize();
  onSetupEvents();
  onSetupOptions();
}

function onSetupOptions() {
  document.querySelector('.bg-color').value = gOptions.bgColor;
  document.querySelector('.fill-color').value = gOptions.fillColor.hex;
  document.querySelector('.shapes').value = gOptions.shape;
}

function onSetupEvents() {
  window.addEventListener('resize', onResize, false);

  gCanvas.addEventListener('mousemove', onMouseMove, false);
  gCanvas.addEventListener('mousedown', onMouseDown, false);
  gCanvas.addEventListener('mouseup', onMouseUp, false);
  gCanvas.addEventListener('mouseout', onMouseUp, false);
}

function onResize() {
  gCanvas.width = window.innerWidth;
  gCanvas.height = window.innerHeight;
}

function onMouseMove(ev) {
  gMouse.x = ev.pageX;
  gMouse.y = ev.pageY;
  onDraw();
}

function onMouseDown(ev) {
  gPosition.x = ev.pageX;
  gPosition.y = ev.pageY;
  gMouse.isDown = true;
}

function onMouseUp() {
  gMouse.isDown = false;
}

function onSelectBackgroundColor(ev) {
  gOptions.bgColor = ev.target.value;
  document.body.style.backgroundColor = gOptions.bgColor;
}

function onSelectFillColor(ev) {
  gOptions.fillColor.hex = ev.target.value;
  gOptions.fillColor.r = parseInt(ev.target.value.substr(1, 2), 16);
  gOptions.fillColor.g = parseInt(ev.target.value.substr(3, 2), 16);
  gOptions.fillColor.b = parseInt(ev.target.value.substr(5, 2), 16);
}

function onSelectShape(ev) {
  gOptions.shape = ev.target.value;
}

function onDownloadCanvas(el) {
  el.href = gCanvas.toDataURL();
  el.download = 'my-canvas';
}

function onClearCanvas() {
  gCanvas.width = gCanvas.width;
}

function onDraw() {
  switch (gOptions.shape) {
    case '0':
      onDrawSquares();
      break;
    case '1':
      onDrawCircles();
      break;
    case '2':
      onDrawGrid();
      break;
    case '3':
      onDrawText();
      break;
  }
}

function onDrawSquares() {
  if (gMouse.isDown) {
    let dx = gMouse.x - gPosition.x;
    let dy = gMouse.y - gPosition.y;
    let angle = 1.57079633;
    let px = Math.cos(angle) * dx - Math.sin(angle) * dy;
    let py = Math.sin(angle) * dx + Math.cos(angle) * dy;

    gCtx.lineWidth = 1;
    gCtx.strokeStyle = gOptions.fillColor.hex;
    gCtx.fillStyle = gOptions.bgColor;

    gCtx.beginPath();
    gCtx.moveTo(gPosition.x - px, gPosition.y - py);
    gCtx.lineTo(gPosition.x + px, gPosition.y + py);
    gCtx.lineTo(gMouse.x + px, gMouse.y + py);
    gCtx.lineTo(gMouse.x - px, gMouse.y - py);
    gCtx.lineTo(gPosition.x - px, gPosition.y - py);
    gCtx.stroke();
    gCtx.fill();

    gPosition.x = gMouse.x;
    gPosition.y = gMouse.y;
  }
}

function onDrawCircles() {
  if (gMouse.isDown) {
    let dx = gMouse.x - gPosition.x;
    let dy = gMouse.y - gPosition.y;
    let d = Math.sqrt(dx * dx + dy * dy) * 2;
    let cx = Math.floor(gMouse.x / 100) * 100 + 50;
    let cy = Math.floor(gMouse.y / 100) * 100 + 50;
    let steps = Math.floor(Math.random() * 10);
    let deltaSteps = d / steps;

    gCtx.lineWidth = 1;
    gCtx.strokeStyle = `rgba(${gOptions.fillColor.r}, ${gOptions.fillColor.g}, ${gOptions.fillColor.b}, 0.1)`;

    for (let i = 0; i < steps; i++) {
      gCtx.beginPath();
      gCtx.arc(cx, cy, (steps - 1) * deltaSteps, 0, Math.PI * 2, true);
      gCtx.stroke();
    }

    gPosition.x = gMouse.x;
    gPosition.y = gMouse.y;
  }
}

function onDrawGrid() {
  if (gMouse.isDown) {
    let cx = Math.round(gMouse.x / 100) * 100;
    let cy = Math.round(gMouse.y / 100) * 100;
    let dx = (cx - gMouse.x) * 10;
    let dy = (cy - gMouse.y) * 10;

    gCtx.lineWidth = 1;
    gCtx.strokeStyle = `rgba(${gOptions.fillColor.r}, ${gOptions.fillColor.g}, ${gOptions.fillColor.b}, 0.01)`;

    for (let i = 0; i < 50; i++) {
      gCtx.beginPath();
      gCtx.moveTo(cx, cy);
      gCtx.quadraticCurveTo(
        gMouse.x + Math.random() * dx,
        gMouse.y + Math.random() * dy,
        cx,
        cy
      );
      gCtx.stroke();
    }
  }
}

function onDrawText() {
  if (gMouse.isDown) {
    let d = onDistance(gPosition, gMouse);
    let fontSize = gFont.minFontSize + d / 2;
    let letter = letters[gFont.counter];
    let stepSize = onTextWidth(letter, fontSize);

    if (d > stepSize) {
      let angle = Math.atan2(gMouse.y - gPosition.y, gMouse.x - gPosition.x);

      gCtx.font = fontSize + 'px Georgia';
      gCtx.fillStyle = gOptions.fillColor.hex;

      gCtx.save();
      gCtx.translate(gPosition.x, gPosition.y);
      gCtx.rotate(angle);
      gCtx.fillText(letter, 0, 0);
      gCtx.restore();
      gFont.counter++;

      if (gFont.counter > letters.length - 1) gFont.counter = 0;

      gPosition.x = gPosition.x + Math.cos(angle) * stepSize;
      gPosition.y = gPosition.y + Math.sin(angle) * stepSize;
    }
  }
}

function onDistance(pt1, pt2) {
  let xs = 0;
  let ys = 0;

  xs = pt2.x - pt1.x;
  xs = xs * xs;

  ys = pt2.y - pt1.y;
  ys = ys * ys;

  return Math.sqrt(xs + ys);
}

function onTextWidth(string, size) {
  gCtx.font = size + 'px Georgia';

  if (gCtx.fillText) return gCtx.measureText(string).width;
  else if (gCtx.mozDrawText) return gCtx.mozMeasureText(string);
}

const colorPicker = document.getElementById("color-picker")
const selectedColor = document.getElementById("selected-color")
const deltaInput = document.getElementById("delta")
const selectedDelta = document.getElementById("selected-delta")

const rgbColorBoxes = document.querySelectorAll('[id^="rgb-color-"]');
const hslColorBoxes = document.querySelectorAll('[id^="hsl-color-"]');
const hsvColorBoxes = document.querySelectorAll('[id^="hsv-color-"]');
const xyzColorBoxes = document.querySelectorAll('[id^="xyz-color-"]');
const labColorBoxes = document.querySelectorAll('[id^="lab-color-"]');
const luvColorBoxes = document.querySelectorAll('[id^="luv-color-"]');

const D65 = [95.047, 100, 108.883];
let deltaPct = 0.01;

(function() {
  colorPicker.addEventListener("change", onColorChange);
  deltaInput.addEventListener("change", onDeltaChange);
  onDeltaChange();
})()

function onColorChange() {
  const color = colorPicker.value;
  const rgbColor = hexToRgb(color);

  selectedColor.innerText = color;
  changeRgb(rgbColor);
  changeHsl(rgbColor);
  changeHsv(rgbColor);
  let {r, g, b} = rgbColor;
  let xyzColor = rgbToXyz(r, g, b);
  changeXyz(xyzColor);
  changeLab(xyzColor);
  changeLuv(xyzColor);
}

function onDeltaChange() {
  const delta = deltaInput.value;
  deltaPct = delta / 100.0;
  selectedDelta.innerText = delta;
  onColorChange();
}

/* On Change Callbacks */

function changeRgb(newColor) {
  let {r, g, b} = newColor;
  let rDelta = Math.round(deltaPct * 255);
  let gDelta = Math.round(deltaPct * 255);
  let bDelta = Math.round(deltaPct * 255);

  let rPlus  = r + rDelta > 255 ? r + rDelta - 255 : r + rDelta; 
  let gPlus  = g + gDelta > 255 ? g + gDelta - 255 : g + gDelta; 
  let bPlus  = b + bDelta > 255 ? b + bDelta - 255 : b + bDelta; 
  let rMinus = r - rDelta < 0   ? r - rDelta + 255 : r - rDelta; 
  let gMinus = g - gDelta < 0   ? g - gDelta + 255 : g - gDelta; 
  let bMinus = b - bDelta < 0   ? b - bDelta + 255 : b - bDelta; 

  let hex0 = rgbToHex(rPlus, g, b);
  let hex1 = rgbToHex(r, gPlus, b);
  let hex2 = rgbToHex(r, g, bPlus);
  let hex3 = rgbToHex(rMinus, g, b);
  let hex4 = rgbToHex(r, gMinus, b);
  let hex5 = rgbToHex(r, g, bMinus);

  rgbColorBoxes[0].innerText = hex0;
  rgbColorBoxes[1].innerText = hex1;
  rgbColorBoxes[2].innerText = hex2;
  rgbColorBoxes[3].innerText = hex3;
  rgbColorBoxes[4].innerText = hex4;
  rgbColorBoxes[5].innerText = hex5;

  rgbColorBoxes[0].style.background = hex0; 
  rgbColorBoxes[1].style.background = hex1; 
  rgbColorBoxes[2].style.background = hex2; 
  rgbColorBoxes[3].style.background = hex3; 
  rgbColorBoxes[4].style.background = hex4; 
  rgbColorBoxes[5].style.background = hex5; 
}

function changeHsl(newColor) {
  let {r, g, b} = newColor;
  let {h, s, l} = rgbToHsl(r, g, b);
  let hDelta = Math.round(deltaPct * 360);
  let sDelta = Math.round(deltaPct * 100);
  let lDelta = Math.round(deltaPct * 100);
  
  let hPlus  = h + hDelta > 360 ? h + hDelta - 360 : h + hDelta;
  let sPlus  = s + sDelta > 100 ? s + sDelta - 100 : s + sDelta;
  let lPlus  = l + lDelta > 100 ? l + lDelta - 100 : l + lDelta;
  let hMinus = h - hDelta < 0   ? h - hDelta + 360 : h - hDelta;
  let sMinus = s - sDelta < 0   ? s - sDelta + 100 : s - sDelta;
  let lMinus = l - lDelta < 0   ? l - lDelta + 100 : l - lDelta;

  let hex0 = rgbToHex(hslToRgb(hPlus, s, l));
  let hex1 = rgbToHex(hslToRgb(h, sPlus, l));
  let hex2 = rgbToHex(hslToRgb(h, s, lPlus));
  let hex3 = rgbToHex(hslToRgb(hMinus, s, l));
  let hex4 = rgbToHex(hslToRgb(h, sMinus, l));
  let hex5 = rgbToHex(hslToRgb(h, s, lMinus));

  hslColorBoxes[0].innerText = hex0; 
  hslColorBoxes[1].innerText = hex1; 
  hslColorBoxes[2].innerText = hex2; 
  hslColorBoxes[3].innerText = hex3; 
  hslColorBoxes[4].innerText = hex4; 
  hslColorBoxes[5].innerText = hex5; 

  hslColorBoxes[0].style.background = hex0;
  hslColorBoxes[1].style.background = hex1;
  hslColorBoxes[2].style.background = hex2;
  hslColorBoxes[3].style.background = hex3;
  hslColorBoxes[4].style.background = hex4;
  hslColorBoxes[5].style.background = hex5;
}

function changeHsv(newColor) {
  let {r, g, b} = newColor;
  let {h, s, v} = rgbToHsv(r, g, b);
  let hDelta = Math.round(deltaPct * 360);
  let sDelta = Math.round(deltaPct * 100);
  let vDelta = Math.round(deltaPct * 100);
  
  let hPlus  = h + hDelta > 360 ? h + hDelta - 360 : h + hDelta;
  let sPlus  = s + sDelta > 100 ? s + sDelta - 100 : s + sDelta;
  let vPlus  = v + vDelta > 100 ? v + vDelta - 100 : v + vDelta;
  let hMinus = h - hDelta < 0   ? h - hDelta + 360 : h - hDelta;
  let sMinus = s - sDelta < 0   ? s - sDelta + 100 : s - sDelta;
  let vMinus = v - vDelta < 0   ? v - vDelta + 100 : v - vDelta;

  let hex0 = rgbToHex(hsvToRgb(hPlus, s, v));
  let hex1 = rgbToHex(hsvToRgb(h, sPlus, v));
  let hex2 = rgbToHex(hsvToRgb(h, s, vPlus));
  let hex3 = rgbToHex(hsvToRgb(hMinus, s, v));
  let hex4 = rgbToHex(hsvToRgb(h, sMinus, v));
  let hex5 = rgbToHex(hsvToRgb(h, s, vMinus));

  hsvColorBoxes[0].innerText = hex0; 
  hsvColorBoxes[1].innerText = hex1; 
  hsvColorBoxes[2].innerText = hex2; 
  hsvColorBoxes[3].innerText = hex3; 
  hsvColorBoxes[4].innerText = hex4; 
  hsvColorBoxes[5].innerText = hex5; 

  hsvColorBoxes[0].style.background = hex0;
  hsvColorBoxes[1].style.background = hex1;
  hsvColorBoxes[2].style.background = hex2;
  hsvColorBoxes[3].style.background = hex3;
  hsvColorBoxes[4].style.background = hex4;
  hsvColorBoxes[5].style.background = hex5;
}

function changeXyz(newColor) {
  let {x, y, z} = newColor;
  let xDelta = Math.round(deltaPct * 100);
  let yDelta = Math.round(deltaPct * 100);
  let zDelta = Math.round(deltaPct * 100);

  let xPlus  = x + xDelta > 100 ? x + xDelta - 100 : x + xDelta;
  let yPlus  = y + yDelta > 100 ? y + yDelta - 100 : y + yDelta;
  let zPlus  = z + zDelta > 100 ? z + zDelta - 100 : z + zDelta;
  let xMinus = x - xDelta < 0   ? x - xDelta + 100 : x - xDelta;
  let yMinus = y - yDelta < 0   ? y - yDelta + 100 : y - yDelta;
  let zMinus = z - zDelta < 0   ? z - zDelta + 100 : z - zDelta;

  let hex0 = rgbToHex(xyzToRgb(xPlus, y, z));
  let hex1 = rgbToHex(xyzToRgb(x, yPlus, z));
  let hex2 = rgbToHex(xyzToRgb(x, y, zPlus));
  let hex3 = rgbToHex(xyzToRgb(xMinus, y, z));
  let hex4 = rgbToHex(xyzToRgb(x, yMinus, z));
  let hex5 = rgbToHex(xyzToRgb(x, y, zMinus));

  xyzColorBoxes[0].innerText = hex0; 
  xyzColorBoxes[1].innerText = hex1; 
  xyzColorBoxes[2].innerText = hex2; 
  xyzColorBoxes[3].innerText = hex3; 
  xyzColorBoxes[4].innerText = hex4; 
  xyzColorBoxes[5].innerText = hex5; 

  xyzColorBoxes[0].style.background = hex0;
  xyzColorBoxes[1].style.background = hex1;
  xyzColorBoxes[2].style.background = hex2;
  xyzColorBoxes[3].style.background = hex3;
  xyzColorBoxes[4].style.background = hex4;
  xyzColorBoxes[5].style.background = hex5;
} 

function changeLab(newColor) {
  let {x, y, z} = newColor;
  let {l, a, b} = xyzToLab(x, y, z);
  let lDelta = Math.round(deltaPct * 100);
  let aDelta = Math.round(deltaPct * 100);
  let bDelta = Math.round(deltaPct * 100);

  let lPlus  = l + lDelta > 100 ? l + lDelta - 100 : l + lDelta;
  let aPlus  = a + aDelta > 100 ? a + aDelta - 100 : a + aDelta;
  let bPlus  = b + bDelta > 100 ? b + bDelta - 100 : b + bDelta;
  let lMinus = l - lDelta < 0   ? l - lDelta + 100 : l - lDelta;
  let aMinus = a - aDelta < 0   ? a - aDelta + 100 : a - aDelta;
  let bMinus = b - bDelta < 0   ? b - bDelta + 100 : b - bDelta;

  let hex0 = rgbToHex(xyzToRgb(labToXyz(lPlus, a, b)));
  let hex1 = rgbToHex(xyzToRgb(labToXyz(l, aPlus, b)));
  let hex2 = rgbToHex(xyzToRgb(labToXyz(l, a, bPlus)));
  let hex3 = rgbToHex(xyzToRgb(labToXyz(lMinus, a, b)));
  let hex4 = rgbToHex(xyzToRgb(labToXyz(l, aMinus, b)));
  let hex5 = rgbToHex(xyzToRgb(labToXyz(l, a, bMinus)));

  labColorBoxes[0].innerText = hex0; 
  labColorBoxes[1].innerText = hex1; 
  labColorBoxes[2].innerText = hex2; 
  labColorBoxes[3].innerText = hex3; 
  labColorBoxes[4].innerText = hex4; 
  labColorBoxes[5].innerText = hex5; 

  labColorBoxes[0].style.background = hex0;
  labColorBoxes[1].style.background = hex1;
  labColorBoxes[2].style.background = hex2;
  labColorBoxes[3].style.background = hex3;
  labColorBoxes[4].style.background = hex4;
  labColorBoxes[5].style.background = hex5;
} 

function changeLuv(newColor) {
  let {x, y, z} = newColor;
  let {l, u, v} = xyzToLuv(x, y, z);
  let lDelta = Math.round(deltaPct * 100);
  let uDelta = Math.round(deltaPct * 100);
  let vDelta = Math.round(deltaPct * 100);

  let lPlus  = l + lDelta > 100 ? l + lDelta - 100 : l + lDelta;
  let uPlus  = u + uDelta > 100 ? u + uDelta - 100 : u + uDelta;
  let vPlus  = v + vDelta > 100 ? v + vDelta - 100 : v + vDelta;
  let lMinus = l - lDelta < 0   ? l - lDelta + 100 : l - lDelta;
  let uMinus = u - uDelta < 0   ? u - uDelta + 100 : u - uDelta;
  let vMinus = v - vDelta < 0   ? v - vDelta + 100 : v - vDelta;

  let hex0 = rgbToHex(xyzToRgb(luvToXyz(lPlus, u, v)));
  let hex1 = rgbToHex(xyzToRgb(luvToXyz(l, uPlus, v)));
  let hex2 = rgbToHex(xyzToRgb(luvToXyz(l, u, vPlus)));
  let hex3 = rgbToHex(xyzToRgb(luvToXyz(lMinus, u, v)));
  let hex4 = rgbToHex(xyzToRgb(luvToXyz(l, uMinus, v)));
  let hex5 = rgbToHex(xyzToRgb(luvToXyz(l, u, vMinus)));

  luvColorBoxes[0].innerText = hex0; 
  luvColorBoxes[1].innerText = hex1; 
  luvColorBoxes[2].innerText = hex2; 
  luvColorBoxes[3].innerText = hex3; 
  luvColorBoxes[4].innerText = hex4; 
  luvColorBoxes[5].innerText = hex5; 

  luvColorBoxes[0].style.background = hex0;
  luvColorBoxes[1].style.background = hex1;
  luvColorBoxes[2].style.background = hex2;
  luvColorBoxes[3].style.background = hex3;
  luvColorBoxes[4].style.background = hex4;
  luvColorBoxes[5].style.background = hex5;
} 

/* Color Conversion */

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  if (arguments.length === 1) {
    b = r.b; 
    g = r.g; 
    r = r.r; 
  }
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r,g,b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let cmin = Math.min(r,g,b);
  let cmax = Math.max(r,g,b);
  let delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta == 0) {
    h = 0;
  } else if (cmax == r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax == g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) {
      h += 360;
  }

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {h, s, l};
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c/2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;  
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return {r, g, b};
}

function rgbToHsv(r, g, b) {
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;
  let h;
  let s = (max === 0 ? 0 : d / max);
  let v = max / 255;

  switch (max) {
    case min: h = 0; break;
    case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
    case g: h = (b - r) + d * 2; h /= 6 * d; break;
    case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return { 
    h: Math.round(h * 360), 
    s: Math.round(s * 100), 
    v: Math.round(v * 100)
  };
}


function hsvToRgb(h, s, v) {
  let r, g, b, i, f, p, q, t;
  h /= 360;
  s /= 100;
  v /= 100;

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// reference: https://www.easyrgb.com/en/math.php
// standard illuminant (D65/2°) is used

function rgbToXyz(r, g, b) {
  if (arguments.length === 1) {
    b = r.b; 
    g = r.g; 
    r = r.r; 
  }
  const [varR, varG, varB] = [r, g, b]
    .map(x => x / 255)
    .map(x => x > 0.04045 ? Math.pow(((x + 0.055) / 1.055), 2.4) : x / 12.92)
    .map(x => x * 100);
  x = varR * 0.4124 + varG * 0.3576 + varB * 0.1805;
  y = varR * 0.2126 + varG * 0.7152 + varB * 0.0722;
  z = varR * 0.0193 + varG * 0.1192 + varB * 0.9505;
  return {
    x: Math.round(x),
    y: Math.round(y), 
    z: Math.round(z)
  };
}

function xyzToRgb(x, y, z) {
  if (arguments.length === 1) {
    z = x.z; 
    y = x.y; 
    x = x.x; 
  }
  let varX = x / 100;
  let varY = y / 100;
  let varZ = z / 100;

  varR = varX *  3.2406 + varY * -1.5372 + varZ * -0.4986;
  varG = varX * -0.9689 + varY *  1.8758 + varZ *  0.0415;
  varB = varX *  0.0557 + varY * -0.2040 + varZ *  1.0570;

  let [r, g, b] = [varR, varG, varB]
    .map(n => Math.max(0, Math.min(1.0, n)))
    .map(n => n > 0.0031308 ? 1.055 * Math.pow(n, (1 / 2.4)) - 0.055 : 12.92 * n)
    .map(n => Math.round(n * 255));
  return {r, g, b};
}

function xyzToLab(x, y, z) {
  const [varX, varY, varZ] = [x, y, z]
    .map((a, i) => a / D65[i])
    .map(a => a > 0.008856 ? Math.pow(a, 1 / 3) : (7.787 * a) + (16 / 116));

  return {
    l: Math.round((116 * varY) - 16),
    a: Math.round(500 * (varX - varY)),
    b: Math.round(200 * (varY - varZ))
  };
}

function labToXyz(l, a, b) {
  const varY = (l + 16) / 116;
  const varX = a / 500 + varY;
  const varZ = varY - b / 200;

  const [x, y, z] = [varX, varY, varZ]
    .map(n => Math.pow(n, 3) > 0.008856 ? Math.pow(n, 3) : (n - 16 / 116) / 7.787)
    .map((n, i) => n * D65[i]);

  return {x, y, z};
}

function xyzToLuv(x, y, z) {
  const varU = (4 * x) / (x + (15 * y) + (3 * z));
  const varV = (9 * y) / (x + (15 * y) + (3 * z));
  let varY = y / 100;
  varY = varY > 0.008856 ? Math.pow(varY, 1 / 3) : (7.787 * varY) + (16 / 116);

  const refU = (4 * D65[0]) / (D65[0] + (15 * D65[1]) + (3 * D65[2]));
  const refV = (9 * D65[1]) / (D65[0] + (15 * D65[1]) + (3 * D65[2]));

  const l = (116 * varY) - 16;
  const u = 13 * l * (varU - refU);
  const v = 13 * l * (varV - refV);

  return {l, u, v};
}

function luvToXyz(l, u, v) {
  let varY = (l + 16) / 116;
  varY = Math.pow(varY, 3) > 0.008856 ? Math.pow(varY, 3) : (varY - 16 / 116) / 7.787;

  const refU = (4 * D65[0]) / (D65[0] + (15 * D65[1]) + (3 * D65[2]));
  const refV = (9 * D65[1]) / (D65[0] + (15 * D65[1]) + (3 * D65[2]));
  const varU = u / (13 * l) + refU;
  const varV = v / (13 * l) + refV;

  const y = varY * 100;
  const x = -(9 * y * varU) / ((varU - 4) * varV - varU * varV);
  const z = (9 * y - (15 * varV * y) - (varV * x)) / (3 * varV);

  return {x, y, z};
}


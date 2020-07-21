var points = [];
const margin = 30;
var range;
var sizeX, sizeY;
var average;
var reg = {a: undefined, b: undefined, p: undefined};
var input;
var button;


function setup() {
  createCanvas(550, 550);
  strokeWeight(2);
  sizeX = width - 2 * margin;
  sizeY = height - 2 * margin;
  input = createInput();
  button = createButton('Add');
}

function draw() {
  background(255);
  translate(0, height);
  button.mousePressed( ()=> {
    let p = input.value();
      if(p.includes(',')) {
        let cIndex = p.indexOf(',');
        let num1 = int(p.substring(0, cIndex));
        let num2 = int(p.substring(cIndex + 1, p.length));
        console.log(num1);
        console.log(num2);
        points.push( [num1, num2] );
        newReg();
        console.log(points);
      }
    })
  scale(1, -1);
  line(margin, 0, margin, height);
  line(0, margin, width, margin);
  for(let i = 0; i < 10; i++) {
    let x = margin + (i + 1) * (sizeX / 10);
    line(x, margin - 5, x, margin + 5);
    let y = margin + (i + 1) * (sizeY / 10);
    line(margin - 5, y, margin + 5, y);
  }
  
  // drawing the adjusted line
  if(reg.a != undefined && reg.b != undefined) {
    let y0 = map(reg.a, 0, range, margin, height - margin);
    let yf = map(reg.a + reg.b * range, 0, range, margin, height - margin);
    push();
    line(margin, y0, width - margin, yf);
    translate(0, height);
    scale(1, -1);
    text('p = ' + reg.p.toFixed(4), width - 2 *margin, height - 2 *margin);
    pop();
  }
  
  for(let pnt of points) {
    let x = map(pnt[0], 0, range, margin, width - margin);
    let y = map(pnt[1], 0, range, margin, height - margin);
    push();
    stroke(250, 10, 50);
    strokeWeight(5);
    point(x, y);
    pop();
  }
}

// checks whether x or y has greater range and returns the range
function chkRng(arr) {
  let minX = Infinity;
  let maxX = 0;
  let minY = Infinity;
  let maxY = 0;
  for(let i = 0; i < arr.length; i++) {
    if(arr[i][0] > maxX) {
      maxX = arr[i][0];
    }
    if(arr[i][0] < minX) {
      minX = arr[i][0];
    }
    if(arr[i][1] > maxY) {
      maxY = arr[i][1];
    }
    if(arr[i][1] < minY) {
      minY = arr[i][1];
    }
  }
  
  // checking the max between x range and y range
  let rngX = maxX - minX;
  let rngY = maxY - minY;
  return max(rngX, rngY);
}

// input: array of points [x, y]
function avgPoints(arr) {
  let avgX = 0;
  let avgY = 0;
  for(let el of arr) {
    avgX += el[0];
    avgY += el[1];
  }
  avgX /= arr.length;
  avgY /= arr.length;
  return [avgX, avgY];
}

// input: array of points [x, y]
// returns an object with values of a, b and p (Pearson correlation coefficient)
// linear equation: y = a + bx
function regLin(arr) {
  // this function uses the method of least squares
  // https://en.wikipedia.org/wiki/Least_squares
  let avg = avgPoints(arr);
  
  // b = cov(x, y) / var(x)
  // var(x) = sum of (xi - average x)^2 / n,
  // cov(x, y) = (xi - average x) * (yi - average y)
  let covXY = 0;
  let varX = 0;
  let varY = 0;
  for(let i = 0; i < arr.length; i++) {
    covXY += (arr[i][0] - avg[0]) * (arr[i][1]- avg[1]) / arr.length;
    varX += sq(arr[i][0] - avg[0]) / arr.length;
    varY += sq(arr[i][1] - avg[1]) / arr.length;
  }
  covXY /= arr.length;
  varX /= arr.length;
  varY /= arr.length;
  
  let b = covXY / varX;
  
  // since we've found b, now we can find a
  // a = average y - b * average x
  
  let a = avg[1] - (b * avg[0]);
  
  // now we're calculating the Pearson correlation coefficient
  // p = cov(x, y) / sqrt(var(x) * var(y))
  let p = covXY / sqrt(varX * varY);
  return {a: a, b: b, p: p};
}

function newReg() {
  range = chkRng(points);
  reg = regLin(points);
  console.log(reg);
}


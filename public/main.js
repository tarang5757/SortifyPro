const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const speedControl = document.getElementById('speedControl');
const stepCounter = document.getElementById('stepCounter');

let bars = [];
let animationSpeed = 300;

// this function generates an array of random heights for bars
function generateBars() {
    bars = [];
    for (let i = 0; i < 50; i++) {
        bars.push(Math.floor(Math.random() * (canvas.height - 10)) + 10);
    }
}

//this function draws bars on the canvas with improved borders
function drawBars(step) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#3498db'); // Blue
    gradient.addColorStop(1, '#2980b9'); // Slightly darker blue
    ctx.fillStyle = gradient;

    for (let i = 0; i < bars.length; i++) {
        const barHeight = bars[i];
        const x = i * 12;
        const y = canvas.height - barHeight;

        //draw main rectangle without the white border
        ctx.fillRect(x, y, 10, barHeight);

        //draw borders
        drawBorders(x, y, barHeight);
    }

    //display step count
    stepCounter.innerText = `Step: ${step}`;
}

//this function  draws borders around the bars
function drawBorders(x, y, barHeight) {
    ctx.fillStyle = '#1f2c39'; //darker color for the top border
    ctx.fillRect(x, y, 10, 2); //draw top border

    ctx.fillStyle = '#1f2c39'; // darker color for the right border
    ctx.fillRect(x + 8, y, 2, barHeight); // draw right border

    ctx.fillStyle = '#102330'; // darker color for the bottom border
    ctx.fillRect(x, y + barHeight - 2, 10, 2); // Draw bottom border

    ctx.fillStyle = '#102330'; // darker color for the left border
    ctx.fillRect(x, y, 2, barHeight); // draw left border
}

// Function to change the color of a single bar
function setColor(index, color) {
    ctx.fillStyle = color;
    ctx.fillRect(index * 12, canvas.height - bars[index], 10, bars[index]);
}

// Delay function for animation
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const COMPARISON_COLOR = '#e74c3c'; // Red color for comparisons

// Function to change the color of a single bar during comparison
function setColorComparison(index) {
    ctx.fillStyle = COMPARISON_COLOR;
    ctx.fillRect(index * 12, canvas.height - bars[index], 10, bars[index]);
}

// Insertion Sort
async function insertionSort() {
    const n = bars.length;
    let steps = 0;
    for (let i = 1; i < n; i++) {
        let key = bars[i];
        let j = i - 1;
        while (j >= 0 && bars[j] > key) {
            bars[j + 1] = bars[j];
            setColorComparison(j + 1); // change color during comparison
            await delay(animationSpeed);
            drawBars(++steps);
            j = j - 1;
        }
        bars[j + 1] = key;
        drawBars(++steps);
        await delay(animationSpeed);
    }
}

// quick Sort
async function quickSort(start, end) {
    if (start < end) {
        const pivotIndex = await partition(start, end);
        await quickSort(start, pivotIndex - 1);
        await quickSort(pivotIndex + 1, end);
    }
}

// this  function which is used to break the array into pieces for Quick Sort
async function partition(start, end) {
    const pivot = bars[end];
    let i = start - 1;

    for (let j = start; j <= end - 1; j++) {
        if (bars[j] < pivot) {
            i++;
            [bars[i], bars[j]] = [bars[j], bars[i]];
            setColorComparison(i); // change color during comparison
            setColorComparison(j);
            await delay(animationSpeed);
            drawBars();
        }
    }

    [bars[i + 1], bars[end]] = [bars[end], bars[i + 1]];
    setColorComparison(i + 1); // change color during comparison
    setColorComparison(end);
    await delay(animationSpeed);
    drawBars();

    return i + 1;
}

// bubble Sort
async function bubbleSort() {
    const n = bars.length;
    let steps = 0;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            steps++;
            if (bars[j] > bars[j + 1]) {
                [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
                setColorComparison(j); // Change color during comparison
                setColorComparison(j + 1);
                await delay(animationSpeed);
                drawBars(steps);
            }
        }
    }
}

// Merge Sort
async function mergeSort() {
    bars = await mergeSortHelper(bars, 0, bars.length - 1);
    colorBarsGreen(); // change color to green when sorting is finished
}

// helper function for Merge Sort
async function mergeSortHelper(arr, start, end) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(arr, start, mid);
        await mergeSortHelper(arr, mid + 1, end);
        await merge(arr, start, mid, end);
    }
    return arr;
}

// merge function for Merge Sort
async function merge(arr, start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
        setColorComparison(k - 1); // Change color during comparison
        await delay(animationSpeed);
        drawBars();
    }

    while (i < left.length) {
        arr[k++] = left[i++];
        setColorComparison(k - 1); // Change color during comparison
        await delay(animationSpeed);
        drawBars();
    }

    while (j < right.length) {
        arr[k++] = right[j++];
        setColorComparison(k - 1); // Change color during comparison
        await delay(animationSpeed);
        drawBars();
    }
}

// this function  sets color of all bars to green
function colorBarsGreen() {
    for (let i = 0; i < bars.length; i++) {
        setColor(i, '#2ecc71'); // green color
    }
}

// event listener for merge sort button
document.getElementById('mergeSort').addEventListener('click', async () => {
    generateBars();
    drawBars(0);
    animationSpeed = 300 / speedControl.value;
    await mergeSort();
    drawBars(bars.length); // sisplay final step count
    colorBarsGreen(); // change color to green when sorting is finished
});

// event listener for quick sort button
document.getElementById('quickSort').addEventListener('click', async () => {
    generateBars();
    drawBars(0);
    animationSpeed = 300 / speedControl.value;
    await quickSort(0, bars.length - 1);
    drawBars(bars.length); // display final step count
    colorBarsGreen(); // change color to green when sorting is finished
});

// Event listener for bubble sort button
document.getElementById('bubbleSort').addEventListener('click', async () => {
    generateBars();
    drawBars(0);
    animationSpeed = 300 / speedControl.value;
    await bubbleSort();
    drawBars(bars.length); // sisplay final step count
    colorBarsGreen(); // change color to green when sorting is finished
});

// Event listener for insertion sort button
document.getElementById('insertionSort').addEventListener('click', async () => {
    generateBars();
    drawBars(0);
    animationSpeed = 300 / speedControl.value;
    await insertionSort();
    drawBars(bars.length); // display final step count
    colorBarsGreen(); // change color to green when sorting is finished
});

// event listener for speed control slider
speedControl.addEventListener('input', () => {
    animationSpeed = 300 / speedControl.value;
});

// initial setup to draw the bars 
generateBars();
drawBars(0);

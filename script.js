let runningTotal = 0;
let buffer = "0";
let previousOperator;
let isWaiting = false;
const PLUS = "+";
const MINUS = "−";
const DIVIDE = "÷";
const MULTIPLY = "×";
const screen = document.querySelector('#screen');
const subScreen= document.querySelector('#sub-screen');

function buttonClick(value) {
    if (isNaN(value) && value !== ".") {
        handleSymbol(value);
        
    } else {
        handleNumber(value);
    }
    if(buffer === "Cannot divide by 0"){
        subScreen.innerHTML= "&nbsp;";
    };
    screen.innerText = buffer;
}

function performOperation(floatBuffer) {
    if (previousOperator === PLUS) {
        runningTotal += floatBuffer;
    } else if (previousOperator === MINUS) {
        runningTotal -= floatBuffer;
    } else if (previousOperator === MULTIPLY) {
        runningTotal *= floatBuffer;
    } else if (previousOperator === DIVIDE) {
        if (floatBuffer === 0) {
            buffer = "Cannot divide by 0";
        } else {
            runningTotal /= floatBuffer;
        }
    }
}

function handleNumber(numberString) {
    if (buffer === "Cannot divide by 0") {
        runningTotal = 0;
    }
    if (isWaiting) {
        if (previousOperator === null) {
            document.querySelector('#sub-screen').innerHTML = "&nbsp;";
        }
        buffer = (numberString === ".") ? "0." : numberString;
        isWaiting = false;
        return;
    }


    if (buffer.length >= 12) return;
    
    if (numberString === ".") {
        if (!buffer.includes(".")) buffer += ".";
        return;
    }
    if (buffer === "0") {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}

function handleSymbol(symbol){
    if (symbol !== "C"){
        if (buffer === "Cannot divide by 0") return;
    }
    
    switch (symbol){
        case "C":
            buffer = "0";
            runningTotal = 0;
            subScreen.innerHTML = "&nbsp;";
            break;
        case "←":
            if(buffer.length === 1){
                buffer = "0";
            }else{
                buffer = buffer.substring(0, buffer.length - 1);;
            }
            break;
        case "=":
            if (previousOperator === null) return;

            const currentVal = parseFloat(buffer);

            subScreen.innerText = `${runningTotal} ${previousOperator} ${currentVal} =`;
            performOperation(currentVal);
            if (buffer === "Cannot divide by 0") {
                subScreen.innerHTML = "&nbsp;";
            }else{
                buffer = parseFloat(runningTotal.toFixed(8)).toString();
            }
            previousOperator = null;
            isWaiting = true; 
            break;
        case PLUS: 
        case MINUS:
        case MULTIPLY:
        case DIVIDE:
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol) {
 
    if (buffer === "Cannot divide by 0") return;

    if (buffer === "0" && runningTotal === 0) return;

    if (isWaiting) {
        previousOperator = symbol;
        subScreen.innerText = `${runningTotal} ${symbol}`;
        return; 
    }

    const floatBuffer = parseFloat(buffer);

    if (runningTotal === 0) {
        runningTotal = floatBuffer;
    } 
    else {
        performOperation(floatBuffer);
    }
    previousOperator = symbol;
    isWaiting = true;

    subScreen.innerText = `${runningTotal} ${symbol}`;
    
}


function init() {
    document.querySelector('.buttons').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            buttonClick(event.target.innerText);
        }
    });
}

init();

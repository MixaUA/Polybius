const gridData = [
    ['А','Б','В','Г','Ґ','Д'],['Е','Є','Ж','З','И','І'],
    ['Ї','Й','К','Л','М','Н'],['О','П','Р','С','Т','У'],
    ['Ф','Х','Ц','Ч','Ш','Щ'],['Ь','Ю','Я','.',',',' ']
];

const gridContainer = document.getElementById('polybiusGrid');
const letterToCode = {};
const codeToLetter = {};

for (let r = 0; r < 6; r++) {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'grid-cell label';
    rowLabel.textContent = r + 1;
    gridContainer.appendChild(rowLabel);

    for (let c = 0; c < 6; c++) {
        const char = gridData[r][c];
        const cell = document.createElement('div');
        cell.className = 'grid-cell letter';
        if (r === 0 && c === 0) cell.classList.add('top-l');
        if (r === 0 && c === 5) cell.classList.add('top-r');
        if (r === 5 && c === 0) cell.classList.add('bot-l');
        if (r === 5 && c === 5) cell.classList.add('bot-r');
        cell.textContent = char === ' ' ? '␣' : char;
        gridContainer.appendChild(cell);

        const code = (r + 1).toString() + (c + 1).toString();
        letterToCode[char] = code;
        codeToLetter[code] = char;
    }
}

const input = document.getElementById('input');

const outputDiv = document.getElementById('output');

const clearBtn = document.getElementById('clearBtn');

const clearBtnOutput = document.getElementById('clearBtnOutput');

const ignoreCaseCheckbox = document.getElementById('ignoreCase');



const copyInputBtn = document.getElementById('copy-input-btn');
const copyOutputBtn = document.getElementById('copy-output-btn');

// --- EVENT LISTENERS ---

copyInputBtn.addEventListener('click', function() {
    copyText('input', this);
});

copyOutputBtn.addEventListener('click', function() {
    copyText('output', this);
});

// Show clear button on input

input.addEventListener('input', () => {

    clearBtn.style.display = input.value.length > 0 ? 'block' : 'none';

    autoResize(input);

    process();

});



// Re-process on toggle change

ignoreCaseCheckbox.addEventListener('change', process);



// Clear buttons

function clearEverything() {

    input.value = '';

    outputDiv.value = '';

    clearBtn.style.display = 'none';

    clearBtnOutput.style.display = 'none';

    autoResize(input);

    autoResize(outputDiv);

}

clearBtn.addEventListener('click', clearEverything);

clearBtnOutput.addEventListener('click', clearEverything);









// --- CORE FUNCTIONS ---

// Copy button
function copyText(id, btn) {
    const textEl = document.getElementById(id);
    if (!textEl || !textEl.value) return;

    navigator.clipboard.writeText(textEl.value).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'OK!';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 2000);
    }).catch(err => {
        console.error('Не вдалося скопіювати текст: ', err);
    });
}

// Auto-resize textarea height

function autoResize(el) {

    el.style.height = 'auto';

    el.style.height = el.scrollHeight + 'px';

}



// Main processing function

function process() {

    let val = input.value;

    let ignoreCase = ignoreCaseCheckbox.checked;

    

    if (!val.trim()) {

        outputDiv.value = ''; // Use .value

        clearEverything(); // Clear all if input is empty

        return;

    }



    if (val.trim().startsWith('¿')) {

        decrypt(val);

    } else {

        encrypt(val, ignoreCase);

    }



    // Handle visibility of output clear button and resizing

    clearBtnOutput.style.display = outputDiv.value.length > 0 ? 'block' : 'none';

    autoResize(outputDiv);

}



// Encrypt function

function encrypt(text, ignoreCase) {

    let result = ['¿'];

    let i = 0;



    while (i < text.length) {

        let char = text[i];

        if (char === '\n') { result.push('66'); i++; continue; }

        if (/\d/.test(char)) {

            let num = '';

            while (i < text.length && /\d/.test(text[i])) { num += text[i++]; }

            result.push(`[${num}]`);

            continue;

        }

        if (char === "'" || char === "’" || char === "‘" || char === "ʼ") {

            result.push("[’]");

            i++;

            continue;

        }

        let isUpper = !ignoreCase && (char === char.toUpperCase() && char !== char.toLowerCase());

        let upperChar = char.toUpperCase();

        if (letterToCode[upperChar]) {

            let code = letterToCode[upperChar];

            result.push(isUpper ? '^' + code : code);

        } else {

            result.push(`[${char}]`);

        }

        i++;

    }

    outputDiv.value = result.join(' ');

}



// Decrypt function

function decrypt(text) {

    let cleaned = text.replace(/\s+/g, '');

    let result = '';

    let i = 0;



    while (i < cleaned.length) {

        if (cleaned[i] === '¿') { i++; continue; }

        if (cleaned[i] === '[') {

            let end = cleaned.indexOf(']', i + 1);

            if (end !== -1) {

                result += cleaned.substring(i + 1, end);

                i = end + 1;

                continue;

            } else { result += '[помилка]'; break; }

        }

        let isUpper = false;

        if (cleaned[i] === '^') { isUpper = true; i++; }

        if (i + 1 < cleaned.length) {

            let code = cleaned[i] + cleaned[i + 1];

            if (codeToLetter[code]) {

                let letter = codeToLetter[code];

                result += (letter !== ' ' && letter !== '.' && letter !== ',') ? (isUpper ? letter : letter.toLowerCase()) : letter;

                i += 2;

            } else { result += `[??${code}]`; i += 2; }

        } else { result += '[неповна пара]'; break; }

    }

    outputDiv.value = result;

}

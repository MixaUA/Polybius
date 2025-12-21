const grid = [
    ['А','Б','В','Г','Ґ','Д'],
    ['Е','Є','Ж','З','И','І'],
    ['Ї','Й','К','Л','М','Н'],
    ['О','П','Р','С','Т','У'],
    ['Ф','Х','Ц','Ч','Ш','Щ'],
    ['Ь','Ю','Я','.',',',' ']
];

const letterToCode = {};
const codeToLetter = {};

for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
        const symbol = grid[row][col];
        const code = (row + 1) + '' + (col + 1);
        letterToCode[symbol] = code;
        codeToLetter[code] = symbol;
    }
}

const input = document.getElementById('input');
const clearBtn = document.getElementById('clearBtn');

input.addEventListener('input', function() {
    clearBtn.style.display = input.value.length > 0 ? 'flex' : 'none';
});

clearBtn.addEventListener('click', function() {
    input.value = '';
    clearBtn.style.display = 'none';
    input.focus();
});

function process() {
    let inputText = input.value;
    let ignoreCase = document.getElementById('ignoreCase').checked;

    if (inputText.trim() === '') {
        document.getElementById('output').textContent = '(порожньо)';
        return;
    }

    if (inputText.trim().startsWith('¿')) {
        decrypt(inputText);
    } else {
        encrypt(inputText, ignoreCase);
    }
}

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

    document.getElementById('output').textContent = result.join(' ') || '(порожньо)';
}

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

    document.getElementById('output').textContent = result || '(порожньо)';
}

function copyResult() {
    let output = document.getElementById('output').textContent;
    if (output && output !== '(порожньо)') {
        navigator.clipboard.writeText(output).then(() => {
            let btn = document.getElementById('copyBtn');
            let originalText = btn.textContent;
            btn.textContent = '✓ Скопійовано!';
            btn.disabled = true;
            setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 2000);
        }).catch(() => { alert('Помилка копіювання. Скопіюй вручну.'); });
    }
}

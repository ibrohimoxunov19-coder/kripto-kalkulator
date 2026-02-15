const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
};

function process(isEncrypt) {
    let text = document.getElementById('inputText').value.toUpperCase();
    let key = document.getElementById('keyInput').value;
    const algo = document.getElementById('algoSelect').value;
    let result = "";

    if (!text) return;

    switch(algo) {
        case 'caesar':
            let shift = 0;
            if (!isNaN(parseInt(key))) {
                shift = parseInt(key);
            } else if (key && /[A-Z]/i.test(key)) {
                shift = key.toUpperCase().charCodeAt(0) - 65;
            }
            result = caesar(text, isEncrypt ? shift : -shift);
            break;
        case 'vigenere':
            result = vigenere(text, key || "A", isEncrypt);
            break;
        case 'atbash':
            result = atbash(text);
            break;
        case 'rot13':
            result = caesar(text, 13);
            break;
        case 'morse':
            result = isEncrypt ? toMorse(text) : fromMorse(text);
            break;
        case 'ascii':
            result = isEncrypt ? toASCII(text) : fromASCII(text);
            break;
    }
    document.getElementById('outputText').value = result;
}

function caesar(str, shift) {
    let res = "";
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        // HARFLAR (A-Z)
        if (code >= 65 && code <= 90) {
            res += String.fromCharCode(((code - 65 + shift % 26 + 26) % 26) + 65);
        }
        // RAQAMLAR (0-9)
        else if (code >= 48 && code <= 57) {
            res += String.fromCharCode(((code - 48 + shift % 10 + 10) % 10) + 48);
        } else {
            res += str[i];
        }
    }
    return res;
}

function vigenere(text, key, isEncrypt) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '') || "A";
    let res = "", j = 0;
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i);
        if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57)) {
            let k = key[j % key.length].charCodeAt(0) - 65;
            res += caesar(text[i], isEncrypt ? k : -k);
            j++;
        } else {
            res += text[i];
        }
    }
    return res;
}

function atbash(str) {
    let res = "";
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code >= 65 && code <= 90) {
            res += String.fromCharCode(90 - (code - 65));
        } else if (code >= 48 && code <= 57) {
            res += String.fromCharCode(57 - (code - 48));
        } else {
            res += str[i];
        }
    }
    return res;
}

function toMorse(str) {
    return str.split('').map(c => morseCode[c] || c).join(' ');
}

function fromMorse(str) {
    const decodeMorse = Object.fromEntries(Object.entries(morseCode).map(([k, v]) => [v, k]));
    return str.trim().split(/\s+/).map(c => decodeMorse[c] || c).join('');
}
function copyToClipboard() {
    const output = document.getElementById('outputText');
    if (!output.value) return;
    output.select();
    document.execCommand('copy');
}

function clearAll() {
    document.getElementById('inputText').value = "";
    document.getElementById('outputText').value = "";
    document.getElementById('keyInput').value = "";
}




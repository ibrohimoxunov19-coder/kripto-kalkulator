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

    if (!text) {
        alert("Matn kiriting!");
        return;
    }

    switch(algo) {
        case 'caesar':
            let shift = parseInt(key);
            if (isNaN(shift)) {
                alert("Sezar uchun kalitga FAQAT RAQAM kiriting!");
                return;
            }
            result = caesar(text, isEncrypt ? shift : -shift);
            break;
        case 'vigenere':
            if (!key) {
                alert("Vijiner uchun kalit so'z kiriting!");
                return;
            }
            result = vigenere(text, key, isEncrypt);
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
    }
    document.getElementById('outputText').value = result;
}

// SEZAR: Harf va raqamni shifrlash miyasi
function caesar(str, shift) {
    let res = "";
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        // HARFLAR (A-Z)
        if (charCode >= 65 && charCode <= 90) {
            res += String.fromCharCode(((charCode - 65 + shift % 26 + 26) % 26) + 65);
        }
        // RAQAMLAR (0-9)
        else if (charCode >= 48 && charCode <= 57) {
            res += String.fromCharCode(((charCode - 48 + shift % 10 + 10) % 10) + 48);
        }
        else {
            res += str[i];
        }
    }
    return res;
}

// VIJINER: Endi raqamlarni ham kalit so'z asosida shifrlaydi
function vigenere(text, key, isEncrypt) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) return text;
    let res = "", j = 0;
    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        let charCode = text.charCodeAt(i);
        
        // Harf yoki raqam bo'lsa kalitni ishlatamiz
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 48 && charCode <= 57)) {
            let k = key[j % key.length].charCodeAt(0) - 65;
            res += caesar(c, isEncrypt ? k : -k);
            j++;
        } else {
            res += c;
        }
    }
    return res;
}

// ATBASH: Raqamlarni ham teskari qiladi (0->9, 1->8...)
function atbash(str) {
    let res = "";
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            res += String.fromCharCode(90 - (charCode - 65));
        } else if (charCode >= 48 && charCode <= 57) {
            res += String.fromCharCode(57 - (charCode - 48));
        } else {
            res += str[i];
        }
    }
    return res;
}

// MORZE (O'zgarishsiz)
function toMorse(str) {
    return str.split('').map(c => morseCode[c] || c).join(' ');
}

function fromMorse(str) {
    const decodeMorse = Object.fromEntries(Object.entries(morseCode).map(([k, v]) => [v, k]));
    return str.trim().split(/\s+/).map(c => decodeMorse[c] || c).join('');
}

// QO'SHIMCHA
function copyToClipboard() {
    const output = document.getElementById('outputText');
    if (!output.value) return;
    output.select();
    document.execCommand('copy');
    alert("Nusxa olindi! ✅");
}

function clearAll() {
    document.getElementById('inputText').value = "";
    document.getElementById('outputText').value = "";
    document.getElementById('keyInput').value = "";
}
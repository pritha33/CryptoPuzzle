let score = 0;

// --- Vigenere Cipher ---
function vigenereEncrypt(text, key) {
  text = text.toUpperCase();
  key = key.toUpperCase();
  let result = "";
  let i = 0;
  for (let char of text) {
    if (/[A-Z]/.test(char)) {
      let shift = key.charCodeAt(i % key.length) - 65;
      result += String.fromCharCode((char.charCodeAt(0) - 65 + shift) % 26 + 65);
      i++;
    } else {
      result += char;
    }
  }
  return result;
}

function vigenereDecrypt(cipher, key) {
  cipher = cipher.toUpperCase();
  key = key.toUpperCase();
  let result = "";
  let i = 0;
  for (let char of cipher) {
    if (/[A-Z]/.test(char)) {
      let shift = key.charCodeAt(i % key.length) - 65;
      result += String.fromCharCode((char.charCodeAt(0) - 65 - shift + 26) % 26 + 65);
      i++;
    } else {
      result += char;
    }
  }
  return result;
}

// --- Rail Fence Cipher ---
function railFenceEncrypt(text, rails) {
  let fence = Array.from({length: rails}, () => []);
  let rail = 0, dir = 1;
  for (let char of text) {
    fence[rail].push(char);
    rail += dir;
    if (rail === rails - 1 || rail === 0) dir *= -1;
  }
  return fence.flat().join('');
}

function railFenceDecrypt(cipher, rails) {
  let fence = Array.from({length: rails}, () => Array(cipher.length).fill(''));
  let rail = 0, dir = 1;
  for (let i = 0; i < cipher.length; i++) {
    fence[rail][i] = '*';
    rail += dir;
    if (rail === rails - 1 || rail === 0) dir *= -1;
  }
  let index = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < cipher.length; c++) {
      if (fence[r][c] === '*' && index < cipher.length) {
        fence[r][c] = cipher[index++];
      }
    }
  }
  let result = "";
  rail = 0; dir = 1;
  for (let i = 0; i < cipher.length; i++) {
    result += fence[rail][i];
    rail += dir;
    if (rail === rails - 1 || rail === 0) dir *= -1;
  }
  return result;
}

// --- Playfair Cipher (simplified) ---
function playfairEncrypt(text, key) {
  // For simplicity, just return text reversed with key appended
  return text.split('').reverse().join('') + key[0];
}
function playfairDecrypt(cipher, key) {
  return cipher.slice(0, -1).split('').reverse().join('');
}

// --- Puzzle Generator ---
function generatePuzzle() {
  const texts = ["HELLO", "SECURITY", "PYTHON", "CRYPTO"];
  const keys = ["KEY", "LOCK", "SAFE"];
  const text = texts[Math.floor(Math.random() * texts.length)];
  const key = keys[Math.floor(Math.random() * keys.length)];
  const choice = ["vigenere", "playfair", "railfence"][Math.floor(Math.random() * 3)];

  let cipher;
  if (choice === "vigenere") cipher = vigenereEncrypt(text, key);
  else if (choice === "playfair") cipher = playfairEncrypt(text, key);
  else cipher = railFenceEncrypt(text, 3);

  return {algo: choice, plain: text, key: key, cipher: cipher};
}

// --- Game Functions ---
function playPuzzle() {
  const puzzle = generatePuzzle();
  document.getElementById("gameArea").innerHTML = `
    <p><b>Cipher:</b> ${puzzle.cipher}</p>
    <p><b>Hint:</b> Algorithm = ${puzzle.algo}, Key = ${puzzle.key}</p>
    <input type="text" id="guess" placeholder="Your guess">
    <button onclick="checkAnswer('${puzzle.plain}')">Submit</button>
  `;
}

function checkAnswer(answer) {
  const guess = document.getElementById("guess").value.toUpperCase();
  if (guess === answer) {
    score += 10;
    document.getElementById("gameArea").innerHTML += "<p>✅ Correct!</p>";
  } else {
    score -= 5;
    document.getElementById("gameArea").innerHTML += `<p>❌ Wrong! Answer was ${answer}</p>`;
  }
}

function viewScore() {
  document.getElementById("scoreArea").innerHTML = `<p>Your score: ${score}</p>`;
}

function resetGame() {
  score = 0;
  document.getElementById("gameArea").innerHTML = "";
  document.getElementById("scoreArea").innerHTML = "";
}

// Inicializar o EmailJS com sua chave pública
emailjs.init("JYoQo6fr9wl810ErJ"); // Substitua pela sua chave pública

const words = [
    { word: "A Viagem de Chihiro", hint: "Filme do Studio Ghibli sobre uma jovem que entra em um mundo mágico." },
    { word: "Ponyo", hint: "Filme do Studio Ghibli sobre uma menina peixe." },
    { word: "Totoro", hint: "Filme do Studio Ghibli sobre duas meninas que encontram um espírito da floresta." },
    { word: "O menino e a garça", hint: "Filme do Studio Ghibli sobre um garoto que faz amizade com uma garça mágica." },
    { word: "O Castelo Animado", hint: "Filme do Studio Ghibli sobre uma jovem transformada em velha que encontra um castelo mágico." }
];

const maxErrors = 6;
let chosenWord = "";
let guessedLetters = [];
let errors = 0;

const wordElement = document.getElementById("word");
const keyboardElement = document.getElementById("keyboard");
const messageElement = document.getElementById("message");
const hangmanCanvas = document.getElementById("hangman");
const ctx = hangmanCanvas.getContext("2d");
const hintElement = document.getElementById("hint");

const phoneContainer = document.getElementById("phoneContainer");
const phoneInput = document.getElementById("phone");

const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ç', ' '
];

function chooseWord() {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    chosenWord = randomWord.word.toUpperCase();
    hintElement.textContent = "Dica: " + randomWord.hint;
}

function drawWord() {
    wordElement.innerHTML = "";
    for (const letter of chosenWord) {
        const letterElement = document.createElement("div");
        letterElement.className = "letter";
        letterElement.textContent = guessedLetters.includes(letter) || letter === ' ' ? letter : "";
        wordElement.appendChild(letterElement);
    }
}

function drawHangman() {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#fff";
    if (errors > 0) {
        ctx.beginPath();
        ctx.moveTo(10, 190);
        ctx.lineTo(190, 190);
        ctx.stroke();
    }
    if (errors > 1) {
        ctx.beginPath();
        ctx.moveTo(50, 190);
        ctx.lineTo(50, 20);
        ctx.lineTo(120, 20);
        ctx.lineTo(120, 40);
        ctx.stroke();
    }
    if (errors > 2) {
        ctx.beginPath();
        ctx.arc(120, 60, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (errors > 3) {
        ctx.beginPath();
        ctx.moveTo(120, 80);
        ctx.lineTo(120, 140);
        ctx.stroke();
    }
    if (errors > 4) {
        ctx.beginPath();
        ctx.moveTo(120, 100);
        ctx.lineTo(90, 120);
        ctx.stroke();
    }
    if (errors > 5) {
        ctx.beginPath();
        ctx.moveTo(120, 100);
        ctx.lineTo(150, 120);
        ctx.stroke();
    }
}

function drawKeyboard() {
    keyboardElement.innerHTML = "";
    for (const letter of alphabet) {
        const key = document.createElement("button");
        key.className = "key";
        key.textContent = letter;
        key.addEventListener("click", () => guessLetter(key.textContent));
        keyboardElement.appendChild(key);
    }
}

function guessLetter(letter) {
    if (guessedLetters.includes(letter) || errors >= maxErrors) return;
    guessedLetters.push(letter);
    if (!chosenWord.includes(letter)) {
        errors++;
        drawHangman();
    }
    drawWord();
    checkGameStatus();
}

function checkGameStatus() {
    const wordGuessed = chosenWord.split("").every(letter => guessedLetters.includes(letter) || letter === ' ');
    if (wordGuessed) {
        messageElement.textContent = "Parabéns! Você venceu!";
        phoneContainer.classList.add("show"); // Exibe a tela do desafio bônus
    } else if (errors >= maxErrors) {
        messageElement.textContent = `Você perdeu! A palavra era: ${chosenWord}`;
    }
}

function submitPhone() {
    let phone = phoneInput.value;
    phone = phone.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    if (phone.length === 11) {
        const templateParams = { phone_number: phone };
        emailjs.send("service_6ik0pge", "template_aux52mh", templateParams)
            .then(function(response) {
                phoneContainer.classList.remove("show"); // Esconde a tela do telefone
                alert("Número enviado com sucesso!");
            }, function(error) {
                alert("Erro ao enviar o número. Tente novamente.");
            });
    } else {
        alert("Número inválido. Por favor, insira um número válido.");
    }
}

function startGame() {
    guessedLetters = [];
    errors = 0;
    chooseWord();
    drawWord();
    drawHangman();
    drawKeyboard();
}

window.onload = startGame;

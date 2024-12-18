// Inicializar o EmailJS com sua chave pública
emailjs.init("JYoQo6fr9wl810ErJ");

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
const modal = document.getElementById("phoneModal");
const phoneInput = document.getElementById("phoneInput");

// Função para escolher uma palavra aleatória
function chooseWord() {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    chosenWord = randomWord.word.toUpperCase();
    hintElement.textContent = "Dica: " + randomWord.hint;
}

// Atualiza a exibição da palavra no jogo
function drawWord() {
    wordElement.innerHTML = "";
    for (const letter of chosenWord) {
        const letterElement = document.createElement("div");
        letterElement.className = "letter";
        letterElement.textContent = guessedLetters.includes(letter) || letter === ' ' ? letter : "_";
        wordElement.appendChild(letterElement);
    }
}

// Atualiza a exibição do boneco na forca
function drawHangman() {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#fff";

    // Desenho progressivo do boneco
    if (errors > 0) { ctx.strokeRect(10, 190, 180, 10); } // Base
    if (errors > 1) { ctx.strokeRect(50, 20, 5, 170); }  // Poste
    if (errors > 2) { ctx.strokeRect(50, 20, 70, 5); }   // Braço
    if (errors > 3) { ctx.strokeRect(120, 20, 5, 20); }  // Forca
    if (errors > 4) { ctx.arc(122, 60, 20, 0, Math.PI * 2); ctx.stroke(); } // Cabeça
    if (errors > 5) { ctx.strokeRect(120, 80, 5, 60); }   // Corpo
}

// Atualiza o teclado virtual
function drawKeyboard() {
    keyboardElement.innerHTML = "";
    for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZÇ ") {
        const key = document.createElement("button");
        key.className = "key";
        key.textContent = letter;
        key.addEventListener("click", () => guessLetter(letter));
        key.disabled = guessedLetters.includes(letter); // Desativa letras já adivinhadas
        keyboardElement.appendChild(key);
    }
}

// Lida com tentativas do jogador
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

// Verifica o estado do jogo (vitória/derrota)
function checkGameStatus() {
    const wordGuessed = chosenWord.split("").every(letter => guessedLetters.includes(letter) || letter === ' ');
    if (wordGuessed) {
        showModal(); // Mostra o modal se o jogador venceu
    } else if (errors >= maxErrors) {
        messageElement.textContent = `Você perdeu! A palavra era: ${chosenWord}`;
    }
}

// Mostra o modal
function showModal() {
    modal.style.display = "block"; // Exibe o modal
}

// Fecha o modal
function closeModal() {
    modal.style.display = "none"; // Oculta o modal
}

// Envia o número de telefone via EmailJS
function submitPhone() {
    const phone = phoneInput.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    if (phone.length === 11) {
        const templateParams = { phone_number: phone };
        emailjs.send("service_6ik0pge", "template_aux52mh", templateParams)
            .then(() => {
                alert("Número enviado com sucesso!");
                closeModal();
            })
            .catch(() => alert("Erro ao enviar o número. Tente novamente."));
    } else {
        alert("Número inválido. Insira um número válido com 11 dígitos.");
    }
}

// Inicializa o jogo
function startGame() {
    guessedLetters = [];
    errors = 0;
    chooseWord();
    drawWord();
    drawHangman();
    drawKeyboard();
}

// Inicia o jogo quando a página carrega
window.onload = startGame;

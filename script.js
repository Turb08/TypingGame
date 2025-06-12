const quoted = [
  "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  "There is nothing more deceptive than an obvious fact.",
  "I ought to know by this time that when a face appears to, I never make exceptions. An exception disproves the rule.",
  "What one man can invent another can discover.",
  "Nothing clears up a case so much as stating it to another.",
  "The world is full of obvious things which nobody by any chance ever observes.",
  "To a great mind, nothing is little.",
  "I never guess. It is a capital mistake to theorize before one has data.",
  "Mediocrity knows nothing higher than itself; but talent instantly recognizes genius.",
  "Education never ends, Watson. It is a series of lessons, with the greatest for the last.",
];

let words = [];
let wordIndex = 0;
let startTime;
let timerInterval;
let bestTime = localStorage.getItem("bestTime") || null;

const quoteElement = document.getElementById("quote");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const highScoreDisplay = document.getElementById("high-score");
const successSound = document.getElementById("success-sound");
const errorSound = document.getElementById("error-sound");
const toggleDarkButton = document.getElementById("toggle-dark");

if (bestTime) highScoreDisplay.innerText = `🏆 Best Time: ${bestTime}s`;

document.getElementById("start").addEventListener("click", () => {
  typedValueElement.disabled = false;
  const quote = quoted[Math.floor(Math.random() * quoted.length)];
  words = quote.split(" ");
  wordIndex = 0;

  quoteElement.innerHTML = words
    .map((word, index) => `<span id="word-${index}">${word}</span>`)
    .join(" ");
  messageElement.innerText = "";
  typedValueElement.value = "";
  typedValueElement.focus();
  typedValueElement.className = "";

  document.getElementById(`word-0`).classList.add("highlight");

  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 100);

  timerDisplay.innerText = `⏱️ Time: 0.00s`;
  wpmDisplay.innerText = `⌨️ WPM: 0`;
});

typedValueElement.addEventListener("input", () => {
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  const elapsedTime = (Date.now() - startTime) / 1000;
  const wordsTyped = wordIndex + (typedValue.trim() === currentWord ? 1 : 0);
  const wpm = Math.round((wordsTyped / elapsedTime) * 60);
  wpmDisplay.innerText = `⌨️ WPM: ${wpm}`;

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const totalTime = elapsedTime.toFixed(2);
    messageElement.innerText = `🎉 You finished in ${totalTime} seconds!`;
    clearInterval(timerInterval);
    successSound.play();

    if (!bestTime || totalTime < bestTime) {
      bestTime = totalTime;
      localStorage.setItem("bestTime", totalTime);
      highScoreDisplay.innerText = `🏆 Best Time: ${totalTime}s`;
    }
  } else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
    typedValueElement.value = "";
    document.getElementById(`word-${wordIndex}`).classList.remove("highlight");
    wordIndex++;
    document.getElementById(`word-${wordIndex}`).classList.add("highlight");
  } else if (currentWord.startsWith(typedValue)) {
    typedValueElement.className = "";
  } else {
    typedValueElement.className = "error";
    errorSound.play();
  }
});

function updateTimer() {
  const currentTime = ((Date.now() - startTime) / 1000).toFixed(2);
  timerDisplay.innerText = `⏱️ Time: ${currentTime}s`;
}

// 🌙 Dark Mode Toggle
toggleDarkButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleDarkButton.innerText = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌓 Dark Mode";
});

// 🛑 Stop button functionality
document.getElementById("stop").addEventListener("click", () => {
  clearInterval(timerInterval);
  typedValueElement.disabled = true;
  messageElement.innerText = "⏹️ Typing stopped.";
  quoteElement.innerHTML = "";
  typedValueElement.value = "";
  wpmDisplay.innerText = "⌨️ WPM: 0";
  timerDisplay.innerText = "⏱️ Time: 0.00s";
});

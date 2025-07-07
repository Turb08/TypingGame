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
  "Crime is common. Logic is rare. Therefore, it is upon the logic rather than upon the crime that you should dwell.",
  "The little things are infinitely the most important.",
  "You know my method. It is founded upon the observation of trifles.",
  "I cannot live without brain-work. What else is there to live for?",
  "It has long been an axiom of mine that the little things are infinitely the most important.",
  "I am a brain, Watson. The rest of me is a mere appendix.",
  "There is no branch of detective science which is so important and so much neglected as the art of tracing footsteps.",
  "My name is Sherlock Holmes. It is my business to know what other people do not know.",
  "You see, but you do not observe. The distinction is clear.",
  "The temptation to form premature theories upon insufficient data is the bane of our profession.",
  "A client is to me a mere unit, a factor in a problem.",
  "Nothing clears up a case so much as stating it to another person.",
  "I never make exceptions. An exception disproves the rule.",
  "Violence does, in truth, recoil upon the violent, and the schemer falls into the pit which he digs for another.",
];

let words = [];
let wordIndex = 0;
let startTime;
let timerInterval;
let charIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let bestTime = localStorage.getItem("bestTime");
bestTime = bestTime ? parseFloat(bestTime) : null;

const quoteElement = document.getElementById("quote");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const highScoreDisplay = document.getElementById("high-score");
const successSound = document.getElementById("success-sound");
const errorSound = document.getElementById("error-sound");
const toggleDarkButton = document.getElementById("toggle-dark");
const accuracydisplay = document.getElementById("message");

if (bestTime) highScoreDisplay.innerText = `${bestTime}s`;

// Splitting the quote into characters for per-character typing
function renderQuotePerCharacter(quote) {
  quoteElement.innerHTML = "";
  quote.split("").forEach((char, i) => {
    const span = document.createElement("span");

    // Replacing spaces with non-breaking space for visibility
    span.textContent = char === " " ? "\u00A0" : char;

    span.classList.add("char");
    if (i === 0) span.classList.add("active");
    quoteElement.appendChild(span);
  });
}

document.getElementById("start").addEventListener("click", () => {
  typedValueElement.disabled = false;
  const quote = quoted[Math.floor(Math.random() * quoted.length)];
  words = quote.split(" ");
  wordIndex = 0;

  renderQuotePerCharacter(quote);
  messageElement.innerText = "";
  typedValueElement.value = "";
  typedValueElement.focus();
  typedValueElement.className = "";

  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 100);

  timerDisplay.innerText = `00.00s`;
  wpmDisplay.innerText = `0`;
  accuracydisplay.innerText = `0%`;

  // Reset state
  charIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
});

typedValueElement.addEventListener("keydown", (e) => {
  const spans = quoteElement.querySelectorAll(".char");

  //ignore keys that aren't a single character except Backspace
  if (e.key.length !== 1 && e.key !== "Backspace") return;

  //Move back one character if Backspace is pressed
  if (e.key === "Backspace") {
    if (charIndex === 0) return;
    spans[charIndex].classList.remove("active");
    charIndex--;
    spans[charIndex].classList.remove("correct", "incorrect");
    spans[charIndex].classList.add("active");
    e.preventDefault();
    return;
  }

  const expectedChar = spans[charIndex].textContent;
  const userChar = e.key;

  spans[charIndex].classList.remove("active");

  //If typed key is correct, mark correct else mark incorrect
  if (userChar === expectedChar) {
    spans[charIndex].classList.add("correct");
    correctCount++;
  } else {
    spans[charIndex].classList.add("incorrect");
    incorrectCount++;
  }

  charIndex++;
  if (charIndex < spans.length) {
    spans[charIndex].classList.add("active");
  } else {
    // If all characters are typed, stop timer, compute and display stats
    clearInterval(timerInterval);
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    const total = correctCount + incorrectCount;
    const accuracy = ((correctCount / total) * 100).toFixed(1);

    messageElement.innerText = `${accuracy}%`;

    //Check for new best time and store if there is one
    if (!bestTime || totalTime < bestTime) {
      bestTime = totalTime;
      localStorage.setItem("bestTime", totalTime);
      highScoreDisplay.innerText = `${totalTime}s`;
    }
  }

  // Update wpm on every keydown event
  const elapsedTime = (Date.now() - startTime) / 1000;
  const wpm = Math.round((correctCount / 5 / elapsedTime) * 60);
  wpmDisplay.innerText = `${wpm}`;

  e.preventDefault();
});

// Update timer display every 100ms
function updateTimer() {
  const currentTime = ((Date.now() - startTime) / 1000).toFixed(2);
  timerDisplay.innerText = `${currentTime}s`;
}

// Dark Mode Toggle
toggleDarkButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleDarkButton.innerText = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌓 Dark Mode";
});

// Stop button functionality
document.getElementById("stop").addEventListener("click", () => {
  clearInterval(timerInterval);
  typedValueElement.disabled = true;
  quoteElement.innerHTML = "";
  typedValueElement.value = "";
  wpmDisplay.innerText = "0";
  timerDisplay.innerText = "00.00s";
});

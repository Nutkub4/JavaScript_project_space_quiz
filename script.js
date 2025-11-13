// Quiz questions database organized by difficulty
const questions = {
    easy: [
        {q: "What is the largest planet in our solar system?", c: ["Earth", "Jupiter", "Saturn", "Mars"], a: 1},
        {q: "How many planets are in our solar system?", c: ["7", "8", "9", "10"], a: 1},
        {q: "What is the closest star to Earth?", c: ["Alpha Centauri", "Sirius", "The Sun", "Polaris"], a: 2},
        {q: "What is the name of Earth's natural satellite?", c: ["Titan", "Europa", "The Moon", "Phobos"], a: 2},
        {q: "Which planet is known as the Red Planet?", c: ["Venus", "Mars", "Mercury", "Jupiter"], a: 1},
        {q: "What force keeps planets in orbit around the Sun?", c: ["Magnetism", "Gravity", "Friction", "Inertia"], a: 1},
        {q: "How long does it take Earth to orbit the Sun?", c: ["30 days", "365 days", "24 hours", "12 months exactly"], a: 1},
        {q: "What is the hottest planet in our solar system?", c: ["Mercury", "Venus", "Mars", "Jupiter"], a: 1}
    ],
    medium: [
        {q: "What is the name of the galaxy that contains our solar system?", c: ["Andromeda", "Milky Way", "Triangulum", "Whirlpool"], a: 1},
        {q: "Who was the first human to walk on the Moon?", c: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Alan Shepard"], a: 2},
        {q: "What is the name of the rover that landed on Mars in 2021?", c: ["Curiosity", "Opportunity", "Perseverance", "Spirit"], a: 2},
        {q: "How many moons does Jupiter have (approximately)?", c: ["12", "45", "79", "100"], a: 2},
        {q: "What is a light-year?", c: ["365 days", "Distance light travels in a year", "Weight of light", "Speed of sound"], a: 1},
        {q: "Which planet has the most prominent ring system?", c: ["Jupiter", "Uranus", "Saturn", "Neptune"], a: 2},
        {q: "What is the International Space Station (ISS)?", c: ["A satellite", "A space telescope", "A habitable space laboratory", "A rocket"], a: 2},
        {q: "What causes a solar eclipse?", c: ["Earth blocks the Sun", "Moon blocks the Sun", "Mars aligns with Earth", "Sun's light dims"], a: 1}
    ],
    hard: [
        {q: "What is the Schwarzschild radius?", c: ["Distance to nearest star", "Event horizon of a black hole", "Orbit of Mercury", "Solar system diameter"], a: 1},
        {q: "What is the Hubble constant approximately?", c: ["70 km/s/Mpc", "300,000 km/s", "9.8 m/s²", "3.14 rad/s"], a: 0},
        {q: "What phenomenon causes gravitational lensing?", c: ["Refraction of light", "Warping of spacetime", "Reflection of light", "Absorption of photons"], a: 1},
        {q: "What is the approximate temperature of the cosmic microwave background?", c: ["0 K", "2.7 K", "273 K", "5778 K"], a: 1},
        {q: "What is the main component of a neutron star?", c: ["Hydrogen", "Iron", "Degenerate neutron matter", "Dark matter"], a: 2},
        {q: "What is the Great Attractor?", c: ["A supermassive black hole", "A gravitational anomaly pulling galaxies", "The center of the universe", "A giant star"], a: 1},
        {q: "What is the Chandrasekhar limit?", c: ["Speed of light", "Maximum mass of a white dwarf", "Distance to Andromeda", "Age of the universe"], a: 1},
        {q: "What are magnetars?", c: ["Magnetic planets", "Neutron stars with extreme magnetic fields", "Magnetic asteroids", "Charged particles"], a: 1}
    ]
};

// Game state variables
let difficulty = 'easy';
let quiz = [];
let current = 0;
let score = 0;
let correct = 0;
let incorrect = 0;
let timer;

// Function to select difficulty level
function selectDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.difficulty-selector .btn').forEach(btn => {
        btn.classList.toggle('selected', btn.textContent.toLowerCase() === level);
    });
}

// Function to start the game
function startGame() {
    quiz = questions[difficulty];
    current = 0;
    score = 0;
    correct = 0;
    incorrect = 0;
    
    showScreen('quizScreen');
    document.getElementById('totalQ').textContent = quiz.length;
    document.getElementById('score').textContent = score;
    
    loadQuestion();
}

// Function to load a question
function loadQuestion() {
    if (current >= quiz.length) {
        showResults();
        return;
    }

    const q = quiz[current];
    document.getElementById('question').textContent = q.q;
    document.getElementById('currentQ').textContent = current + 1;
    document.getElementById('progressFill').style.width = ((current + 1) / quiz.length * 100) + '%';
    
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    
    q.c.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        btn.onclick = () => checkAnswer(i);
        choicesDiv.appendChild(btn);
    });

    document.getElementById('feedback').className = 'feedback';
    document.getElementById('nextBtn').className = 'btn btn-primary hidden';
    
    startTimer();
}

// Function to start the timer
function startTimer() {
    let timeLeft = 30;
    document.getElementById('time').textContent = timeLeft;
    clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1);
        }
    }, 1000);
}

// Function to check the selected answer
function checkAnswer(selected) {
    clearInterval(timer);
    
    const q = quiz[current];
    const btns = document.querySelectorAll('.choice-btn');
    btns.forEach(btn => btn.disabled = true);
    
    const feedback = document.getElementById('feedback');
    
    if (selected === q.a) {
        btns[selected].classList.add('correct');
        feedback.textContent = '✓ Correct! Well done!';
        feedback.className = 'feedback show correct';
        score += 10;
        correct++;
        document.getElementById('score').textContent = score;
    } else {
        if (selected >= 0) btns[selected].classList.add('incorrect');
        btns[q.a].classList.add('correct');
        feedback.textContent = selected === -1 ? '⏱️ Time\'s up!' : '✗ Incorrect';
        feedback.className = 'feedback show incorrect';
        incorrect++;
    }
    
    document.getElementById('nextBtn').classList.remove('hidden');
}

// Function to move to the next question
function nextQuestion() {
    current++;
    loadQuestion();
}

// Function to show results screen
function showResults() {
    clearInterval(timer);
    showScreen('resultScreen');
    
    const percent = Math.round((correct / quiz.length) * 100);
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalTotal').textContent = quiz.length * 10;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('incorrectCount').textContent = incorrect;
    document.getElementById('percentage').textContent = percent;
    
    let emoji = '🚀';
    let msg = 'Try Again! Practice Makes Perfect!';
    
    if (percent === 100) {
        emoji = '🏆';
        msg = 'Perfect Score! You\'re a Space Expert!';
    } else if (percent >= 80) {
        emoji = '🌟';
        msg = 'Awesome Job! You Know Your Space!';
    } else if (percent >= 60) {
        emoji = '👍';
        msg = 'Good Work! Keep Learning!';
    } else if (percent >= 40) {
        emoji = '📚';
        msg = 'Not Bad! Study More About Space!';
    }
    
    document.getElementById('emoji').textContent = emoji;
    document.getElementById('message').textContent = msg;
}

// Function to show a specific screen
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Function to reset the game
function resetGame() {
    clearInterval(timer);
    showScreen('startScreen');
    document.getElementById('progressFill').style.width = '0%';
}
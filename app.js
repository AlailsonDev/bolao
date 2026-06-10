

async function loadData() {
  const response = await fetch('data.json');
  const data = await response.json();

  const team1 = data.match.team1;
  const team2 = data.match.team2;

  document.getElementById('team1-name').textContent = team1.name;
  document.getElementById('team2-name').textContent = team2.name;

  document.getElementById('flag1').src =
    `https://flagcdn.com/w320/${team1.flag}.png`;

  document.getElementById('flag2').src =
    `https://flagcdn.com/w320/${team2.flag}.png`;

  document.getElementById('score1').textContent =
    data.match.official_score.team1;

  document.getElementById('score2').textContent =
    data.match.official_score.team2;

  const container = document.getElementById('predictions-container');

  const winners = [];

  data.predictions.forEach(person => {

    const official1 = data.match.official_score.team1;
const official2 = data.match.official_score.team2;

const hasOfficialResult =
  !isNaN(official1) &&
  !isNaN(official2) &&
  official1 !== "" &&
  official2 !== "";

const correct =

 hasOfficialResult &&
  person.score.team1 === official1 &&
  person.score.team2 === official2;

    if (correct) {
  winners.push(person);
}

 

    const card = document.createElement('div');
    card.className = correct ? 'card winner' : 'card';

    card.innerHTML = `
      ${correct ? '<div class="winner-badge">🏆 ACERTOU</div>' : ''}

      <div style="text-align:center;">
        <img class="avatar" src="${person.photo}" alt="${person.name}">

        <div class="name">${person.name}</div>

        <div class="prediction-score with-flags">

  <div class="mini-team">
    <img 
      class="mini-flag"
      src="https://flagcdn.com/w40/${team1.flag}.png"
      alt="${team1.name}"
    >
    <span>${person.score.team1}</span>
  </div>

  <span class="x">x</span>

  <div class="mini-team">
    <span>${person.score.team2}</span>

    <img 
      class="mini-flag"
      src="https://flagcdn.com/w40/${team2.flag}.png"
      alt="${team2.name}"
    >
  </div>

</div>

        <div class="result-text ${
  !hasOfficialResult
    ? 'waiting'
    : correct
      ? 'correct'
      : 'wrong'
}">
  ${
    !hasOfficialResult
      ? '⏳ Aguardando Resultado'
      : correct
        ? '✅ Palpite Correto!'
        : '❌ Não acertou desta vez'
  }
</div>
      </div>
    `;

    container.appendChild(card);
  });
  showWinnerPopup(winners, team1, team2);
}

const confettiScript = document.createElement('script');

confettiScript.src =
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';

document.body.appendChild(confettiScript);

let myConfetti;

const confettiReady = new Promise((resolve) => {

  confettiScript.onload = () => {

    const confettiCanvas =
      document.getElementById('confetti-canvas');

    myConfetti =
      confetti.create(confettiCanvas, {
        resize: true,
        useWorker: true
      });

    resolve();
  };

});

function startConfetti() {

  if (!myConfetti) return;

  const duration = 4000;
  const end = Date.now() + duration;

  (function frame() {

    myConfetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 },

      zIndex: 9998
    });

    myConfetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 },

      zIndex: 10001
    });

    myConfetti({
      particleCount: 3,
      spread: 120,
      startVelocity: 40,

      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      },

      zIndex: 10002
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }

  })();
}

loadData();

async function showWinnerPopup(winners, team1, team2) {

  if (!winners.length) return;

  const popup = document.getElementById('winner-popup');
  const container = document.getElementById('winner-cards');

  container.innerHTML = '';

  winners.forEach(person => {

    container.innerHTML += `
      <div class="popup-winner-card">

        <img src="${person.photo}" alt="${person.name}">

        <div class="popup-winner-name">
          ${person.name}
        </div>

        <div class="popup-score">

          <img
            class="mini-flag"
            src="https://flagcdn.com/w40/${team1.flag}.png"
          >

          ${person.score.team1}

          <span class="x">x</span>

          ${person.score.team2}

          <img
            class="mini-flag"
            src="https://flagcdn.com/w40/${team2.flag}.png"
          >

        </div>

      </div>
    `;
  });

  await confettiReady;

  popup.classList.remove('hidden');

  startConfetti();

  document
  .getElementById('close-popup')
  .addEventListener('click', () => {

    popup.classList.add('closing');

    startConfetti();

    setTimeout(() => {

      popup.classList.add('hidden');
      popup.classList.remove('closing');

    }, 500);

  });
}

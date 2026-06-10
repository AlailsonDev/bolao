
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

  data.predictions.forEach(person => {

    const correct =
      person.score.team1 === data.match.official_score.team1 &&
      person.score.team2 === data.match.official_score.team2;

    const card = document.createElement('div');
    card.className = correct ? 'card winner' : 'card';

    card.innerHTML = `
      ${correct ? '<div class="winner-badge">🏆 ACERTOU</div>' : ''}

      <div style="text-align:center;">
        <img class="avatar" src="${person.photo}" alt="${person.name}">

        <div class="name">${person.name}</div>

        <div class="prediction-score">
          <span>${person.score.team1}</span>
          <span>x</span>
          <span>${person.score.team2}</span>
        </div>

        <div class="result-text ${correct ? 'correct' : 'wrong'}">
          ${correct ? 'Palpite Correto!' : 'Não acertou desta vez'}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

loadData();

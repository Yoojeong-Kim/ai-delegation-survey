/* ?-?- Session Storage Helpers ?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?- */
function getSurveyData() {
  try {
    const d = sessionStorage.getItem('surveyData');
    return d ? JSON.parse(d) : null;
  } catch (e) { return null; }
}

function saveSurveyData(data) {
  sessionStorage.setItem('surveyData', JSON.stringify(data));
}

/* ?-?- Guard: redirect to start if no session ?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?- */
function requireSession(needsDemographics) {
  const data = getSurveyData();
  if (!data) { window.location.href = 'index.html'; return null; }
  if (needsDemographics && !data.demographics) {
    window.location.href = 'demographics.html';
    return null;
  }
  return data;
}

/* ?-?- Display participant ID in header ?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?- */
function showParticipantId() {
  const data = getSurveyData();
  const el = document.getElementById('header-pid');
  if (el && data?.participantId) el.textContent = 'ID: ' + data.participantId;
}

/* ?-?- Render Likert question block ?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?- */
function renderLikertQuestion(q, container, answers, onChange) {
  const leftLabel  = q.leftLabel  || 'Strongly Disagree';
  const rightLabel = q.rightLabel || 'Strongly Agree';

  const div = document.createElement('div');
  div.className = 'question-block';
  div.innerHTML = `
    <p class="question-text">
      <span class="question-num">${q.num}.</span>${q.text}
    </p>
    <div class="likert-wrapper">
      <div class="likert-endpoint-labels">
        <span>${leftLabel}</span>
        <span>${rightLabel}</span>
      </div>
      <div class="likert-buttons" id="lk-${q.id}">
        ${[1,2,3,4,5,6,7].map(n => `
          <button type="button"
            class="likert-btn"
            data-q="${q.id}"
            data-val="${n}"
            onclick="handleLikert('${q.id}', ${n}, this, '${q.id}')">
            ${n}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  container.appendChild(div);

  // Expose per-question click handler
  window.handleLikert = function(qId, val, btn, groupId) {
    answers[qId] = val;
    document.querySelectorAll(`#lk-${groupId} .likert-btn`).forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (typeof onChange === 'function') onChange();
  };
}

/* ?-?- Render multiple Likert questions ?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?- */
function renderLikertGroup(questions, containerId, answers, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  questions.forEach(q => renderLikertQuestion(q, container, answers, onChange));

  // Override global handleLikert with per-group version
  window.handleLikert = function(qId, val, btn) {
    answers[qId] = val;
    document.querySelectorAll(`[data-q="${qId}"]`).forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (typeof onChange === 'function') onChange();
  };
}

/* ?-?- Check all Likert answers filled ?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?- */
function allLikertAnswered(questions, answers) {
  return questions.every(q => answers[q.id] !== undefined);
}

/* ?-?- Render radio options list ?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?-?- */
function renderRadioGroup(options, containerId, name, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  options.forEach(opt => {
    const label = document.createElement('label');
    label.className = 'radio-item';
    label.innerHTML = `
      <input type="radio" name="${name}" value="${opt.value}">
      <div class="radio-dot"></div>
      <span class="radio-text">${opt.label}</span>
    `;
    label.addEventListener('click', () => {
      container.querySelectorAll('.radio-item').forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
      label.querySelector('input').checked = true;
      if (typeof onSelect === 'function') onSelect(opt.value);
    });
    container.appendChild(label);
  });
}

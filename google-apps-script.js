/**
 * AI Proxy Delegation Study — Google Apps Script (2x2 Between x 2 Within Architecture)
 *
 * HOW TO SET UP:
 * 1. Open your Google Sheets file
 * 2. Go to Extensions -> Apps Script
 * 3. Paste this entire script, replacing any existing content
 * 4. Click "Save" (Ctrl+S)
 * 5. Click "Deploy" -> "Manage deployments" -> Edit -> "New version" -> "Deploy"
 *    (or "Deploy" -> "New deployment" -> Web app -> Execute as: Me, Who has access: Anyone)
 * 6. Copy the Web App URL and update GOOGLE_SCRIPT_URL in config.js if changed!
 */

const SHEET_NAME = 'Responses';

const HEADERS = [
  'participant_id', 'timestamp', 'server_timestamp', 'total_time_seconds',
  'assigned_group', 'assigned_scenario', 'task_type', 'info_sensitivity', 'agent_order',
  'q1_birth_year', 'q2_gender', 'q3_education', 'q4_work_exp', 'q5_work_type', 'q5_other',
  'ai_yesno', 'ai_q6', 'ai_q7', 'ai_q8', 'ai_q9', 'ai_q10', 'ai_q11', 'ai_q12', 'ai_q13', 'ai_q14', 'ai_q15', 'ai_q16',
  'human_yesno', 'human_q6', 'human_q7', 'human_q8', 'human_q9', 'human_q10', 'human_q11', 'human_q12', 'human_q13', 'human_q14', 'human_q15', 'human_q16',
  'q86_privacy', 'q87_ai_trust', 'q88_attention_imc', 'attention_check_passed', 'q89_motivation'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // Condition Assignment: 4 Between Groups x 2 Within Orders = 8 Counterbalanced Cells
    if (action === 'assign') {
      let count = 1;
      const lock = LockService.getScriptLock();
      const hasLock = lock.tryLock(1500);
      try {
        const props = PropertiesService.getScriptProperties();
        count = parseInt(props.getProperty('participant_count') || '0', 10) + 1;
        props.setProperty('participant_count', count.toString());
      } catch (err) {
        count = Math.floor(100 + Math.random() * 900);
      } finally {
        if (hasLock) {
          try { lock.releaseLock(); } catch (e) {}
        }
      }

      const pid = 'P' + count.toString().padStart(3, '0');
      
      // Group 1: Scenario 1 (Analytical x High Sensitivity)
      // Group 2: Scenario 2 (Analytical x Low Sensitivity)
      // Group 3: Scenario 3 (Socio-emotional x High Sensitivity)
      // Group 4: Scenario 4 (Socio-emotional x Low Sensitivity)
      const assignedGroup = ((count - 1) % 4) + 1;
      const scenarioId = assignedGroup;
      
      // Counterbalanced Agent Order: 50% AI first, 50% Human first
      const orderType = Math.floor(((count - 1) % 8) / 4) === 0 ? 'AI_FIRST' : 'HUMAN_FIRST';
      const round1Condition = orderType === 'AI_FIRST' ? 1 : 2; // 1 = AI, 2 = Human
      const round2Condition = orderType === 'AI_FIRST' ? 2 : 1;

      const taskType = (assignedGroup <= 2) ? 'Analytical' : 'Socio-emotional';
      const infoSensitivity = (assignedGroup === 1 || assignedGroup === 3) ? 'High' : 'Low';

      return jsonResponse({
        ok: true,
        participant_id: pid,
        assigned_group: assignedGroup,
        scenario_id: scenarioId,
        task_type: taskType,
        info_sensitivity: infoSensitivity,
        order_type: orderType,
        round1_condition: round1Condition,
        round2_condition: round2Condition
      });
    }

    // Survey Submission
    if (action === 'submit') {
      const payload = data.payload;
      const ss    = SpreadsheetApp.getActiveSpreadsheet();
      let   sheet = ss.getSheetByName(SHEET_NAME);

      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow(HEADERS);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#0f172a').setFontColor('#818CF8');
        sheet.setFrozenRows(1);
      }

      const row = buildRow(payload);
      sheet.appendRow(row);

      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: 'Unknown action' });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// Allow preflight OPTIONS request for CORS
function doOptions(e) {
  return jsonResponse({ ok: true });
}

function doGet(e) {
  // Admin Dashboard Data Fetch
  if (e.parameter && e.parameter.action === 'admin') {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) return jsonResponse({ ok: true, data: [] });
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) return jsonResponse({ ok: true, data: [] });

      const headers = data[0];
      const rows = data.slice(1);
      
      const result = rows.map(row => {
        let obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });
      return jsonResponse({ ok: true, data: result });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.toString() });
    }
  }

  return jsonResponse({ ok: true, message: 'AI Delegation Apps Script backend is running' });
}

function buildRow(d) {
  let totalTime = '';
  if (d.timestamp) {
    totalTime = Math.round((new Date() - new Date(d.timestamp)) / 1000);
  }
  const dem = d.demographics || {};
  const ps  = d.postSurvey   || {};
  
  let aiEval = d.aiEvaluation || {};
  let humanEval = d.humanEvaluation || {};

  // Fallback to round evaluations if direct objects are empty
  if (!aiEval.yesNo) {
    if (d.round1Evaluation && d.round1Evaluation.condition === 1) aiEval = d.round1Evaluation;
    else if (d.round2Evaluation && d.round2Evaluation.condition === 1) aiEval = d.round2Evaluation;
  }
  if (!humanEval.yesNo) {
    if (d.round1Evaluation && d.round1Evaluation.condition === 2) humanEval = d.round1Evaluation;
    else if (d.round2Evaluation && d.round2Evaluation.condition === 2) humanEval = d.round2Evaluation;
  }

  const attentionCheckPassed = (ps.q88 == 5 || ps.q88 === '5') ? 'PASSED' : 'FAILED';

  const q5WorkType = (dem.q5 && dem.q5.startsWith('Other: ')) ? 'Other' : (dem.q5 || '');
  const q5Other    = dem.q5_other || (dem.q5 && dem.q5.startsWith('Other: ') ? dem.q5.replace('Other: ', '') : '');

  const row = [
    d.participantId    || '',
    d.timestamp        || '',
    new Date().toISOString(),
    totalTime,
    d.assignedGroup    || '',
    d.scenarioId       || '',
    d.taskType         || '',
    d.infoSensitivity  || '',
    d.orderType        || '',
    dem.q1 || '', dem.q2 || '', dem.q3 || '', dem.q4 || '',
    q5WorkType,
    q5Other,
    
    // AI Secretary Evaluation
    aiEval.yesNo || '',
    aiEval.q6 !== undefined ? aiEval.q6 : '',
    aiEval.q7 !== undefined ? aiEval.q7 : '',
    aiEval.q8 !== undefined ? aiEval.q8 : '',
    aiEval.q9 !== undefined ? aiEval.q9 : '',
    aiEval.q10 !== undefined ? aiEval.q10 : '',
    aiEval.q11 !== undefined ? aiEval.q11 : '',
    aiEval.q12 !== undefined ? aiEval.q12 : '',
    aiEval.q13 !== undefined ? aiEval.q13 : '',
    aiEval.q14 !== undefined ? aiEval.q14 : '',
    aiEval.q15 !== undefined ? aiEval.q15 : '',
    aiEval.q16 !== undefined ? aiEval.q16 : '',

    // Human Secretary Evaluation
    humanEval.yesNo || '',
    humanEval.q6 !== undefined ? humanEval.q6 : '',
    humanEval.q7 !== undefined ? humanEval.q7 : '',
    humanEval.q8 !== undefined ? humanEval.q8 : '',
    humanEval.q9 !== undefined ? humanEval.q9 : '',
    humanEval.q10 !== undefined ? humanEval.q10 : '',
    humanEval.q11 !== undefined ? humanEval.q11 : '',
    humanEval.q12 !== undefined ? humanEval.q12 : '',
    humanEval.q13 !== undefined ? humanEval.q13 : '',
    humanEval.q14 !== undefined ? humanEval.q14 : '',
    humanEval.q15 !== undefined ? humanEval.q15 : '',
    humanEval.q16 !== undefined ? humanEval.q16 : '',

    // Post-Survey General Traits & Attention Check
    ps.q86 !== undefined ? ps.q86 : '',
    ps.q87 !== undefined ? ps.q87 : '',
    ps.q88 !== undefined ? ps.q88 : '',
    attentionCheckPassed,
    ps.q89 || ''
  ];

  return row;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

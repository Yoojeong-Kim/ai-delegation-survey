/**
 * AI Proxy Delegation Study — Google Apps Script (Static Web Version)
 *
 * HOW TO SET UP:
 * 1. Open your Google Sheets file
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire script, replacing any existing content
 * 4. Click "Save" (Ctrl+S)
 * 5. Click "Deploy" → "New deployment"
 * 6. Type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click "Deploy" and authorize permissions
 * 10. Copy the Web App URL!
 * 11. Open `js/config.js` in your project and paste the URL into `GOOGLE_SCRIPT_URL`.
 */

const SHEET_NAME = 'Responses';

const HEADERS = [
  'participant_id', 'timestamp', 'server_timestamp', 'condition',
  'q1_gender', 'q2_birth_year', 'q3_ai_usage', 'q4_work_exp', 'q5_work_type', 'q5_other',
  's1_yesno', 's1_q6', 's1_q7', 's1_q8', 's1_q9', 's1_q10', 's1_q11', 's1_q12', 's1_q13', 's1_q14', 's1_q15',
  's2_yesno', 's2_q6', 's2_q7', 's2_q8', 's2_q9', 's2_q10', 's2_q11', 's2_q12', 's2_q13', 's2_q14', 's2_q15',
  's3_yesno', 's3_q6', 's3_q7', 's3_q8', 's3_q9', 's3_q10', 's3_q11', 's3_q12', 's3_q13', 's3_q14', 's3_q15',
  's4_yesno', 's4_q6', 's4_q7', 's4_q8', 's4_q9', 's4_q10', 's4_q11', 's4_q12', 's4_q13', 's4_q14', 's4_q15',
  'q86', 'q87', 'q88', 'q89'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // Condition Assignment
    if (action === 'assign') {
      const props = PropertiesService.getScriptProperties();
      
      const lock = LockService.getScriptLock();
      lock.waitLock(5000); 
      
      let count = parseInt(props.getProperty('participant_count') || '0', 10);
      count += 1;
      props.setProperty('participant_count', count.toString());
      
      lock.releaseLock();

      const condition = (count % 2 === 1) ? 1 : 2;
      const pid = 'P' + count.toString().padStart(3, '0');

      return jsonResponse({
        ok: true,
        participant_id: pid,
        condition: condition
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

  return jsonResponse({ ok: true, message: 'Apps Script is running' });
}

function buildRow(d) {
  const dem = d.demographics || {};
  const ps  = d.postSurvey   || {};
  const row = [
    d.participantId    || '',
    d.timestamp        || '',
    new Date().toISOString(),
    d.condition        || '',
    dem.q1 || '', dem.q2 || '', dem.q3 || '', dem.q4 || '', dem.q5 || '', dem.q5_other || '',
  ];

  for (let i = 1; i <= 4; i++) {
    const sc = (d.scenarios || []).find(s => s.scenarioId === i) || {};
    row.push(
      sc.yesNo || '',
      sc.q6 !== undefined ? sc.q6 : '', sc.q7 !== undefined ? sc.q7 : '', sc.q8 !== undefined ? sc.q8 : '', sc.q9 !== undefined ? sc.q9 : '', sc.q10 !== undefined ? sc.q10 : '',
      sc.q11 !== undefined ? sc.q11 : '', sc.q12 !== undefined ? sc.q12 : '', sc.q13 !== undefined ? sc.q13 : '', sc.q14 !== undefined ? sc.q14 : '', sc.q15 !== undefined ? sc.q15 : ''
    );
  }

  row.push(
    ps.q86 !== undefined ? ps.q86 : '', ps.q87 !== undefined ? ps.q87 : '', ps.q88 !== undefined ? ps.q88 : '', ps.q89 || ''
  );
  return row;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

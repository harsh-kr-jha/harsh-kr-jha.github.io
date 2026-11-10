/** Paste into a Google Sheet's Extensions → Apps Script editor. */
function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Run setup from the script attached to your Google Sheet.');
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', spreadsheet.getId());
  let sheet = spreadsheet.getSheetByName('Headwig waitlist');
  if (!sheet) sheet = spreadsheet.insertSheet('Headwig waitlist');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Signed up at', 'Email', 'Stack', 'OS', 'Agent', 'Name', 'Message for me']);
    sheet.setFrozenRows(1);
  } else {
    // Extend the existing waitlist without moving or changing earlier entries.
    sheet.getRange(1, 6, 1, 2).setValues([['Name', 'Message for me']]);
  }
}

function doPost(e) {
  const reply = (ok) => ContentService.createTextOutput(JSON.stringify({ ok: ok, schema: 2 }))
    .setMimeType(ContentService.MimeType.JSON);
  const data = (e && e.parameter) || {};
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const stack = String(data.stack || '').trim();
  const os = String(data.os || '').trim();
  const agent = String(data.agent || '').trim();
  const message = String(data.message || '').trim();
  if (data.website || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !name || name.length > 120 || !stack || stack.length > 300 ||
      !agent || agent.length > 300 || message.length > 2000 ||
      ['macOS', 'Windows', 'Linux', 'Other'].indexOf(os) < 0) return reply(false);
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (!id) throw new Error('Run setup first.');
    const sheet = SpreadsheetApp.openById(id).getSheetByName('Headwig waitlist');
    // Retries are safe: one entry per email address.
    if (sheet.getLastRow() > 1) {
      const existing = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getDisplayValues();
      if (existing.some((row) => row[0].replace(/^'/, '').toLowerCase() === email)) return reply(true);
    }
    // Prefix untrusted cells to prevent spreadsheet formula execution.
    const cell = (value) => /^[=+\-@\t\r\n]/.test(value) ? "'" + value : value;
    sheet.appendRow([new Date(), cell(email), cell(stack), os, cell(agent), cell(name), cell(message)]);
    SpreadsheetApp.flush();
    return reply(true);
  } catch (error) {
    console.error('Waitlist write failed');
    return reply(false);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

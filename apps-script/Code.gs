const SHEET_NAME = "RSVPs";
const HEADERS = [
  "submitted_at",
  "attendee_name",
  "chichen_itza_selected",
  "dive_trip_selected",
  "yacht_day_selected",
  "source_page",
];

function doGet() {
  return jsonResponse({ ok: true, message: "RSVP endpoint is live." });
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const attendees = Array.isArray(payload.attendees) ? payload.attendees : [];

    if (!attendees.length) {
      return jsonResponse({ ok: false, error: "No attendees submitted." });
    }

    const sheet = getSheet_();
    const submittedAt = payload.submitted_at || new Date().toISOString();
    const sourcePage = payload.source_page || "";

    const rows = attendees
      .filter((row) => row && typeof row.attendee_name === "string" && row.attendee_name.trim())
      .map((row) => [
        submittedAt,
        row.attendee_name.trim(),
        row.chichen_itza_selected === true,
        row.dive_trip_selected === true,
        row.yacht_day_selected === true,
        sourcePage,
      ]);

    if (!rows.length) {
      return jsonResponse({ ok: false, error: "Every attendee row was blank." });
    }

    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);

    return jsonResponse({ ok: true, rows_saved: rows.length });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

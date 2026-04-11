# Google Sheets RSVP Setup

1. Create a new Google Sheet for wedding RSVPs.
2. Open `Extensions -> Apps Script`.
3. Replace the default file with the contents of [`Code.gs`](./Code.gs).
4. Click `Deploy -> New deployment`.
5. Choose `Web app`.
6. Set:
   - Execute as: `Me`
   - Who has access: `Anyone`
7. Deploy and copy the web app URL.
8. Paste that URL into [`config.js`](../config.js) as `rsvpEndpoint`.
9. Commit and push `config.js`.

The sheet will auto-create a tab named `RSVPs` and save one row per attendee.

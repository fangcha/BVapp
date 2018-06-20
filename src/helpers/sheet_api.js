import config from "./config";

const gapi = window.gapi

// export function load() {
//     gapi.client.sheets.spreadsheets.values.get({
//         spreadsheetId: config.spreadsheetId,
//         range: 'Sheet1'
//       })
//       .then(
//         response => {
//           const data = response.result.values;
//           console.log(data);
//         });
// };

export function write(value, callback) {
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: 'Sheet1',
    majorDimension: 'ROWS',
    valueInputOption: 'RAW',
    values: value
 }).then(callback);
}
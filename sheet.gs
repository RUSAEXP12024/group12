function getSheet(name) {
  const SPREADSHEET_ID = '1FmO5CcOkv_dV8OhRBTLOk5gigojqE995q6vf6OUTxtQ' //スプレッドシートのIDをここに入れる
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}

function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}
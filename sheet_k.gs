function getSheet(name) {
  const SPREADSHEET_ID = '1fPdn7RCv3VInknkugXR1RIFrBPGsAdLhR5jtJ4K3isY'
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

function getValues(){ 
}



const REMO_ACCESS_TOKEN = ''; //remoのアクセストークンをここに入れる
//別のモジュールでも使用するので関数の外に出しておく

function getNatureRemoData(endpoint) {
  const headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + REMO_ACCESS_TOKEN,
  };

  const options = {
    "method" : "get",
    "headers" : headers,
  };

  return JSON.parse(UrlFetchApp.fetch("https://api.nature.global/1/" + endpoint, options));
}
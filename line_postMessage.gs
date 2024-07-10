function postMessage(x) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const token = ''; //チャネルアクセストークン

  const payload = {
    to: '',//ユーザーID
    messages: [
      { type: 'text', text: x,}
    ]
  };

  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + token
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, params);
}

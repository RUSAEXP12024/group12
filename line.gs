const CHANNEL_ACCESS_TOKEN = ''; // LINEのチャンネルトークンをここに入れる

// LINEからのPOSTを処理する関数
function doPost(e) {
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof replyToken === 'undefined') {
    return;
  }
  var url = 'https://api.line.me/v2/bot/message/reply';
  var receive_message = JSON.parse(e.postData.contents).events[0].message.text;
  var reply_text = receive_message + "\n" + "は無効なメッセージです";

  if(receive_message == "電源をONにして！") {
    reply_text = Aircon_ON();
  } else if(receive_message == "電源をOFFにして！") {
    reply_text = Aircon_OFF();
  } else if(receive_message == "エアコンの温度を1℃上げて！") {
    reply_text = Up_AC_temp();
  } else if(receive_message == "エアコンの温度を1℃下げて！") {
    reply_text = Down_AC_temp();
  } else if(receive_message.toLowerCase() === 'get thresholds') {
    const thresholds = getThresholdValues();
    reply_text = `現在の基準値:\n気温: ${thresholds.te}°C\n湿度: ${thresholds.hu}%`;
  } else if(receive_message.toLowerCase() === '基準値の変更') {
    reply_text = "基準値を変更します。\n気温(20~45℃), 湿度(0~100%)の形式で送ってください。";
  } else if(receive_message.toLowerCase().startsWith('set thresholds')) {
    const input = receive_message.replace('set thresholds', '').trim();
    const values = input.split(',');
    if (values.length === 2) {
      try {
        const [te, hu] = values.map(Number);
        setThresholdValues(te, hu);
        reply_text = `基準値を${te}℃, ${hu}%に変更しました。`;
      } catch (e) {
        reply_text = `エラー: ${e.message}`;
      }
    } else {
      reply_text = '無効な形式です。2つの値をカンマで区切って入力してください。';
    }
  } else if(receive_message == "今の気温と湿度を教えて！") {
    const sheet = getSheet("sensor");
    const te = 'B'+getLastData("sensor");
    const hu = 'C'+getLastData("sensor");

    var temp = sheet.getRange(te).getValue();
    var humid = sheet.getRange(hu).getValue();
    reply_text  = '現在の気温は'+ temp +'℃、湿度は' + humid + '％です。';
  }

  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': reply_text,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function postMessage(x) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const token = ''; // チャネルアクセストークン

  const payload = {
    to: '', // ユーザーID
    messages: [
      { type: 'text', text: x, }
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

//LINEからのPOSTを処理する関数
function doPost(e) {
  //LINEから受け取ったデータをパースし、replyTokenを取り出す
  var replyToken= JSON.parse(e.postData.contents).events[0].replyToken;
  //replyTokenが存在しない場合は処理を終了
  if (typeof replyToken === 'undefined') {
    return;
  }
  //LINE Messaging APIのエンドポイント
  var url = 'https://api.line.me/v2/bot/message/reply';
  //認証に使用するチャンネルトークンを入力
  var channelToken = ''; //LINEのチャンネルトークンをここに入れる

  //LINEから受け取ったデータをパースし、メッセージテキストを取り出す
  var receive_message = JSON.parse(e.postData.contents).events[0].message.text;
  //応答するメッセージのデフォルトのテキストを設定
  var reply_text = receive_message + "\n" + "は無効なメッセージです";

  //ONというメッセージを受け取った場合は「エアコンをつけます」というメッセージをLINEに返す
  if(receive_message == "電源をONにして！") {
    reply_text = Aircon_ON();
  //OFFというメッセージを受け取った場合は「エアコンを消します」というメッセージをLINEに返す
  } else if(receive_message == "電源をOFFにして！") {
    reply_text = Aircon_OFF();
  } else if(receive_message == "エアコンの温度を1℃上げて！") {
    reply_text = Up_AC_temp();
  } else if(receive_message == "エアコンの温度を1℃下げて！") {
    reply_text = Down_AC_temp();
  } else if(receive_message == "777") { //まだできてないところ
    reply_text = "777";
  } else if(receive_message == "今の気温と湿度を教えて！") {
    const sheet = getSheet("sensor");
    const te = 'B'+getLastData("sensor");
    const hu = 'C'+getLastData("sensor");

    var temp = sheet.getRange(te).getValue();
    var humid = sheet.getRange(hu).getValue();
    reply_text  = '現在の気温は'+ temp +'℃、湿度は' + humid + '％です。' 

    else if (receive_message.startsWith("温度基準値を変更して！")) {
    const newTemperatureThreshold = receive_message.replace("温度基準値を変更して", "").trim();
    updateThresholds(newTemperatureThreshold, getHumidityThreshold());

    reply_text = '温度基準値を' + newTemperatureThreshold + '℃に変更しました。';
  } else if (receive_message.startsWith("湿度基準値を変更して！")) {
    const newHumidityThreshold = receive_message.replace("湿度基準値を変更して", "").trim();
    updateThresholds(getTemperatureThreshold(), newHumidityThreshold);

    reply_text = '湿度基準値を' + newHumidityThreshold + '%に変更しました。';
  }
  }
  //LINEに対して応答メッセージを返すためのAPIコールを行う
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
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
  //処理が成功したことを示すレスポンスを返します。
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

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


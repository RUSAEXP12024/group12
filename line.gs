var mode = PropertiesService.getScriptProperties(); //基準値変更のどの値を変更するか判断するための変数

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
  } else if(receive_message == "今の気温と湿度を教えて！") {
    reply_text = Get_latest_temp(); 
  } else if(receive_message == "基準値変更") { //まだできてないところ
    //今の基準値も分かるようにした方がいいかな？
    reply_text = "基準値変更を変更します。\nまず、温度を数字で入力してください(20~45)";
    mode.setProperty('MODE', '温度基準値変更');
  } else if (receive_message == "確認") { //動作確認用、最終的に消してもいい
    reply_text = mode.getProperty('MODE');
  } else if(mode.getProperty('MODE') == '温度基準値変更' || mode.getProperty('MODE') == '湿度基準値変更') {
    var num = parseFloat(receive_message);

    if(isNaN(num)) {
      reply_text = "数字を入力してください。"
    } else if(mode.getProperty('MODE') == '温度基準値変更') {
      if(num < 20 || num > 45) {
        reply_text = "正しい値(20~45)を入力してください";
      } else {
        //スプレッドシートに書き換える処理を入れて
        updateTemperatureThreshold(num);
        reply_text = "温度の基準値を変更しました。\n変更後の温度基準値：" + String(num) + "℃\n湿度を数字で入力してください(0~100)";
        mode.setProperty('MODE', '湿度基準値変更');
      }
    } else if(mode.getProperty('MODE') == '湿度基準値変更') {
      if(num < 0 || num > 100) {
        reply_text = "正しい値(0~100)を入力してください";
      } else {
        //スプレッドシートに書き換える処理を入れて
        updateHumidityThreshold(num);
        reply_text = "湿度の基準値を変更しました。\n変更後の湿度基準値：" + String(num) + "％";
        mode.setProperty('MODE', '変更完了');
      }
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


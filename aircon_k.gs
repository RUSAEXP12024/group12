const ApplianceID = ""; //Nature Remo3 applianceIDをここに入れる

function Aircon_ON() {
  var url = "https://api.nature.global/1/appliances/" + ApplianceID + "/aircon_settings"; //Nature Remo3 APIのエアコン設定エンドポイント

  var headers = {
    "Authorization": "Bearer " + REMO_ACCESS_TOKEN //REMO_ACCESS_TOKENはremo.gsで設定済み
  };
  var payload = {
    "button":""/*エアコンのONはbuttonに空文字*/
  };

  var options = {
    "method": "POST",
    "headers": headers,
    "payload": payload
  };

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText()); //動作確認用
  var responseBody = JSON.parse(response);

  var reply_text = "エアコンをONにしました\n設定温度： " + responseBody.temp + "℃";
  return reply_text;
}

function Aircon_OFF() {
  var url = "https://api.nature.global/1/appliances/" + ApplianceID + "/aircon_settings"; // Nature Remo3 APIのエアコン設定エンドポイント

  var headers = {
    "Authorization": "Bearer " + REMO_ACCESS_TOKEN
  };
  var payload = {
    "button":"power-off"/*エアコンのOFFを指定*/
  };

  var options = {
    "method": "POST",
    "headers": headers,
    "payload": payload
  };

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText()); //動作確認用

  var reply_text = "エアコンをOFFにしました";
  return reply_text;
}

function Up_AC_temp() {
  var url = "https://api.nature.global/1/appliances/" + ApplianceID + "/aircon_settings"; // Nature Remo3 APIのエアコン設定エンドポイント

  //文字列を一旦数字にして1足して戻す
  var ac_temp = Get_AC_temp(); //エアコンの設定温度を取得
  var num = Number(ac_temp);
  num += 1;
  ac_temp = String(num);

  var headers = {
    "Authorization": "Bearer " + REMO_ACCESS_TOKEN
  };
  var payload = {
    "temperature": ac_temp,
    "tempetature_unit": "c"
  };

  var options = {
    "method": "POST",
    "headers": headers,
    "payload": payload
  };

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText()); //動作確認用
  var responseBody = JSON.parse(response);

  var reply_text = "エアコンの温度を1℃上げました\n設定温度： " + responseBody.temp + "℃";
  return reply_text;
}

function Down_AC_temp() {
  var url = "https://api.nature.global/1/appliances/" + ApplianceID + "/aircon_settings"; // Nature Remo3 APIのエアコン設定エンドポイント

  //文字列を一旦数字にして1引いて戻す
  var ac_temp = Get_AC_temp(); //エアコンの設定温度を取得
  var num = Number(ac_temp);
  num -= 1;
  ac_temp = String(num);

  var headers = {
    "Authorization": "Bearer " + REMO_ACCESS_TOKEN
  };
  var payload = {
    "temperature": ac_temp,
    "tempetature_unit": "c"
  };

  var options = {
    "method": "POST",
    "headers": headers,
    "payload": payload
  };

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText()); //動作確認用
  var responseBody = JSON.parse(response);

  var reply_text = "エアコンの温度を1℃下げました\n設定温度： " + responseBody.temp + "℃";
  return reply_text;
}

function Get_AC_temp() { //エアコンの設定温度を返す
  var data = getNatureRemoData("appliances"); //remo.gsのgetNatureRemoData()を使う
  var ac_temp = "";
  data.forEach(function(e) {
    if(e.nickname == 'エアコン'){ //'エアコン'のところは自分がつけてるニックネーム、このforeach文はもう少しうまく書けそう
      ac_temp = e.settings.temp;
    }
  });

  Logger.log("%s", ac_temp); //動作確認用
  
  return ac_temp;
}

function Get_AC_state() { //エアコンのON/OFF状態を返す
  var data = getNatureRemoData("appliances"); 
  var ac_button = ""; //ONなら空文字だからいったんac_stateで状態を表すようにしてる
  var ac_state = 0; //OFFなら0、ONなら1
  data.forEach(function(e) {
    if(e.nickname == 'エアコン'){
      ac_button = e.settings.button;
      if(ac_button != "power-off"){
        ac_state = 1;
      }
    }
  });

  Logger.log("%s %d", ac_button, ac_state); //動作確認用
  
  return ac_state;
}

//参考文献：https://rcmdnk.com/blog/2020/10/09/computer-iot-google/
//applianceIDの取得方法参考：https://blog.yuu26.com/nature-remo-api-control/
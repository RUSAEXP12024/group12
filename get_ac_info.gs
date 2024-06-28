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
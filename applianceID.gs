function get_applianceID() {
  var data = getNatureRemoData("appliances");
  var applianceID = "";

  data.forEach(function(e) {

    if(e.nickname == 'エアコン') { //'エアコン'のところは操作したいエアコンのニックネーム
      applianceID = e.id;
    }


  });

  Logger.log("%s", applianceID); //動作確認用

  return applianceID;
}

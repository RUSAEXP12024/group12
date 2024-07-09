function get_applianceID() {
  var data = getNatureRemoData("appliances");
  var applianceID = "";

  data.forEach(function(e) {
    applianceID = e.id;
  });

  Logger.log("%s", applianceID); //動作確認用

  return applianceID;
}

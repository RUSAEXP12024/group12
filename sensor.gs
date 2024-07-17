var judge = PropertiesService.getScriptProperties();

function recordSensorData() {
  const deviceData = getNatureRemoData("devices");//data取得

  let lastSensorData = getLastData("sensor");

    checkSheet();
    var arg = {
    te:deviceData[0].newest_events.te.val,//温度
    hu:deviceData[0].newest_events.hu.val,//湿度
    il:deviceData[0].newest_events.il.val,//照度
    mo_last:deviceData[0].newest_events.mo.created_at,//人感センサー
  }

  if(lastSensorData < 2){
    for(let i = 0; i < 3; i++){
      setSensorData(arg, lastSensorData + 1);
      lastSensorData += 1;
    }
    judge.setProperty('JUDGE', '0');
  }

  setSensorData(arg, lastSensorData + 1);

  lastSensorData += 1;
 
  const sheet = getSheet("sensor");
  var mo_l = 'E'+lastSensorData;
  var mo_l_5 = 'E'+(lastSensorData-1);
  var mo_l_15 = 'E'+(lastSensorData-3);

  var mo_last = sheet.getRange(mo_l).getValue();
  var mo_last_5 = sheet.getRange(mo_l_5).getValue();
  var mo_last_15 = sheet.getRange(mo_l_15).getValue();

  //Logger.log(mo_last);
  //Logger.log(mo_last_5);

  if(mo_last != mo_last_5) {
    if(judge.getProperty('JUDGE') == '0') {
      judge.setProperty('JUDGE', '1');
      //Logger.log('1');
    } else {
      judge.setProperty('JUDGE', '0');
    }
  }

  if(Get_AC_state() == 0) {
    judge.setProperty('JUDGE', '0');
  }
  

  const te = 'B'+getLastData("sensor");
  const hu = 'C'+getLastData("sensor");
  const warning_te = 'G1';   //気温の基準値が記録されているセル
  const warning_hu = 'H1';   //湿度の基準値が記録されているセル

  var temp = sheet.getRange(te).getValue();
  var humid = sheet.getRange(hu).getValue();
  var warning_temp = sheet.getRange(warning_te).getValue();
  var warning_humid = sheet.getRange(warning_hu).getValue();

  let x = '現在の気温は'+ temp +'℃、湿度は' + humid + '％です。' 

  
  if(temp >= warning_temp && humid >= warning_humid){
    x = x + '気温と湿度の両方の基準値を超えました。';
    postMessage(x);
  }else if(temp >= warning_temp){
    x = x + '気温の基準値を超えました。';
    postMessage(x);
  }else if(humid >= warning_humid){
    x = x + '湿度の基準値を超えました。'
    postMessage(x);
  }


  if(mo_last == mo_last_15){
    if(Get_AC_state() == 1 && judge.getProperty('JUDGE') == '1'){
      let z = '15分以上人感センサーが反応しませんでした。エアコンを消し忘れていませんか？' 
      judge.setProperty('JUDGE', '0');
      //Logger.log('a');
      postMessage(z);
    }
  }

  
  Logger.log(judge.getProperty('JUDGE'));
}

function setSensorData(data, row) {
  getSheet('sensor').getRange(row, 1, 1, 5).setValues([[new Date(), data.te, data.hu, data.il, data.mo_last]])
}
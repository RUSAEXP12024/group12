function recordSensorData() {
  const deviceData = getNatureRemoData("devices");//data取得

  for (let step = 0; step < 5; step++) 
  {
    let lastSensorData = getLastData("sensor");//最終data取得
    var arg = {
    te:deviceData[0].newest_events.te.val,//温度
    hu:deviceData[0].newest_events.hu.val,//湿度
    il:deviceData[0].newest_events.il.val,//照度
    mo_last:deviceData[0].newest_events.mo.created_at,//人感センサー
  }
  setSensorData(arg, lastSensorData + 1);
  
  const sheet = getSheet("sensor");
  const te = 'B'+getLastData("sensor");
  const hu = 'C'+getLastData("sensor");
  const warning_te = 'G1';   //気温の基準値が記録されているセル
  const warning_hu = 'H1';   //湿度の基準値が記録されているセル

  var temp = sheet.getRange(te).getValue();
  var humid = sheet.getRange(hu).getValue();
  var warning_temp = sheet.getRange(warning_te).getValue();
  var warning_humid = sheet.getRange(warning_hu).getValue();

  let x = '現在の気温は'+ temp +'℃、湿度は' + humid + '％です。' 
  const y = '熱中症のリスクがあります。エアコンをつけることを推奨します。'

  
  if(temp >= warning_temp){
    x = x + y;
  }else if(humid >= warning_humid){
    x = x + y;
  }
    postMessage(x);

    if(lastSensorData >= 5){
      const sheet = getSheet("sensor");
      const mo_l = 'E'+lastSensorData;
      const mo_l_15 = 'E'+(lastSensorData-3);
      var mo_last = sheet.getRange(mo_l).getValue();
      var mo_last_15 = sheet.getRange(mo_l_15).getValue();

      if(mo_last === mo_last_15){
        if(Get_AC_state() == 1){
          let z = '15分以上人感センサーが反応しませんでした。エアコンを消し忘れていませんか？' 
          postMessage(z);
        }
      }
    }
  }
}


function setSensorData(data, row) {
  getSheet('sensor').getRange(row, 1, 1, 5).setValues([[new Date(), data.te, data.hu, data.il,data.mo_last]])
  var second = 300//計測間隔
  Utilities.sleep(second*1000);
}
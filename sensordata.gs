function recordSensorData() {
  const deviceData = getNatureRemoData("devices");　　　　//data取得

  for (let step = 0; step < 5; step++) 
  {
    const lastSensorData = getLastData("sensor");　　　　　//最終data取得

    var arg = {
      te:deviceData[0].newest_events/*一番新しいデータ*/.te.val,　　//温度
      hu:deviceData[0].newest_events.hu.val,　　//湿度
      il:deviceData[0].newest_events.il.val,　　//照度
      mo:deviceData[0].newest_events.mo.created_at,　　//人感
    }

    setSensorData(arg, lastSensorData + 1);
  }
}

function setSensorData(data, row) {
  
  getSheet('sensor').getRange(row, 1, 1, 5)/*書き始めの行、何行書き込む、書き始め列、何列書き込む*/.setValues([[new Date(), data.te, data.hu, data.il,data.mo]])
  
  var second = 300//計測間隔
  Utilities.sleep(second*1000);
}
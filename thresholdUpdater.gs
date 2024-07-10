var thresholdUpdater = (function() {
  // 気温の基準値を更新する関数
  function updateTemperatureThreshold(temperatureThreshold) {
    const sheet = getSheet("sensor"); // sensorシートを取得
    sheet.getRange('G1').setValue(temperatureThreshold); // G1セルに気温基準値を設定
  }

  // 湿度の基準値を更新する関数
  function updateHumidityThreshold(humidityThreshold) {
    const sheet = getSheet("sensor"); // sensorシートを取得
    sheet.getRange('H1').setValue(humidityThreshold); // H1セルに湿度基準値を設定
  }

  // 外部に公開する関数を返す
  return {
    updateTemperatureThreshold: updateTemperatureThreshold,
    updateHumidityThreshold: updateHumidityThreshold
  };
})();

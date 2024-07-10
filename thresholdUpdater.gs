var thresholdUpdater = (function() {
  function updateReferenceThresholds(temperatureThreshold, humidityThreshold) {
    const sheet = getSheet("Reference");
    const lastRow = getLastData("Reference");
    sheet.getRange(lastRow + 1, 1, 1, 3).setValues([[new Date(), temperatureThreshold, humidityThreshold]]);
  }

  function updateTemperatureThreshold(temperatureThreshold) {
    const sheet = getSheet("Reference");
    const lastRow = getLastData("Reference");
    sheet.getRange(lastRow + 1, 1, 1, 2).setValues([[new Date(), temperatureThreshold]]);
  }

  function updateHumidityThreshold(humidityThreshold) {
    const sheet = getSheet("Reference");
    const lastRow = getLastData("Reference");
    sheet.getRange(lastRow + 1, 1, 1, 3).setValues([[new Date(), '', humidityThreshold]]);
  }

  return {
    updateReferenceThresholds: updateReferenceThresholds,
    updateTemperatureThreshold: updateTemperatureThreshold,
    updateHumidityThreshold: updateHumidityThreshold
  };
})();

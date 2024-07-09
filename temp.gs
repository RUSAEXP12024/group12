function Get_latest_temp() {
  const sheet = getSheet("sensor");
  const te = 'B'+getLastData("sensor");
  const hu = 'C'+getLastData("sensor");

  let temp = sheet.getRange(te).getValue();
  let humid = sheet.getRange(hu).getValue();
  let reply_text  = '現在の気温は'+ temp +'℃、湿度は' + humid + '％です。';

  return reply_text;
}

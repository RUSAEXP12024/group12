function checkSheet(){
  var date1 = new Date(getSheet("sensor").getRange(2,1,1,1).getValues());
  var date2 = new Date(getSheet("sensor").getRange(getLastData("sensor"), 1, 1, 1).getValue());

  var date1_month = date1.getMonth();
  var date2_month = date2.getMonth();
  var date1_day = date1.getDate();
  var date2_day = date2.getDate();

  if(date2_month!=date1_month)
  {
    date2_day = (date2_month-date1_month)*30;
  }

  if(date2_day-date1_day >7 )
  {
    const deleteRow = 2; // 削除したい先頭の行番号
    const deleteNum = getLastData("sensor")-4; // 削除したい行数

    getSheet("sensor").deleteRows(deleteRow,deleteNum);

    Logger.log("%s","スプレッドシートを削除しました")//確認

  }
}

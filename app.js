/*
'use strict';
//モジュール呼び出し　いろんな機能が用意されているから書かなくていい
// fs is filesystem module,readline is fail reading by line
const fs = require('fs');
const readline = require('readline');
//以上の部分は popu-pref.csv ファイルから、ファイルを読み込みを行う Stream（ストリーム）を生成し、 さらにそれを readline オブジェクトの input として設定し、 rl オブジェクトを作成しています。
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input':rs,'output':{} });
const prefectureDataMap = new Map();//key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
//rlオブジェクトで、lineというイベントが発生したら、この無名関数を呼ぶという意味
//処理の中でconsole.logを使っているので、lineイベントが発生したタイミングで、
//コンソールに引数lineStringの内容が出力される。これには読みこんだ1行が入っている
rl.on('line',(lineString) => {
    //"ab,cde,f" という文字列であれば、["ab", "cde", "f"]という文字列からなる配列に分割
    const columns = lineString.split(',');

    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    //parseInt() （パースイント）という文字列を整数値に変換する関数
    const popu = parseInt(columns[3]);

    //集計年の数値 year が、 2010 または 2015 である時を if 文で判定しています。
    if(year ===2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {
                popu10:0,
                popu15:0,
                change:null
            };
        }
        if(year === 2010){
            value.popu10 = popu;
        }
        if(year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture,value);
    }
});
rl.on('close', () => {
    console.log(prefectureDataMap);
});
*/

'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) { 
      value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
      return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
  });
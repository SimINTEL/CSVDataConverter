/**
 * Created by Yukai Ji on 2016/11/13.
 */
var csv = require('csv-parser')
var fs = require('fs')
var redis = require("redis"),
    client = redis.createClient();

var writeLineStream = require('lei-stream').writeLine;

// writeLineStream第一个参数为ReadStream实例，也可以为文件名
var s = writeLineStream(fs.createWriteStream('myfile.txt'), {
    // 换行符，默认\n
    newline: '\n',
    // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
    // encoding: function (data) {
    //     return JSON.stringify(data);
    // },
    // 缓存的行数，默认为0（表示不缓存），此选项主要用于优化写文件性能，当数量缓存的内容超过该数量时再一次性写入到流中，可以提高写速度
    cacheLines: 0
});




client.keys("*", function(err, reply) {

    reply.forEach(function(e){
        client.get(e, function (err, reply) {
                  // Will print `OK`

            var array = e.split("%");
            var datearray = array[1].toString().split("-");
            var date = datearray[0] + "-" + datearray[1]+ "-"  + datearray[2] + " " + datearray[3] + ":" + datearray[4] + "0:00";
            var line = array[0] + "," + date + "," + reply;


// 写一行
            s.write((line), function () {
            });
        });
    })
    //
});
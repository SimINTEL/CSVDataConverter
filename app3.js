
var csv = require('csv-parser')
var fs = require('fs')
var redis = require("redis"),
    client = redis.createClient();

//时间对比函数，如果a>b返回1，如果a<b返回-1，相等返回0
function comptime(a,b)
{
    if(isNaN(a) || isNaN(b)) return null;
    if(a >= b) return 1;
    if(a <= b) return -1;
    return 0;
}
var count = 0;

fs.createReadStream('airport_gz_security_check_chusai_1stround.csv')
    .pipe(csv())
    .on('data', function (data) {
        //console.log('Tag: %s count: %s Time: %s', data.WIFIAPTag, data.passengerCount, data.timeStamp);
        var startTime = new Date('2016/09/10 18:50');
        var endTime = new Date('2016/09/14 14:50');
        var time1 = new Date(data.security_time);

        var key;
        //only handle time period is between start and end time
        if(comptime(time1, startTime) == 1 && comptime(time1, endTime) == -1) {
            count++;
            var minute = parseInt(parseInt(time1.getMinutes())/10);
            key = data.security_time.toString().substr(0, 9) + '-'+ time1.getHours() + ':'+minute;
            console.log(key);

            client.get(key, function(err, reply) {
                // reply is null when the key is missing
                if(reply == null){
                    client.set(key, 1, redis.print);
                }
                else{
                    client.set(key, 1 + parseInt(reply), redis.print);
                }
                console.log(key + " # " + reply);
                // client.get(key, function (err, reply) {
                //     console.log(key + "  "+reply); // Will print `OK`
                // });
            });
        }

        //console.log(client.get(key));
        //client.set(key, "string val", redis.print);
    }).on('end', function () {
    console.log(count);
    console.log("finished");
})
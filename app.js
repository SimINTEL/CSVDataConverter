
var csv = require('csv-parser')
var fs = require('fs')
var redis = require("redis"),
    client = redis.createClient();


fs.createReadStream('WIFI_AP_Passenger_Records_chusai_1stround.csv')
    .pipe(csv())
    .on('data', function (data) {
        //console.log('Tag: %s count: %s Time: %s', data.WIFIAPTag, data.passengerCount, data.timeStamp);
        var time1 = data.timeStamp.toString().split("-");

        var minute = parseInt(parseInt(time1[4])/10);
        //console.log(minute);

        var key;
        var value;

        key = data.WIFIAPTag + "%" + data.timeStamp.toString().substr(0, 14)+minute;
        value=parseInt(data.passengerCount);
        //console.log(key);

        client.get(key, function(err, reply) {
            // reply is null when the key is missing
            if(reply == null){
                client.set(key, value, redis.print);
            }
            else{
                client.set(key, value + parseInt(reply), redis.print);
            }
            //console.log(reply);
            // client.get(key, function (err, reply) {
            //     console.log(key + "  "+reply); // Will print `OK`
            // });
        });

        //console.log(client.get(key));
        //client.set(key, "string val", redis.print);
    }).on('end', function () {
    console.log("finished");
})
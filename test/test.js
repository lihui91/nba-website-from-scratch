var fs = require("fs");
var file = fs.readFileSync("./shotDetailChart.csv", "utf8");


function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = {} ;
            for (var j=0; j<headers.length; j++) {
                tarr[headers[j]] = data[j];
            }
            lines.push(tarr);
        }
    }
    // alert(lines);
    return lines;
}

var per_shot = processData(file);

var game_set = new Set();

per_shot.forEach(ele => {
    var time = (( ele.PERIOD - 1 ) * 12 + (12 - ele.MINUTES_REMAINING))*60 - ele.SECONDS_REMAINING;
    game_set.add(ele.TEAM_NAME);
    ele["time"] = time;
    
});

per_shot.sort(function(a, b){
    return a.time - b.time;
})

// console.log(per_shot);
function getScore(ele){
    if(ele.SHOT_MADE_FLAG!=0){
        if(ele.SHOT_TYPE == "3PT Field Goal")
            return 3;
        else if(ele.SHOT_TYPE == "2PT Field Goal")
            return 2;
        else{
            console.log(ele);
        }

    }
    else{
        return 0;
    }
}

var team_a = [0];
var team_b = [0];

var cur_time = 0;

var cur_a = team_a[team_a.length - 1];
var cur_b = team_b[team_b.length - 1];

var name_a = game_set.values().next().value;


per_shot.forEach(ele => {
    //console.log(ele);
    if(cur_time < ele.time && ele.time <= cur_time + 30){
        console.log(ele.time)
        if(ele.TEAM_NAME == name_a){
            cur_a += getScore(ele)*2;
        }
        else{
            cur_b += getScore(ele)*2;
        }
    }
    else{
        cur_time += 30;
        team_a.push(cur_a);
        team_b.push(cur_b);
        cur_a = team_a[team_a.length - 1];
        cur_b = team_b[team_b.length - 1];
    }   

});

console.log(name_a);

console.log(team_a);
console.log(team_b.length);







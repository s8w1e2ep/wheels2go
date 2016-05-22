var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var json = "";
var url = "";
var pnum;
var id = "";
// record the info of the driver and index
var cinfo = ""; //record the information of the carpool
var dinfo = "";
var dinfo2 = "";
var dinfo3 = "";
var did = "";
var did2 = "";
var did3 = "";
var index1 = -1;
var index2 = -1;
var index3 = -1;
var dname = "";

$(document).ready(function() {
    url = window.location.toString();
    var str = url.substring(url.indexOf("{"), url.length);
    json = JSON.parse(decodeURIComponent(str));
    id = json.id;
    pnum = json.pnum;

    var result = json.result;
    var temp = json.result[0].did;

    getPersonalData();
    setPic();
    setURL();

    result = JSON.stringify(result);

    //set Table
    result1(server + "result.php", result, "table1");
    result2(server + "result2.php", result, "table2");
    $("#table2").hide();
    result2(server + "result3.php", result, "table3");
    $("#table3").hide();

    $('.wrapperInside').attr('style', 'background-color: rgba(0,0,0,0.5);');
    $('#submit').click(function() {
        confirm();
    });

    $('#cancel').click(function() {
        cancel();
    });

    var element = document.body;
    Hammer(element, {prevent_default:true, no_mouseevents:true}).on("swiperight", function(){
        $('.mdl-layout__drawer').addClass('is-visible').attr('aria-hidden', 'false');
        $('.mdl-layout__obfuscator').addClass('is-visible');
    });

    Hammer(element, {prevent_default:true, no_mouseevents:true}).on("swipeleft", function(){
        $('.mdl-layout__drawer').removeClass('is-visible').attr('aria-hidden', 'true');
        $('.mdl-layout__obfuscator').removeClass('is-visible');
    });
});

function getPersonalData() {
    var url = server + 'get_personal_info.php?data={"id":"' + id + '"}';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var personalData = JSON.parse(xmlhttp.responseText);
            name = personalData.name;
            phone = personalData.phone;

            $('#pname').html(name);
            $('#pname2').html(name);
            $('#dialog_name').html(name);
            $('#tel').html(phone);
        }
    };
    xmlhttp.send();
}

function setURL() {
    $('#board').attr('href', local + 'board.html?data={"id":"' + id + '"}');
    $('#wall').attr('href', local + 'wall.html?data={"id":"' + id + '"}');
    $('#friendlist').attr('href', local + 'friendlist.html?data={"id":"' + id + '"}');
    $('#about').attr('href', local + 'about.html?data={"id":"' + id + '"}');
    $('#setting').attr('href', local + 'setting.html?data={"id":"' + id + '"}');
    $('#edit').attr('href', local + 'edit.html?data={"id":"' + id + '"}');
    $('#logo').attr('href', local + 'index.html?data={"id":"' + id + '"}');
    $('#dsgr').attr('href', local + 'index.html?data={"id":"' + id + '"}');
}

//設定大頭貼
function setPic() {
    if (id.length == 10 && id.substr(0, 2) === "09") {
        var url = server + 'get_image.php?data={"id":"' + id + '"}';
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var result = "http://120.114.186.4:8080/carpool/" + xmlhttp.responseText.trim();
                $('#user_image').attr('src', result);
            }
        };
        xmlhttp.send();
    } else {
        $('#user_image').attr('src', 'http://graph.facebook.com/' + id + '/picture?type=large');
    }
}

function setPic2(index, id) {
    var url = server + 'get_image.php?data={"id":"' + id + '"}';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var res = "http://120.114.186.4:8080/carpool/" + xmlhttp.responseText.trim();
            $('#' + index).attr('src', res);
        }
    };
    xmlhttp.send();
}

/**
 * [updateCarpool description]
 * @param  {"index1": 1, "index2": 2, "index3": 0} data [description]
 * @return {[type]}      [description]
 */
function updateCarpool(data, data2) {
    var xmlhttp = new XMLHttpRequest();
    var url = server + "update_carpool.php?data=" + data;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            window.location = local + 'waiting.html?data=' + data2;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function confirm() {
    var num = 1;
    var data = [];
    data.push({
        'id': id,
        'pnum': pnum,
        'index1': index1,
        'index2': index2,
        'index3': index3
    });
    data = JSON.stringify(data);
    data = data.substring(1, data.length - 1);
    var ids = [];
    ids.push(id, did);
    sendGCM(did, 0);

    if ((did2 !== "") && (did3 !== "")) {
        sendGCM(did2, 1);
        sendGCM(did3, 2);
        num = 3;
        ids.push(did2, did3);
    } else if (did2 !== "") {
        sendGCM(did2, 1);
        num = 2;
        ids.push(did2);
    }

    var data2 = [];
    data2.push({
        'id': ids,
        'pnum': pnum,
        'num': num
    });
    data2 = JSON.stringify(data2);
    data2 = data2.substring(1, data2.length - 1);
    updateCarpool(data, data2);
}

function cancel() {
    $('#dialog').css("display", "none");
    $("#table1").show();
    $("#table2").hide();
    $("#table3").hide();
    var index1 = -1;
    var index2 = -1;
    var index3 = -1;
    did = "";
    did2 = "";
    did3 = "";
    dname = "";
}

function result1(url, data, mode) {
    var xmlhttp = new XMLHttpRequest();
    url += '?data={"result":' + data + '}';
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            dinfo = JSON.parse(xmlhttp.responseText);
            cinfo = JSON.parse(data);
            cinfo.sort(sort_by_percentage);
            var str = "";

            for (var i = 0; i < cinfo.length; i++) {
                var dpic = "";
                var name = dinfo[i].name;
                var gender = dinfo[i].gender;
                var rvalue = dinfo[i].rating;
                rvalue = Math.round(rvalue * 100) / 100;

                if (cinfo[i][0].did.length == 10 && cinfo[i][0].did.substr(0, 2) === "09")
                    setPic2('d' + i, cinfo[i][0].did);
                else
                    dpic = 'http://graph.facebook.com/' + cinfo[i][0].did + '/picture/?type=normal';

                if (cinfo[i].length > 1) {
                    str += '<div class="mdl-grid" style="text-align: center; box-shadow:2px 2px 2px 2px rgba(20%,20%,40%,0.5); margin:10px;"  onclick="showResult2(' + i + ');">';
                    str += '<div class="mdl-cell mdl-cell--4-col" style="border-bottom: 1px solid;border-bottom-color: rgba(0,0,0,.2);">';
                    str += '<img id="d' + i + '" src="' + dpic + '" class="avatar">';
                    str += '<h5 style="font-size: 1em;font-family: Microsoft YaHei;">';
                    str += '司機' + (i + 1) + ': ' + name + '/ ' + gender + '/ <i class="material-icons" style="font-size: 1em;">&#xE8D0;</i>' + rvalue + '</h5>';
                    str += '</div>';
                    str += '<div class="mdl-cell mdl-cell--2-col">共乘比例</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][0].percentage) + '%</div>';
                    str += '<div class="mdl-cell mdl-cell--2-col">等待時間</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][0].wait / 60) + '分</div>';
                    str += '<div class="mdl-cell mdl-cell--2-col">上車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][0].on_d + '公尺</div>';
                    str += '<div class="mdl-cell mdl-cell--2-col">下車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][0].off_d + '公尺</div>';
                    str += '</div>';
                } else {
                    str += '<div class="mdl-grid" style="text-align: center; box-shadow:2px 2px 2px 2px rgba(20%,20%,40%,0.5); margin:10px;"  onclick="setDialog(' + cinfo[i][0].did + ',' + i + ');">';
                    str += '<div class="mdl-cell mdl-cell--4-col" style="border-bottom: 1px solid;border-bottom-color: rgba(0,0,0,.2);">';
                    str += '<img id="d' + i + '" src="' + dpic + '" class="avatar">';
                    str += '<h5 style="font-size: 1em;font-family: Microsoft YaHei;">';
                    str += '司機' + (i + 1) + ': ' + name + '/ ' + gender + '/ <i class="material-icons" style="font-size: 1em;">&#xE8D0;</i>' + rvalue + '</h5>';
                    str += '</div>';
                    str += '<div class="mdl-cell mdl-cell--2-col">共乘比例</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][0].percentage) + '%</div>';
                    str += '<div class="mdl-cell mdl-cell--2-col">等待時間</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][0].wait / 60) + '分</div>';
                    str += '<div class="mdl-cell mdl-cell--2-col">上車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][0].on_d + '公尺</div>';
                    str += '<div class="mdl-cell mdl-cell--2-col">下車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][0].off_d + '公尺</div>';
                    str += '</div>';
                }
            }

            document.getElementById(mode).innerHTML = str;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function result2(url, data, mode) {
    var xmlhttp = new XMLHttpRequest();
    url += '?data={"result":' + data + '}';
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            dinfo2 = JSON.parse(xmlhttp.responseText);
            var str = "";
            var count = 0;
            var count_index = 1;
            var dpic = "";

            for (var i = 0; i < cinfo.length; i++) {
                //var class_n = "child" + i;

                for (var j = 1; j < cinfo[i].length; j++) {
                    var name = dinfo[count].name;
                    var gender = dinfo[count].gender;
                    var rvalue = dinfo[count].rating;
                    rvalue = Math.round(rvalue * 100) / 100;

                    if (cinfo[i][j].order == 2) {
                        if (cinfo[i][j].did.length == 10 && cinfo[i][j].did.substr(0, 2) === "09")
                            setPic2('d2' + (j - 1), cinfo[i][j].did);
                        else
                            dpic = 'http://graph.facebook.com/' + cinfo[i][j].did + '/picture/?type=normal';

                        if ((j != (cinfo[i].length - 1)) && (cinfo[i][j + 1].order == 3)) {
                            // str += '<div class="mdl-grid ' + class_n + '" style="text-align: center; box-shadow:2px 2px 2px 2px rgba(20%,20%,40%,0.5); margin:10px;" value="' + i + '" onclick="showResult3(' + i + ',' + (j - 1) + ',' + name + ');">';
                            str += '<div class="mdl-grid" style="text-align: center; box-shadow:2px 2px 2px 2px rgba(20%,20%,40%,0.5); margin:10px;" onclick="showResult3(' + i + ',' + (j - 1) + ',\'' + name + '\');">';
                            str += '<div class="mdl-cell mdl-cell--4-col" style="border-bottom: 1px solid;border-bottom-color: rgba(0,0,0,.2);">';
                            str += '<img id="d2' + (j - 1) + '" src="' + dpic + '" class="avatar">';
                            str += '<h5 style="font-size: 1em;font-family: Microsoft YaHei;">';
                            str += '司機' + count_index + ': ' + name + '/ ' + gender + '/ <i class="material-icons" style="font-size: 1em;">&#xE8D0;</i>' + rvalue + '</h5>';
                            str += '</div>';
                            str += '<div class="mdl-cell mdl-cell--2-col">共乘比例</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][j].percentage) + '%</div>';
                            str += '<div class="mdl-cell mdl-cell--2-col">等待時間</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][j].wait / 60) + '分</div>';
                            str += '<div class="mdl-cell mdl-cell--2-col">上車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][j].on_d + '公尺</div>';
                            str += '<div class="mdl-cell mdl-cell--2-col">下車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][j].off_d + '公尺</div>';
                            str += '</div>';
                        } else {
                            str += '<div class="mdl-grid" style="text-align: center; box-shadow:2px 2px 2px 2px rgba(20%,20%,40%,0.5); margin:10px;" onclick="setDialog2(' + cinfo[i][0].did + ',' + cinfo[i][j].did + ',' + (j - 1) + ',\'' + name + '\');">';
                            str += '<div class="mdl-cell mdl-cell--4-col" style="border-bottom: 1px solid;border-bottom-color: rgba(0,0,0,.2);">';
                            str += '<img id="d2' + (j - 1) + '" src="' + dpic + '" class="avatar">';
                            str += '<h5 style="font-size: 1em;font-family: Microsoft YaHei;">';
                            str += '司機' + count_index + ': ' + name + '/ ' + gender + '/ <i class="material-icons" style="font-size: 1em;">&#xE8D0;</i>' + rvalue + '</h5>';
                            str += '</div>';
                            str += '<div class="mdl-cell mdl-cell--2-col">共乘比例</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][j].percentage) + '%</div>';
                            str += '<div class="mdl-cell mdl-cell--2-col">等待時間</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][j].wait / 60) + '分</div>';
                            str += '<div class="mdl-cell mdl-cell--2-col">上車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][j].on_d + '公尺</div>';
                            str += '<div class="mdl-cell mdl-cell--2-col">下車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][j].off_d + '公尺</div>';
                            str += '</div>';
                        }
                    }
                    count_index++;
                    count++;
                }
            }
            document.getElementById(mode).innerHTML = str;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function result3(url, data, mode) {
    var xmlhttp = new XMLHttpRequest();
    url += '?data={"result":' + data + '}';
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            dinfo2 = JSON.parse(xmlhttp.responseText);
            var str = "";
            var count = 0;
            var count_index = 1;
            var dpic = "";

            for (var i = 0; i < cinfo.length; i++) {
                //var class_n = "lastchild" + (i * 100);
                //var temp_n = 0;

                for (var j = 2; j < cinfo[i].length; j++) {
                    var name = dinfo[count].name;
                    var gender = dinfo[count].gender;
                    var rvalue = dinfo[count].rating;
                    rvalue = Math.round(rvalue * 100) / 100;

                    if (cinfo[i][j].order == 3) {
                        if (cinfo[i][j].did.length == 10 && cinfo[i][j].did.substr(0, 2) === "09")
                            setPic2('d23' + (j - 1), cinfo[i][j].did);
                        else
                            dpic = 'http://graph.facebook.com/' + cinfo[i][j].did + '/picture/?type=normal';

                        if (cinfo[i][j - 1].order == 2)
                            temp_n = j - 1;

                        //str += '<div class="mdl-grid ' + (class_n + temp_n) + '" style="text-align: center; box-shadow:2px 2px 2px 2px rgba(20%,20%,40%,0.5); margin:10px;" value="' + i + '" onclick="setDialog3(' + cinfo[i][0]['did'] + ',' + cinfo[i][temp_n]['did'] + ',' + cinfo[i][j]['did'] + ',' + (j - 1) + ',' + count + ');">';
                        str += '<div class="mdl-grid" style="text-align: center; box-shadow:2px 2px 2px 2px rgba(20%,20%,40%,0.5); margin:10px;" onclick="setDialog3(' + cinfo[i][0].did + ',' + cinfo[i][temp_n].did + ',' + cinfo[i][j].did + ',' + (j - 1) + ',\'' + name + '\');">';
                        str += '<div class="mdl-cell mdl-cell--4-col" style="border-bottom: 1px solid;border-bottom-color: rgba(0,0,0,.2);">';
                        str += '<img id="d23' + (j - 1) + '" src="' + dpic + '" class="avatar">';
                        str += '<h5 style="font-size: 1em;font-family: Microsoft YaHei;">';
                        str += '司機' + count_index + ': ' + name + '/ ' + gender + '/ <i class="material-icons" style="font-size: 1em;">&#xE8D0;</i>' + rvalue + '</h5>';
                        str += '</div>';
                        str += '<div class="mdl-cell mdl-cell--2-col">共乘比例</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][j].percentage) + '%</div>';
                        str += '<div class="mdl-cell mdl-cell--2-col">等待時間</div><div class="mdl-cell mdl-cell--2-col">' + Math.round(cinfo[i][j].wait / 60) + '分</div>';
                        str += '<div class="mdl-cell mdl-cell--2-col">上車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][j].on_d + '公尺</div>';
                        str += '<div class="mdl-cell mdl-cell--2-col">下車點距離</div><div class="mdl-cell mdl-cell--2-col">' + cinfo[i][j].off_d + '公尺</div>';
                        str += '</div>';
                    }
                    count++;
                    count_index++;
                }
            }
            document.getElementById(mode).innerHTML = str;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function setDialog(id1, user1) {
    index1 = user1;
    did = id1;

    var str = "";
    var dpic = "";

    if (did.length == 10 && did.substr(0, 2) === "09")
        setPic2('driver1', did);
    else
        dpic = 'http://graph.facebook.com/' + did + '/picture/?type=normal';

    str += '<img id="driver1" src="' + dpic + '" alt="司機1" class="avatar"><br/><br/>';
    str += '<span style="font-size: 18px;">司機1: ' + dinfo[index1].name + '</span><br/>';

    document.getElementById('dbody').innerHTML = str;
    $('#dialog').css("display", "table");
}

function setDialog2(id1, id2, user2, name2) { //user2 is the index of the carpoolpath(cinfo), name2 is the index of dinfo2
    index2 = user2;
    did = id1;
    did2 = id2;

    var str = "";
    var dpic = "";
    var dpic2 = "";

    if (did.length == 10 && did.substr(0, 2) === "09")
        setPic2('driver1', did);
    else
        dpic = 'http://graph.facebook.com/' + did + '/picture/?type=normal';

    if (did2.length == 10 && did2.substr(0, 2) === "09")
        setPic2('driver2', did2);
    else
        dpic2 = 'http://graph.facebook.com/' + did2 + '/picture/?type=normal';

    str += '<img id="driver1" src="' + dpic + '" alt="司機1" class="avatar"><br/>';
    str += '<span style="font-size: 18px;">司機1: ' + dinfo[index1].name + '</span><br/><br/>';
    str += '<img id="driver2" src="' + dpic2 + '" alt="司機2" class="avatar"><br/>';
    str += '<span style="font-size: 18px;">司機2: ' + name2 + '</span><br/>';

    document.getElementById('dbody').innerHTML = str;
    $('#dialog').css("display", "table");
}

function setDialog3(id1, id2, id3, user3, name3) { //user2 is the index of the carpoolpath(cinfo), name2 is the index of dinfo2
    index3 = user3;
    did = id1;
    did2 = id2;
    did3 = id3;

    var str = "";
    var dpic = "";
    var dpic2 = "";
    var dpic3 = "";

    if (did.length == 10 && did.substr(0, 2) === "09")
        setPic2('driver1', did);
    else
        dpic = 'http://graph.facebook.com/' + did + '/picture/?type=normal';

    if (did2.length == 10 && did2.substr(0, 2) === "09")
        setPic2('driver2', did2);
    else
        dpic2 = 'http://graph.facebook.com/' + did2 + '/picture/?type=normal';

    if (did3.length == 10 && did3.substr(0, 2) === "09")
        setPic2('driver3', did3);
    else
        dpic3 = 'http://graph.facebook.com/' + did3 + '/picture/?type=normal';

    str += '<img id="driver1" src="' + dpic + '" alt="司機1" class="avatar"><br/>';
    str += '<span style="font-size: 18px;">司機1: ' + dinfo[index1].name + '</span><br/><br/>';
    str += '<img id="driver2" src="' + dpic2 + '" alt="司機2" class="avatar"><br/>';
    str += '<span style="font-size: 18px;">司機2: ' + dname + '</span><br/>';
    str += '<img id="driver3" src="' + dpic3 + '" alt="司機3" class="avatar"><br/>';
    str += '<span style="font-size: 18px;">司機3: ' + name3 + '</span><br/>';

    document.getElementById('dbody').innerHTML = str;
    $('#dialog').css("display", "table");
}

function showResult2(user1) {
    index1 = user1;
    //var cid = '.child' + user1;
    //$(cid).css("display", "inline");
    $("#table1").hide();
    $("#table2").show();
}

function showResult3(user1, user2, name2) {
    index1 = user1;
    index2 = user2;
    dname = name2;
    //var cid = '.lastchild' + (user1 * 100) + user2;
    //$(cid).css("display", "inline");
    $("#table2").hide();
    $("#table3").show();
}

function sendGCM(driver_id, index) {
    var xmlhttp = new XMLHttpRequest();
    url = server + 'gcm_server.php?data={"id":"' + id + '","tid":"' + driver_id + '","pnum":"' + pnum + '","index":"' + index + '","mode":"1"}';
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {}
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function sort_by_percentage(a, b) {
    if (b[0].percentage - a[0].percentage !== 0) {
        return b[0].percentage - a[0].percentage;
    } else {
        if (a[0].on_d - b[0].on_d !== 0) {
            return a[0].on_d - b[0].on_d;
        } else {
            if (a[0].off_d - b[0].off_d !== 0) {
                return a[0].off_d - b[0].off_d;
            } else {
                if (a[0].wait - b[0].wait !== 0) {
                    return a[0].wait - b[0].wait;
                }
            }
        }
    }
}

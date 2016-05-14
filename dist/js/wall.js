var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var id = "";
var uid = "";

$(document).ready(function() {
    var url = window.location.toString();
    document.addEventListener("backbutton", onBackKeyDown, false);
    var str = url.substring(url.indexOf("{"), url.length);
    var json = JSON.parse(decodeURIComponent(str));
    id = json.id;

    if (json.hasOwnProperty('uid')) {
        requestAPI(server + "rating_wall.php", '{"id":"' + id + '"}', "rating");
        requestAPI(server + "history_wall.php", '{"id":"' + id + '"}', "history");
        id = json.uid;
    } else {
        requestAPI(server + "rating_wall.php", decodeURIComponent(str), "rating");
        requestAPI(server + "history_wall.php", decodeURIComponent(str), "history");
    }

    getPersonalData();
    setPic();
    setURL();
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
            $('#tel').html(phone);
        }
    }
    xmlhttp.send();
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
        }
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
    }
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

function requestAPI(url, data, mode) {
    var xmlhttp = new XMLHttpRequest();
    url += "?data=" + data;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var res = JSON.parse(xmlhttp.responseText);
            var str = "";

            if (mode === 'rating') {
                for (var i = 0; i < res.length; i++) {
                    var dpic = "";
                    var uid = res[i]['uid'];
                    var rname = res[i]['name'];
                    var rating = res[i]['rating'];
                    var comment = res[i]['comment'];
                    var time = res[i]['time'];

                    if (uid.length == 10 && uid.substr(0, 2) === "09")
                        setPic2('r' + i, uid);
                    else
                        dpic = 'http://graph.facebook.com/' + uid + '/picture/?type=normal';

                    str += '<div class="wallOut">';
                    str += '<div class="wall-left">';
                    str += '<img id="r' + i + '" src="' + dpic + '" class="avatar" style="padding: 5px;">';
                    str += '</div>';
                    str += '<div class="wall-right">';
                    str += '<div style="height: 50%; white-space: nowrap;">';
                    str += '<span style="padding-right: 5px; float: right; color: rgba(0,0,0,0.45);">' + time + '</span>';
                    for (var j = 0; j < rating; j++) {
                        str += '<i class="material-icons" style="font-size: 18px; color: #F7FA00; ">star</i>';
                    }
                    str += '</div>';
                    str += '<div style="height: 50%;">';
                    str += '<span style="float: left;"><b>' + rname + ':</b></span><br/>';
                    str += '<span style="text-align: left; color: rgba(0,0,0,0.75);">' + comment + '</span>';
                    str += '</div></div></div>';
                }
            } else if (mode === 'history') {
                for (var i = 0; i < res.length; i++) {
                    var dpic = "";
                    var role = res[i]['role'];
                    var hid = res[i]['hid'];
                    var hname = res[i]['name'];
                    var dis = res[i]['dis'];
                    var start = res[i]['start'];
                    var end = res[i]['end'];
                    var time = res[i]['time'];
                    var finish = res[i]['finish'];

                    if (hid.length == 10 && hid.substr(0, 2) === "09")
                        setPic2('h' + i, hid);
                    else
                        dpic = 'http://graph.facebook.com/' + hid + '/picture/?type=normal';

                    str += '<div class="wallOut">';
                    str += '<div class="wall-left">';
                    str += '<img id="h' + i + '" src="' + dpic + '" class="avatar" style="padding: 5px;">';
                    str += '</div>';
                    str += '<div class="wall-right">';
                    str += '<div style="height: 50%; white-space: nowrap;">';
                    str += '<span style="padding-right: 5px; float: right; color: rgba(0,0,0,0.45);">' + time + '</span>';
                    if (role === 'passenger')
                        str += '<span style="float: left;"><b>司機: ' + hname + '</b></span><br/></div>';
                    else
                        str += '<span style="float: left;"><b>乘客: ' + hname + '</b></span><br/></div>';
                    str += '<div style="height: 50%;">';
                    str += '<span style="float: left;">共乘距離: ' + dis + '公尺</span><br/>';
                    str += '<span style="float: left;">共乘情況: ' + finish + '</span><br/>';
                    str += '<span style="text-align: left; color: rgba(0,0,0,0.75);">起點:<br/>' + start + '號<br/></span>';
                    str += '<span style="text-align: left; color: rgba(0,0,0,0.75);">起點:<br/>' + end + '號<br/></span>';
                    str += '</div></div></div>';
                }
            }
            document.getElementById(mode).innerHTML = str;
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function onBackKeyDown() {
    window.location = local + 'index.html?data={"id":"' + id + '"}';
}

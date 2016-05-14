var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var url = "";
var id = "";

$(document).ready(function() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    url = window.location.toString();
    var str = url.substring(url.indexOf("{"), url.length);
    var json = JSON.parse(decodeURIComponent(str));

    id = json.id;

    requestAPI(server + "friendlist.php", str, "table");

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

            if (res.length == 0) {
                str += '<br/><div style="text-align: center; text-font: 24px;">尚無朋友</div>';
            } else {
                var dpic = "";
                for (var i = 0; i < res.length; i++) {
                    var fid = res[i]['fid'];
                    var fname = res[i]['name'];

                    if (fid.length == 10 && fid.substr(0, 2) === "09")
                        setPic2('f' + i, fid);
                    else
                        dpic = 'http://graph.facebook.com/' + fid + '/picture/?type=normal';

                    str += '<div class="friendlist" onclick="nextFriend(' + fid + ',' + id + ');">';
                    str += '<img id="f' + i + '" src="' + dpic + '" class="avatar" style="padding: 5px;">';
                    str += '<b>' + fname + '</b>';
                    str += '</div>';
                }
            }
            document.getElementById(mode).innerHTML = str;
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function nextFriend(fid, id) {
    window.location = local + 'wall.html?data={"id":"' + fid + '","uid":"' + id + '"}';
}

function onBackKeyDown() {
    window.location = local + 'index.html?data={"id":"' + id + '"}';
}

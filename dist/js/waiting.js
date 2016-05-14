var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var url = "";
var id = "";
var tid = "";
var json = "";
var trace_str = "";
var count = 0;
var num = 0;
// count
var countdownnumber = 300;
var countdownid, x;

$(document).ready(function() {
    url = window.location.toString();
    var str = url.substring(url.indexOf("{"), url.length);
    trace_str = str;
    json = JSON.parse(decodeURIComponent(str));
    id = json.id;
    id = id[0];
    num = json.num;
    json = decodeURIComponent(str);

    $('.wrapperInside').attr('style', 'background-color: rgba(0,0,0,0.5);');
    getPersonalData();
    setPic();
    setURL();

    // x = document.getElementById("countdown");
    // x.innerHTML = countdownnumber;
    // countdownnumber--;
    // countdownid = window.setInterval(countdownfunc, 1000);

    $('#accept').click(function() {
        confirmCarpool();
    });
}).on('deviceready', onDeviceReady);

// function countdownfunc() {
//     x.innerHTML = countdownnumber;
//     if (countdownnumber == 0) {
//         alertify.success("倒數結束!");
//         clearInterval(countdownid);
//         window.location = local + 'index.html?data={"id":"' + id + '"}';
//     }
//     countdownnumber--;
//     var show = document.getElementById("show_time");
//     show.innerHTML = parseInt(countdownnumber / 60, 10) + "分" + (countdownnumber % 60) + "秒";
// }

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
        }
        xmlhttp.send();
    } else {
        $('#user_image').attr('src', 'http://graph.facebook.com/' + id + '/picture?type=large');
    }
}

// passenger: {"role":"passenger","id":"838717559541922","result":[{"did":"1046779538684826"},{"did":"1046779538684826"}]}
function confirmCarpool() {
    count++;
    if (count == num)
        window.location = local + 'tracePassengerPage.html?data=' + trace_str;
}

function setName(data, mode) {
    var url = server + 'get_name.php?data={"id":"' + data + '"}';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            $('#image').attr('src', 'http://graph.facebook.com/' + data + '/picture?type=large');
            document.getElementById(mode).innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.send();
}

//確認device ready
function onDeviceReady() {
    try {
        var push = PushNotification.init({
            "android": {
                "senderID": "72965952119", //"47580372845"
                "image": "http://120.114.186.4:8080/carpool/assets/logo.png"
            },
            "ios": {},
            "windows": {}
        });

        //通知設定
        push.on('notification', function(data) {
            var additional = JSON.stringify(data.additionalData);
            additional = JSON.parse(additional);
            document.getElementById("dialog_message").innerHTML = data.message;
            setName(additional.tid, 'dialog_name');
            $('#dialog').css("display", "table");
        });

        push.on('error', function(e) {
            console.log("push error");
        });

    } catch (err) {
        txt = "There was an error on this page.\n\n";
        txt += "Error description: " + err.message + "\n\n";
    }
}

//document.addEventListener('deviceready', onDeviceReady, false);

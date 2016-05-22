var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var url = "";
var id = "";
var data = "";

$(document).ready(function() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    url = window.location.toString();
    var str = url.substring(url.indexOf("{"), url.length);
    var json = JSON.parse(decodeURIComponent(str));

    id = json.id;
    requestAPI(server + "board.php");
    getPersonalData();
    setPic();
    setURL();

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

function requestAPI(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.responseText);
            var str = "";
            var dpic = "";
            var ppic = "";

            for (var i = 0; i < data.length; i++) {
                if (data[i].did.length == 10 && data[i].did.substr(0, 2) === "09")
                    setPic2('d' + i, data[i].did);
                else
                    dpic = 'http://graph.facebook.com/' + data[i].did + '/picture/?type=normal';

                if (data[i].pid.length == 10 && data[i].pid.substr(0, 2) === "09")
                    setPic2('p' + i, data[i].pid);
                else
                    ppic = 'http://graph.facebook.com/' + data[i].pid + '/picture/?type=normal';

                str += '<div class="mdl-grid" style="box-shadow:2px 2px 2px 2px rgba(20%,20%,40%,0.5); margin:10px;">';
                str += '<div class="mdl-cell mdl-cell--4-col" style="border-bottom: 1px solid;border-bottom-color: rgba(0,0,0,.2);">';
                str += '<div class="mdl-cell mdl-cell--2-col" style="float:left;">';
                str += '<img id= "d' + i + '" src="' + dpic + '" class="avatar">';
                str += '<h6 style="font-size: 1em;font-family: Microsoft YaHei;color: #F75000;">';
                str += '<i class="material-icons" style="font-size: 1.5em;">&#xE531;</i>' + data[i].dname + '/ ' + data[i].dgender + '</h6>';
                str += '</div>';
                str += '<div class="mdl-cell mdl-cell--2-col" style="float:right;">';
                str += '<img id= "p' + i + '" src="' + ppic + '" class="avatar">';
                str += '<h6 style="font-size: 1em;font-family: Microsoft YaHei;color: #007979;">';
                str += '<i class="material-icons" style="font-size: 1.5em;">&#xE536;</i>' + data[i].pname + '/ ' + data[i].pgender + '</h6>';
                str += '</div>';
                str += '</div>';
                str += '<div class="mdl-cell mdl-cell--2-col">共乘日期</div><div class="mdl-cell mdl-cell--2-col">' + data[i].time + '</div>';
                str += '<div class="mdl-cell mdl-cell--2-col">共乘距離</div><div class="mdl-cell mdl-cell--2-col">' + data[i].dis + '公尺</div>';
                str += '<div class="mdl-cell mdl-cell--2-col">共乘情況</div><div class="mdl-cell mdl-cell--2-col">' + data[i].finished + '</div>';
                str += '</div>';

            }

            document.getElementById('show').innerHTML = str;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

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
    };
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
        };
        xmlhttp.send();
    } else {
        $('#user_image').attr('src', 'http://graph.facebook.com/' + id + '/picture?type=normal');
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

function onBackKeyDown() {
    window.location = local + 'index.html?data={"id":"' + id + '"}';
}

var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var url = "";
var id = "";

$(document).ready(function() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    url = window.location.toString();

    if (url.indexOf("data") > 0) {
        var str = url.substring(url.indexOf("{"), url.length);
        var json = JSON.parse(decodeURIComponent(str));
        id = json.id;

        getPersonalData();
        setPic();
        setURL();
    } else {
        $('#board').css("display", "none");
        $('#wall').css("display", "none");
        $('#friendlist').css("display", "none");
        $('#setting').css("display", "none");
        $('#edit').css("display", "none");
    }
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

function setURL() {
    $('#board').attr('href', local + 'board.html?data={"id":"' + id + '"}');
    $('#wall').attr('href', local + 'wall.html?data={"id":"' + id + '"}');
    $('#friendlist').attr('href', local + 'friendlist.html?data={"id":"' + id + '"}');
    $('#setting').attr('href', local + 'setting.html?data={"id":"' + id + '"}');
    $('#edit').attr('href', local + 'edit.html?data={"id":"' + id + '"}');
    $('#logo').attr('href', local + 'index.html?data={"id":"' + id + '"}');
    $('#dsgr').attr('href', local + 'index.html?data={"id":"' + id + '"}');
}

function onBackKeyDown() {
    if (url.indexOf("data") > 0)
        window.location = local + 'index.html?data={"id":"' + id + '"}';
    else
        window.location = local + 'index.html';
}

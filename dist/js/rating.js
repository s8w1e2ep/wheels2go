var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var id = "";
var json = "";
var pnum;
var dnum;
var rid = "";
var role = "";
var target = "";
var index = 0;
var rate = 0;

/*
 *   data={"id":"860467000642654","role":"driver" ,"rid":["779892335364114","1046779538684826","id3"]}
 */

$(document).ready(function() {
    var url = window.location.toString();
    var str = url.substring(url.indexOf("{"), url.length);
    json = JSON.parse(decodeURIComponent(str));

    id = json.id;
    role = json.role;
    rid = json.rid;

    setTarget();
    check();

    getPersonalData();
    setPic();
    setURL();

    $('#next').click(function() {
        addRating();
    });

    $('#add').click(function() {
        addFriend();
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

function check() {
    var url = server + 'check_friend.php?data={"id":"' + id + '","fid":"' + rid[index] + '"}';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var res = xmlhttp.responseText;
            if (res.match("success"))
                $('#add').css("display", "block");
        }
    }
    xmlhttp.send();
}

function setTarget() {
    var dpic = "";
    setName(rid[index], "rname");
    if (rid[index].length == 10 && rid[index].substr(0, 2) === "09")
        setPic2('pimage' + i, rid[index]);
    else
        $('#pimage').attr('src', 'http://graph.facebook.com/' + rid[index] + '/picture?type=large');
}

function setName(data, mode) {
    var url = server + 'get_name.php?data={"id":"' + data + '"}';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            $('#' + mode).html(xmlhttp.responseText);
        }
    }
    xmlhttp.send();
}

function addRating() {
    var comment = $('#comment').val();
    rate = $('#input-21e').val();
    if (rate == 0) {
        alertify.success("最低評價為1分!");
    } else {
        var data = '{"id":"' + id + '","uid":"' + rid[index] + '","role":"' + role + '","rating":"' + rate + '","comment":"' + comment + '"}';
        var url = server + 'add_rating.php?data=' + data;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                index++;
                if (index < rid.length) {
                    $('#comment').val('');
                    setTarget();
                } else if (index == rid.length) {
                    window.location = local + 'index.html?data={"id":"' + id + '"}'
                }
            }
        }
        xmlhttp.send();
    }
}

function addFriend() {
    var data = '{"id":"' + id + '","fid":"' + rid[index] + '"}';
    var url = server + 'add_friend.php?data=' + data;

    console.log(url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var res = xmlhttp.responseText;
            $('#add').css("display", "none");
            var status = document.getElementById("status");
            if (res.match("success"))
                status.innerHTML = '成功加入好友';
            else if (res.match("failed"))
                status.innerHTML = '加入失敗';
        }
    }
    xmlhttp.send();
}

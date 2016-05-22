var url = "";
var id = "";
var check = false;
var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";

$(document).ready(function() {
    url = window.location.toString();
    var str = url.substring(url.indexOf("{"), url.length);
    var json = JSON.parse(decodeURIComponent(str));
    id = json.id;

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

$('#next').click(function() {
    ok();
});

//判斷手機號碼
$("#phone").on("input propertychange", function() {
    phone = $(this).val();
    if (phone === "") {
        $('#register_state').html('手機號碼不能為空!');
        check = false;
    } else {
        if (!checkDigit(phone)) {
            $('#register_state').html('密碼格式錯誤!');
            check = false;
        } else if (phone.length < 10) {
            $('#register_state').html('手機號碼長度錯誤!');
            check = false;
        } else {
            $('#register_state').html('');
            check = true;
        }
    }
});

//判斷Email
$("#email").on("input propertychange", function() {
    email = $(this).val();
    if (email === "") {
        $('#email_state').html('email不能為空!');
        check = false;
    } else {
        if (!checkEmail(email)) {
            $('#email_state').html('email格式錯誤!');
            check = false;
        } else {
            $('#email_state').html('');
            check = true;
        }
    }
});

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
        $('#user_image').attr('src', 'http://graph.facebook.com/' + id + '/picture?type=large');
    }
}

function ok() {
    if (check) {
        var name = $('#firstname').val();
        //確認名字為英文或中文
        if (checkVal(name)) {
            name += ', ' + $('#lastname').val();
        } else {
            name = $('#lastname').val() + name;
        }

        var phone = $('#phone').val();
        var gender = document.getElementById("male");
        if (gender.checked)
            gender = "m";
        else
            gender = "f";

        var data = [];
        data.push({
            'id': id,
            'name': name,
            'gender': gender,
            'email': email,
            'phone': phone,
        });
        data = JSON.stringify(data);
        data = data.substring(1, data.length - 1);

        var url = server + 'edit.php?data=' + data;
        console.log(url);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                window.location = local + 'index.html?data={"id":"' + id + '"}';
            }
        };
        xmlhttp.send();
    }
}

//確認是否為英文字
function checkVal(str) {
    var regExp = /^[\d|a-zA-Z]+$/;
    if (regExp.test(str))
        return true;
    else
        return false;
}

//確認是否為數字
function checkDigit(str) {
    var regExp = /\d+/;
    if (regExp.test(str))
        return true;
    else
        return false;
}

//確認是否為email
function checkEmail(str) {
    var regExp = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (regExp.test(str)) {
        return true;
    } else {
        return false;
    }
}

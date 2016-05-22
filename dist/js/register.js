//global variable
var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var url = "";
var regid = "";
var password = "";
var password2 = "";
var phone = "";
var email = "";
var check1 = false;
var check2 = false;
var check3 = false;
var check4 = false;

$(document).ready(function() {
    url = window.location.toString();
    var str = url.substring(url.indexOf("{"), url.length);
    var json = JSON.parse(decodeURIComponent(str));

    regid = json.regid;

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

//判斷密碼是否符合格式
$("#password").on("input propertychange", function() {
    password = $(this).val();
    $('#p_error').css("display", "inline");
    if (password === "") {
        $('#p_error').html('密碼不能為空!');
        check1 = false;
    } else {
        if (!checkVal(password)) {
            $('#p_error').html('密碼格式錯誤!');
            check1 = false;
        } else if (password.length < 6) {
            $('#p_error').html('密碼長度錯誤!');
            check1 = false;
        } else {
            $('#p_error').html('');
            check1 = true;
        }
    }
});

//判斷密碼是否符合格式與是否與第一次密碼相同
$("#password2").on("input propertychange", function() {
    password2 = $(this).val();
    if (password2 === "") {
        $('#p2_error').html('密碼不能為空!');
        check2 = false;
    } else {
        if (!checkVal(password2)) {
            $('#p2_error').html('密碼格式錯誤!');
            check2 = false;
        } else if (password2.length < 6) {
            $('#p2_error').html('密碼長度錯誤!');
            check2 = false;
        } else if (password !== password2) {
            $('#p2_error').html('與第一次密碼不同!');
            check2 = false;
        } else {
            $('#p2_error').html('');
            check2 = true;
        }
    }
});

//判斷手機號碼
$("#phone").on("input propertychange", function() {
    phone = $(this).val();
    if (phone === "") {
        $('#register_state').html('手機號碼不能為空!');
        check3 = false;
    } else {
        if (!checkDigit(phone)) {
            $('#register_state').html('密碼格式錯誤!');
            check3 = false;
        } else if (phone.length < 10) {
            $('#register_state').html('手機號碼長度錯誤!');
            check3 = false;
        } else {
            $('#register_state').html('');
            check3 = true;
        }
    }
});

//判斷Email
$("#email").on("input propertychange", function() {
    email = $(this).val();
    if (email === "") {
        $('#email_state').html('email不能為空!');
        check4 = false;
    } else {
        if (!checkEmail(email)) {
            $('#email_state').html('email格式錯誤!');
            check4 = false;
        } else {
            $('#email_state').html('');
            check4 = true;
        }
    }
});

//會員註冊
$('#regist_member').click(function() {
    if (check1 && check2 && check3 && check4) {
        var name = $('#firstname').val();
        //確認名字為英文或中文
        if (checkVal(name)) {
            name += ', ' + $('#lastname').val();
        } else {
            name = $('#lastname').val() + name;
        }
        password = hex_md5(password);   //md5加密
        var gender = document.getElementById("male");

        if (gender.checked)
            gender = "m";
        else
            gender = "f";

        var data = [];
        data.push({
            'name': name,
            'gender': gender,
            'email': email,
            'phone': phone,
            'password': password,
            'regid': regid
        });
        data = JSON.stringify(data);
        data = data.substring(1, data.length - 1);

        //會員註冊
        var url = server + 'registmember.php?data=' + data;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var res = xmlhttp.responseText.trim();
                if (res === "success") {
                    sendEmail();
                } else {
                    alertify.success(res);
                }
            }
        };
        xmlhttp.send();
    } else {
        alertify.success("輸入欄位有誤!");
    }
});

function sendEmail() {
    //寄送驗證碼
    var url = server + 'send_email.php?data={"id":"' + phone + '"}';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var verification = xmlhttp.responseText.trim();
            alertify.success("註冊成功!");
            window.location = local + 'uploadimg.html?data={"id":"' + phone + '", "verify":"' + verification + '"}';
        }
    };
    xmlhttp.send();
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

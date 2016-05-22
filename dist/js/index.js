var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var url = "";
var id = "";
var name = "";
var phone = "";
var gender = "";
var email = "";
var regid = "";
var rvalue = ""; //the value of rating
var status = "";
var check = false;
var fbrig = false;




$(document).ready(function() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    url = window.location.toString();
    alertify.set({ labels: { ok: "確定", cancel: "取消" } });

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

    $('.wrapperInside').attr('style', 'background-color: rgba(0,0,0,0.5);');
    //fb登入
    $('#login1').click(function() {
        $('#loginbyphone').attr('style', 'display:none');
        loginFacebook();
    });
    //會員登入
    $('#login2').click(function() {
        $('#loginbyphone').attr('style', 'display:table');
    });

    $('#check').click(function() {
        var phone = $('#phone_number').val();
        var password = $('#password').val();
        password = hex_md5(password); //md5加密
        var url = server + 'check_member.php?data={"id":"' + phone + '","password":"' + password + '","regid":"' + regid + '"}';
        console.log(url);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var res = xmlhttp.responseText;
                if (res.match("success")) {
                    $('#loginbyphone').attr('style', 'display:none');
                    id = phone;
                    checkCarpool();
                } else {
                    alertify.success(res);
                }
            }
        };
        xmlhttp.send();
    });

    //cancel 會員dialog
    $('#cancel').click(function() {
        $('#loginbyphone').attr('style', 'display:none');
    });

    //fb註冊
    $('#submit').click(function() {
        registerCarpool();
    });

    //會員註冊
    $('#test').click(function() {
        window.location = local + 'register.html?data={"regid":"' + regid + '"}';
    });

    //司機
    $('#driver').click(function() {
        nextDriver();
    });

    //乘客
    $('#passenger').click(function() {
        nextPassenger();
    });

    //FB註冊dialog顯示
    $('#register_button').click(function() {
        $('#dialog').attr('style', 'display:table');
    });

    //confirm取消
    $('#cancel2').click(function() {
        $('#confirm_dialog').attr('style', 'display:none');
    });

    //comfirm確定
    $('#close').click(function() {
        $('#confirm_dialog').attr('style', 'display:none');
        navigator.app.exitApp();
    });

    //判斷手機號碼
    $("#phone").on("input propertychange", function() {
        phone = $(this).val();
        if (phone === "") {
            $('#phone_state').html('手機號碼不能為空!');
            check = false;
        } else {
            if (!checkDigit(phone)) {
                $('#phone_state').html('密碼格式錯誤!');
                check = false;
            } else if (phone.length < 10) {
                $('#phone_state').html('手機號碼長度錯誤!');
                check = false;
            } else {
                $('#phone_state').html('');
                check = true;
            }
        }
    });

    //判斷手機號碼2
    $("#phone_number").on("input propertychange", function() {
        phone = $(this).val();
        if (phone === "") {
            $('#phone_state2').html('手機號碼不能為空!');
            check = false;
        } else {
            if (!checkDigit(phone)) {
                $('#phone_state2').html('密碼格式錯誤!');
                check = false;
            } else if (phone.length < 10) {
                $('#phone_state2').html('手機號碼長度錯誤!');
                check = false;
            } else {
                $('#phone_state2').html('');
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
            rvalue = personalData.rating;
            status = personalData.status;

            if (status === 0) {
                $('#login1').attr('style', 'display:none');
                $('#login2').attr('style', 'display:none');
                $('#test').attr('style', 'display:none');
                $('#state').html('尚未審核');
                $('#name').html('Hi, ' + name);
                $('#dialog_name').html(name);
            } else if (status == 1) {
                $('#login1').attr('style', 'display:none');
                $('#login2').attr('style', 'display:none');
                $('#test').attr('style', 'display:none');
                $('#state').html('已登入');
                $('#rbox').css("display", "block");
                $('#gbox').css("display", "block");
                $('#driver').css("display", "block");
                $('#passenger').css("display", "block");
            }

            rvalue = Math.round(rvalue * 100) / 100;
            document.getElementById('rating').innerHTML = rvalue + '     ';
            $("#jRate").jRate({
                startColor: 'yellow',
                endColor: 'yellow',
                backgroundColor: 'lightgray',
                shapeGap: '5px',
                rating: rvalue,
                readOnly: true
            });
            if (personalData.gender === "f") {
                $('#gender').html("女");
            } else {
                $('#gender').html("男");
            }
            $('#pname').html(name);
            $('#pname2').html(name);
            $('#name').html(name);
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
                $('#image').attr('src', result);
                $('#dialog_image').attr('src', result);
                $('#user_image').attr('src', result);
            }
        };
        xmlhttp.send();
    } else {
        $('#image').attr('src', 'http://graph.facebook.com/' + id + '/picture?type=large');
        $('#dialog_image').attr('src', 'http://graph.facebook.com/' + id + '/picture?type=large');
        $('#user_image').attr('src', 'http://graph.facebook.com/' + id + '/picture?type=large');
    }
}

function checkCarpool() {
    var url = server + 'check.php?data={"id":"' + id + '","regid":"' + regid + '"}';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //registed
            if (xmlhttp.responseText.trim() === "success") {
                window.location = local + 'index.html?data={"id":"' + id + '"}';
            } else if (xmlhttp.responseText.trim() === "uncertified") {
                getPersonalData();
                $('#register_button').attr('style', 'display:none');
                setPic();
            } else {
                $('#login1').attr('style', 'display:none');
                $('#login2').attr('style', 'display:none');
                $('#test').attr('style', 'display:none');
                $('#register_button').attr('style', 'display:');
                $('#state').html('尚未註冊');
                $('#name').html('Hi, ' + name);
                $('#dialog_name').html(name);
                setPic();
            }
        }
    };
    xmlhttp.send();
}

function registerCarpool() {
    if (check) {
        var phone = $('#phone').val();
        var data = [];
        data.push({
            'id': id,
            'name': name,
            'gender': gender,
            'email': email,
            'phone': phone,
            'regid': regid
        });
        data = JSON.stringify(data);
        data = data.substring(1, data.length - 1);

        var url = server + 'register.php?data=' + data;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.responseText.trim() === "success") {
                $('#dialog').attr('style', 'display:none');
                checkCarpool();
            } else {
                $('#register_state').html(xmlhttp.responseText);
            }
        };
        xmlhttp.send();
    } else {
        $('#register_state').html('輸入欄位有誤!');
    }
}

function nextDriver() {
    window.location = local + 'driver.html?data={"id":"' + id + '"}';
}

function nextPassenger() {
    window.location = local + 'passenger.html?data={"id":"' + id + '"}';
}

function setInfo(response) {
    id = response.id;
    name = response.name;
    gender = response.gender;
    email = response.email;
    //alert("verified: " + response.verified);alert("link: " + response.link);

    if (name.length > 0)
        checkCarpool();
}

//facebook api
var loginFacebook = function() {
    facebookConnectPlugin.login(["email"],
        function(response) {
            apiTest();
        },
        function(response) {
            //alert(JSON.stringify(response))
        });
};
var apiTest = function() {
    facebookConnectPlugin.api("me/?fields=id,name,gender,email,link", ["user_birthday"],
        function(response) {
            setInfo(response);
        },
        function(response) {
            //alert(JSON.stringify(response))
        });
};
var logout = function() {
    facebookConnectPlugin.logout(
        function(response) {
            //alert(JSON.stringify(response))
        },
        function(response) {
            //alert(JSON.stringify(response))
        });
};

//確認device ready
function onDeviceReady() {
    try {
        var push = PushNotification.init({
            "android": {
                "senderID": "72965952119", //"47580372845",
                "image": "http://120.114.186.4:8080/carpool/assets/logo.png"
            },
            "ios": {},
            "windows": {}
        });
        //取得註冊ID
        push.on('registration', function(data) {
            regid = data.registrationId;
        });

        push.on('error', function(e) {
            console.log("push error");
        });
    } catch (err) {
        txt = "There was an error on this page.\n\n";
        txt += "Error description: " + err.message + "\n\n";
        //alert(txt);
    }
}

function onBackKeyDown() {
    $('#confirm_dialog').attr('style', 'display:table');
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

//document.addEventListener('deviceready', onDeviceReady, true);

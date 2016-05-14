var server = "http://120.114.186.4:8080/carpool/api/";
var local = "file:///android_asset/www/";
var pictureSource; //圖片的來源
var destinationType; //返回值的格式設置
var id;
var verify;
var imgurl = "";
var countdownnumber = 300;
var countdownid, x;

function countdownfunc() {
    x.innerHTML = countdownnumber;
    if (countdownnumber == 0) {
        alertify.success("請重寄驗證信");
        clearInterval(countdownid);
        window.location = local + 'index.html?data={"id":"' + id + '"}';
    }
    countdownnumber--;
    var show = document.getElementById("show_time");
    show.innerHTML = parseInt(countdownnumber / 60, 10) + "分" + (countdownnumber % 60) + "秒";
}

$(document).ready(function() {
    document.addEventListener("backbutton", function() {}, false);
    var url = window.location.toString();
    var str = url.substring(url.indexOf("{"), url.length);
    var json = JSON.parse(decodeURIComponent(str));

    id = json.id;
    verify = json.verify;

    x = document.getElementById("countdown");
    x.innerHTML = countdownnumber;
    countdownnumber--;
    countdownid = window.setInterval(countdownfunc, 1000);
});

$('#send').click(function() {
    var url = server + 'send_email.php?data={"id":"' + id + '"}';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            verify = xmlhttp.responseText.trim();
            alertify.success("寄送成功!");
            countdownnumber = 300;
        }
    }
    xmlhttp.send();
});

$('#addphoto').click(function() {
    getPhoto(pictureSource.PHOTOLIBRARY);
});

$('#camera').click(function() {
    capturePhoto();
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

function capturePhoto() {
    // getpicture(cameraSuccess,cameraError,{cameraOptions});
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        allowEdit: true,
        popoverOptions: CameraPopoverOptions
    });
}

function onPhotoDataSuccess(imageData) {
    //獲取的圖像處理
    $('#largeImage').attr('src', imageData);
    imgurl = imageData;
}

//錯誤發生時
function onFail(message) {
    console.log('Failed because: ' + message);
}

function getPhoto(source) {
    // 取得圖像(成功事件 ,失敗事件,{圖片設定});
    navigator.camera.getPicture(onPhotoURISuccess, onFail2, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        allowEdit: true,
        sourceType: source
    });
}

function onPhotoURISuccess(imageURI) {
    //獲取的圖像處理
    $('#largeImage').attr('src', imageURI);
    imgurl = imageURI;
}

//錯誤發生時
function onFail2(message) {
    console.log('Failed because: ' + message);
}

$('#check').click(function() {
    var user_verify = $('#verify').val();
    var options = new FileUploadOptions();
    var ft = new FileTransfer();

    // setup parameters
    options.fileKey = "file";
    options.fileName = imgurl.substr(imgurl.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    var params = {};
    options.params = params;

    var upload = 'http://120.114.186.4:8080/carpool/uploadimg.php?data={"id":"' + id + '"}'

    if (user_verify.match(verify)) {
        ft.upload(imgurl, encodeURI(upload), success, error, options);
    } else {
        alertify.success("驗證碼錯誤!");
    }
});

function success(res) {
    alertify.success("圖片上傳成功");//('圖片上傳成功!' + JSON.stringify(res));
    setTimeout("window.location = local + 'index.html'", 2000);
}

function error(error) {
    console.log(error.code);
    // alert("An error has occurred: Code = " + error.code);
    // alert("upload error source " + error.source);
    // alert("upload error target " + error.target);
}

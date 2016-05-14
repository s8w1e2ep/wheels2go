 <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);

$id = $data['id'];
$id = preg_replace("/[\'\"]+/" , '' ,$id);
$password = $data['password'];
$password = preg_replace("/[\'\"]+/" , '' ,$password);
$regid = $data['regid'];

$sql = "SELECT * FROM `account` WHERE `aid` = '$id' and `password` = '$password'";

$result = mysql_query($sql);
$i = mysql_fetch_array($result);
$num = mysql_num_rows($result);

if ($num == 1) {
	$reg = $i[0];
	if ($reg != "" && $reg != $regid) {
		$sql = "UPDATE `account` SET `regid` = '$regid' WHERE `aid` = '$id'";
		$result = mysql_query($sql);
	}
	echo ("success");
} else {
	echo ("密碼或帳號錯誤!");
}

?>

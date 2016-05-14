 <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$sql = "SELECT * FROM `history` ORDER BY `hid` DESC";
$result = mysql_query($sql);

$index = 0;
date_default_timezone_set("Asia/Taipei");

$arr = array();

while ($index < 10 && $i = mysql_fetch_array($result)) {

	$ssql = "SELECT `aid` FROM `passenger` WHERE `pnum` = " . $i['pnum'];
	$rresult = mysql_query($ssql);
	$j = mysql_fetch_array($rresult);
	$temp['pid'] = $j[0];

	$ssql2 = "SELECT `aid` FROM `driver` WHERE `dnum` = " . $i['dnum'];
	$rresult2 = mysql_query($ssql2);
	$j2 = mysql_fetch_array($rresult2);
	$temp['did'] = $j2[0];

	//get distance
	$finished = $i["finished"];
	$temp['dis'] = $i['distance'];
	//get driver name
	$ssql = "SELECT `name`, `gender` FROM `account` WHERE `aid` =" . $temp['did'];
	$rresult = mysql_query($ssql);
	$j = mysql_fetch_array($rresult);
	$temp['dname'] = $j['name'];
	if($j['gender'] == "f")
		$temp['dgender'] = '女';
	else
		$temp['dgender'] = '男';
	//get passenger name
	$ssql = "SELECT `name`, `gender` FROM `account` WHERE `aid` =" . $temp['pid'];
	$rresult = mysql_query($ssql);
	$j = mysql_fetch_array($rresult);
	$temp['pname'] = $j['name'];
	if($j['gender'] == "m")
		$temp['pgender'] = '男';
	else
		$temp['pgender'] = '女';

	$d = substr($i['time'], 0, 10);
	if ($d == date('Y-m-d')) {
		$temp['time'] = '今天 ' . substr($i['time'], strrpos($i['time'], ' '), 6);
	} else if ($d == date('Y-m-d', strtotime('yesterday'))) {
		$temp['time'] = '昨天 ' . substr($i['time'], strrpos($i['time'], ' '), 6);
	} else {
		$temp['time'] = $d . substr($i['time'], strrpos($i['time'], ' '), 6);
	}

	if ($finished == 1) {
		$temp['finished'] = '共乘配對成功';
	} else if ($finished == 2) {
		$temp['finished'] = '司機取消共乘';
	} else if ($finished == 3) {
		$temp['finished'] = '乘客取消共乘';
	} else if ($finished == 4) {
		$temp['finished'] = '乘客提早下車';
	} else{
		$temp['finished'] = '共乘失敗';
	}

	array_push($arr, $temp);
	$index++;
}

echo json_encode($arr);
?>

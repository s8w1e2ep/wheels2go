 <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);

$id = $data['id'];

$sql = "SELECT * FROM `wall` WHERE `wid` = '$id' ORDER BY `wnum` DESC";
$result = mysql_query($sql);
$arr = array();

$index = 0;
date_default_timezone_set("Asia/Taipei");

while ($index < 10 && $i = mysql_fetch_array($result)) {
	$uid = $i['uid'];
	$ssql = "SELECT `name` FROM `account` WHERE `aid` = '$uid'";
	$rresult = mysql_query($ssql);
	$j = mysql_fetch_array($rresult);
	$name = $j[0];

	$temp['uid'] = $uid;
	$temp['name'] = $name;
	$temp['rating'] = $i['rating'];
	$temp['comment'] = $i['comment'];
	$d = substr($i['time'], 0, 10);
	if ($d == date('Y-m-d')) {
		$temp['time'] = '今天 ' . substr($i['time'], strrpos($i['time'], ' '), 6);
	} else if ($d == date('Y-m-d', strtotime('yesterday'))) {
		$temp['time'] = '昨天 ' . substr($i['time'], strrpos($i['time'], ' '), 6);
	} else {
		$temp['time'] = $d . ' ' . substr($i['time'], strrpos($i['time'], ' '), 6);
	}

	array_push($arr, $temp);
	$index++;
}
echo json_encode($arr);
?>

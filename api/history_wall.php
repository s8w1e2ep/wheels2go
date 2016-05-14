 <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);

$id = $data['id'];
$arr = array();

$sql = "SELECT * FROM `history` WHERE `finished` != '0' ORDER BY `hid` DESC";
$result = mysql_query($sql);

$index = 0;
date_default_timezone_set("Asia/Taipei");

function getAddress($latlng) {
	$latlng = json_decode($latlng);
	$url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' . ($latlng->at) . ',' . ($latlng->ng) . '&language=zh-TW';
	$response = json_decode(file_get_contents($url), true);
	if ($response["status"] == "OK") {
		$n = count($response["results"][0]["address_components"]);
		$address = "";
		$ii = $n - 3;
		for ($ii; $ii >= 0; $ii--) {
			$address = $address . $response["results"][0]["address_components"][$ii]["long_name"];
		}
		return $address;
	}
}

while ($index < 10 && $i = mysql_fetch_array($result)) {
	$pnum = $i['pnum'];
	$dnum = $i['dnum'];
	$finish = $i['finished'];

	$ssql = "SELECT * FROM `passenger` WHERE `pnum` = '$pnum'";
	$rresult = mysql_query($ssql);
	$j = mysql_fetch_array($rresult);

	$ssql2 = "SELECT * FROM `driver` WHERE `dnum` = '$dnum'";
	$rresult2 = mysql_query($ssql2);
	$j2 = mysql_fetch_array($rresult2);

	if ($j['aid'] == $id) {
		//passenger
		$passenger = $j;
		$dis = $i['distance'];
		//get driver id
		$ssql = "SELECT `aid` FROM `driver` WHERE `dnum` = '$dnum'";
		$rresult = mysql_query($ssql);
		$j = mysql_fetch_array($rresult);
		$did = $j[0];
		//get driver name
		$ssql = "SELECT `name` FROM `account` WHERE `aid` = '$did'";
		$rresult = mysql_query($ssql);
		$j = mysql_fetch_array($rresult);
		$name = $j[0];

		$temp['role'] = 'passenger';
		$temp['hid'] = $did;
		$temp['name'] = $name;
		$temp['dis'] = $dis;
		$temp['start'] = getAddress($passenger['start']);
		$temp['end'] = getAddress($passenger['end']);
		$d = substr($passenger['time'], 0, 10);
		if ($d == date('Y-m-d')) {
			$temp['time'] = '今天 ' . substr($passenger['time'], strrpos($passenger['time'], ' '), 6);
		} else if ($d == date('Y-m-d', strtotime('yesterday'))) {
			$temp['time'] = '昨天 ' . substr($passenger['time'], strrpos($passenger['time'], ' '), 6);
		} else {
			$temp['time'] = $d . ' ' . substr($passenger['time'], strrpos($passenger['time'], ' '), 6);;
		}
		if($finish == '1')
			$temp['finish'] = '共乘成功!';
		else if ($finish == '2')
			$temp['finish'] = '司機取消共乘!';
		else if ($finish == '3')
			$temp['finish'] = '乘客取消共乘!';
		else if ($finish == '4')
			$temp['finish'] = '乘客提前下車!';

		array_push($arr, $temp);
		$index++;

	} else if ($j2['aid'] == $id) {
		//driver
		$path = json_decode($j2['path']);
		$dis = $i['distance'];
		//get passenger id
		$ssql = "SELECT `aid` FROM `passenger` WHERE `pnum` = '$pnum'";
		$rresult = mysql_query($ssql);
		$j = mysql_fetch_array($rresult);
		$pid = $j[0];
		//get passenger name
		$ssql = "SELECT `name` FROM `account` WHERE `aid` = '$pid'";
		$rresult = mysql_query($ssql);
		$j = mysql_fetch_array($rresult);
		$name = $j[0];

		$temp['role'] = 'driver';
		$temp['hid'] = $pid;
		$temp['name'] = $name;
		$temp['dis'] = $dis;
		$temp['start'] = getAddress(json_encode($path[0]));
		$temp['end'] = getAddress(json_encode(end($path)));
		$d = substr($j2['time'], 0, 10);
		if ($d == date('Y-m-d')) {
			$temp['time'] = '今天 ' . substr($j2['time'], strrpos($j2['time'], ' '), 6);
		} else if ($d == date('Y-m-d', strtotime('yesterday'))) {
			$temp['time'] = '昨天 ' . substr($j2['time'], strrpos($j2['time'], ' '), 6);
		} else {
			$temp['time'] = $d . ' ' . substr($j2['time'], strrpos($j2['time'], ' '), 6);
		}
		if($finish == '1')
			$temp['finish'] = '共乘成功!';
		else if ($finish == '2')
			$temp['finish'] = '司機取消共乘!';
		else if ($finish == '3')
			$temp['finish'] = '乘客取消共乘!';
		else if ($finish == '4')
			$temp['finish'] = '乘客提前下車!';

		array_push($arr, $temp);
		$index++;
	}
}
echo json_encode($arr);
?>

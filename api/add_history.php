<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);

$dnum = $data['dnum'];
$pnum = $data['pnum'];
$index = $data['index'];

function getDistance($path) {
	$R = 6378137;
	$l = count($path);
	$sum = 0;

	for ($i = 0; $i < $l - 1; $i++) {
		$pt1 = $path[$i];
		$pt2 = $path[$i + 1];

		$dLat = ($pt2->at - $pt1->at) * M_PI / 180;
		$dLong = ($pt2->ng - $pt1->ng) * M_PI / 180;
		$a = sin($dLat / 2) * sin($dLat / 2) +
		cos(($pt1->at * M_PI / 180)) * cos(($pt2->at * M_PI / 180)) * sin($dLong / 2) * sin($dLong / 2);
		$c = 2 * atan2(sqrt($a), sqrt(1 - $a));
		$sum += $R * $c;
	}
	return round($sum);
}
//update the seat of driver
$sql = "SELECT `seat` FROM `driver` WHERE `dnum` = '$dnum'";
$result = mysql_query($sql);
$seat = mysql_fetch_array($result);
$seat = $seat[0] - 1;
$sql = "UPDATE `driver` SET `seat` = '$seat' WHERE `dnum` = '$dnum'";
$result = mysql_query($sql);

//get max hid
$sql = "SELECT MAX(`hid`) FROM `history`";
$result = mysql_query($sql);
$max = mysql_fetch_array($result);
$max = $max[0] + 1;

//get the distance of carpool path
$sql = "SELECT `carpoolpath` FROM `passenger` WHERE `pnum` = '$pnum'";
$result = mysql_query($sql);
$i = mysql_fetch_array($result);
$path = json_decode($i[0]);
$d = getDistance($path[$index]);

//add history
$sql = "INSERT INTO `history`(`hid`, `dnum`, `pnum`, `distance`, `finished`) VALUES ('$max', '$dnum', '$pnum', '$d', '0')";
$result = mysql_query($sql);
echo $max;

?>
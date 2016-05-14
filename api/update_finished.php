 <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);
$finished = $data['finish'];

if (isset($data['dnum'])) {
	$dnum = $data['dnum'];
	$sql = "UPDATE `driver` SET `finished` = '$finished' WHERE `dnum` = '$dnum'";
	$result = mysql_query($sql);
} else if (isset($data['pnum'])) {
	$pnum = $data['pnum'];
	$sql = "UPDATE `passenger` SET `finished` = '$finished' WHERE `pnum` = '$pnum'";
	$result = mysql_query($sql);
}

?>

<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);

$pnum = $data['pnum'];
$at = $data['at'];
$ng = $data['ng'];
$end = '{"at":"' . $at . '","ng":"' . $ng . '"}';

$sql = "UPDATE `passenger` SET `end` = '$end' WHERE `pnum` = '$pnum'";
$result = mysql_query($sql);
echo $max;

?>
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);

$hid = $data['hid'];
$finish = $data['finish'];

$sql = "UPDATE `history` SET `finished` = '$finish', `time` = CURRENT_TIMESTAMP WHERE `hid` = '$hid'";
$result = mysql_query($sql);

?>
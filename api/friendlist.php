 <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);

$id = $data['id'];
$arr = array();

$sql = "SELECT `friendlist` FROM `account` WHERE `aid` = '$id'";
$result = mysql_query($sql);
$i = mysql_fetch_array($result);
$friendlist = json_decode($i[0]);

$index = 0;
$fnum = count($friendlist);

if($fnum != 0){
	while($index < $fnum)
	{
		$fid = $friendlist[$index];
		$sql = "SELECT `name` FROM `account` WHERE `aid` = '$fid'";
		$result = mysql_query($sql);
		$i = mysql_fetch_array($result);

		$temp['fid'] = $fid;
		$temp['name'] = $i[0];
		array_push($arr, $temp);

		$index++;
	}
}
echo json_encode($arr);
?>

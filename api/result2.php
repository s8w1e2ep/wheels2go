 <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);

$result = $data['result'];
$arr = array();

usort($result, 'sort_by_percentage');

for ($index = 0; $index < sizeof($result); $index++) {
	for ($i = 1; $i < sizeof($result[$index]); $i++) {
		$order = $result[$index][$i]['order'];

		if ($order == 2) {
			$sql = "SELECT * FROM `account` WHERE `aid` =" . $result[$index][$i]["did"];
			$res = mysql_query($sql);
			$row = mysql_fetch_array($res);

			$temp['name'] = $row['name'];
			if (strcmp($row['gender'], "m") == 0) {
				$temp['gender'] = '男';
			} else {
				$temp['gender'] = '女';
			}

			$temp['rating'] = $row['rating'];

			array_push($arr, $temp);
		}
	}
}

echo json_encode($arr);

//$class_n = 'child' . $index;

function sort_by_percentage($a, $b) {
	if ($b[0]['percentage'] - $a[0]['percentage'] != 0) {
		return $b[0]['percentage'] - $a[0]['percentage'];
	} else {
		if ($a[0]['on_d'] - $b[0]['on_d'] != 0) {
			return $a[0]['on_d'] - $b[0]['on_d'];
		} else {
			if ($a[0]['off_d'] - $b[0]['off_d'] != 0) {
				return $a[0]['off_d'] - $b[0]['off_d'];
			} else {
				if ($a[0]['wait'] - $b[0]['wait'] != 0) {
					return $a[0]['wait'] - $b[0]['wait'];
				}

			}
		}
	}
}
?>

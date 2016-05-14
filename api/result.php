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
	$sql = "SELECT * FROM `account` WHERE `aid` =" . $result[$index][0]["did"];
	$rresult = mysql_query($sql);
	$i = mysql_fetch_array($rresult);

	$temp['name'] = $i['name'];
	if (strcmp($i['gender'], "m") == 0) {
		$temp['gender'] = '男';
	} else {
		$temp['gender'] = '女';
	}

	$temp['rating'] = $i['rating'];

	array_push($arr, $temp);
}

echo json_encode($arr);

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

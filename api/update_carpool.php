 <?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config//db_connect.php';
$db = new DB_CONNECT();

$data = $_GET['data'];
$data = json_decode($data, true);
$id = $data['id'];
$pnum = $data['pnum'];

$index1 = $data['index1'];
$index2 = $data['index2'];
$index3 = $data['index3'];

if ($index1 != -1 && $index2 != -1 && $index3 != -1) {
	$sql = "SELECT `carpoolpath` FROM `passenger` WHERE `pnum` = '$pnum'";
	$result = mysql_query($sql);
	$i = mysql_fetch_array($result);
	$i = json_decode($i[0]);

	$order1 = $i->order1;
	$order2 = $i->order2;
	$order3 = $i->order3;
	$start = '{"at":"' . $order1[$index1][0]->at . '","ng":"' . $order1[$index1][0]->ng . '"}'; 		//乘客上車點
	$order1 = json_encode($order1[$index1]);

	for($ii = 0; $ii < count($order2); $ii++){
		$temp = $order2[$ii]->index;
		if(strcmp($temp, $index1) == 0){
			$order2 = $order2[$ii];
			break;
		}
	}
	$path2 = $order2->path;
	$order2 = $path2[$index2];
	$order2 = json_encode($order2);

	$pat = $index1. '' . $index2;
	for($ii = 0; $ii < count($order3); $ii++){
		$temp = $order3[$ii]->index;
		if(strcmp($temp, $pat) == 0){
			$order3 = $order3[$ii];
			break;
		}
	}
	$path3 = $order3->path;
	$order3 = $path3[$index3];
	$end = '{"at":"' . end($order3)->at . '","ng":"' . end($order3)->ng . '"}'; 				//乘客下車點
	$order3 = json_encode($order3);
	$carpool = '[' . $order1 . ',' . $order2 . ',' . $order3 . ']';

	$sql = "UPDATE `passenger` SET `carpoolpath` = '$carpool', `start`='$start', `end`='$end' WHERE `pnum` = '$pnum'";
	$result = mysql_query($sql);

} else if ($index1 != -1 && $index2 != -1) {
	$sql = "SELECT `carpoolpath` FROM `passenger` WHERE `pnum` = '$pnum'";
	$result = mysql_query($sql);
	$i = mysql_fetch_array($result);
	$i = json_decode($i[0]);

	// $i = '[{"order1":[[{"at":1,"ng":2},{"at":1,"ng":2},{"at":1,"ng":2}]],
	//          "order2":[{"index": "0", "path":[[{"at":1,"ng":2},{"at":1,"ng":2},{"at":1,"ng":2}]]},
	//          		  {"index": "1", "path":[[{"at":1,"ng":2},{"at":1,"ng":2},{"at":1,"ng":2}]]}],
	//          "order3":[{"index": "01", "path":[[{"at":1,"ng":2},{"at":1,"ng":2},{"at":1,"ng":2}]]}]
	// 	}]';
	//$i = json_decode($i);

	$order1 = $i->order1;
	$order2 = $i->order2;
	$start = '{"at":"' . $order1[$index1][0]->at . '","ng":"' . $order1[$index1][0]->ng . '"}';	 //乘客上車點
	$order1 = json_encode($order1[$index1]);

	for($ii = 0; $ii < count($order2); $ii++){
		$temp = $order2[$ii]->index;
		if(strcmp($temp, $index1) == 0){
			$order2 = $order2[$ii];
			break;
		}
	}
	$path2 = $order2->path;
	$order2 = $path2[$index2];
	$end = '{"at":"' . end($order2)->at . '","ng":"' . end($order2)->ng . '"}'; 			//乘客下車點
	$order2 = json_encode($order2);
	$carpool = '[' . $order1 . ',' . $order2 . ',[]]';

	$sql = "UPDATE `passenger` SET `carpoolpath` = '$carpool', `start`='$start', `end`='$end' WHERE `pnum` = '$pnum'";
	$result = mysql_query($sql);

} else {
	$sql = "SELECT `carpoolpath` FROM `passenger` WHERE `pnum` = '$pnum'";
	$result = mysql_query($sql);
	$i = mysql_fetch_array($result);
	$i = json_decode($i[0]);
	$order1 = $i->order1;
	$start = '{"at":"' . $order1[$index1][0]->at . '","ng":"' . $order1[$index1][0]->ng . '"}'; 		//乘客上車點
	$end = '{"at":"' . end($order1[$index1])->at . '","ng":"' . end($order1[$index1])->ng . '"}'; 	//乘客下車點
	$order1 = json_encode($order1[$index1]);
	$carpool = '[' . $order1 . ',[],[]]';

	$sql = "UPDATE `passenger` SET `carpoolpath` = '$carpool', `start`='$start', `end`='$end' WHERE `pnum` = '$pnum'";
	$result = mysql_query($sql);
}

?>

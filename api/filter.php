<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	
	require_once '../config//db_connect.php';
	$db = new DB_CONNECT();
	
	$data = $_GET['data'];
	$data = json_decode($data, true);
	
	$id = $data['id'];
	
	$condition = $data['condition'];
	//$selection = $data['role'];
	$threshold = $condition[0]['rating'];
	
	function getRating($fid){//���ӤH����
		$sql = "SELECT `rating` FROM `account` WHERE `aid` = '$fid'";
		$result = mysql_query($sql);
		$i = mysql_fetch_array($result);
		return $i[0];
	}
	
	function getDriverThreshold($fid){//���q�����e
		$sql = "SELECT `threshold` FROM `receiver` WHERE `aid` = '$fid'";
		$result = mysql_query($sql);
		$i = mysql_fetch_array($result);
		return $i[0];
	}
	
	//if($selection === 'passenger'){//requester
		$sql = "SELECT `receiver`.`aid` FROM `receiver`,`account` WHERE `account`.`rating` >= '$threshold' and `account`.`aid`=`receiver`.`aid` and `seat` != '0'";//�z�ﭼ�ȵ������e
		$result = mysql_query($sql);//�q�������ŦX���Ȫ��e
		$driver_num = mysql_num_rows($result);

		
		/*$count = 0;
		for($i=0; $i < $driver_num; $i++){
			if(getRating($resarr[$i]) >= $threshold){
				$result1[$count] = $resarr[$i];
				$count++;
			}
		}*/
		//�z��q���������e
		
		$resarr = array();
		$count = 0;
		for($i=0; $i < $driver_num; $i++){	
			$res = mysql_result($result,$i);
			if(getDriverThreshold($res) <= getRating($id)){//���ȵ����ŦX�q�����e
				$resarr[$count] = $res;
				$count++;
			}
		}
		//$resarr = array_values($resarr);//����}�C
		
		$sql = "SELECT `path` FROM `requester` WHERE `aid` = '$id'";
		$result = mysql_query($sql);
		$temp = mysql_fetch_array($result);
		$p1 =  $temp[0];//���o���ȸ��|
		
		//�}�l���|���
		//$count = count($resarr);
		$p2 = array();
		for($i=0; $i < $count; $i++){
			$res = $resarr[$i];
			$sql = "SELECT `path` FROM `receiver` WHERE `aid` = '$res'";
			$result = mysql_query($sql);
			$temp = mysql_fetch_array($result);
			$p2[$i] =  $temp[0];//���o�q�����|
		}
		//array_push($p2,$p1);//�N���ȸ��|��b�̫�@��
		echo json_encode($p2);

	//}
?>



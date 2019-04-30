<?php

require_once('db.php');
require_once('processData.php');

$page = file_get_contents('rawData.txt');

$data = convertData($page);

foreach($data as $table=>$tableData) {
	//echo "Inserting $table\n";
	foreach ( $tableData as $values ) {
		$keyset = implode(', :', array_keys($values));
		break;
	}
	$stmt = $dbh->prepare('INSERT INTO `' . $table . '` VALUES ( :' . $keyset . ' )' );
	$c = 0;
	foreach ($tableData as $values) {
		$stmt->execute($values);
		//echo "+";
		if (++$c % 50 == 0) {
			//echo "<br>\n";
		}
	}
	//echo "</p>\n";
}
//echo "<p>DONE!</p>\n";


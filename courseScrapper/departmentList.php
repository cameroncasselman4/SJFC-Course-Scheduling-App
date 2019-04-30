<?php

//read file 
//loop through each line using fgets()
//start parsing when fgets() returns subjects

$myfile = fopen("courseHTML.txt", "r") or die("Unable to open file!");
$shouldParse = false;
$startParseKeyWord = 'Subjects';
$departmentNames = [];

while(!feof($myfile)) {
	
	$currentLine = fgets($myfile);
	echo($currentLine);
	if($shouldParse == true) {
		//get rid of white space,*,and [ ]
		
		$trimWhiteSpace = trim($currentLine);
		
		//first 6 characters need to be removed for easier parsing
		$strippedLine = substr($trimWhiteSpace,6);

		//capture everything before "-"
		$departmentAcronym = substr($strippedLine, 0, strpos($strippedLine, "-"));
		
		//capture everything after "-"
		$departmentName = substr($strippedLine, strpos($strippedLine, "-") + 1);  
		
		//trim remaining white space
		$departmentAcronym = trim($departmentAcronym);
		
		//add acronyms and department names to associative array
		$departmentNames[$departmentAcronym] = $departmentName;
	}
	
	//if the current line contains "Subjects" start parsing next line
	if(strpos($currentLine,$startParseKeyWord) == true){
		
		if($shouldParse == true) {
			echo("should parse is now false and should stop parsing\n");
			$shouldParse = false;
		}
		else{
			echo("this should only hit once\n");
			$shouldParse = true;
		}	
	}
}

//remove the blank element from the array
unset($departmentNames['']);

fclose($myfile);

//automate post body for curl script

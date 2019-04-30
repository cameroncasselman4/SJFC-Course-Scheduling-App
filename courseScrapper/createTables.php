<?php

echo "is this working echo /n";

require_once('db.php'); // This is the connection to the database, currently called ‘db.php’

echo "is this working echo /n";
// Turns out I need more tables.  course_instructor and course_schedule seem to help.  Also, there needs to be somewhere to store the departments, so that has a table now.
// Also NOT NULL is important for things that could be primary keys
// Also some things need more than one primary key.  course_instructor and course_schedule don’t really have one, so they have two.
// Apparently ‘ is different than ` and PHP is okay with that, so I can use both of those.

$statements = [

	'DROP TABLE IF EXISTS `course_schedule`',
	'DROP TABLE IF EXISTS `course_instructor`',
	'DROP TABLE IF EXISTS `courses`',
	'DROP TABLE IF EXISTS `schedules`',
	'DROP TABLE IF EXISTS `instructors`',
	'DROP TABLE IF EXISTS `departments`',

	'CREATE TABLE `departments` (
		`departmentID` int(10) unsigned NOT NULL AUTO_INCREMENT,
		`code` char(4) NOT NULL,
		`name` varchar(40) NOT NULL,
		PRIMARY KEY (`departmentID`)
	)',

	'CREATE TABLE `instructors` (
		`instructorID` int(10) unsigned NOT NULL AUTO_INCREMENT,
		`name` varchar(50) NOT NULL,
		`email` varchar(50) NOT NULL,
		PRIMARY KEY (`instructorID`)
	)',

	'CREATE TABLE `schedules` (
		`scheduleID` int(10) unsigned NOT NULL AUTO_INCREMENT,
		`days` varchar(5) NOT NULL,
		`daySort` varchar(5) NOT NULL,
		`times` varchar(25) NOT NULL,
		PRIMARY KEY (`scheduleID`)
	)',

	'CREATE TABLE `courses` (
		`courseID` int(10) unsigned NOT NULL AUTO_INCREMENT,
		`departmentID` int(10) unsigned NOT NULL,
		`number` varchar(10) NOT NULL,
		`title` varchar(40) NOT NULL,
		`notes` varchar(150) NOT NULL,
		`detailLink` varchar(75) NOT NULL,
		`restrictions` enum("y","n") NOT NULL,
		`prerequisites` enum("y","n") NOT NULL,
		`online` enum("y","n") NOT NULL,
		`hybrid` enum("y","n") NOT NULL,
		`credits` varchar(10) DEFAULT NULL,
		`partOfTerm` varchar(5) DEFAULT NULL,
		`capacity` smallint(6) DEFAULT NULL,
		`seatsAvailable` smallint(6) DEFAULT NULL,
		PRIMARY KEY (`courseID`),
		FOREIGN KEY (`departmentID`) REFERENCES `departments`(`departmentID`) ON DELETE CASCADE ON UPDATE CASCADE
	)',

	'CREATE TABLE `course_instructor` (
		`courseID` int(10) unsigned NOT NULL,
		`instructorID` int(10) unsigned NOT NULL,
		`priamry` enum("y","n") NOT NULL,
		PRIMARY KEY (`courseID`,`instructorID`),
		FOREIGN KEY (`courseID`) REFERENCES `courses` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY (`instructorID`) REFERENCES `instructors` (`instructorID`) ON DELETE CASCADE ON UPDATE CASCADE
	)',

	'CREATE TABLE `course_schedule` (
		`courseID` int(10) unsigned NOT NULL,
		`scheduleID` int(10) unsigned NOT NULL,
		`startDate` varchar(10) NOT NULL,
		`endDate` varchar(10) DEFAULT NULL,
		`location` varchar(20) DEFAULT NULL,
		PRIMARY KEY (`courseID`,`scheduleID`),
		FOREIGN KEY (`courseID`) REFERENCES `courses` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY (`scheduleID`) REFERENCES `schedules` (`scheduleID`) ON DELETE CASCADE ON UPDATE CASCADE
	)',

];


// Not sure exactly how this works, but it seems to, so don’t touch it.
foreach ($statements as $k => $sql) {
	echo "<p>Executing Statement #", ($k + 1), "<p>";
	try {
		echo "&nbsp; &nbsp; ", var_export($dbh->query($sql), true);
	} catch ( PDOException $e ) {
		echo "<p>Error Executing Statement#", ( $k + 1 ), ": {$e->getMessage()}<p>";
		die();
	}
}
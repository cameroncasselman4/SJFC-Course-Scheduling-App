<?php

function convertData($page) {

	$courses = [];

	$departmentNames = [];  // An error comes up if you don’t predefine this, even though I am getting it from a different file.
	require_once('departmentList.php'); // This is a list of all of the departments.  Go there to update it, and keep it in the same folder.

	$departments      = [ 0 => 'starts-first-on-1' ];
	$departmentsIndex = [];
	$instructors      = [ 0 => 'starts-first-on-1' ];
	$instructorsIndex = [];
	$schedules        = [ 0 => 'starts-first-on-1' ];
	$schedulesIndex   = [];

	$course_instructor_map = [];
	$course_schedule_map   = [];

	$doc                      = new DOMDocument();
	$doc->recover             = true;
	$doc->strictErrorChecking = false;

	// According to stack exchange, this causes a lot of warnings and no errors, but those all go away with a simple @
	@$doc->loadHTML($page);

	$tr_list = $doc->getElementsByTagName('tr');

	if ($tr_list->length > 0) {
		foreach ($tr_list as $tr) {
			$tr_id = $tr->getAttribute('id');
			if (substr($tr_id, 0, 4) == 'crn_' && $tr->childNodes->length > 0) {
				$course = [
					'id'            => $tr_id,
					'cs_id'         => '',
					'link'          => '',
					'restrictions'  => false,
					'prerequisites' => false,
					'online'        => false,
					'hybrid'        => false,
					'crn'           => '',
					'title'         => '',
					'text'          => '',
					'credits'       => '',
					'meetings'      => [],
					'part_of_term'  => '',
					'instructors'   => [],
					'capacity'      => 0,
					'seats_avail'   => 0,
				];
				foreach ($tr->childNodes as $c => $td ) {
					// Using switch. Will need adjusted if the returned table ever modified.
					switch ( $c ) {
						case 0:
							// BEGIN: TD that will lists course/section & options
							$a_list = $td->getElementsByTagName('a');
							if ($a_list->length > 0) {
								foreach ($a_list as $a) {
									$course['cs_id'] = trim( $a->textContent );
									$course['link']  = $a->getAttribute( 'href' );
									break;
								}
							}
							$img_list = $td->getElementsByTagName('img');
							if ($img_list->length > 0) {
								foreach ($img_list as $img) {
									$title = trim( $img->getAttribute('title') );
									if ($title == 'restrictions') {
										$course['restrictions'] = true;
									} elseif ($title == 'prerequisite required') {
										$course['prerequisites'] = true;
									}
								}
							}
							break; // END: TD that will list options
						case 1:
							// CRN Number.  I wonder what CRN stands for.  Like ATM machine…
							$course['crn'] = trim($td->textContent);
							break;
						case 2:
							// BEGIN: TD that will lists types (Online/Hybrid)
							$img_list = $td->getElementsByTagName('img');
							if ($img_list->length > 0) {
								foreach ($img_list as $img) {
									$title = strtolower( trim( $img->getAttribute('title')));
									if ($title == 'online course') {
										$course['online'] = true;
									} elseif ($title == 'hybrid course') {
										$course['hybrid'] = true;
									}
								}
							}
							break; // END: TD that will lists types (Online/Hybrid)
						case 3:
							// BEGIN: Course Title/Text
							$p_list = $td->getElementsByTagName('p');
							if ($p_list->length > 0) {
								foreach ($p_list as $p) {
									$class = trim( $p->getAttribute('class'));
									if ( $class == 'course_title') {
										$course['title'] = trim($p->textContent);
									} elseif ($class == 'course_text') {
										$course['text'] = trim($p->textContent);
									}
								}
							}
							break; // END: Course Title/Text
						case 4:
							// Number of credits
							$course['credits'] = trim($td->textContent);
							break;
						case 5:
							// BEGIN: Course Meeting
							$meeting_list = $td->getElementsByTagName('span');
							if ($meeting_list->length > 0 ) {
								foreach ($meeting_list as $meeting) {
									$meeting_class = trim( $meeting->getAttribute('class'));
									if ( $meeting_class == 'meeting') {
										$meeting_set = [
											'meeting_day'  => '',
											'meeting_time' => '',
											'start_date'   => '',
											'end_date'     => '',
											'location'     => ''
										];

										$abbr_list = $meeting->getElementsByTagName('abbr');
										if ($abbr_list->length > 0) {
											// BEGIN: Meeting Days of Week & Location
											foreach ($abbr_list as $abbr ) {
												$class = trim($abbr->getAttribute('class'));
												switch ($class) {
													case "meeting-day":
														$meeting_set['meeting_day'] = trim($abbr->textContent);
														break;
													case "location":
														$meeting_set['location'] = trim($abbr->textContent);
														break;
												}
											} // END: Meeting Days of Week & Location
										}

										$span_list = $meeting->getElementsByTagName('span');
										if ($span_list->length > 0) {
											// BEGIN: Meeting Times & Dates
											foreach ($span_list as $span) {
												$class = trim( $span->getAttribute('class') );
												switch ($class) {
													case "meeting-time":
														$meeting_set['meeting_time'] = trim($span->textContent);
														break;
													case "meeting-start-date":
														$meeting_set['start_date'] = trim($span->textContent);
														break;
													case "meeting-end-date":
														$meeting_set['end_date'] = trim($span->textContent, "- \t\n\r\0\x0B" ); // expand default list to include hyphen-
														break;
												}
											} // END: Meeting Times & Dates
										}

										$course['meetings'][] = $meeting_set;
									}
								}
							}
							break; // END: Course Meetings
						case 6:
							// Part of Term
							$course['part_of_term'] = trim($td->textContent);
							break;
						case 7:
							// BEGIN: Get Instructor Name / Link (or just note if none)
							$a_list = $td->getElementsByTagName('a');
							if ( $a_list->length > 0 ) {
								foreach ( $a_list as $a ) {
									$course['instructors'][] =
										[
											'name'    => trim($a->textContent),
											'primary' => ($a->getAttribute('data-primary-instructor') == 'Y'),
											'email'   => substr( $a->getAttribute('href'), 7)
										];
								}
							}

							if (count($course['instructors']) == 0) {
								// No instructor, grab note
								$span_list = $td->getElementsByTagName('span');
								if ( $span_list->length > 0 ) {
									foreach ($span_list as $span) {
										$class = trim( $span->getAttribute('class'));
										if ($class == 'instructor') {
											$course['instructors'][] =
												[
													'name'  => trim($span->textContent),
													'email' => false
												];
											break;
										}
									}
								}
							}
							break; // END: Get Instructor Name / Link (or just note if none)

						case 8:
							// Capacity
							$course['capacity'] = trim( $td->textContent);
							break;

						case 9:
							// Seats Available
							$course['seats_avail'] = trim($td->textContent);
							break;

					}
				}

				$dept = substr( $course['cs_id'], 0, 4 );
				if ( ! array_key_exists( $dept, $departmentsIndex)) {
					$newID                     = count($departments);
					$deptName                  = (array_key_exists($dept, $departmentNames)) ? $departmentNames[$dept] : $dept;
					$departments[]             = [
						'departmentID' => $newID,
						'code'         => $dept,
						'name'         => $deptName
					];
					$departmentsIndex[$dept] = $newID;
				}

				$courseID = (int) $course['crn'];

				$courses[] = [
					'courseID'       => $courseID,
					'departmentID'   => $departmentsIndex[ $dept ],
					'number'         => substr( $course['cs_id'], 4 ),
					'title'          => $course['title'],
					'notes'          => $course['text'],
					'detailLink'     => $course['link'],
					'restrictions'   => ($course['restrictions'] ? 'y' : 'n' ),
					'prerequisites'  => ($course['prerequisites'] ? 'y' : 'n' ),
					'online'         => ($course['online'] ? 'y' : 'n' ),
					'hybrid'         => ($course['hybrid'] ? 'y' : 'n' ),
					'credits'        => $course['credits'],
					'partOfTerm'     => $course['part_of_term'],
					'capacity'       => (int) $course['capacity'],
					'seatsAvailable' => (int) $course['seats_avail'],
				];

				foreach ($course['instructors'] as $inst) {
					if ( ! array_key_exists($inst['name'], $instructorsIndex)) {
						$newID                             = count($instructors);
						$instructors[]                     = [
							'instructorID' => $newID,
							'name'         => $inst['name'],
							'email'        => $inst['email']
						];
						$instructorsIndex[$inst['name']] = $newID;
					}
					$course_instructor_map[] = [
						'courseID'     => $courseID,
						'instructorID' => $instructorsIndex[$inst['name']],
						'primary'      => ($inst['primary'] ? 'y' : 'n')
					];
				}

				foreach ($course['meetings'] as $meeting) {
					$key = $meeting['meeting_day'] . '~' . $meeting['meeting_time'];
					if ( ! array_key_exists($key, $schedulesIndex)) {
						$newID                  = count($schedules);
						$schedules[]            = [
							'scheduleID' => $newID,
							'days'       => $meeting['meeting_day'],
							'daySort'    => str_replace(
								['M', 'T', 'W', 'R', 'F', 'S'],
								['1', '2', '3', '4', '5', '6'],
								$meeting['meeting_day'] // Gives a field to sort on
							),
							'times'      => $meeting['meeting_time']
						];
						$schedulesIndex[ $key ] = $newID;
					}
					$course_schedule_map[] = [
						'courseID'   => $courseID,
						'scheduleID' => $schedulesIndex[ $key ],
						'startDate'  => $meeting['start_date'],
						'endDate'    => $meeting['end_date'],
						'location'   => $meeting['location']
					];
				}
			}
		}
	}

	// Delete the items that are 0
	unset( $departments[0], $instructors[0], $schedules[0] );

	return [
		'departments'       => $departments,
		'instructors'       => $instructors,
		'schedules'         => $schedules,
		'courses'           => $courses,
		'course_instructor' => $course_instructor_map,
		'course_schedule'   => $course_schedule_map

	];
}


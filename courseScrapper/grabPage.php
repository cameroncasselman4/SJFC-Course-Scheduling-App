<?php

$curl = curl_init();

// This is the curl statement.  For some reason it seems you can only get it on a Mac.  It doesn’t show up on chrome or firebox’s network settings.
// Get it by opening the network developer tools in safari and clicking the submit button on the course search page
curl_setopt_array($curl, array(
	CURLOPT_PORT           => "8445",
	CURLOPT_URL            => "https://rhelxess2-prod.sjfc.edu:8445/prod/sjfc_course_search_1.main_page",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING       => "",
	CURLOPT_MAXREDIRS      => 10,
	CURLOPT_TIMEOUT        => 30,
	CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST  => "POST",
	CURLOPT_POSTFIELDS     => "p_term_code=201909&p_term_code_alt=201901&p_enrollment=&p_subject=&p_attr=&p_enrollment=OPEN&p_enrollment=CLOSED&p_subject=ACCT&p_subject=AFAM&p_subject=AMST&p_subject=ANTH&p_subject=APIT&p_subject=ARTS&p_subject=BIOL&p_subject=CHEM&p_subject=CLST&p_subject=COMM&p_subject=CRIM&p_subject=CSCI&p_subject=DEXL&p_subject=DIGC&p_subject=ECON&p_subject=EDUC&p_subject=ENGL&p_subject=FGEN&p_subject=FINA&p_subject=FSTY&p_subject=GAED&p_subject=GCED&p_subject=GDAT&p_subject=GEDA&p_subject=GEDU&p_subject=GHRD&p_subject=GISP&p_subject=GLMS&p_subject=GMGT&p_subject=GMHC&p_subject=GMSM&p_subject=GMST&p_subject=GNUR&p_subject=GPBH&p_subject=GRDG&p_subject=GREK&p_subject=GSCM&p_subject=GSED&p_subject=GSMG&p_subject=GTLY&p_subject=HHUM&p_subject=HIST&p_subject=HNRS&p_subject=HRMG&p_subject=ISPR&p_subject=ITDY&p_subject=ITED&p_subject=LARA&p_subject=LATN&p_subject=LCHN&p_subject=LCLA&p_subject=LEST&p_subject=LFRN&p_subject=LITL&p_subject=LLIT&p_subject=LSPN&p_subject=MATH&p_subject=MGMT&p_subject=MKTG&p_subject=MSTD&p_subject=MSTI&p_subject=NURS&p_subject=PHAR&p_subject=PHIL&p_subject=PHYS&p_subject=POSC&p_subject=PSJS&p_subject=PSYC&p_subject=PUBH&p_subject=REST&p_subject=SERV&p_subject=SGNL&p_subject=SOCI&p_subject=SPST&p_subject=SSCH&p_subject=STAT&p_subject=SUST&p_subject=WGST&p_attr=ALL&p_title=&p_meet_time=ANY&p_instructor=&p_course_type=ALL",
	CURLOPT_HTTPHEADER     => array(
		"Accept: */*",
		"Content-Type: application/x-www-form-urlencoded",
		"Origin: https://rhelxess2-prod.sjfc.edu:8445",
		"Referer: https://rhelxess2-prod.sjfc.edu:8445/prod/sjfc_course_search_1.main_page",
		"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
		"X-Requested-With: XMLHttpRequest"
	),
) );

$page = curl_exec($curl);
$err  = curl_error($curl);

curl_close($curl);

if ($err) {
	die("cURL Error #:" . $err);
}

//echo "Received ", number_format(strlen($page), 0), "bytes of data\n";

file_put_contents('rawData.txt', $page);

//echo "Wrote data to raw-data.txt\n";

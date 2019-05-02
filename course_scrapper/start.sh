#!/bin/bash

printf "\nCreating Tables\n"
php createTables.php

printf "\n\nScrapping Course website for department names\n"
lynx --dump https://rhelxess2-prod.sjfc.edu:8445/prod/sjfc_course_search_1.main_page > courseHTML.txt

printf "\n\nScraping\n"
php grabPage.php

printf "Processing the data...\n"
php processData.php

printf "Inserting data.  This is going to take a while\n"
php insertData.php

printf "starting course_api and connection to database"
cd ..
cd SJFC-Course-Scheduling-App
npm install
cd course-api
node course-api

printf "Done!\n"



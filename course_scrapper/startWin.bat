echo "Creating Tables"
php createTables.php

REM echo "Scraping"
REM php grabPage.php

echo "Processing the data..."
php processData.php

echo "Inserting data.  This is going to take a while"
php insertData.php

@echo off
set /p id="Enter ID: "

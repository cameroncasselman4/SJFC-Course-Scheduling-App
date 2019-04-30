echo "Processing the data..."
php processData.php

echo "Inserting data.  This is going to take a while"
php insertData.php

@echo off
set /p id="Enter ID: "

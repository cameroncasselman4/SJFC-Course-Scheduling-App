# SJFC-Course-Scheduling-App
http://www.connorcasselman.com/sjfccourse/SJFC-Course-Scheduling-App/

The SJFC-Course-Scheduling-App is designed with several technologies including, Javascript, React, Babel, Express.js, Node.js MySQL, PHP and HTML+CSS 

St. John Fisher students can leverage this website to organize their schedule prior to registration. 
Users may add courses to their schedule or alternative list and then print their formatted class list.

## User Documentation

### Selecting Classes
At first glance, users will see a picture of Kearny Hall with a button "Get started". Clicking this button will direct the user to the course selection textboxes. Students may check any subject with or without attributes. Press the "submit" button to return a list of classes based on the search criteria.

### Adding courses to your schedule
Each course is sorted into a table based on the department *computer science classes fall under the CSCI table*. 
Users may add a course to their schedule by clicking the "main" button on the desired class. The course will appear under the user's main schedule further down the page.

You will receive an error adding courses to your schedule if:
- Courses exceed 10
- The course already exists in your schedule
- There are no seats available
- The course conflicts with another

### Adding courses to your alternative list
Users may also add courses to their alternative list by pressing "alternative" on the selected class. 
If any of the criteria above is not met, or if a student is unsure of enrolling in a particular class, they should use the alternative list. Unfortunatly, a printing feature has not been implemented for the alternative list.

### Moving courses between Your Schedule and Alternative List or removing a course
Select "Your Schedule" or "Alternative List" on the navigation bar to view your current classes.
Once users have courses added to their schedule, you may swap classes between the main schedule and alternative schedule by pressing the "main" and "alternative" buttons. If you would like to remove a course from your schedule, press the remove button.

### Printing your Week at a Glance
Once you are finished adding courses to your schedule, press "Week at a Glance" on the navigation bar and you will be directed to a weekly agenda. Press the "print" button and you will be directed to a new page. The new page will open allowing you to print your schedule. Close the page after you are finished to return to the site.

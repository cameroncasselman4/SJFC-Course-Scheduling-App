//created by cameron casselman
//main script to control http requests and course scheduling information

//These global lets are kind of a hack for controlling the amount of classes everytime an event is called
//I could have implemented an object with a static letiable containing #classes
let numMainCourses = 0;
let numAlternativeCourses = 0;

//this is an object to keep track of the classes added inisde your schedule
//global letiable
let mainCourses = [];
let alternateCourses = [];

getCourseSubjects();

//funciton to populate check box areas with course subjects
function getCourseSubjects() {
    const url = "http://localhost:3000/getCourseSubjects"
    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(value){
            populateCheckBox(value);
        })
}

//function to loop through every course subject and create html check box containing their associated id
function populateCheckBox(subj) {
    for(let i=0; i<subj.length; i++) {
        addCheckBoxInput(subj[i]);
    }
}

//create html nodes and associate with css
function addCheckBoxInput(subj) {
    
    const element = document.querySelector(".subjects");
    const inputElement = document.createElement("INPUT");
    const brElement = document.createElement("BR");
    inputElement.setAttribute("type","checkbox");
    inputElement.setAttribute("id",subj.departmentID);
    const textNode = document.createTextNode(subj.code + " - " + subj.name);
    inputElement.appendChild(textNode);
    element.appendChild(inputElement);
    element.appendChild(textNode);
    element.appendChild(brElement);
}

//function to scan checkboxes and send http request containing attributes and subjects
//this function is triggered through an onClick listener on html submit button
function getClasses() {
    const checkedSubjects = getCheckedSubjects();
    const checkedAttributes = getCheckedAttributes();

    if(checkedSubjects.length == 0) {
        createAlert("Please select at least one subject");
    }
    else{
        getClassesRequest(checkedSubjects,checkedAttributes);
    }
}

//returns array of ids from checked boxes
function getCheckedSubjects() {
    let subjectsArray = [];
    const subjectsContainer = document.querySelector('#getSubjects');
    let checkboxes = subjectsContainer.querySelectorAll('input[type=checkbox]:checked')
    for (let i = 0; i < checkboxes.length; i++) {
      subjectsArray.push(checkboxes[i].id);
    }
    return subjectsArray;
}

function checkAllSubjects(e) {
    const subjectsContainer = document.querySelector("#getSubjects");
    let checkboxes = subjectsContainer.querySelectorAll("input[type=checkbox]");
    if(e.checked) {
        for(let i = 0; i < checkboxes.length; i++) {
            changeCheckBox(checkboxes[i],true);
        }
    }
    else {
        for(let i = 0; i < checkboxes.length; i++) {
            changeCheckBox(checkboxes[i],false);
        }
    }
}

function noAttributes(e) {
    const attributesContainer = document.querySelector("#getAttributes");
    let checkboxes = attributesContainer.querySelectorAll("input[type=checkbox]");

    if(e.checked) {
        for(let i = 0; i < checkboxes.length; i++) {
            changeCheckBox(checkboxes[i],false);
        }
    }
}

function changeCheckBox(element, checkValue) {
    element.checked = checkValue;
}

function getCheckedAttributes() {
    let attributesArray = [];
    const attributesContainer = document.querySelector('#getAttributes');
    let checkboxes = attributesContainer.querySelectorAll('input[type=checkbox]:checked')
    for (let i = 0; i < checkboxes.length; i++) {
      attributesArray.push(checkboxes[i].id);
    }
    return attributesArray;
}

function getClassesRequest(subjects, attributes) {
    const url = "http://localhost:3000/getClasses";
    
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({subjects:subjects,attributes:attributes}) 
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(courses){
        //This function cleans the data and passes the json blob into another fucntion to create tables

        //remove previous tables
        removeTableElements("#section-two",".course-table");
   
        //if no checkboxes were selected
        if(courses.length < 1)
            createAlert("No classes returned with that combination");

        //clean the data     
        else  {
            let allCourses = [];
            let subjectsArray = [];
            let newSubjects=[];
            let count = 0;

            //find which classes are returned and build an array of subjects
            //we need to do this because not all subjects have classes
             
            for(let i=0; i<courses.length; i++){
                                
                if(newSubjects.includes(courses[i].departmentID.toString())==false){
                    let found = false;
                    count = 0;
                    while(!found) {

                        if(count > subjects.length)
                            found = true;

                        if(courses[i].departmentID == subjects[count]){
                            newSubjects.push(subjects[count].toString());
                            found = true;
                        }
                        else{
                            count ++;
                        }
                    }
                }
            }

            //create a table for each subject selected
            //ceate an array of arrays for each subject and pass each array into table creator
            count = 0;
            for(let i = 0; i < courses.length; i++) {
    
                subjectsArray.push(courses[i]);
                
                if(i != courses.length -1){
            
                    if(courses[i+1].departmentID == newSubjects[count+1]) {
                    //append subjectsArray to all courses
                        count++;
                        let clone = subjectsArray.slice(0);
                        allCourses.push(clone);
                        subjectsArray.length = 0;                         
                    }
                }
                else{
                    let clone = subjectsArray.slice(0);
                    allCourses.push(clone);
                }
            }

            for(let i=0; i < allCourses.length;i++) {
               
                insertTableData(allCourses[i],"course-search");  
            }
        }
    });
}

//removes all elements with a specifc class name. In this case it will work with the class search table
function removeTableElements(parentElement,childElement) {
    const tableElements = document.querySelectorAll(childElement);
    if(tableElements.length !=0) {
        for(let i=0;i<tableElements.length;i++) {
            const parent = document.querySelector(parentElement);
            const child = document.querySelector(childElement);
            
            parent.removeChild(child);
        }
    }
}

//function to insert json data into employees table
//this function creates table html for populating the course search, main schedule and alternate schedule table
function insertTableData(jsonData,whichTable,numCourses=0){
    
    //--->create data table > start
    let tbl = '';
        //--->create table header > start
        //numCourses defaults to 0 so this will always set off unless we pass a different value in. 
        //a different value will prevent a header being added to the table every time this function is called.
        if(numCourses <= 1) {
            tbl +='<table class="table table-hover">'
            tbl +='<thead>';
                if(whichTable == "course-search")
                    tbl += '<caption><h2>'+jsonData[0].code+'</h2></caption>';
                tbl +='<tr>';
                tbl +='<th>Course/Section</th>';
                tbl +='<th>CRN</th>';
                tbl +='<th>Course Title</th>';
                tbl +='<th>Credits</th>';
                tbl +='<th>Days/Time</th>';
                tbl +='<th>Instructor</th>';
                tbl +='<th>Capacity</th>';
                tbl +='<th>Seats Avail</th>';
                if(whichTable == "course-search")
                    tbl +='<th>Main/Alternate</th>';
                if(whichTable == "main-schedule")
                    tbl +='<th>Remove/Alternate</th>';    
                if(whichTable == "alternate-schedule")
                    tbl +='<th>Remove/Main</th>';
                tbl +='</tr>';
            tbl +='</thead>';
            //--->create table header > end
        }
        
    //populate body with json
    //this will iterate though multiple rows
    if(whichTable == "course-search") {
        tbl +='<tbody>';
        for(let i=0; i < jsonData.length; i++) {
            tbl += '<tr class="rows" row_id="'+ i +'">';
                tbl += '<td><div class="row_data">'+ jsonData[i].code + jsonData[i].number + '</div></td>';
                tbl += '<td><div class="row_data">'+ jsonData[i].courseID + '</div></td>';
                tbl += '<td><div class="row_data">'+ jsonData[i].title + '</div></td>'; 
                tbl += '<td><div class="row_data">'+ jsonData[i].credits + '</div></td>'; 
                tbl += '<td><div class="row_data">'+ jsonData[i].days + " " + jsonData[i].times + " " + jsonData[i].startDate + "-" + jsonData[i].endDate + '</div></td>';
                tbl += '<td><div class="row_data">'+ jsonData[i].name + '</div></td>'; 
                tbl += '<td><div class="row_data">'+ jsonData[i].capacity + '</div></td>'; 
                tbl += '<td><div class="row_data">'+ jsonData[i].seatsAvailable + '</div></td>'; 
                
                //Create buttons
                tbl += '<td>';
                    
                    tbl += '<span class="btn_main"> <a href="#/" row_id="'+ i +'" class ="btn btn-link">Main</a></span>';
                    tbl += '<span class="btn_alternate"> <a href="#/" row_id="'+ i +'" class ="btn btn-link">Alternative</a></span>';
    
                tbl += '<td>';  
    
            tbl += '</tr>';  
        }
        tbl +='</tbody>';
    }
    
    //only one row is passed so we can't use iteration
    else {
        
        tbl += '<tr class="rows" row_id="'+ numCourses +'">';
            tbl += '<td><div class="row_data">'+ jsonData.code + jsonData.number + '</div></td>';
            tbl += '<td><div class="row_data">'+ jsonData.courseID + '</div></td>';
            tbl += '<td><div class="row_data">'+ jsonData.title + '</div></td>'; 
            tbl += '<td><div class="row_data">'+ jsonData.credits + '</div></td>'; 
            tbl += '<td><div class="row_data">'+ jsonData.days + " " + jsonData.times + " " + jsonData.startDate + "-" + jsonData.endDate + '</div></td>';
            tbl += '<td><div class="row_data">'+ jsonData.name + '</div></td>'; 
            tbl += '<td><div class="row_data">'+ jsonData.capacity + '</div></td>'; 
            tbl += '<td><div class="row_data">'+ jsonData.seatsAvailable + '</div></td>'; 
            
            //Create buttons
            tbl += '<td>';

                if(whichTable == "main-schedule") {
                    tbl += '<span class="btn_remove"> <a href="#/" class ="btn btn-link">Remove</a></span>';
                    tbl += '<span class="btn_alternate"> <a href="#/" class ="btn btn-link">Alternative</a></span>';
                    
                }
                if(whichTable == "alternate-schedule") {
                    tbl += '<span class="btn_remove"> <a href="#/" class ="btn btn-link">Remove</a></span>';
                    tbl += '<span class="btn_main"> <a href="#/" class ="btn btn-link">Main</a></span>';
                    
                }
        
            tbl += '<td>';  

        tbl += '</tr>';
    }    
    
    let tableBody;
    
    if(whichTable == "course-search"){
        //this function adds the tbl letiable to the dom
        tableBody = createTableElements(tbl,"#section-two"); 

        attachJsonToRow(jsonData,tableBody);

        //add event listeners for course-search table
        //add event listeners to the main courses btn
        addEventListeners(".btn_main",addCourseToMainList);
        //add even listeners to the alternate courses btn
        addEventListeners(".btn_alternate",addCourseToAlternateList);
    }
        
    
    //create table elements and add event listeners if we are adding to the main table
    if(whichTable == "main-schedule") {
    
        if (numCourses > 1) {
            
            tableBody = appendToCurrentTable(tbl,".main-courses-table");
            tableBody.childNodes[numCourses -1].childNodes[8].childNodes[1].childNodes[1].data = jsonData;

        }
        else {

            tableBody = createTableElements(tbl,".main-schedule"); 
            tableBody.children[0].children[0].children[1].children[0].children[8].children[1].children[0].data = jsonData;

        }
        //add event listeners to the remove btn
        addEventListeners(".btn_remove",removeCourse);
        //add even listeners to the alternate courses btn
        addEventListeners(".btn_alternate",addCourseToAlternateList);
    }
     
    if(whichTable == "alternate-schedule"){
        
        if(numCourses > 1){

            tableBody = appendToCurrentTable(tbl,".alternate-courses-table");
            tableBody.childNodes[numCourses-1].childNodes[8].childNodes[1].childNodes[1].data = jsonData;

        }
        else{
            tableBody = createTableElements(tbl,".alternate-schedule"); 
            tableBody.children[0].children[0].children[1].children[0].children[8].children[1].children[0].data = jsonData;
        }
        
        //add event listeners to the remove btn
        addEventListeners(".btn_remove",removeCourse);
        //add even listeners to the main courses btn
        addEventListeners(".btn_main",addCourseToMainList);
    }
}


//expects correct table html and the parent element
function createTableElements(tbl,parent) {
    const parentElement = document.querySelector(parent);
    const myDiv = document.createElement("div");

    if(parent == ".main-schedule" ) {
        myDiv.className = ("main-courses-table");
    }
    if(parent == ".alternate-schedule") {
        myDiv.className = ("alternate-courses-table");
    }
    if(parent == "#section-two"){
        myDiv.className = ("course-table");
    }

    myDiv.innerHTML = tbl;
    parentElement.appendChild(myDiv);
    return parentElement;
}

//appends a row to the main courses list or alternative courses list
function appendToCurrentTable(tbl,parent) {

    const parentElement = document.querySelector(parent);
    const tableBody = parentElement.childNodes[0].childNodes[1];

    //this perserves event listeners
    tableBody.insertAdjacentHTML('beforeend', tbl);
    return tableBody;

}

//attaches json to all table elements populated by course search
function attachJsonToRow(jsonData,tableBody) {

    const numTables = tableBody.children.length;

    for(let i = 0; i < jsonData.length; i++){
        tableBody.children[numTables-1].children[0].children[3].children[i].children[8].children[0].children[0].data = jsonData[i];    
    }
    
}

//used to add event listeners to alternate courses btn, main courses btn, remove btn, 
//queries for all elements based on the class or id. Also needs the function to be handled by the event
function addEventListeners(element,eventHandlerName) {

    let allElements = document.querySelectorAll(element);
    for(let i=0;i<allElements.length;i++) {
        allElements[i].addEventListener('click',eventHandlerName);
    }

}

function addCourseToMainList(e) {
    
    if(mainCourses.length >= 10){
        alert("You cannot add more than 10 classes to your main schedule");
    }
    else{
        let selectedClass = e.target.data;
    
    //add course to mainList if no classes exist
    if(selectedClass.seatsAvailable > 0){

        if(numMainCourses == 0) {
            mainCourses.push(selectedClass);
            numMainCourses++;
            createAlert("Course added to your main schedule");
            insertTableData(selectedClass,"main-schedule",numMainCourses);  
            if(e.path[8].id == "section-four"){
                        
                removeCourse(e,"alternate-courses");
            }
        }
    
        //compare mainCourses list to see if the class already exists
        else{

            let courseIsPresent = checkIfCourseExists(selectedClass,"main-courses");
            //check if there any seats available
            if(courseIsPresent == false) {
                let courseConflict;
                if(courseConflict = checkIfCourseConflicts(selectedClass) == false){
                    //if the button was pressed on the alternate table we need to remove that row from the table as well      
                    mainCourses.push(selectedClass);
                    numMainCourses++;
                    createAlert("Course added to your main schedule");
                    if(e.path[8].id == "section-four"){
                        
                        removeCourse(e,"alternate-courses");
                    }
                    insertTableData(selectedClass,"main-schedule",numMainCourses);  
                }
            }
        }
    }
    else {
        createAlert("There are no seats available for this class");
    }
}
    

    //if the class conflicts, ask the user if they want to send it to the alternative list
    //limit classes to 8 at a time
}

function addCourseToAlternateList(e) {

    let selectedClass;

    if(alternateCourses.length >= 10){
        createAlert("You cannot add more than 10 class to your alternative list");
    }
    else{
        if(e.target.data == null) {
            selectedClass = e.target.parentElement.parentElement.children[0].children[0].data;
        }
        else {
            selectedClass = e.target.data;    
        }
    
        if(numAlternativeCourses == 0) {
            alternateCourses.push(selectedClass);
            numAlternativeCourses++;
            createAlert("Course added to your alternative schedule");
            insertTableData(selectedClass,"alternate-schedule",numAlternativeCourses);    
        }
        else{
            let courseIsPresent = checkIfCourseExists(selectedClass,"alternate-courses");
            if(courseIsPresent == false) {
                alternateCourses.push(selectedClass);
                numAlternativeCourses++;
                createAlert("Course added to your alternative schedule");
                insertTableData(selectedClass,"alternate-schedule",numAlternativeCourses);  
            }
        }
    
        //if the button was pressed on the main table we need to remove that row from the table as well
        if(e.path[8].id == "section-three"){
            removeCourse(e,"main-courses");
        }
    }
    
}

function checkIfCourseExists(selectedClass,whichTable) {
    let doesClassExist = false;

    if(whichTable == "main-courses"){
        for(let i = 0; i < mainCourses.length; i++) {
            if(mainCourses[i].courseID == selectedClass.courseID){
                    createAlert("This course already exists in your schedule");
                    doesClassExist = true;
                    break;
            }
        }
    }
    
    if(whichTable == "alternate-courses"){
        for(let i = 0; i < alternateCourses.length; i++) {
            if(alternateCourses[i].courseID == selectedClass.courseID){
                    createAlert("This course already exists in your schedule");
                    doesClassExist = true;
                    break;
            }
        }
    }

    return doesClassExist;
}

function checkIfCourseConflicts(selectedClass) {
    //if course is on same day and at the same time
    let doesClassConflict = false;    

    //letiables for comparing the current class to the classes already in the main schedule
    let selectedClassStartTime = "";
    let selectedClassEndTime = "";
    let newSelectedClassStartTime = ""
    let newSelectedClassEndTime = ""
    let comparingClassStartTime = "";
    let comparingClassEndTime = "";
    let newComparingClassStartTime = "";
    let newComparingClassEndTime = "";
    let comparingClass = "";
    let sameDay = false;
    let daysCharacter = "";

    for(let i = 0; i < mainCourses.length; i++) {
        //check to see if course takes place on the same day
        comparingClass = mainCourses[i];
        for(let j=0; j < comparingClass.days.length; j++){
            
            daysCharacter = comparingClass.days.charAt(j);
            if(selectedClass.days.includes(daysCharacter) == true || selectedClass.days == ""){
                sameDay = true;
                break;
            }
        }

        if(sameDay == true){
            //compare the times of the classes
            if(selectedClass.times == ""){
                console.log("hitting this");
                return doesClassConflict;
            }
            else if(comparingClass.times == ""){
                console.log("compare next item");
            }
            else{
                //strip off "-" and get times before and after "-"
                selectedClassStartTime = selectedClass.times.substr(0,selectedClass.times.indexOf("-"));
                selectedClassEndTime = selectedClass.times.split('-')[1];
                comparingClassStartTime = comparingClass.times.substr(0,mainCourses[i].times.indexOf("-"));
                comparingClassEndTime = comparingClass.times.split('-')[1];

                //convert each time to military time
                newSelectedClassStartTime = convertToMilitaryTime(selectedClassStartTime);
                newSelectedClassEndTime = convertToMilitaryTime(selectedClassEndTime);
                newComparingClassStartTime = convertToMilitaryTime(comparingClassStartTime);
                newComparingClassEndTime = convertToMilitaryTime(comparingClassEndTime);

                if(newSelectedClassEndTime >= newComparingClassStartTime && newSelectedClassEndTime <= newComparingClassEndTime) {
                    alert(selectedClass.title + " at " + selectedClass.times + " conflicts with " + comparingClass.title + " at " + comparingClass.times);
                    doesClassConflict = true;
                    return doesClassConflict;
                }
                else if(newSelectedClassStartTime >= newComparingClassStartTime && newSelectedClassStartTime <= newComparingClassEndTime) {
                    alert(selectedClass.title + " at " + selectedClass.times + " conflicts with " + comparingClass.title + " at " + comparingClass.times);
                    doesClassConflict = true;
                    return doesClassConflict;
                }
            }   
        }
    }
    return doesClassConflict;
}

//function to convert a standard time string to military time. Strings need to be formated like "8:00 AM"
function convertToMilitaryTime(timeString){
    let d = new Date("1/1/2013 " + timeString); 
    newTime = d.getHours() + ':' + d.getMinutes(); 
    newTime = newTime.replace(":","");
    return newTime;
}

//removes the element from the dom
function removeCourse(e, fromCourse="none") {
    
    let removedCourse = e.target.parentElement.parentElement.children[1].children[0].data;

    //if remove button was clicked on main table
    if(e.path[8].id == "section-three" && fromCourse == "none"){
      //  console.log("removing course from main");
        numMainCourses--;
        findAndRemoveCourse(removedCourse,"main-courses");
    }

    //if remove button was clicked on alternate table
    if(e.path[8].id == "section-four" && fromCourse == "none"){ 
        
        numAlternativeCourses--;
        findAndRemoveCourse(removedCourse,"alternate-courses");

    }

    //deduct 1 from the total alternative courses when a course is added from the alternative courses to main courses
    else if(e.path[8].id == "section-four" && fromCourse == "alternate-courses"){
    
        numAlternativeCourses--;
        findAndRemoveCourse(removedCourse,"alternate-courses");

    }

    else if(e.path[8].id == "section-three" && fromCourse == "main-courses"){
        
        numMainCourses--;
        findAndRemoveCourse(removedCourse,"main-courses");

    }

    const element = e.target.parentElement.parentElement.parentElement;
    const parent = element.parentElement;
    parent.removeChild(element);
    const tableColumns = parent.parentElement.parentElement;
    const tableSection = tableColumns.parentElement;

    //get rid of the table columns
    if(numMainCourses == 0 && e.path[8].id == "section-three"){
        tableSection.removeChild(tableColumns);
    }
    if(numAlternativeCourses == 0 && e.path[8].id == "section-four") {
        tableSection.removeChild(tableColumns);
    }
}

function findAndRemoveCourse(courseToRemove,whichTable){
    
    if(whichTable == "main-courses") {
        for(let i = 0; i < mainCourses.length; i++) {
            if(mainCourses[i].courseID == courseToRemove.courseID){
                mainCourses.splice(i,1);
                break;
            }
        }
    }

    if(whichTable == "alternate-courses") {
        
        for(let i = 0; i < alternateCourses.length; i++) {
            if(alternateCourses[i].courseID == courseToRemove.courseID){
                
                alternateCourses.splice(i,1);
                break;
            }
        }
    }
}

//this function will either hide the table or show the table
function tableDisplay(element, value) {
    const elem = document.getElementsByClassName(element);
    elem[0].style.display = value;
}

function createPrintButton() {
    //create a print button
    const weekGlanceHeader = document.querySelector(".section-five-header");
    //remove it from the dom first because it might already be there
    let  printBtn = document.querySelector(".printBtn");
    
    //idk why i had to do it like this but no time to think of a better way
    if(printBtn == null)
        createIt();
    else{
        removeIt();
        createIt();
    }    

    function removeIt(){
        weekGlanceHeader.removeChild(printBtn)
    }

    function createIt(){
        printBtn = document.createElement("div");
        printBtn.className = "printBtn";
        printBtn.innerHTML = "<a href='#'>Print</a>"
        printBtn.addEventListener("click",printFunc);
        weekGlanceHeader.appendChild(printBtn);
    }    
}

//function to print the week at a glance 
function printFunc(e){

    e.preventDefault();

    if(window.confirm("Printing your schedule will cause the page to refresh and your courses will be gone. Are you ready to print?") == true){
        const printBtn = document.querySelector(".printBtn");
        printBtn.style.display = "none";
        const printDiv = document.querySelector("#print").innerHTML;
        const oldHTML = document.body.innerHTML;

        //Reset the pages HTML with divs HTML only
        document.body.innerHTML = 
        "<html><head><title></title></head><body>" + 
        printDiv + "<br></br><span>Advisor:_______________________________________   Date:________</span></body>";

        //print the page
        window.print();

        //reload the page
        document.location.reload(true);
    }
}

function createAlert(message) {
    alert(message);
}
//created by cameron casselman
//main script to control http requests and course scheduling information

//These global vars are kind of a hack for controlling the amount of classes everytime an event is called
//I could have implemented an object with a static variable containing #classes
let numMainCourses = 0;
let numAlternativeCourses = 0;
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
    for(i=0; i<subj.length; i++) {
        addCheckBoxInput(subj[i])
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
   // getCheckedAttributes();    
}

//returns array of ids from checked boxes
function getCheckedSubjects() {
    let subjectsArray = [];
    const subjectsContainer = document.querySelector('#getSubjects');
    var checkboxes = subjectsContainer.querySelectorAll('input[type=checkbox]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
      subjectsArray.push(checkboxes[i].id);
    }
    return subjectsArray;
}

function checkAllSubjects(e) {
    const subjectsContainer = document.querySelector("#getSubjects");
    let checkboxes = subjectsContainer.querySelectorAll("input[type=checkbox]");
    if(e.checked) {
        for(i = 0; i < checkboxes.length; i++) {
            changeCheckBox(checkboxes[i],true);
        }
    }
    else {
        for(i = 0; i < checkboxes.length; i++) {
            changeCheckBox(checkboxes[i],false);
        }
    }
}



function noAttributes(e) {
    const attributesContainer = document.querySelector("#getAttributes");
    let checkboxes = attributesContainer.querySelectorAll("input[type=checkbox]");

    if(e.checked) {
        for(i = 0; i < checkboxes.length; i++) {
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
    var checkboxes = attributesContainer.querySelectorAll('input[type=checkbox]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
      attributesArray.push(checkboxes[i].id);
    }
    return attributesArray;
}

function getClassesRequest(subjects, attributes) {
    const url = "http://localhost:3000/getClasses";
    //console.log(JSON.stringify(subjects));
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
            var count = 0;

            //find which classes are returned and build an array of subjects
            //we need to do this because not all subjects have classes
             
            for(var i=0; i<courses.length; i++){
                                
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
            for(var i = 0; i < courses.length; i++) {
    
                subjectsArray.push(courses[i]);
                
                if(i != courses.length -1){
            
                    console.log("next course depID " + courses[i+1].departmentID + " next subject " + newSubjects[count+1])
                    if(courses[i+1].departmentID == newSubjects[count+1]) {
                    //append subjectsArray to all courses
                       // console.log(courses[i]);
                        count++;
                        var clone = subjectsArray.slice(0);
                        allCourses.push(clone);
                        subjectsArray.length = 0;                         
                    //             insertTableData(newArray);
                    }
                }
                else{
                    var clone = subjectsArray.slice(0);
                    allCourses.push(clone);
                }
            }  
            console.log(allCourses);
            for(var i=0; i < allCourses.length;i++) {
               // console.log("course " + i);
                //console.log(allCourses[i]);
                insertTableData(allCourses[i],"course-search");  
            }
        }
    });
}

//removes all elements with a specifc class name. In this case it will work with the class search table
function removeTableElements(parentElement,childElement) {
    const tableElements = document.querySelectorAll(childElement);
    if(tableElements.length !=0) {
        for(i=0;i<tableElements.length;i++) {
            const parent = document.querySelector(parentElement);
            const child = document.querySelector(childElement);
            // if((parent !== null)&&(child !== null))
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
        for(var i=0; i < jsonData.length; i++) {
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
                    
                    tbl += '<span class="btn_main"> <a href="#javascript:void(0)" row_id="'+ i +'" class ="btn btn-link">Add to Main</a></span>';
                    tbl += '<span class="btn_alternate"> <a href="#javascript:void(0)" row_id="'+ i +'" class ="btn btn-link">Alternative List</a></span>';
    
                tbl += '<td>';  
    
            tbl += '</tr>';  
        }
        tbl +='</tbody>';
    }
    
    //only one row is passed so we can't use iteration
    else {
        tbl += '<tr class="rows">';
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
                    tbl += '<span class="btn_remove"> <a href="#javascript:void(0)" class ="btn btn-link">Remove</a></span>';
                    tbl += '<span class="btn_alternate"> <a href="#javascript:void(0)" class ="btn btn-link">Alternative List</a></span>';
                }
                if(whichTable == "alternate-schedule") {
                    tbl += '<span class="btn_remove"> <a href="#javascript:void(0) class ="btn btn-link">Remove</a></span>';
                    tbl += '<span class="btn_main"> <a href="#javascript:void(0) class ="btn btn-link">Main List</a></span>';
                }
        
            tbl += '<td>';  

        tbl += '</tr>';
    }    
    
    //this function adds the tbl variable to the dom
    if(whichTable == "course-search")
        createTableElements(tbl,"#section-two"); 
    
    if(whichTable == "main-schedule") {
        if (numCourses > 1) {
            appendToCurrentTable(tbl,".main-courses-table")
        }
        else {
            createTableElements(tbl,".main-schedule"); 
        }
    }
     
    if(whichTable == "alternate-schedule")
        createTableElements(tbl,".alternate-schedule"); 
            
    //store json in a data object stored for each row element.
    //I do this for easier data manipulation when passing data between tables
    if(whichTable == "course-search") {
        for(var i = 0; i < jsonData.length; i++){
            //pass row id and json
            attachJsonToRow(i, jsonData[i]);
        }
        
        //add event listeners for course-search table
        //add event listeners to the main courses btn
        addEventListeners(".btn_main",addCourseToMainList);
        //add even listeners to the alternate courses btn
        addEventListeners(".btn_alternate",addCourseToAlternateList);
    }

    //add event listeners for main-schedule table
    if(whichTable == "main-schedule") {
        //add event listeners to the remove btn
        addEventListeners(".btn_remove",removeCourse);
        //add even listeners to the alternate courses btn
        addEventListeners(".btn_alternate",addCourseToAlternateList);
    }

    //add event listeners for alternate-schedule table
    if(whichTable == "alternate-schedule") {
        //add event listeners to the remove btn
        addEventListeners(".btn-remove",removeCourse);
        //add even listeners to the main courses btn
        addEventListeners(".btn_main",addCourseToMain);
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
        myDiv.className = ("alternative-courses-table");
    }
    if(parent == "#section-two"){
        myDiv.className = ("course-table");
    }

    myDiv.innerHTML = tbl;
    parentElement.appendChild(myDiv);
}

//appends a row to the main courses list or alternative courses list
function appendToCurrentTable(tbl,parent) {
    const parentElement = document.querySelector(".main-courses-table");
    const tableBody = parentElement.childNodes[0].childNodes[1];
    //const textNode = document.createTextNode(tbl);
    //this perserves event listeners
    tableBody.insertAdjacentHTML('beforeend', tbl);
}

function attachJsonToRow(rowID, jsonData) {
    //get all elemenets with row class (should be everything populated from the class search)
    const element = document.querySelectorAll(".rows");
    let found = false
    let count = 0;    
   //this loop will find the element with the correct id then we place json data inside the data dom element
    while(!found) {
    
        if(element[count].getAttributeNode("row_id").value == rowID){
            element[count].children[8].children[0].children[0].data = jsonData;
            found = true;
        }
        else {
            count++;
        }
    }
}

//used to add event listeners to alternate courses btn, main courses btn, remove btn, 
//queries for all elements based on the class or id. Also needs the function to be handled by the event
function addEventListeners(element,eventHandlerName) {
    allElements = document.querySelectorAll(element);
    for(i=0;i<allElements.length;i++) {
        allElements[i].addEventListener('click',eventHandlerName);
    }
}

function addCourseToMainList(e) {
    numMainCourses++;
    jsonData = e.target.data;
    //display selected course in a table format
    insertTableData(jsonData,"main-schedule",numMainCourses);     
    //check to see if the class already exists or if it conflicts with another class existing in the schedule
    //store array containing class ids and compare each time a new class is sent
    //if the class conflicts, ask the user if they want to send it to the alternative list
    //if same class is present send alert
    //limit classes to 8 at a time
}

function addCourseToAlternateList(e) {
    console.log("did this even work");
   //if the same class is already present in the table send alert
}

function removeCourse(e) {
    console.log(e);
    //console.log("course removed");
}
//removes an element from the document
function removeElement(parentElement,elementId) {
    const parent = document.querySelector(parentElement);
    const child = document.querySelector(".course-table");
   // if((parent !== null)&&(child !== null))
    parent.removeChild(child);
}

    //this function will either hide the table or show the table
function tableDisplay(element, value) {
    const elem = document.getElementsByClassName(element);
    elem[0].style.display = value;
}


function createAlert(message) {
    alert(message);
}
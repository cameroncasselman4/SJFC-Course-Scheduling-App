//created by cameron casselman
//main script to control http requests and course scheduling information
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
        //pass the json blob into a fucntion to format the table
        
        //remove previous table
        removeTableElements("#section-two",".course-table");
        
     //   console.log(courses);
        if(courses.length < 1)
            createAlert("No classes returned with that combination");
        else  {
            let allCourses = [];
            let subjectsArray = [];
            var count = 0;
            //create a table for each subject selected
            //console.log(courses); 
            //ceate an array of arrays for each subject
            //append new arrays containing table information about specific subject

            for(i = 0; i < courses.length; i++) {
    
                subjectsArray.push(courses[i]);
                
                if(i != courses.length -1){
            
                 //   console.log(count);
                    if(courses[i+1].departmentID == subjects[count+1]) {
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
            //console.log(allCourses);
            for(var i=0;allCourses.length;i++) {
                console.log("course " + i);
                console.log(allCourses[i]);
                insertTableData(allCourses[i]);  
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
function insertTableData(jsonData){
    
    //--->create data table > start
    let tbl = '';
    tbl +='<table class="table table-hover">'

        //--->create table header > start
        tbl +='<thead>';
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
            tbl +='<th>Main/Alternate</th>';
            tbl +='</tr>';
        tbl +='</thead>';
        //--->create table header > end

    //populate body with json
    tbl +='<tbody>';
    for(var i=0; i < jsonData.length; i++) {
        tbl += '<tr row_id="'+ i +'">';
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
    
    //this function adds the tbl variable to the dom
    createTableElements(tbl); 
    
    //add event listeners to the main courses btn
    addEventListeners(".btn_main",addCourseToMainList);
    //add even listeners to the alternate courses btn
    addEventListeners(".btn_alternate",addCourseToAlternateList);
    
}

function createTableElements(tbl) {
    parentElement = document.querySelector("#section-two");
    myDiv = document.createElement("div");
    myDiv.className = ("course-table");
    myDiv.innerHTML = tbl;
    parentElement.appendChild(myDiv);
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
    //console.log(e);
}

function addCourseToAlternateList(e) {
   // console.log("did this even work");
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
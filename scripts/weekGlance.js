'use strict';

//WeekGlance js will organize all the main courses into days of the week
//we then call the Display day componenet for each day of the week to display the students agenda

//const e = React.createElement;

function timeSort(props) {

    //perform bubble sort on the array
    for(var i = 1; i < props.length; i++){
        for(var j =0; j < props.length-1; j++){
            //we only care about the starting times for each class
            var firstTime = props[j].times.substr(0,props[j].times.indexOf("-"));
            var secondTime = props[j+1].times.substr(0,props[j+1].times.indexOf("-"));

            //strip off the PM or AM and : so we can just have a number to compare with the time
            if(firstTime.includes("PM"))
                var fristTimeNum = firstTime.replace(':',"").replace('PM',"");
            else
                var fristTimeNum = firstTime.replace(':',"").replace('AM',"") 
            
            if(secondTime.includes("PM"))
                var secondTimeNum = secondTime.replace(':',"").replace('PM',"");
            else
                var secondTimeNum = secondTime.replace(':',"").replace('AM',"") 
            
            //console.log("First number  without colon ", fristTimeNum);
            //console.log("Second number  without colon ", secondTimeNum);

            //parse object's time to cut off everything after "-"
            //if first class is pm and second class is am swap

            if(firstTime.includes("PM") && secondTime.includes("AM")){
                console.log("swapping AM and PM");
                swap(j,j+1);
            }
            else if(firstTime.includes("PM") && secondTime.includes("PM")){
                if(fristTimeNum > secondTimeNum){
                    console.log("swapped two PMs");
                    swap(j,j+1);
                }
            }
            else if(firstTime.includes("AM") && secondTime.includes("AM")){
                if(fristTimeNum > secondTimeNum){
                    console.log("swapped two AMs");
                    swap(j,j+1);
                }
            }
            //sometimes there might not be a time. In this case we want to push it ot the ned of the array
            else if(props[j].times == ""){
                console.log("swapped a class without a time");
                swap(j,j+1);
            }
        }
    }

    console.log("after");
    console.log(props);
    
    function swap(a,b) {
        let temp = props[a];
        props[a] = props[b];
        props[b] = temp;
    }
}

class DisplayDay extends React.Component {

    render() {

        if(this.props.data.length > 1 && this.props.day != "Other")
            timeSort(this.props.data);
        //console.log(this.props.day)
        return (
            <h1>{"hello world"}</h1>
        );
    }
}

const weekGlanceBtn = document.querySelector("#weekGlance_btn");
weekGlanceBtn.addEventListener("click",renderWeekGlance);


//this function organizes main courses into an array of 5 separate arrays
function renderWeekGlance() {

    if(mainCourses < 1) {
        createAlert("You must have at least one course to view your weekly agenda");
    }
    else {
        let weekDayArray = [];
        let monday = [];
        let tuesday = [];
        let wednesday = [];
        let thursday = [];
        let friday = [];
        let other = [];
    
        for(var i = 0; i<mainCourses.length; i++){
            //check to see which days each class fall under
            let day = mainCourses[i].days;

            if(day.includes("M")||day.includes("T")||day.includes("W")||day.includes("R")||day.includes("F")){

                if(day.includes("M")){
                    monday.push(mainCourses[i]);
                }
                if(day.includes("T")){
                    tuesday.push(mainCourses[i]);
                }
                if(day.includes("W")){
                    wednesday.push(mainCourses[i]);
                }
                if(day.includes("R")){
                    thursday.push(mainCourses[i]);
                }
                if(day.includes("F")){
                    friday.push(mainCourses[i]);
                }
            }
            else {
                other.push(mainCourses[i]);
            }
            
        }

        weekDayArray.push(monday);
        weekDayArray.push(tuesday);
        weekDayArray.push(wednesday);
        weekDayArray.push(thursday);
        weekDayArray.push(friday);
        if(other.length > 0) {
            weekDayArray.push(other);
        }
        //console.log(weekDayArray);
        //left off on adding tuesday
        const domContainer = document.querySelector('#weekGlance_container');
        ReactDOM.render(
            <div>
                <DisplayDay key="monday" data={weekDayArray[0]} day="Monday"/>
                <DisplayDay key="tuesday" data={weekDayArray[1]} day="Tuesday"/>
            </div>,
            
            //<DisplayDay data={weekDayArray[2]} day="Wednesday"/>,
            //<DisplayDay data={weekDayArray[3]} day="Thursday"/>,
            //<DisplayDay data={weekDayArray[4]} day="Friday"/>,
            //<DisplayDay data={weekDayArray[5]} day="Other"/>,
            domContainer
        );
    }
}
'use strict';

//WeekGlance js will organize all the main courses into days of the week
//we then call the Display day componenet for each day of the week to display the students agenda

//const e = React.createElement;

function timeSort(props) {
    console.log("before");
    console.log(props);

    //perform bubble sort on the array
    // for(var i = 1; i < props.length; i++){
    //     for(var j =0; j < props.length-1; j++){
    //         //we only care about the starting times for each class
    //         var firstTime = props[j].times.substr(0,props[j].times.indexOf("-"));
    //         var secondTime = props[j+1].times.substr(0,props[j+1].times.indexOf("-"));
    //         //parse object's time to cut off everything after "-"
    //         console.log(firstTime);
    //         console.log(secondTime);
    //         //if first class is pm and second class is am swap
    //         if(firstTime.includes("PM") && secondTime.includes("AM")){
    //             console.log("swap");
    //             swap(j,j+1)
    //         }
    //     }
    // }

    console.log("after");
    console.log(props);

    function swap(a, b) {
        let temp = props[a];
        props[a] = props[b];
        props[b] = temp;
    }
}

class DisplayDay extends React.Component {

    render() {

        if (this.props.data.length > 1 && this.props.day != "Other") timeSort(this.props.data);
        //console.log(this.props.day)
        return React.createElement(
            "h1",
            null,
            "hello world"
        );
    }
}

const weekGlanceBtn = document.querySelector("#weekGlance_btn");
weekGlanceBtn.addEventListener("click", renderWeekGlance);

//this function organizes main courses into an array of 5 separate arrays
function renderWeekGlance() {

    if (mainCourses < 1) {
        createAlert("You must have at least one course to view your weekly agenda");
    } else {
        let weekDayArray = [];
        let monday = [];
        let tuesday = [];
        let wednesday = [];
        let thursday = [];
        let friday = [];
        let other = [];

        for (var i = 0; i < mainCourses.length; i++) {
            //check to see which days each class fall under
            let day = mainCourses[i].days;

            if (day.includes("M") || day.includes("T") || day.includes("W") || day.includes("R") || day.includes("F")) {

                if (day.includes("M")) {
                    monday.push(mainCourses[i]);
                }
                if (day.includes("T")) {
                    tuesday.push(mainCourses[i]);
                }
                if (day.includes("W")) {
                    wednesday.push(mainCourses[i]);
                }
                if (day.includes("R")) {
                    thursday.push(mainCourses[i]);
                }
                if (day.includes("F")) {
                    friday.push(mainCourses[i]);
                }
            } else {
                other.push(mainCourses[i]);
            }
        }

        weekDayArray.push(monday);
        weekDayArray.push(tuesday);
        weekDayArray.push(wednesday);
        weekDayArray.push(thursday);
        weekDayArray.push(friday);
        if (other.length > 0) {
            weekDayArray.push(other);
        }
        console.log(weekDayArray);

        const domContainer = document.querySelector('#weekGlance_container');
        ReactDOM.render(React.createElement(DisplayDay, { data: weekDayArray[0], day: "Monday" }), domContainer);
    }
}
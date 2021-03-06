'use strict';
//WeekGlance js will organize all the main courses into days of the week
//we then call the Display day componenet for each day of the week to display the students agenda

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
                var fristTimeNum = firstTime.replace(':',"").replace('AM',""); 
            
            if(secondTime.includes("PM"))
                var secondTimeNum = secondTime.replace(':',"").replace('PM',"");
            else
                var secondTimeNum = secondTime.replace(':',"").replace('AM',"") 
            
            //parse object's time to cut off everything after "-"
            //if first class is pm and second class is am swap

            if(firstTime.includes("PM") && secondTime.includes("AM")){
                swap(j,j+1);
            }
            else if(firstTime.includes("PM") && secondTime.includes("PM")){
                if(fristTimeNum > secondTimeNum){
                    swap(j,j+1);
                }
            }
            else if(firstTime.includes("AM") && secondTime.includes("AM")){
                if(fristTimeNum > secondTimeNum){
                    swap(j,j+1);
                }
            }
            //sometimes there might not be a time. In this case we want to push it ot the ned of the array
            else if(props[j].times == ""){
                swap(j,j+1);
            }
        }
    }
    
    function swap(a,b) {
        let temp = props[a];
        props[a] = props[b];
        props[b] = temp;
    }
    return props;
}

class DisplayDay extends React.Component {

    buildUI(){

        let classesArray = this.props.data;
        let currentDay = this.props.day;

        if(classesArray.length > 1 && currentDay != "Other")
            //time will sort the classes in order from earliest to latest
            classesArray = timeSort(this.props.data);

        let renderData = [];

        if(classesArray.length == 0){
            renderData.push(<div className="week-glance-row" key={currentDay}><h4>No Classes</h4></div>);
        }

        else{
            for(var i=0; i<classesArray.length; i++){

                if(classesArray[i].times == "")
                    renderData.push(<div className="week-glance-row" key={classesArray[i].title}><h4>{classesArray[i].title}</h4></div>);
                else    
                    renderData.push(<div className="week-glance-row" key={classesArray[i].title}><h4>{classesArray[i].times} <strong> | </strong> {classesArray[i].title}</h4></div>);
            }
            //renderData.push(<div className="week-glance-row" key={totalCredits}><h4>Total credits: {totalCredits}</h4></div>);
        }
        return renderData;
    }

    render() {
        return ( 
            <div className="day-container">
                <div className="day-header">
                    <h3>{this.props.day}</h3>
                </div>
                <div className="display-courses">
                    {this.buildUI()}
                </div>
            </div>
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
        //hide message
        const weedGlanceMessage =  document.querySelector(".week-glance-message");
        weedGlanceMessage.style.display = "none";

        createPrintButton();

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
        weekDayArray.push(other);
        
        function renderData() {
            let renderData = [];
            let keyName;
            let dataLocation;
            
            //creating react dom elements
            for(var i=0; i < 5; i++) {
                switch(i) {
                    case 0:
                        keyName = "Monday"
                        dataLocation = weekDayArray[i]
                        break;
                    case 1:
                        keyName = "Tuesday";
                        dataLocation = weekDayArray[i]
                        break;    
                    case 2:
                        keyName = "Wednesday";
                        dataLocation = weekDayArray[i]
                        break;
                    case 3:
                        keyName = "Thursday";
                        dataLocation = weekDayArray[i]
                        break;
                    case 4:
                        keyName = "Friday";
                        dataLocation = weekDayArray[i]
                        break;                   
                }

                renderData.push(<DisplayDay key={keyName} data={dataLocation} day={keyName}/>)
            }
            
            //we need to push one more element if the user is taking classes without a day/time
            if(other.length > 0){
                renderData.push(<DisplayDay key="Other" data={weekDayArray[5]} day="Other"/>);
            }
            return renderData;
        }
        
        const domContainer = document.querySelector('#weekGlance_container');
        ReactDOM.render(
            <div id="week-glance-container">
                {renderData()}
            </div>,
            domContainer
        );
    }
}
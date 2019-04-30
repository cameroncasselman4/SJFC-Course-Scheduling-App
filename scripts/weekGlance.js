'use strict';

//WeekGlance js will organize all the main courses into days of the week
//we then call the Display day componenet for each day of the week to display the students agenda

//const e = React.createElement;

import DisplayDay from "./DisplayDay";

const domContainer = document.querySelector('#weekGlance_container');

ReactDOM.render(
  <DisplayDay items={"hello world"}/>,
  domContainer
);


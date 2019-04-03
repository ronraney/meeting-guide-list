
//Helper functions
//This one creates an HTML element using an html tag name for argument
function createNode(element) {
    return document.createElement(element);
}
//This one appends to the element using the element type and a variable as arguments
function append(parent, el) {
  return parent.appendChild(el);
}

//Helper variables
let meetings; //Placeholder for all JSON data
let numOfMeetings; //Placeholder for user input
const numBox = document.getElementById('number-of-meetings');
const ul = document.getElementById('meetings');
const url = 'http://aa-ksdist23.org/wp/wp-admin/admin-ajax.php?action=meetings';
const start = new Date();

//set some event listeners
numBox.addEventListener('change', e => {
  e.preventDefault();
  buildMeetings();
});

document.getElementById('go').addEventListener('click', e => {
  e.preventDefault();
  buildMeetings();
});

const today = start.getDay();
const weekdays = new Array(7); //Create an array to use for rendering day index
  weekdays[0]="Sunday";
  weekdays[1]="Monday";
  weekdays[2]="Tuesday";
  weekdays[3]="Wednesday";
  weekdays[4]="Thursday";
  weekdays[5]="Friday";
  weekdays[6]="Saturday";
const dayNow = weekdays[today];
const timeNow = start.toTimeString("hh/mm");

//Fetch the data
//Call the buildMeetings function
fetch(url)
.then((resp) => resp.json())
.then(function(data) {
  meetings = data; //A nice name for what the data is
  numBox.setAttribute('max', meetings.length)
  buildMeetings();
})
.catch(function(error) {
  console.log(JSON.stringify(error));
});
//This renders the list
function buildMeetings() {
  //the if statement may be unnecessary
  if(ul.hasChildNodes()){
    while(ul.hasChildNodes()){
      ul.removeChild(ul.lastChild);
    };
  };
  numOfMeetings = Number(numBox.value);
  let weekdayToday = weekdays[today]; //Parse the day number to a string
  return filterByNow().map(function(meeting) { //The data is an array so we can map it
    const meetingTime = meeting.time_formatted;
    const d = meeting.day;
    const meetingDay = weekdays[d];
    const li = createNode('li'), //For each item in the map, we create elements
        name = createNode('h2'),
        day = createNode('p'),
        time = createNode('p'),
        location = createNode('p'),
        region = createNode('p'),
        url = createNode('a');

    url.href = meeting.url;    //Assign the href to new element using JSON url
    //I love template literals. Just fucking love 'em
    name.innerHTML = `${meeting.name}`;  //Interpolation for each element
    day.innerHTML = `${meetingDay}`;
    time.innerHTML = `${meetingTime}`;
    location.innerHTML = `${meeting.location}`;
    region.innerHTML = `${meeting.region}`;
    url.innerHTML = `${meeting.url}`;

    //Append elements to li variable/element
    append(li, name);
    append(li, day);
    append(li, time);
    append(li, location);
    append(li, region);
    append(li, url);
    append(ul, li);
  })
};
//This is the magic
function filterByNow(){
  //This piece of code handles the stringiness of the JSON data and allows us to
  //compare real time to the meeting times
  const myTime = Number(`${start.getHours()}${start.getMinutes()}`)
  let nextMeetingIndex = meetings.findIndex(meeting => (Number(meeting.day)===today) && (Number(meeting.time.split(':').join('')))>myTime)
  // returns -1 if there are no more meetings that day
  // This conditional handles the turnaround from Saturday to Sunday (6 to 0)
  if(nextMeetingIndex===-1){
    if(today===6){
      nextMeetingIndex = 0;
    } else {
      nextMeetingIndex = meetings.findIndex(meeting => Number(meeting.day)===today+1)
    }
  }
  //Here we filter/pull the amount of meetings requested by user input value and return those
  let upcomingMeetings = meetings.slice(nextMeetingIndex, nextMeetingIndex+numOfMeetings);
  if(upcomingMeetings.length<numOfMeetings){
    upcomingMeetings=[...upcomingMeetings.concat(meetings.slice(0, numOfMeetings-upcomingMeetings.length))]
  }
  return upcomingMeetings;
};

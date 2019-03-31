
//Helper functions
function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

//Helper variables
const ul = document.getElementById('meetings');
const url = 'http://aa-ksdist23.org/wp/wp-admin/admin-ajax.php?action=meetings';
const start = new Date();

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

//const timeNow = start.toTimeString("hh/mm");

console.log(dayNow);
console.log(timeNow);

//Fetch, bitch
fetch(url)
.then((resp) => resp.json())
.then(function(data) {
  const meetings = data; //A nice name for what the data is
  let weekdayToday = weekdays[today]; //Parse the day number to a string

  return meetings.map(function(meeting) { //The data is an array so we can map it
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
})
.catch(function(error) {
  console.log(JSON.stringify(error));
});

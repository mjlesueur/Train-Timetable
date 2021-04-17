//hello, friend
$(document).ready(function () {

  //create var databse for general workings with firebase
  var database = firebase.database();

  //gather data when new train info is added
  database.ref().on("value", function (snapshot) {

    // when user clicks add train button
    $("#add-train-btn").on("click", function () {

      // convert user input to useable variables
      var trainName = $("#train-name-input").val().trim();
      var destination = $("#destination-input").val().trim();
      var firstTrainTime = $("#first-train-input").val().trim();
      var frequency = $("#frequency-input").val().trim();

      //object holds info for new train
      var newTrain = {
        name: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
      };

      //populate train info in firebase
      database.ref().push(newTrain);
      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.firstTrainTime);
      console.log(newTrain.frequency);

      //clear user input entry fields 
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#first-train-input").val("");
      $("#frequency-input").val("");

    })
  })


  //match webpage timetable with objects in firebase
  database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    //create variables that will hold entries to go in timetable
    var nameEntry = childSnapshot.val().name;
    console.log(nameEntry);
    var destinationEntry = childSnapshot.val().destination;
    console.log(destinationEntry);
    var frequencyEntry = childSnapshot.val().frequency;
    console.log(frequencyEntry);

    //---next arrival and minutes away will be dynmaic based on current time---//

    //variable to store first train time
    var tFirst = childSnapshot.val().firstTrainTime;

    //separate hour and minutes for use of yet to be declared variables
    var tSplit = tFirst.split(":");
    var tFirstHr = tSplit[0];
    var tFirstMin = tSplit[1];

    //minutes passed in the day for time of the first train
    var firstMinutes = (Number(tFirstHr) * 60) + Number(tFirstMin);

    //set of variables to allow working with minutes passed as of now
    var nowMilitary = (moment().format("HH:mm"));
    var nowSplit = nowMilitary.split(":");
    var nowHr = nowSplit[0];
    var nowMin = nowSplit[1];
    var nowMinutes = (Number(nowHr) * 60) + Number(nowMin);

    //difference between now and first train
    var minutesDiff = nowMinutes - firstMinutes;

    //difference between next train and now
    var minAwayEntry = (minutesDiff % Number(frequencyEntry));

    //set of variables that will determine the time the next train arrives
    var nextArrivalMinutes = (nowMinutes + minAwayEntry);
    var nextArrivalHr = Math.floor(nextArrivalMinutes / 60);
    var nextArrivalMin = Math.floor(nextArrivalMinutes % 60);
    var nextArrivalEntry = moment().hours(nextArrivalHr).minutes(nextArrivalMin).format("h:mm A");
    console.log(nextArrivalEntry);

    //append new train info as table data
    $("#timetable > tbody").append("<tr> <td>" + nameEntry + "</td> <td>" + destinationEntry + "</td> <td>" + frequencyEntry + "</td> <td>" + nextArrivalEntry + "</td> <td>" + minAwayEntry + "</td> </tr>");

  })

})
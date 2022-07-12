// Setting the app to start with the home screen
// Creating the timeChosen variable, which will determine how
// long the test will last
setScreen("homeScreen");
var timeChosen = "";

// Event for the more information button
onEvent("moreInfo", "click", function(){
  setScreen("informationScreen");
});

// Event for going back to the results screen
// From the information screen
onEvent("backButton", "click", function(){
  setScreen("resultsScreen");
});

// Event for going home from the results screen
onEvent("goHomeButton", "click", function(){
  setScreen("homeScreen");});

// Event for the thirty seconds test option
onEvent("30Seconds", "click", function(){
  timeChosen = 30;
  hideElement("60Seconds");
  hideElement("customTimeInput");
  hideElement("sixtySecondsLabel");
});

// Event for the sixty seconds test option
onEvent("60Seconds", "click", function(){
  timeChosen = 60;
  hideElement("30Seconds");
  hideElement("customTimeInput");
  hideElement("thirtySecondsLabel");
});

// Event for the custom time option  
onEvent("customTimeInput", "input", function(){
  timeChosen = getNumber("customTimeInput");
  console.log("You chose: " + timeChosen + " seconds");
  hideElement("30Seconds");
  hideElement("60Seconds");
  hideElement("thirtySecondsLabel");
  hideElement("sixtySecondsLabel");
});

// Event for going to the game screen
onEvent("startButton", "click", function(){
  setScreen("gameScreen");
});

// Event for starting the test
onEvent("playerAnswer", "click" , function(){
  hideElement("shortMessage");
  updateScreen();
  time(timeChosen);
});

// Function that will control the timer
var seconds = 0;

function time(timeChosen){
  var j = setInterval(function() {
    seconds = seconds + 1;
    setText("timer", seconds);
    console.log(seconds + " seconds have elapsed");
    if (seconds == timeChosen){
      setScreen("resultsScreen");
      results();
      clearInterval(j);
    }
  }, 1000);
}

// List of possible letters
var letterList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var totalQuestionsAsked = 0;
var computerAnswers = [];
// Function that will create new patterns
function updateScreen(){
  var letter1 = letterList[randomNumber(0,25)];
  var letter2 = letterList[randomNumber(0,25)];
  var letter3 = letterList[randomNumber(0,25)];
  var letter4 = letterList[randomNumber(0,25)];
  var letter5 = letterList[randomNumber(0,25)];
  var word = letter1 + letter2 + letter3 + letter4 + letter5;
  setText("patternDisplay", word);
  appendItem(computerAnswers, word);
  totalQuestionsAsked++;
}

// Event for submitting an answer
onEvent("playerAnswer", "keydown", function(event){
  if (event.key == "Enter"){
    var playerAnswer = getText("playerAnswer");
    appendItem(playerAnswers, playerAnswer);
    var checkWord = getText("patternDisplay");
    checkAnswer(playerAnswer, checkWord);
  }
});

// Function for checking the player's answer and displaying results
var totalAnswers = [];
var playerAnswers = [];
function checkAnswer(playerAnswer, checkWord){
  if (playerAnswer.toUpperCase() == checkWord.toUpperCase()) {
    appendItem(totalAnswers, 1);
    updateScreen();
    setText("playerAnswer", "");
  } else if (playerAnswer.toUpperCase() != checkWord.toUpperCase()){
    appendItem(totalAnswers, 0);
    updateScreen();
    setText("playerAnswer", "");
  }
}

// Variables for results
var correct = 0;
var wrong = 0;
var total = 0;
var wpm = 0;
var comparisonComment;
var advice;
var avgWpm = 40;
var accuracy = 0;
var accuracyComment;

function results() {
  
  // Loop that will traverse the total Answers list
  // To find the number of correct and wrong answers
  for (var i = 0; i < totalAnswers.length; i++){
    if (totalAnswers[i] == 1) {
      correct++;
    } else if (totalAnswers[i] == 0) {
      wrong++;
    }
  }
  
  // Find the total number of answers
  total = wrong + correct;
  
  // Finding the words per minute rate
  if (timeChosen == 30){
    wpm = total * 2;
  } else if (timeChosen == 60){
    wpm = total;
  } else {
    wpm = (total * 60) / timeChosen;
  }
  
  // Comparing wpm with avgWpm
  // Complimenting
  // Advice
  // Setting the corresponding image
  if (total == 0) {
    advice = "";
    comparisonComment = "";
  } else if (wpm < avgWpm){
      advice = "Try harder, you'll get it next time!";
      comparisonComment = "You type slower than the average person!";
  } else if (wpm > avgWpm){
      advice = "You don't need to practice!";
      comparisonComment = "Perfection! You type faster than the average person!";
  } else if (wpm == avgWpm){
      advice = "You might want to work a bit harder!";
      comparisonComment = "You type at the average speed!";
  }
  
  // Find the accuracy
  accuracy = (correct / totalQuestionsAsked) * 100;
  accuracy = Math.round(accuracy);
  
  // Accuracy comment
  if (total == 0) {
    accuracyComment = "You did not take the test.";
  } else if (correct < wrong) {
     accuracyComment = "You might want to work on accuracy!";
  } else if (correct > wrong) {
     accuracyComment = "You have great accuracy!";
  } else if (correct == wrong) {
     accuracyComment = "You're accuracy is ok.";
  } 
  
  // Displaying the results on the screen
  setText("resultsMessage", "Patterns Completed: " + total + "\nCorrect Answers: " + correct + "\nWrong Answers: " + wrong + "\nAccuracy: " + accuracy + "\nWPM: " + wpm + "\nQuestions Asked: " + totalQuestionsAsked);
  setText("commentsAdvice", comparisonComment + " " + advice + " " + accuracyComment);
}


// Given the Option of Correct only, Wrong only, and Both
// User chooses

onEvent("correct", "click", function(){
  showResultPreference("Correct");  
});

onEvent("wrong", "click", function(){
  showResultPreference("Wrong");
});

// Function for showing the correct or incorrect answers
function showResultPreference(whatToShow) {
 
 showElement("answerCheck");
 
 var setTextToShowCorrect = "";
 var setTextToShowWrong = "";
 
 if (whatToShow == "Correct") {
    for (var j = 0; j < computerAnswers.length; j++) {
      if ((computerAnswers[j] == playerAnswers[j]) && (totalAnswers[j] == 1)) {
        setTextToShowCorrect = setTextToShowCorrect + computerAnswers[j] + "\n";   
      }
    } 
    if(setTextToShowCorrect == "") {
      setProperty("answerCheck", "text", "No correct answers");
    } else {
      setProperty("answerCheck", "text", setTextToShowCorrect);
    }
 } else if (whatToShow == "Wrong") {
   for (var k = 0; k < computerAnswers.length; k++) {
     if (computerAnswers[k] != playerAnswers[k] && totalAnswers[k] == 0) {
       setTextToShowWrong = setTextToShowWrong + computerAnswers[k] + " --> You Entered: " + playerAnswers[k] + "\n";
     }
   }
   if (setTextToShowWrong == "") {
     setProperty("answerCheck", "text", "No wrong answers");
   } else {
    setProperty("answerCheck", "text", setTextToShowWrong);
   }
  }
}  
  
  

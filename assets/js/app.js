
// # questions variables
let Questions = [];
let currentQuestion = {};
let asked = 0;
let correct = 0;
let wrong = 0;
let skipped = 0;

// time related variables
const timeLimit = 30;
let timeRemain = 0;
const msBetweenQs = 10000; //5000;
var intervalId;

// sounds of the game (more below within questions)
const themeAudio = "theme.mp3";
const startAudio = "notafraid.wav";
// sound being played
let currentAudio = null;

function startGame(){
	// reset question variables
	currentQuestion = null;
	asked = 0;
	correct = 0;
	wrong = 0;
	skipped = 0;

	// shuffle questions
	Questions = GameQuestions.reduce(shuffle);

	// play intro sound
	playSound(startAudio);

	// ask the first question
	setTimeout(askQuestion, msBetweenQs);
}

function newGame(){
	// hide the splash screen and stop the theme from playing
	$("#splash-screen").hide(); 
	startGame();
}

function restartGame(){
	$("#game-over").hide(); // starting from game over screen
	startGame();
}

function updateTimeRemaining(){
	// update text for time remaining
	$("#time-remaining").html(`Time Remaining: ${timeRemain} seconds`);

	// update progress bar for time remaining
	var timePercent = Math.floor(timeRemain / timeLimit * 100);
	var progressBar = $(".progress-bar");
	progressBar.attr("aria-valuenow", timePercent);
	progressBar.css("width", timePercent+"%");
}

function tickSecond(){
	// update time remaining
	timeRemain--;
	updateTimeRemaining();

	// if no time left, question is skipped
	if (timeRemain <= 0){
		timeUp();
	}
}

function playSound(sound){
	// if sound variable is set
	if (sound != undefined){
		// if anything currently playing, stop it
		if (currentAudio != null){
			currentAudio.pause();
			currentAudio.currentTime = 0;
		}
		// play new sound
		currentAudio = new Audio("assets/sounds/" + sound);
		currentAudio.play();
	}
}

function showQuestionResult(){
	$("#correct-answer").html(currentQuestion.answer);

	// if there is a sound to play, play it
	playSound(currentQuestion.afterSound);

	$("#question-image").attr("src", "assets/images/" + currentQuestion.image);

	$("#current-question").hide();
	$("#question-result").show();

	if (asked >= Questions.length){
		$("#next-question").hide();
	} else {
		$("#next-question").show();
	}

	setTimeout(nextQuestion, msBetweenQs);	
}

function timeUp(){
	clearInterval(intervalId);

	// user ran out of time so show the answer
	skipped++;
	$("#question-score").html("Time's Up!");

	// if there is a sound to play, play it
	playSound(currentQuestion.wrongSound);

	showQuestionResult();
}

function selectAnswer(){
	clearInterval(intervalId);

	// determine if the answer selected was correct
	var correctAnswer = $(this).html() == currentQuestion.answer;
	if (correctAnswer){
		correct++;
		$("#question-score").html("Correct!");

		// if there is a sound to play, play it
		playSound(currentQuestion.rightSound);
	}
	else {
		wrong++;
		$("#question-score").html("Incorrect");

		// if there is a sound to play, play it
		playSound(currentQuestion.wrongSound);
 	}
	
 	showQuestionResult();
}

function gameOver(){
	// show game over screen
 	$("#question-result").hide();
 	$("#game-over").show();

  // Finds all iframes from youtubes and gives them a unique class
  $('iframe[src*="https://www.youtube.com/embed/"]').addClass("youtube-iframe");
  // add listener for restarting game to stop the video playing
  $("#restart-game").click(function() {
    // changes the iframe src to prevent playback or stop the video playback in our case
    $('.youtube-iframe').each(function(index) {
      $(this).attr('src', $(this).attr('src'));
      return false;
    });
    //click function
  });

 	// show game results
 	$("#game-results").html(`
	 	Correct: ${correct} <br/>
	 	Incorrect: ${wrong} <br/>
	 	Skipped: ${skipped} <br/>
 	`);
}

function nextQuestion(){
	// if out of questions, game over
	if (asked >= Questions.length){
		gameOver();
		return;
	}

	// ask the next question
	askQuestion();	
}

function askQuestion(){
	// select a question to ask
	currentQuestion = Questions[asked];
	asked++;

	// set question
	$("#question-asked").html(currentQuestion.question);
	
	// if there is a sound to play, play it
	playSound(currentQuestion.beforeSound);

	// add answer buttons
	$("#question-answers").empty();
	var answers = [currentQuestion.answer].concat(currentQuestion.wrongAnswers);
	for (answer of answers){
		// for each answer
		var answerButton = $("<button>");
		answerButton.attr("type", "button");
		answerButton.attr("class", "btn btn-link possible-answer");
		answerButton.html(answer);
		$("#question-answers").append(answerButton);
	}

	// sort answers in random order
	$("#current-question").randomize("#question-answers", ".possible-answer");

	// put events here 
	$(".possible-answer").on("click", selectAnswer);

	// reset timer
	timeRemain = timeLimit;
	updateTimeRemaining();

	// show question
	$("#question-result").hide();
	$("#current-question").show();

	// set interval
	intervalId = setInterval(tickSecond, 1000);
}

$(document).ready(function(){
	$(".inner-container").hide();
	playSound(themeAudio);
	$("#splash-screen").show();
	$("#start-game").click(newGame);
	$("#restart-game").click(restartGame);
})
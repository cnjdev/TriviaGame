
// # questions variables
var currentQuestion = {};
var asked = 0;
var correct = 0;
var wrong = 0;
var skipped = 0;

// time related variables
var timeLimit = 30; //30;
var timeRemain = 0;
var msBetweenQs = 5000; //5000;
var intervalId;

function startGame(){
	// reset question variables
	currentQuestion = null;
	asked = 0;
	correct = 0;
	wrong = 0;
	skipped = 0;

	// play intro sound
	var startAudio = new Audio("assets/sounds/notafraid.wav");
	startAudio.play();

	// ask the first question
	setTimeout(askQuestion, msBetweenQs);
}

function newGame(){
	$("#splash-screen").hide(); // starting from splash screen
	startGame();
}

function restartGame(){
	$("#game-over").hide(); // starting from game over screen
	startGame();
}

function updateTimeRemaining(){
	// update text for time remaining
	$("#time-remaining").html("Time Remaining: " + timeRemain + " seconds");

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

function showQuestionResult(){
	$("#correct-answer").html("The correct answer was: <br/><br/>" + currentQuestion.answer);

	$("#current-question").hide();
	$("#question-result").show();

	setTimeout(nextQuestion, msBetweenQs);	
}

function timeUp(){
	clearInterval(intervalId);

	// user ran out of time so show the answer
	skipped++;
	$("#question-score").html("Time's Up!");

	showQuestionResult();
}

function selectAnswer(){
	clearInterval(intervalId);

	// determine if the answer selected was correct
	var correctAnswer = $(this).html() == currentQuestion.answer;
	if (correctAnswer){
		correct++;
		$("#question-score").html("Correct!");
	} else {
		wrong++;
		$("#question-score").html("Incorrect");
 	}
	
 	showQuestionResult();
}

function gameOver(){
	// show game over screen
 	$("#question-result").hide();
 	$("#game-over").show();

 	// tabulate results
 	var gameResults = "";
 	gameResults += "Correct: " + correct + "<br/>";
 	gameResults += "Incorrect: " + wrong + "<br/>";
 	gameResults += "Skipped: " + skipped + "<br/>";
 	$("#game-results").html(gameResults);
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

var Questions = [{
	question: "Why do witches burn?",
	answer: "Because they're made of wood.",
	wrongAnswers: ["Because they're human.", "Because I said so.", "Because they seek the grail."]
}, {
	question: "Which warrior does King Arthur fight?",
	answer: "The Black Knight",
	wrongAnswers: ["The Dark Knight", "Batman", "That French guy"]
}, {
	question: "What... is your quest?",
	answer: "To seek the Grail.",
	wrongAnswers: ["To burn witches.", "To conquer Europe.", "To wear the Crown."]
}, {
	question: "What... is your favorite color?",
	answer: "Blue.",
	wrongAnswers: ["Blue... No, wait yellow.", "I'm not sure.", "What... is YOUR favorite color?"]
}, {
	question: "What... is the airspeed velocity of an unladen swallow?",
	answer: "African or European?",
	wrongAnswers: ["I don't know that.", "50 mph", "None."]
}, {	
	question: "What... is the capital of Assyria?",
	answer: "Nineveh",
	wrongAnswers: ["Damascus", "Alexandria", "Tyre"]
}, {
	question: "Which people does King Arthur rule?",
	answer: "Britons",
	wrongAnswers: ["Gauls", "Romans", "Huns"]
}, {
	question: "Which limbs does King Arthur cut off from the warrior he fought?",
	answer: "All four limbs",
	wrongAnswers: ["His arms", "His legs", "It was just a flesh wound"]
}];


$(document).ready(function(){
	$(".inner-container").hide();
	$("#splash-screen").show();
	$("#start-game").click(newGame);
	$("#restart-game").click(restartGame);
})
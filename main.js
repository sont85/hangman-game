require(['word'], function(words) {

	var startPos = [[150,145],[25,145],[25,25],[80,25],[80,45],[80,55],[80,65],[80,65],[80,100],[80,100]];
	var drawToPos = [[25,145],[25,25],[80,25],[80,35],[10,0],[80,100],[45,80],[115,80],[55,135],[105,135]];

	var word = "";
	var amountCorrect = 0;
	var lives = 10;
	var hint = "";
	var strokeCount = 0;
	var lettersPicked = [];
	var lettersWrong = [];
	var	canvas = document.getElementById("canvas");


	function startGame(){
		var randomResult = randomPick();
		word = Object.keys(randomResult).join("");
		buildHtml(word.length);
		hint = randomResult[word];
	}

	function randomPick() {
		var randomNumber = ( Math.floor(Math.random() * words.length) );
		var selectedCategory = words[randomNumber];
		var categoryName = Object.keys(selectedCategory);
		var categoryArray = selectedCategory[categoryName];
		var randomNumber2 = ( Math.floor(Math.random() * categoryArray.length));

		displayCategory(categoryName);

		console.log(categoryArray[randomNumber2]);
		return categoryArray[randomNumber2];

	}

	function buildHtml(length) {
		var $letterHtml = "<div>";
		for (var i=0; i<length; i++) {
			$letterHtml += '<span class=\"letter\">__  </span>';
		}
		$letterHtml += "</div>";
		$("#wordDiv").html($letterHtml);
	}

	function displayCategory(category) {
		$("#category").html(category);
	}

	function displayData() {
		var livesMessage = lives+" Lives Left";
		if (lives >= 0) {
			$("#lives").html(livesMessage);
		}
		$("#letterPickedDiv").html(lettersPicked.join(", "));
		$("#LetterWrongDiv").html(lettersWrong.join(", "));
	}

	function myCanvas() {
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		if (strokeCount !== 4 && strokeCount < 10) {
			ctx.moveTo(startPos[strokeCount][0],startPos[strokeCount][1]);
			ctx.lineTo(drawToPos[strokeCount][0],drawToPos[strokeCount][1]);
		} else if (strokeCount === 4) {
			ctx.arc(startPos[strokeCount][0],startPos[strokeCount][1],
				drawToPos[strokeCount][0],drawToPos[strokeCount][1], Math.PI*2,true);
		}
		ctx.stroke();
		strokeCount +=1;
	}

	function animation(winLose) {
		TweenMax.to(winLose, 2, {width:300});
		TweenMax.to(winLose, 2, {backgroundColor:"#A8B"});
		TweenMax.to(winLose, 2, {width:600 , delay: 2});
		TweenMax.to(winLose, 2, {backgroundColor:"#4F9", delay: 2});
		TweenMax.to(winLose, 6, {x: 600, rotation: 360, scale:0.5, delay:4, ease:Bounce.easeOut});
		TweenMax.to(winLose, 6, {x: 0, rotation: 360, scale:1, delay:8});

		TweenMax.to($("#winnerImage"), 1, {opacity:0,scale:0, ease:Bounce.easeOut});
		TweenMax.to($("#winnerImage"), 3, {right: 200});
		TweenMax.to($("#winnerImage"), 3, {left: 200, delay: 3});


	}

	function winCheck() {
		if (word.length === amountCorrect) {
			$("#winner").removeClass("hidden");
			$(".letterButton").addClass("disabled");
			var winAudio = document.getElementById("winAudio");
			winAudio.play();
			animation($("#winner"));
			$("#winnerImage").removeClass("hidden");
		}
	}

	function loseCheck() {
		if (lives <= 0) {
			$("#loser").removeClass("hidden");
			$(".letterButton").addClass("disabled");
			var loseAudio = document.getElementById("loseAudio");
			loseAudio.play();
			animation($("#loser"));
		}
	}

	function blink() {
		$("body").addClass("blink").delay(500).queue(function(){
			$(this).removeClass("blink").dequeue();
		});
	}

	function clickSound() {
		var clickAudio = document.getElementById("clickAudio");
		clickAudio.currentTime=0;
		clickAudio.play();
	}


	function reset(){
		lettersWrong = [];
		lettersPicked = [];
		lives = 10;
		hint = "";
		strokeCount = 0;
		amountCorrect = 0;
		letterKey = "";
		word = "";
		$("#winnerImage").addClass("hidden");
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		$("#winner").addClass("hidden");
		$("#loser").addClass("hidden");
		$("#lives").html("10 Lives Left");
		$("#letterPickedDiv").html("");
		$("#LetterWrongDiv").html("");
		$("#hint").html("click show hint");
		$(".letterButton").removeClass("disabled");
	}


	function compare(chosenLetter, word, $letterButtonKey){
		var letterIndex = [];
		word = word.split("");
		if ($letterButtonKey.hasClass("disabled")) {
			blink();
		} else {
			for (var i=0; i<word.length;i++) {
				if (word[i] === chosenLetter) {
					letterIndex.push(i);
				}
			}
		}
		if (letterIndex.length === 0 && $letterButtonKey.hasClass("disabled")===false) {
			lettersWrong.push(chosenLetter);
			myCanvas();
			lives -=1;
			loseCheck();
		} else {
			addToDiv(letterIndex, chosenLetter);
		}
		displayData();

	}


	function addToDiv(letterIndex, chosenLetter) {
		if (letterIndex.length > 0) {
			letterIndex.forEach(function(index) {
				index += 1;
				amountCorrect +=1;
				$(".letter:nth-of-type("+index+")").html(chosenLetter);
			});
		}
		winCheck();
	}


	$(document).ready(function(){
		"use strict";

	  $("#email").tooltip();
		startGame();

		$("#playAgain").on("click", function(){
			reset();
			startGame();
			clickSound();

		});

		window.addEventListener("keydown", function(event){
			var letterPressed = String.fromCharCode(event.keyCode);
			var $letterButtonKey = $("button:contains('"+letterPressed+"')");
			$letterButtonKey = $letterButtonKey.filter($(".letterButton"));
			lettersPicked.push(letterPressed);
			compare(letterPressed, word, $letterButtonKey);
			$letterButtonKey.addClass("disabled");
			clickSound();
		});

		$(".letterButton").on("click", function (){
			var letterClicked = $(this).html();
			lettersPicked.push(letterClicked);
			compare(letterClicked, word,$(this));
			$(this).addClass("disabled");
			clickSound();

		});
		$("#hintButton").on("click", function(){
			$("#hint").html(hint);
			clickSound();

		});

	});
});

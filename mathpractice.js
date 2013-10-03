window.mathhelper = (function($){
	var self = {};
	var dom = {};
	
	
	self.initDom = function(){
		dom.numberOne	= $('#number_1');
		dom.numberTwo	= $('#number_2');
		dom.giveUp		= $('#give_up');
		dom.maxNumber	= $('#max_number');
		dom.minNumber	= $('#min_number');
		dom.response	= $('#response_field');
		dom.answer		= $('#answer');
		dom.checkAnswer	= $('#check_answer');
		dom.operationType=$('#operation_type');
		dom.allowSquares= $('#allow_perfect_squares');
		
		self.dom = dom;
	};
	
	self.knownAnswers = [];
	
	self.isAnswerKnown = function(numberOne, numberTwo){
		var answerIsKnown = false;
		$.each(self.knownAnswers, function(){
			if(
				(this[0] == numberOne && this[1] == numberTwo)
				||
				(this[0] == numberTwo && this[1] == numberOne)
			){
				answerIsKnown = true;
				console.log('Answer was already known for ',numberOne, numberTwo);
				return false;
			}
		});
		return answerIsKnown;
	};
	
	self.logKnownAnswer = function(numberOne, numberTwo){
		self.knownAnswers.push([numberOne, numberTwo]);
	};
	
	self.logWrongAnswer = function(numberOne, numberTwo){
		self.wrongAnswers.push([numberOne, numberTwo]);
	};
	
	self.loadFromWrongAnswers = function() {
		return self.wrongAnswers.shift();
	};
	
	self.initEvents = function() {
		self.dom.response.bind('keydown', function(e){
			if(e.which == 13)
				self.checkAnswer();
		});
		
		dom.maxNumber.bind('change', self.createProblem);
		dom.operationType.bind('change', self.createProblem);
		
		dom.checkAnswer.bind('click', self.checkAnswer);
	};
	
	self.init = function() {
		self.initDom();
		self.initEvents();
		self.createProblem();
	};
	
	var makeRandomNumber = function(max, min) {
		min = parseInt(min);
		max = parseInt(max);
		
		var number = Math.floor(Math.random()*(max-min+1)) + min;
		
		if(number == 10 || number == 5 || number == 11)
			return makeRandomNumber(max, min);
		return number;
	};
	
	var answerWasKnown = 0;
	self.createProblem = function(){
		if(answerWasKnown>100){
			alert('You have correctly answered every possible number combination in this range.'); 
			answerWasKnown = 0;
			return;
		}
		
		var allowPerfectSquares = self.dom.allowSquares[0].checked;
		
		var minNumber = self.dom.minNumber.val();
		var maxNumber = self.dom.maxNumber.val();
		
		switch(dom.operationType.val()){
			case 'multiply': 
				self.numberOne = makeRandomNumber(maxNumber, minNumber);
				self.numberTwo = makeRandomNumber(maxNumber, minNumber);
				
				if(!allowPerfectSquares && self.numberOne == self.numberTwo){
					self.createProblem();
					return false;
				}
			break;
			
			case 'divide':
				var divisor = makeRandomNumber(maxNumber, minNumber);
				var dividend = makeRandomNumber(maxNumber, minNumber);
				self.numberOne = divisor * dividend;
				self.numberTwo = divisor;
				
				if(!allowPerfectSquares && divisor == dividend){
					self.createProblem();
					return false;
				}
			break;
		
		}
				
		dom.numberOne.text(self.numberOne);
		dom.numberTwo.text(self.numberTwo);
		dom.response.val('');
		
		if(self.isAnswerKnown(self.numberOne, self.numberTwo)){
			answerWasKnown++;
			self.createProblem();
			return false;
		}else{
			answerWasKnown = 0;
		}

	};
	
	self.checkAnswer = function(){
		var numberOne = self.dom.numberOne.text();
		var numberTwo = self.dom.numberTwo.text();
		
		switch(dom.operationType.val()){
			case 'multiply':
				var correctAnswer = numberOne * numberTwo;
				var correctAnswerExplanation = numberOne+' x '+numberTwo+' = '+correctAnswer;
			break;
			
			case 'divide':
				var correctAnswer = numberOne / numberTwo;
				var correctAnswerExplanation = numberOne+' \xF7 '+numberTwo+' = '+correctAnswer
			break;
		}
		
		if(self.dom.response.val() == correctAnswer){
			alert('Correct!\n'+correctAnswerExplanation);
			self.logKnownAnswer(numberOne, numberTwo);
		}else{
			alert('Wrong!\n'+correctAnswerExplanation);
		}
		self.createProblem();
	};
	
	$(self.init);
	
	return self;
}(jQuery));
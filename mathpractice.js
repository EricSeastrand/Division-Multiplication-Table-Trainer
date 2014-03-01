window.mathhelper = (function($){
	var self = {
		numberOfTries: 0,
		wrongAnswers: [],
		knownAnswers: []
	};
	var dom = self.dom = {};
	var answerWasKnown = 0;
	
	self.init = function() {
		self.initDom();
		self.initEvents();
		self.createProblem();

		prepareFactorGrid(self.minNumber, self.maxNumber);
	};

	self.initDom = function(){
		dom.container   = $('body');
		dom.numberOne	= $('#number_1');
		dom.numberTwo	= $('#number_2');
		dom.giveUp		= $('#give_up');
		dom.maxNumber	= $('#max_number');
		dom.minNumber	= $('#min_number');
		dom.response	= $('#response_field');
		dom.answer		= $('#answer');
		dom.checkAnswer	= $('#check_answer');
		dom.operationType=$('#operation_type');
		dom.difficultySetting = $( "#difficulty-setting" );
		dom.difficultyWrapper = $('.difficulty-wrapper');
		dom.rightAnswers = $('.answered-correctly');
		dom.wrongAnswers = $('.answered-incorrectly');
		dom.historyContainer = $('section.history').hide();
		dom.allowSquares = $('#allow_perfect_squares')
			.button({
				label: 'Include Squares',
				icons: { primary: "ui-icon-newwin" }
			})
		;

		dom.secondChance = $('#second_chance_hint')
			.button({
				label: 'Second Chance',
				icons: { primary: "ui-icon-heart" }
			})
		;
		
		dom.difficultySetting.slider({
			range   : true,
			min     : 2,
			max     : 32,
			step    : 1,
			values  : [self.minNumber, self.maxNumber],
			slide   : updateInputsFromSlider
		});
		
		updateSliderFromInput();
	};
	
	self.initEvents = function() {
		dom.difficultyWrapper.on('change', 'input[type="number"]', updateSliderFromInput);
		
		dom.operationType.on('change', self.createProblem);

		dom.checkAnswer.closest('form').bind('submit', function(e){
			e.preventDefault(); e.stopPropagation();
			self.checkAnswer();
		});

		dom.container.on('click', '.collapse-closest-section', function(e){
			$(this).closest('section').find('.collapse-me').slideToggle();
		});
	};
	

	self.isAnswerKnown = function(numberOne, numberTwo){
		var answerIsKnown = false;
		$.each(self.knownAnswers, function(){
			if(
				(this[0] == numberOne && this[1] == numberTwo)
				||
				(this[0] == numberTwo && this[1] == numberOne)
			) {
				answerIsKnown = true;
				console.log('Answer was already known for ',numberOne, numberTwo);
				return false;
			}
		});
		return answerIsKnown;
	};
	self.logKnownAnswer = function(){
		self.knownAnswers.push([self.numberOne, self.numberTwo]);
		
		dom.rightAnswers.append( prepareScoreboardRow() );
	};
	
	self.logWrongAnswer = function(){
		self.wrongAnswers.push([self.numberOne, self.numberTwo]);
		
		dom.wrongAnswers.append( prepareScoreboardRow() );
	};
	
	self.loadFromWrongAnswers = function() {
		return self.wrongAnswers.shift();
	};
	
	function updateInputsFromSlider(){
		var values = dom.difficultySetting.slider( "option", "values" );
		dom.minNumber.val(values[0]);
		dom.maxNumber.val(values[1]);
		
		prepareFactorGrid(self.minNumber, self.maxNumber);

		self.createProblem();
	}
	
	function updateSliderFromInput(){
		_getInputValues();
		
		dom.difficultySetting.slider( "values", [ self.minNumber, self.maxNumber ] );
		
		prepareFactorGrid(self.minNumber, self.maxNumber);
		self.createProblem();
	}
	
	function prepareScoreboardRow() {
		return $('<tr>').html(
			'<td>' +self.numberOne.toString()+ '</td>' +
			'<td>' +dom.operationType.find(':selected').text()+ '</td>'+
			'<td>' +self.numberTwo.toString()+ '</td>' +
			'<td> = </td>' +
			'<td>' +self.correctAnswer.toString()+ '</td>'
		);
	}
	function _getInputValues(){
		self.minNumber = parseInt( dom.minNumber.val() );
		self.maxNumber = parseInt( dom.maxNumber.val() );
	}
	
	// Utility function so we don't have to specify the min and max each time we call Math.makeRandomNumber().
	function makeRandomNumber() {
		return Math.makeRandomNumber(self.minNumber, self.maxNumber);
	}

	function adjustDifficulty(howMuch) {
		howMuch = parseInt(howMuch);
		
		_getInputValues();
		
		dom.maxNumber.val( self.maxNumber + howMuch );
		dom.minNumber.val( self.minNumber + howMuch );

		updateSliderFromInput();
	}

	
	self.createProblem = function(){

		// Todo: find a less hack-ish way to determine that we are out of factors.
		self.numberOfTries = 0;
		if(answerWasKnown>100){
			alert('You have correctly answered every possible number combination in this range. The difficulty will now increase automatically.'); 
			answerWasKnown = 0;

			adjustDifficulty(+1);
			
			return;
		}
		
		var allowPerfectSquares = self.allowPerfectSquares = self.dom.allowSquares[0].checked;
		
		var minNumber = self.minNumber = parseInt(self.dom.minNumber.val());
		var maxNumber = self.maxNumber = parseInt(self.dom.maxNumber.val());
		
		switch( dom.operationType.val() ){
			case 'multiply': 
				self.numberOne = makeRandomNumber();
				self.numberTwo = makeRandomNumber();
				
				if(!allowPerfectSquares && self.numberOne == self.numberTwo){
					self.createProblem();
					return false;
				}
				
				self.correctAnswer = self.numberOne * self.numberTwo;
				
			break;
			
			case 'divide':
				var divisor = makeRandomNumber();
				var dividend = makeRandomNumber();
				self.numberOne = divisor * dividend;
				self.numberTwo = divisor;
				self.correctAnswer = self.numberOne / self.numberTwo;
				
				if(!allowPerfectSquares && divisor == dividend){
					self.createProblem();
					return false;
				}
			break;
		
		}
				
		dom.numberOne.text(self.numberOne);
		dom.numberTwo.text(self.numberTwo);
		
		dom.response.val(undefined);
		
		if( self.isAnswerKnown(self.numberOne, self.numberTwo) ){
			answerWasKnown++;
			self.createProblem();
			return false;
		}else{
			answerWasKnown = 0;
		}

	};
	
	self.checkAnswer = function(e){
		
		self.numberOfTries++;
		
		dom.historyContainer.slideDown();

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
		var answerFromUser = parseInt(self.dom.response.val());
		if(answerFromUser == correctAnswer){
		
			alert('Correct!\n'+correctAnswerExplanation);
			self.logKnownAnswer();
			self.createProblem();
		
		} else {
			var howFarOffInt = answerFromUser - correctAnswer;
			var hint = answerFromUser < correctAnswer? 'You are not high enough!' : 'You are too high!' ;
			var howFarOff = 'Your answer is ' +  Math.abs(howFarOffInt) + (howFarOffInt>0?' greaeter than':' less than') + ' the correct answer';
			
			if( !dom.secondChance[0].checked )
				alert('Wrong!\n'+correctAnswerExplanation+'\nHint: You get two tries if you enable "Second Chance" mode.');
			else
				alert(hint+"\n"+howFarOff+'\nPlease try again!');
			
			
			if(self.numberOfTries > 1){
				self.logWrongAnswer();
				self.createProblem();
			}
		}
		
		
	};
	
	$(self.init);
	
	return self;
}(jQuery));

function prepareFactorGrid(minNumber, maxNumber) {
	$('.factor-grid').empty();

	var maxNumber = parseInt(maxNumber);
	var minNumber = parseInt(minNumber);
	var howManyFactors = maxNumber - minNumber;

	var gridOptions = {
		keyByColumn: '1',
		onRowClicked: function(chatId, chatObject){
			//parent.loadArbitraryChat(chatId);
		}
		,container  : '.factor-grid'
		,resizable	: false
		,sortable	: false
		,columns    : {
			'1': {	
				label: 'Times',
				sortAs: 'INT',
				inputDataKey: 'factorsOf'
			}
		}
	};

	/*	Allocate a column for each potential multiplicand	*/
	for(var i=minNumber; i<=maxNumber; i++) {
		gridOptions.columns[i.toString()] = {
			sortAs       : 'INT',
			label        : ( i.toString() ),
			inputDataKey : i
			//dataType     : 'factorOf'+( i.toString() ),
		};
	}

	window.myGrid = mathhelper.factorsTable = new esGrid( gridOptions );
	
	myGrid.loadData( createDataset() );



	/*	Make some data, so that the row contains all factors of @factorsOf */
	function makeRowData(factorsOf) {
		var factorsOf = parseInt(factorsOf);
		var rowCells = { factorsOf: factorsOf };
		
		for(var i=minNumber; i<=maxNumber; i++) {
			rowCells[i.toString()] = factorsOf * i;
		}
		
		return rowCells;
	}

	/* Makes a data-set; each row contains the product of a multiplicant/multiplicand combo. */
	function createDataset() {
		var gridData = [];
		for(var i=minNumber; i<=maxNumber; i++) {
			gridData.push( makeRowData(i) );
		}
		return gridData;
	}
	
}


Math.makeRandomNumber = function(min, max){
	var range = max - min + 1;

	var randomosity = Math.random();

	return Math.floor(randomosity*range) + min;
}
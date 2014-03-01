<!doctype html>
<html>
	<head>
		<meta name="HandheldFriendly" content="true" />
		<meta name="viewport" content="width=device-width,height=device-height,user-scalable=no" />


		<script src="//code.jquery.com/jquery-1.9.1.js"></script>
		<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>

		<script src="esGrid/event-handling.js"></script>
		
		<script src="esGrid/esGrid.js"></script>
		<script src="esGrid/esGrid.dataTable.js"></script>
		<script src="esGrid/esGrid.header.js"></script>
		<script src="esGrid/esGrid.tableRow.js"></script>
		
		<link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/start/jquery-ui.css" />

		<link rel="stylesheet" href="style.css" />
  
		<script type="text/javascript" src="mathpractice.js"></script>		

	</head>
	<body>

		<section class="difficulty-wrapper" title="Move the sliders to change the difficulty. After you get enough problems right, the computer will automatically increase the difficulty for you!">
			
			<div class="min-number-wrapper" title="The lowest number you want to be quizzed on.">
				<label for="max_number">Smallest</label>
				<input type="number" id="min_number" min='2' value="2" />
			</div>
			<div class="slider-wrapper">
				<label for="difficulty-setting">Difficulty</label>
				<div id="difficulty-setting"></div>
			</div>
			
			<div class="max-number-wrapper" title="The highest number you want to be quizzed on.">
				<label for="max_number">Biggest</label>
				<input type="number" id="max_number" min="2" value="5" />
			</div>
		</section>
					
		<section class="options">
			<div title="If turned on (Green), perfect squares (5x5=25, 64&divide;8=8) will not be asked.">
				<label for="allow_perfect_squares" >Include Squares</label>
				<input type="checkbox" id="allow_perfect_squares" />
			</div>
	
			<div title="Turn this on to get a second chance whenever your answer is INCORRECT.">
				<label for="second_chance_hint" >Second Chance Hint</label>
				<input type="checkbox" checked="checked" id="second_chance_hint" />
			</div>
		</section>
		
		<section id="question_area" title="Select whether you want to practice multiplication or division.">
			<span id="number_1"></span>
			<select id="operation_type">
				<option value="multiply">X</option>
				<option value="divide">&divide;</option>
			</select>
			<span id="number_2"></span>
		</section>

		<section id="answer">
			<form id="answer_form" title='Enter your answer here, and click "Check Answer" to see if you got it right! If you prefer, you may use the [Enter] key on your keyboard instead.'>
				<input type="number" id="response_field" placeholder="Enter your answer." step=1 />
				<button type="submit" class="check-answer" id="check_answer">Check Answer</button>
			</form>
		</section>
		
		<section class="history">
			<div class="answered-correctly-wrapper">
				<div>Correct</div>
				<table class="answered-correctly"></table>
			</div>

			<div class="answered-incorrectly-wrapper">
				<div>Incorrect</div>	
				<table class="answered-incorrectly"></table>
			</div>
		</section>

		<section class="factor-grid-wrapper">
			<button class="collapse-closest-section">Show/Hide CheatSheet</button>
			<div class="factor-grid collapse-me"></div>
		</section>
	</body>

</html>
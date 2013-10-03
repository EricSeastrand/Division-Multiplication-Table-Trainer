<html>
	<head>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
		<script src="mathpractice.js"></script>
		<style>

		
		</style>
	</head>
	<body>
		
		<label for="max_number">Min Number</label>
		<input type="text" id="min_number" value="4" />
	<br/>
		<label for="max_number">Max Number</label>
		<input type="text" id="max_number" value="12" />
	<br/>
		<label for="allow_perfect_squares" title="If NOT checked, perfect squares (5x5=25, 64&divide;8=8) will not be asked.">Squares</label>
		<input type="checkbox" id="allow_perfect_squares" />
		
		<div id="question_area">
			<span id="number_1"></span>
			<select id="operation_type">
				<option value="multiply">X</option>
				<option value="divide">&divide;</option>
			</select>
			<span id="number_2"></span>
		</div>
		<div id="answer"></div>
		<input type="text" id="response_field" placeholder="Enter your answer." />
		<input type="button" id="check_answer" value="Check" />
		
	</body>

</html>
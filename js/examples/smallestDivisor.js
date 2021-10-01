var num1 = 131;
var num2 = 10;

function smallestDivisor(num) {
	if (num == 0) {
		return 0;
	}

	if (num == 1) {
		return 1;
	}

	if (num % 2 == 0) {
		return 2;
	}
	for (var i=3; i*i<=num; i+=2) {
		if (num % i == 0) {
			return i;
		}
	}
	return num;
}

console.log(smallestDivisor(num1));
smallestDivisor(num2);
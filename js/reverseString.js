var str = "banana";
var str_arr = [];
var new_str = '';

function reverseStr(str) {
	for (var i=0; i<str.length; i++) {
		str_arr.push(str[str.length - 1 - i]);
	}
	str_arr.forEach(function (letter){
		new_str += letter;
	})
	return new_str;
}

function reverseStrEasy(str) {
	var splitStr = str.split("");
	var reversedArr = splitStr.reverse();
	var joinStr = reversedArr.join("");
	return joinStr;
}

function reverseStrImproved(str) {
	var newStr = ''
	for (var i=str.length-1; i>=0; i--) {
		newStr += str[i];
	}
	return newStr;
}

function reverseStrRecursion(str) {
	if (str === "")
		return "";
	else
		return reverseStrRecursion(str.substr(1)) + str.charAt(0);
}


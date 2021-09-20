var arr = [1,2,3,4];
var numToShiftToEnd = 1;
console.log(arr);

var index = arr.indexOf(numToShiftToEnd);
if (index > -1) {
	arr.splice(index,1)
}

arr.push(numToShiftToEnd);

console.log(arr);
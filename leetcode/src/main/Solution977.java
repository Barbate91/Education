package src.main;

public class Solution977 {
    public int[] sortedSquares(int[] nums) {
        /*
        Runtime: 1 ms, faster than 100.00% of Java online submissions for Squares of a Sorted Array.
        Memory Usage: 55.6 MB, less than 17.18% of Java online submissions for Squares of a Sorted Array.
         */
        int len = nums.length;
        int[] squaredArray = new int[len];
        int idx = len-1;
        int floor = 0;
        int ceil = len-1;

        while (floor <= ceil) {
            // O(n) time
            // Compare as we go in squaring values for new array
            // If negative and abs of nums[floor] isn't greater than nums[ceil] then none after will be
            if (Math.abs(nums[floor]) < Math.abs(nums[ceil])) {
                squaredArray[idx--] = nums[ceil] * nums[ceil];
                ceil--;
            } else {
                squaredArray[idx--] = nums[floor] * nums[floor];
                floor++;
            }
        }
        return squaredArray;

        /*
        Runtime: 852 ms, faster than 5.01% of Java online submissions for Squares of a Sorted Array.
        Memory Usage: 55.9 MB, less than 12.18% of Java online submissions for Squares of a Sorted Array.

        int[] squaredArray = new int[nums.length];
        int lowest = Math.abs(nums[0]);

        for (int i = 0; i < nums.length; i++) {
            int abs = Math.abs(nums[i]);
            squaredArray[i] = abs*abs;

            if (abs < lowest)
                lowest = abs; // This will be the smallest squared value
        }

        // O(n^2) - Basic bubble sort
        while (lowest*lowest < squaredArray[0]) {
            for (int i = 1; i < squaredArray.length; i++) {
                int temp = -1;
                if (squaredArray[i] < squaredArray[i-1]) {
                    // Swap positions for lower value
                    temp = squaredArray[i-1];
                    squaredArray[i-1] = squaredArray[i];
                    squaredArray[i] = temp;
                }
            }
        }

        return squaredArray;
        */
    }
}

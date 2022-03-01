package src.main;

public class Solution704 {
    public int search(int[] nums, int target) {

        int low = 0;
        int high = nums.length-1;

        // Binary Search
        while (low <= high) {
            int middle = low + (high-low)/2;
            if (nums[middle]==target)
                return middle;
            else if (nums[middle] < target)
                // Shift floor up by one
                low = middle + 1;
            else
                // Shift ceiling down by one
                high  = middle - 1;
        }
        return -1;
    }
}

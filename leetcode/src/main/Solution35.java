package src.main;

public class Solution35 {
    public int searchInsert(int[] nums, int target) {
        int low = 0;
        int high = nums.length-1;
        int mid = low + (high-low)/2;

        // Binary search
        while (low <= high) {
            if (nums[mid] == target)
                return mid;

            // Current value is lower than target, shift floor up by 1
            if (nums[mid] < target)
                low = mid + 1;
            // Current value is greater than target, shift ceiling down by 1
            else
                high = mid - 1;

            // Set new middle to search
            mid = low + (high-low)/2;
        }
        return mid;
    }
}

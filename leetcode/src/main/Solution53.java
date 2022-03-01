package src.main;

public class Solution53 {
    public int maxSubArray(int[] nums) {
        int result = nums[0];
        int sum = nums[0];

        for(int i=1; i<nums.length; i++){
            // Math.max is faster than if conditional
            // if current index is greater than the sum of previous elements
            // then we can discard previous sum
            sum = Math.max(nums[i], sum + nums[i]);
            // store largest subarray found
            result = Math.max(result, sum);
        }

        return result;
    }
}

package src.main;

public class Solution1929 {
    public int[] getConcatenation(int[] nums) {
        int arrLength = nums.length;
        int[] result = new int[nums.length * 2];
        System.arraycopy(nums, 0, result, 0, arrLength);
        System.arraycopy(nums, 0, result, arrLength, arrLength);
        return result;
    }
}

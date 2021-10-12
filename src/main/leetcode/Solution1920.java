package main.leetcode;

public class Solution1920 {
    public int[] buildArray(int[] nums) {
        int arrLen = nums.length;
        int[] result = new int[arrLen];
        for (int i=0; i<arrLen; i++) {
            result[i] = nums[nums[i]];
        }
        return result;
    }
}

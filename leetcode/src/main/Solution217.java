package src.main;

import java.util.HashSet;

public class Solution217 {
    public boolean containsDuplicate(int[] nums) {
        // Hashset allows only unique values
        HashSet<Integer> set = new HashSet<>();

        for (int i = 0; i < nums.length; i++) {
            // If we fail to add a value at any point, then we have duplicate values in array
            if (!set.add(nums[i])) {
                return true;
            }
        }
        // Otherwise all values are unique
        return false;
    }
}

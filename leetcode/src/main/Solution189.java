package src.main;

import java.util.HashMap;
import java.util.Map;

public class Solution189 {
    public void rotate(int[] nums, int k) {




        /*
        Runtime: 15 ms, faster than 5.38% of Java online submissions for Rotate Array.
        Memory Usage: 77.8 MB, less than 6.34% of Java online submissions for Rotate Array.
        O(n) time
        O(n) space

        Map<Integer,Integer> prevValues = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            prevValues.put(i,nums[i]);

            int shiftedPos = i-k;
            while (shiftedPos < 0)
                shiftedPos = nums.length+shiftedPos;

            if (prevValues.containsKey(shiftedPos)) {
                nums[i] = prevValues.get(shiftedPos);
            } else {
                nums[i] = nums[shiftedPos];
            }
        }
         */
    }
}

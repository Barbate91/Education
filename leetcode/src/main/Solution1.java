package src.main;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class Solution1 {
    public int[] twoSum(int[] nums, int target) {
        int[] answer = new int[2];

        // Saving in HashMap means we iterate once, O(n) time
        Map<Integer,Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(nums[i])) {
                // We found the previously saved difference, so current index + previous index = target
                answer[0] = i;
                answer[1] = map.get(nums[i]);
            } else {
                // Haven't seen before, get difference and save existing index
                map.put(target-nums[i],i);
            }
        }
        return answer;
    }
}

package src.main;

public class Solution2011 {
    public int finalValueAfterOperations(String[] operations) {
        int result = 0;
        char target = '+';
        for (int i=0; i<operations.length; i++) {
            String operation = operations[i];
            if (operation.indexOf(target) > -1) {
                result++;
            } else {
                result--;
            }
        }
        return result;
    }
}

package src.main;

public class Solution278 {
    public int firstBadVersion(int n) {
        int lowV = 0;
        int highV = n;
        int lastBadV = n;

        // Binary search
        while (lowV <= highV) {
            int midV = lowV + (highV-lowV)/2;
            if (isBadVersion(midV)) {
                // Need to track the last known bad version
                lastBadV = midV;
                // Shift ceiling down by 1
                highV = midV - 1;
            } else {
                // Checked version isn't bad, need to go further up
                // Shift floor up by 1
                lowV = midV + 1;
            }
        }
        return lastBadV;
    }

    // STUB FOR COMPILER
    private boolean isBadVersion(int midV) {
        return true;
    }
}

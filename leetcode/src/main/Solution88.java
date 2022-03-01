package src.main;

public class Solution88 {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int size = m+n-1;
        int i = m-1;
        int j = n-1;

        while (size >= 0) {
            if (j >= 0 && i >= 0) {
                // Work backward from end of nums1 array and add largest number to it
                if (nums1[i] > nums2[j]) {
                    nums1[size--] = nums1[i--];
                } else {
                    nums1[size--] = nums2[j--];
                }
            } else if (i >= 0) { // Out of values from nums2
                nums1[size--] = nums1[i--];
            } else { // Out of values from nums1
                nums1[size--] = nums2[j--];
            }
        }
    }
}

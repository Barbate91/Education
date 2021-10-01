package main;

import java.util.Arrays;

public class QuickSortTester extends QuickSort {
    public static void main(String[] args) {
        int[] arrayToSort = {5,100,-123,545,49,10,15,6,30,230,-234,-2};
        quicksort(arrayToSort,0,arrayToSort.length-1);
        System.out.println(Arrays.toString(arrayToSort));
    }
}

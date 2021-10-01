package main;

import java.util.Arrays;

public class QuickSort {
    public static void quicksort(int[] arrayToSort, int startIndexArray, int endIndexArray) {
        if (startIndexArray >= endIndexArray) {
            return;
        }

        int pivot = partition(arrayToSort, startIndexArray, endIndexArray);

        quicksort(arrayToSort, startIndexArray, pivot-1);
        quicksort(arrayToSort, pivot+1, endIndexArray);
    }

    public static int partition(int[] arrayToSort, int startIndexArray, int endIndexArray) {
        int pivot = arrayToSort[endIndexArray];

        int pivotIndex = startIndexArray;

        for (int i=startIndexArray; i<endIndexArray; i++) {
            if (arrayToSort[i] <= pivot) {
                swapArrayMembers(arrayToSort, i, pivotIndex);
                pivotIndex++;
            }
        }

        swapArrayMembers(arrayToSort,endIndexArray,pivotIndex);
        return pivotIndex;
    }

    public static void swapArrayMembers(int[] arrayToSort, int member1, int member2) {
        int temp = arrayToSort[member1];
        arrayToSort[member1] = arrayToSort[member2];
        arrayToSort[member2] = temp;
    }
}

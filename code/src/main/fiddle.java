package main;

import java.util.Arrays;

public class fiddle {
    public static void main(String[] args) {
        int[] ints = {0,1,2,3};
        int idx = ints.length-1;
        System.out.println(ints[idx--]);
        System.out.println(idx);
    }
}

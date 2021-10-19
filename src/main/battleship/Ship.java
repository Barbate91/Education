package main.battleship;

import java.util.Random;
import java.util.HashMap;

public class Ship {
    private HashMap<Integer, Boolean> hitMap;
    private Random randomInt;
    private int startPos;
    private int sizeOfShip;

    public Ship(int bound, int shipSize) {
         hitMap = new HashMap<Integer, Boolean>();
         randomInt = new Random();
         startPos = randomInt.nextInt(bound-2);
         sizeOfShip = shipSize;

         populateHitMap();
    }

    public Ship() {
         hitMap = new HashMap<Integer, Boolean>();
         randomInt = new Random();
         startPos = randomInt.nextInt(4);
         sizeOfShip = 3;

         populateHitMap();
    }

    public boolean checkForHit(int target) {
        if(hitMap.containsKey(target)) {
            if(!hitMap.get(target)) {
                hitMap.put(target,true);
                System.out.println("You landed a hit!");
                return true;
            }

            if(hitMap.get(target)) {
                System.out.println("You already hit this target!");
                return false;
            }
        }

        System.out.println("You missed!");
        return false;
    }

    private void populateHitMap() {
        for(int i=0; i<sizeOfShip; i++) {
            hitMap.put(startPos+i,false);
        }
    }

}

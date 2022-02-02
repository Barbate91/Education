package main.battleship;

import java.awt.Point;
import java.util.Random;

public class Ship {
    private Point[] shipCoords;

    public Ship(int boundX, int boundY, int shipSize) {
        this.shipCoords = new Point[shipSize];
        createAndSetCoordsInGrid(boundX, boundY);
    }

    public boolean checkForHit(Point target) {
        if(this.shipCoords) {
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

    private void createAndSetCoordsInGrid(int boundX, int boundY) {
        int lastIdx = this.shipCoords.length-1;
        while (this.shipCoords[lastIdx] == null) {
            this.shipCoords[0] = createRandomStartingCoords(boundX, boundY);
            GameHelper.tryToPopulateCoordsInGrid(this);
        }
    }

    private static Point createRandomStartingCoords(int boundX, int boundY) {
        Random randomInt = new Random();
        int startPosX = randomInt.nextInt(boundX);
        int startPosY = randomInt.nextInt(boundY);
        return new Point(startPosX,startPosY);
    }

    public Point[] getCoords() {
        return this.shipCoords;
    }

    public void setCoordsByIdx(int idx, Point coords) {
        this.shipCoords[idx] = coords;
    }
}

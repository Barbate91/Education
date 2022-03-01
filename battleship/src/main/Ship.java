package main;

import java.awt.Point;
import java.util.Arrays;
import java.util.Random;

public class Ship {
    private Point[] shipCoords;
    int numOfHits = 0;
    boolean isDestroyed = false;

    public Ship(int boundX, int boundY, int shipSize) {
        this.shipCoords = new Point[shipSize];
        System.out.println("DEBUG Setting coords");
        createAndSetCoordsInGrid(boundX, boundY);
    }

    public boolean checkForHit(Point target) {
        boolean targetInShipCoords = false;
        for (int i = 0; i < this.shipCoords.length; i++) {
            if (this.shipCoords[i].getX() == target.getX() && this.shipCoords[i].getY() == target.getY()) {
                targetInShipCoords = true;
            }
        }
        if (!targetInShipCoords)
            return false;

        boolean[][] hitMap = GameHelper.getGrid();
        int x = (int) target.getX();
        int y = (int) target.getY();
        if(this.shipCoords != null) {
            if(!hitMap[x][y]) {
                GameHelper.setGrid(x,y,true);
                System.out.println("You landed a hit!");
                this.numOfHits++;
                if (this.checkIfDestroyed()) {
                    System.out.println("Ship destroyed!");
                }
                return true;
            }
            if(hitMap[x][y]) {
                System.out.println("You already hit this target!");
                return false;
            }
        }
        System.out.println("You missed!");
        return false;
    }

    private boolean checkIfDestroyed() {
        if (this.numOfHits >= this.shipCoords.length) {
            this.isDestroyed = true;
        }
        return this.isDestroyed;
    }

    private void createAndSetCoordsInGrid(int boundX, int boundY) {
        int lastIdx = this.shipCoords.length-1;
        while (this.shipCoords[lastIdx] == null) {
            this.shipCoords[0] = createRandomStartingCoords(boundX, boundY);
            System.out.println("DEBUG Random coords: " + this.shipCoords[0].getX() + " " + this.shipCoords[0].getY());
            GameHelper.tryToPopulateCoordsInGrid(this);
            System.out.println("DEBUG Ship coords: " + this.shipCoords[0].getX() + " " + this.shipCoords[0].getY());
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

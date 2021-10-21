package main.battleship;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.awt.*;
import java.util.*;

public class GameHelper {
    public static boolean gameIsActive = true;
    private static boolean[][] grid;
    private static int invalidAttempts = 0;
    final private static int maxInvalidAttempts = 3;

    public static Integer getUserInput(int bound) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a whole number:");
        String response = scanner.nextLine();
        return validateResponse(response, bound);
    }

    public static void handleInvalidAttempt() {
        invalidAttempts++;
        if (invalidAttempts == maxInvalidAttempts) {
            System.out.println("You have exceeded the maximum number of invalid guesses, you lose!");
            gameIsActive = false;
        }
    }

    private static Integer validateResponse(String respToValidate, int maxNum) {
        boolean isParsable = isInt(respToValidate);
        if (!isParsable) {
            System.out.println("Not a whole number! Try again");
            return -1;
        }
        int respToInt = Integer.parseInt(respToValidate);
        if(respToInt > maxNum) {
            System.out.println("Response out of bounds, please try again");
            return -1;
        }
        return respToInt;
    }

    public static void generateGrid(int numCol, int numRow) {
        grid = new boolean[numCol][numRow];
        for (int i=0; i<numCol; i++) {
            for (int j = 0; j < numRow; j++) {
                grid[i][j] = false;
            }
        }
    }

    public static void fillCoords(Ship ship) {
        int x = (int)ship.getCoords()[0].getX();
        int y = (int)ship.getCoords()[0].getY();
        boolean startPointTaken = grid[x][y];
        if (!startPointTaken)
            tryToPlaceRestOfShip(ship,x,y);
    }

    private static synchronized void tryToPlaceRestOfShip(Ship ship,int x,int y) {
        int lastIdx = ship.getCoords().length-1;
        if (ship.getCoords()[lastIdx] == null) {
            tryUp(ship, x, y);
        }
        if (ship.getCoords()[lastIdx] == null) {
            tryDown(ship, x, y);
        }
        if (ship.getCoords()[lastIdx] == null) {
            tryLeft(ship, x, y);
        }
        if (ship.getCoords()[lastIdx] == null) {
            tryRight(ship, x, y);
        }
    }

    private static void tryUp(Ship ship,int x,int y) {
        for (int i = 1; i < ship.getCoords().length; i++) {
            y = y+i;
            if (!grid[x][y]) {
                grid[x][y] = true;
                ship.setCoordsByIdx(i,new Point(x,y));
            } else {
                for (int j = i; j > 0; j--) {
                    y = y+j;
                    grid[x][y] = false;
                    ship.setCoordsByIdx(j,null);
                }
            }
        }
    }

    private static void tryDown(Ship ship,int x,int y) {
        for (int i = 1; i < ship.getCoords().length; i++) {
            y = y-i;
            if (!grid[x][y]) {
                grid[x][y] = true;
                ship.setCoordsByIdx(i,new Point(x,y));
            } else {
                for (int j = i; j > 0; j--) {
                    y = y-j;
                    grid[x][y] = false;
                    ship.setCoordsByIdx(j,null);
                }
            }
        }
    }

    private static void tryLeft(Ship ship,int x,int y) {
        for (int i = 1; i < ship.getCoords().length; i++) {
            x = x-i;
            if (!grid[x][y]) {
                grid[x][y] = true;
                ship.setCoordsByIdx(i,new Point(x,y));
            } else {
                for (int j = i; j > 0; j--) {
                    x = x-j;
                    grid[x][y] = false;
                    ship.setCoordsByIdx(j,null);
                }
            }
        }
    }

    private static void tryRight(Ship ship,int x,int y) {
        for (int i = 1; i < ship.getCoords().length; i++) {
            x = x+i;
            if (!grid[x][y]) {
                grid[x][y] = true;
                ship.setCoordsByIdx(i,new Point(x,y));
            } else {
                for (int j = i; j > 0; j--) {
                    x = x+j;
                    grid[x][y] = false;
                    ship.setCoordsByIdx(j,null);
                }
            }
        }
    }

    private static boolean isInt(String resp) {
        try {
            Integer.parseInt(resp);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Contract(pure = true)
    private static String getCharForNumber(int num) {
        return String.valueOf((char)(num+64));
    }
}

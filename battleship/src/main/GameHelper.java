package main;

import org.jetbrains.annotations.Contract;

import java.awt.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GameHelper {
    public static boolean gameIsActive = true;
    private static boolean[][] grid;
    private static int invalidAttempts = 0;
    final private static int maxInvalidAttempts = 3;

    public static Point getUserInput(Point gridMax) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter an alphanumeric:");
        String response = scanner.nextLine();
        return parsedResponse(response,gridMax);
    }

    private static Point parsedResponse(String respToValidate, Point gridMax) {
        Pattern rgx = Pattern.compile("([A-Z]|[a-z])(\\d+)");
        Matcher m = rgx.matcher(respToValidate);
        if (m.matches()) {
            int guessX = validateFirst(m.group(1), (int)gridMax.getX());
            int guessY = validateSecond(m.group(2), (int)gridMax.getY());
            System.out.println(guessX);
            System.out.println(guessY);
            return new Point(guessX,guessY);
        } else {
            System.out.println("Input not alphanumeric! Try again");
            return new Point(-1,-1);
        }
    }

    private static Integer validateFirst(String firstInput, int bound) {
        int charAsNum = getNumberForCharFromString(firstInput);
        if (charAsNum > bound) {
            System.out.println("First character of input out of bounds, please try again");
            return -1;
        }
        return charAsNum;
    }

    private static Integer validateSecond(String secondInput, int bound) {
        boolean isParsable = isInt(secondInput);
        if (!isParsable) {
            System.out.println("Second character of input not a whole number! Try again");
            return -1;
        }
        int respToInt = Integer.parseInt(secondInput);
        if(respToInt > bound) {
            System.out.println("Second character of input out of bounds, please try again");
            return -1;
        }
        return respToInt;
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
    private static Integer getNumberForCharFromString(String letter) {
        char ch = letter.charAt(0);
        return ((int)ch - 'A');
    }

    public static void handleInvalidAttempt() {
        invalidAttempts++;
        if (invalidAttempts == maxInvalidAttempts) {
            System.out.println("You have exceeded the maximum number of invalid guesses, you lose!");
            gameIsActive = false;
        }
    }

    public static void printGrid() {
        for (int i = 0; i < grid.length-1; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < grid[j].length-1; j++) {
                String cellIcon = "";
                if (grid[i][j])
                    cellIcon = "X";
                else
                    cellIcon = "O";
                sb.append("[").append(cellIcon).append("]");
            }
            System.out.println(sb);
        }
    }

    public static void generateGrid(int numCol, int numRow) {
        grid = new boolean[numCol][numRow];
        for (int i=0; i<numCol; i++) {
            for (int j = 0; j < numRow; j++) {
                grid[i][j] = false;
            }
        }
    }

    public static void tryToPopulateCoordsInGrid(Ship ship) {
        int x = (int)ship.getCoords()[0].getX();
        int y = (int)ship.getCoords()[0].getY();
        System.out.println("DEBUG Inital ship coords: " + x + " " + y);
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

    public static synchronized boolean[][] getGrid() {
        return grid;
    }

    public static synchronized void setGrid(int x, int y, boolean t) {
        grid[x][y] = t;
    }
}

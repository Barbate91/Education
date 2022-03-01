/* Author: jake.armstrong
TODO: Refactor hit tracking
      Refactor guessing to parse alphanumerics
      Support for user arguments
      Rectangular grid size
      Print grid
      Ship HP Tracker
 */

package main;

import java.awt.Point;
import java.util.ArrayList;
import java.util.List;

public class Game {
    private static int numOfGuesses = 0;
    private static int totalGuesses = 15;
    private static int hits = 0;
    private static int shipSize = 3;
    private static Point gridMax = new Point(6,6);
    private static boolean isHit;
    private static List<Ship> ships = new ArrayList<>();

    public void startGame() {
        initGridAndShips();
        printGameRules();

        while(GameHelper.gameIsActive) {
            GameHelper.printGrid();
            Point guess = GameHelper.getUserInput(gridMax);
            if (guess.getY() != -1 || guess.getX() != -1) {
                ships.forEach(ship -> {
                    updateHits(ship.checkForHit(guess));
                    checkGameStatus();
                });
                updateGuesses();
            } else {
                GameHelper.handleInvalidAttempt();
            }
        }
    }

    private static void initGridAndShips() {
        int x = (int)gridMax.getX();
        int y = (int)gridMax.getY();
        GameHelper.generateGrid(x,y);

        for (int i = 0; i < ships.size(); i++) {
           ships.add(new Ship(x-1, y-1, shipSize));
        }
    }

    private static void updateHits(boolean isHit) {
        if(isHit) {
          hits++;
        }
    }

    private static void updateGuesses() {
        numOfGuesses++;
    }

    private static void checkGameStatus() {
        if (hits == shipSize*ships.size()) {
            System.out.println("You have sunk the battleships! You win!");
            GameHelper.gameIsActive = false;
        } else if (numOfGuesses == totalGuesses) {
            System.out.println("You have run out of guesses before sinking the battleship! You lose!");
            GameHelper.gameIsActive = false;
        }
    }

    private static void printGameRules() {
        System.out.println("There are 3 " + shipSize + " unit wide ships");
        System.out.println(" in a " + (gridMax.getX()+1) + "x" + (gridMax.getY()+1) + " unit wide grid");
        System.out.println("You have " + totalGuesses + " guesses to target and sink the ship");
        System.out.println("When prompted, enter an alphanumeric (ex: A1) to guess where the ship is");
    }
}

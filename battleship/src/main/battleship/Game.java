/* Author: jake.armstrong
TODO: Refactor hit tracking
      Refactor guessing to parse alphanumerics
      Support for user arguments
      Rectangular grid size
      Print grid
      Ship HP Tracker
 */

package main.battleship;

import java.awt.*;

public class Game {
    private static int numOfGuesses = 0;
    private static int totalGuesses = 15;
    private static int hits = 0;
    private static int shipSize = 3;
    private static Point gridMax = new Point(6,6);
    private static boolean isHit;

    public static void startGame() {
        initGridAndShips();

        System.out.println("There are 3 " + shipSize + " unit wide ships");
        System.out.println(" in a " + (gridMax.getX()+1) + "x" + (gridMax.getY()+1) + " unit wide grid");
        System.out.println("You have " + totalGuesses + " guesses to target and sink the ship");
        System.out.println("When prompted, enter an alphanumeric (ex: A1) to guess where the ship is");

        while(GameHelper.gameIsActive) {
            Point guess = GameHelper.getUserInput(gridMax);
            if (guess != -1) {
                isHit = battleship.checkForHit(guess);
                updateHitsAndGuesses(isHit);
                checkGameStatus();
            } else {
                GameHelper.handleInvalidAttempt();
            }
        }
    }

    private static void initGridAndShips() {
        GameHelper.generateGrid(gridSize, gridSize);
        Ship[] ships = new Ship[3];

        for (int i = 0; i < ships.length; i++) {
            ships[i] = new Ship(gridSize-1, gridSize-1, shipSize);
        }
    }

    private static void updateHitsAndGuesses(boolean isHit) {
        if(isHit) {
          hits++;
        }
        numOfGuesses++;
    }

    private static void checkGameStatus() {
        if (hits == shipSize) {
            System.out.println("You have sunk the battleship! You win!");
            GameHelper.gameIsActive = false;
        } else if (numOfGuesses == totalGuesses) {
            System.out.println("You have run out of guesses before sinking the battleship! You lose!");
            GameHelper.gameIsActive = false;
        }
    }
}

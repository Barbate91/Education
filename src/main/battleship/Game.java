/* Author: jake.armstrong
TODO: Support for user arguments
      Rectangular grid size
      Print grid
      Ship HP Tracker
 */

package main.battleship;

public class Game {
    private static int numOfGuesses = 0;
    private static int totalGuesses = 4;
    private static int hits = 0;
    private static int numShips = 3;
    private static int shipSize = 3;
    private static int gridSize = 7;
    private static boolean isHit;

    public static void startGame() {
        GameHelper.generateGrid(gridSize, gridSize);

        Ship battleship = new Ship(gridSize-1, gridSize-1, shipSize);


        System.out.println("There is a " + shipSize + " unit wide ship in a " + (gridSize+1) + " unit wide grid");
        System.out.println("You have " + totalGuesses + " guesses to target and sink the ship");
        System.out.println("When prompted, enter a whole number between 0 and " + gridSize + " to guess where the ship is");

        while(GameHelper.gameIsActive) {
            int guess = GameHelper.getUserInput(gridSize);
            if (guess != -1) {
                isHit = battleship.checkForHit(guess);
                updateHitsAndGuesses(isHit);
                checkGameStatus();
            } else {
                GameHelper.handleInvalidAttempt();
            }
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

package main.battleship;

public class Game {
    private static int numOfGuesses = 0;
    private static int totalGuesses = 4;
    private static int hits = 0;
    private static int shipSize = 3;
    private static int gridSize = 6;
    private static boolean isHit;
    private static GameHelper helper = new GameHelper();

    public static void startGame() {
        Ship battleship = new Ship(gridSize, shipSize);


        System.out.println("There is a " + shipSize + " unit wide ship in a " + (gridSize+1) + " unit wide grid");
        System.out.println("You have " + totalGuesses + " guesses to target and sink the ship");
        System.out.println("When prompted, enter a whole number between 0 and " + gridSize + " to guess where the ship is");

        while(helper.gameIsActive) {
            int guess = helper.getUserInput(gridSize);
            if (guess != -1) {
                isHit = battleship.checkForHit(guess);
                updateHitsAndGuesses(isHit);
                checkGameStatus();
            } else {
                helper.handleInvalidAttempt();
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
            helper.gameIsActive = false;
        } else if (numOfGuesses == totalGuesses) {
            System.out.println("You have run out of guesses before sinking the battleship! You lose!");
            helper.gameIsActive = false;
        }
    }
}

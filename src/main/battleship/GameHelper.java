package main.battleship;

import com.sun.org.apache.xpath.internal.operations.Bool;

import java.util.*;

public class GameHelper {
    public boolean gameIsActive = true;
    public List<Map<String, Boolean>> grid;
    private int invalidAttempts = 0;
    final private int maxInvalidAttempts = 3;

    public void generateGrid(int gridCol, int gridRow) {
        //TODO: Need to implement constraints on gridCol amount
         grid = new ArrayList<Map<String,Boolean>>();
         for (int i=0; i<gridCol; i++) {
             Map<String,Boolean> row = new HashMap<String,Boolean>();
             row.put(getCharForNumber(i),false);
             grid.add(row);
         }
    }

    private String getCharForNumber(int num) {
            return String.valueOf((char)(i+64));
    }

    public Integer getUserInput(int bound) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a whole number:");
        String response = scanner.nextLine();

        int validatedResponse = validateResponse(response, bound);
        return validatedResponse;
    }

    public void handleInvalidAttempt() {
        invalidAttempts++;
        if (invalidAttempts == maxInvalidAttempts) {
            System.out.println("You have exceeded the maximum number of invalid guesses, you lose!");
            gameIsActive = false;
        }
    }

    private Integer validateResponse(String respToValidate, int maxNum) {
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

    private static boolean isInt(String resp) {
        try {
            Integer.parseInt(resp);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

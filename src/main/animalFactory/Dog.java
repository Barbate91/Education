package main.animalFactory;

public class Dog implements Animal {
    @Override
    public void speak() {
        System.out.println("Woof");
    }
}

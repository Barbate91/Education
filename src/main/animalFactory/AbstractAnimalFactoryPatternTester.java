package main.animalFactory;

public class AbstractAnimalFactoryPatternTester {
    public static void main(String[] args) {
        AbstractAnimalFactory animalFactory = AnimalFactoryProducer.getFactory("canine");

        Animal animal = animalFactory.getAnimal("dog");

        animal.speak();
    }
}

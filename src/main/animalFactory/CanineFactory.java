package main.animalFactory;

public class CanineFactory extends AbstractAnimalFactory {
    @Override
    public Animal getAnimal(String animalType) {
        if (animalType.equalsIgnoreCase("DOG")) {
            return new Dog();
        }
        return null;
    }
}

package main.animalFactory;

public class BovineFactory extends AbstractAnimalFactory {
    @Override
    public Animal getAnimal(String animalType) {
        if (animalType.equalsIgnoreCase("BOVINE")){
            return new Cow();
        }
        return null;
    }
}

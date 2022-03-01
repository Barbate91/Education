package main.animalFactory;

public class AnimalFactoryProducer {

    public static AbstractAnimalFactory getFactory(String species) {
        if (species.equalsIgnoreCase("canine")) {
            return new CanineFactory();
        } else if (species.equalsIgnoreCase("bovine")) {
            return new BovineFactory();
        } else {
            return null;
        }
    }
}

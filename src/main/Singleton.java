package main;

class Singleton {
	private static Singleton single_instance = null;

	public String s;

	private Singleton() {
		s = "Hello world singleton";
	}

	public static Singleton getInstance() {
		if (single_instance == null) {
			single_instance = new Singleton();
		}
		return single_instance;
	}
}


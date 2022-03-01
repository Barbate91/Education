package main;

import java.util.Stack;

public class StackTester {
	public static void main(String[] args) {
		Stack<String> animals = new Stack<>();

		animals.push("dog");
		animals.push("horse");
		animals.push("cat");

		System.out.println("Stack: " + animals);

		animals.pop();
		System.out.println("Stack post-pop: " + animals);

		String head = animals.peek();
		System.out.println("Head of stack: " + head);
	}
}

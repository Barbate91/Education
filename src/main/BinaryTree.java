package main;

public class BinaryTree {
	Node root;

	public void traverseTree(Node node) {
		if (node != null) {
			traverseTree(node.left);
			System.out.println(" " + node.key);
			traverseTree(node.right);
		}
	}

	public static void invertTree(Node node) {
		if (node == null) {
			return;
		}

		Node temp = node.left;
		node.left = node.right;
		node.right = temp;

		invertTree(node.left);
		invertTree(node.right);
	}
}

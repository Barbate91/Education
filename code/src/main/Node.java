package main;

public class Node {
	int key;
	Node left, right;

	public Node(int item) {
		key = item;
		left = right = null;
	}

	public Node getLeftNode(Node node) { return node.left; }

	public Node getRightNode(Node node) {
		return node.right;
	}

	public void setLeftNode(Node newLeft) {
		this.left = newLeft;
	}

	public void setRightNode(Node newRight) {
		this.right = newRight;
	}

}

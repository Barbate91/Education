import java.util.SortedSet;

public class BinaryTree {
	Node root;

	public void traverseTree(Node node) {
		if (node != null) {
			traverseTree(node.left);
			System.out.println(" " + node.key);
			traverseTree(node.right);
		}
	}

	public static void main(String[] args) {
		BinaryTree tree = new BinaryTree();

		tree.root = new Node(1);
		tree.root.left = new Node(2);
		tree.root.right = new Node(3);
		tree.root.left.left = new Node(4);

		System.out.println("\nBinary Tree: ");
		tree.traverseTree(tree.root);
	}
}

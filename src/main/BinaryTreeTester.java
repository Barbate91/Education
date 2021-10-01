package main;

public class BinaryTreeTester extends BinaryTree{
    public static void main(String[] args) {
        //===================================//
        // Original binary tree implementation
        //===================================//
        BinaryTree tree = new BinaryTree();

        tree.root = new Node(1);
        tree.root.left = new Node(2);
        tree.root.right = new Node(3);
        tree.root.left.left = new Node(4);

        System.out.println("\nBinary Tree: ");
        tree.traverseTree(tree.root);

        //===================================//
        // Invert tree with recursion
        //===================================//
        BinaryTree.invertTree(tree.root);

        System.out.println("\nInverted Tree: ");
        tree.traverseTree(tree.root);

        //===================================//
        // Create binary tree with new setters
        //===================================//
        BinaryTree newTree = new BinaryTree();

        newTree.root = new Node(1);
        newTree.root.setLeftNode(new Node(2));
        newTree.root.setRightNode(new Node(3));
        newTree.root.left.setLeftNode(new Node(4));

        System.out.println("\nNew Binary Tree: ");
        newTree.traverseTree(newTree.root);

    }
}
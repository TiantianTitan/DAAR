package Projet_1;

import java.util.Scanner;



public class Main {

    public static void main(String[] args) {
        int choice = 0;
        while (choice != 3 ){
            
            System.out.println("We provide 2 methodes :");
            System.out.println("1. Egrep Methode");
            System.out.println("2. KMP Search");
            System.out.println("3. Exit");
            System.out.println("Please choose the methode you want : ");
        
            Scanner sc = new Scanner(System.in);
            choice = sc.nextInt();
            System.out.println("");
            sc.skip("\n");
        
            switch (choice) {
                case 1 : {
                    String[] patterns = new String[2];

                    System.out.println("Please enter the Regex :");
                    String Regex = sc.nextLine();
                    patterns[0] = Regex;
                    System.out.println("Please enter the filename : ");
                    String filename = sc.nextLine();
                    patterns[1] = filename;
                    long t1 = System.currentTimeMillis();
                    EgrepClone.main(patterns);
                    long t2 = System.currentTimeMillis();
                    System.out.print("Time Used :" );
                    System.out.print(t2-t1);
                    System.out.println("ms");
                    System.out.println("\n");
                }   

                case 2 : {
                    System.out.println("Please enter the number of text : ");
                    int number = sc.nextInt();
                    sc.skip("\n");
                    String[] patterns = new String[number + 1];
                    System.out.println("Please enter the text(s) : ");
                    for (int i = 1; i < number + 1; i++)
                    {
                        String pattern = sc.nextLine();
                        patterns[i] = pattern;
                    }
                    System.out.println("Please enter the filename : ");
                    String filename = sc.nextLine();
                    patterns[0] = filename;
                    long t1 = System.currentTimeMillis();
                    KMPPatternSearch.main(patterns);
                    long t2 = System.currentTimeMillis();
                    System.out.print("Time Used :" );
                    System.out.print(t2-t1);
                    System.out.println("ms");
                    System.out.println("\n");
                    System.out.println("\n");
                }

            case 3 : System.exit(0);
            }
        }
    }
        
}

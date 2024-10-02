package TME2_Haotian;


public class Lts {

    public static int[] lts(String pattern){

        int length = pattern.length();

        int[] lts = new int[length];
        lts[0] = -1; 
        lts[1] = 0 ; // i = 0, pour pattern[0] il y a pas de préfix

        int i = 1;
        int len = 0;

        // exemple: mamamia
        while(i<length){
            if(pattern.charAt(i) == pattern.charAt(len)){
                len++;
                lts[i] = len;
                i++;
            }
            else{
                if(len == 0){
                    lts[i] = 0;
                    i++;
                }else{
                        len = lts[len-1] == -1?0:lts[len-1];
                }
            }
        }

        return lts;
    }


    public static String printArray(int[] array) {
        StringBuilder sb = new StringBuilder();
        sb.append("["); // Début du format
        for (int i = 0; i < array.length; i++) {
            sb.append(array[i]); // Ajouter l'élément au StringBuilder
            if (i < array.length - 1) {
                sb.append(";"); // Ajouter un point-virgule après chaque élément sauf le dernier
            }
        }
        sb.append("]"); // Fin du format
        return sb.toString();
    }

    public static void main(String[] args) 
    { 
        int[] print = Lts.lts("mamamia");

        System.out.println(printArray(print));

    }
}

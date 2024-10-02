package TME2_Haotian;

public class CarryOver {


    private int[] lts;

    public CarryOver(String pattern){
        this.lts = Lts.lts(pattern);
        int length = lts.length;
        
        for(int i = 0; i < length; i++){
            if(pattern.charAt(i)== pattern.charAt(lts[i]) && lts[lts[i]] ==-1) lts[i] = -1;
            if(pattern.charAt(i)== pattern.charAt(lts[i]) && lts[lts[i]] !=-1) lts[i] =lts[lts[i]];
        }
    }

    public int[] getCarryOver(){
        return this.lts;
    }




}

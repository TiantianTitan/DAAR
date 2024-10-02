package Projet_1;

import java.util.HashMap;
import java.util.Map;

public class DFAState {
    int id;
    Map<Character, DFAState> transitions = new HashMap<>();
    boolean isAccept;

    public DFAState(int id) {
        this.id = id;
    }
}

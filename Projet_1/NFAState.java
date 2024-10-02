package Projet_1;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class NFAState {
    int id;
    Map<Character, Set<NFAState>> transitions = new HashMap<>();
    boolean isAccept;

    public NFAState(int id) {
        this.id = id;
    }

    public void addTransition(char c, NFAState state) {
        transitions.computeIfAbsent(c, k -> new HashSet<>()).add(state);
    }
}

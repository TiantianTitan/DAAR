package Projet_1;

public class NFA {
    NFAState start;
    NFAState end;

    public NFA(NFAState start, NFAState end) {
        this.start = start;
        this.end = end;
    }

    // 示例：构建简单的NFA，例如匹配字符串 "ab"
    public static NFA buildExampleNFA() {
        NFAState s0 = new NFAState(0);
        NFAState s1 = new NFAState(1);
        NFAState s2 = new NFAState(2);
        s0.addTransition('a', s1);
        s1.addTransition('b', s2);
        s2.isAccept = true;
        return new NFA(s0, s2);
    }
}
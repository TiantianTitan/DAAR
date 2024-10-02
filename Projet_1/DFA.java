package Projet_1;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.Stack;

class DFA {
    DFAState start;
    Set<DFAState> states = new HashSet<>();

    public DFA(DFAState start) {
        this.start = start;
        states.add(start);
    }

    public static DFA convertNFAtoDFA(NFA nfa) {
        Map<Set<NFAState>, DFAState> stateMap = new HashMap<>();
        Queue<Set<NFAState>> queue = new LinkedList<>();

        // 初始状态：NFA的起始状态的ε-闭包
        Set<NFAState> startSet = epsilonClosure(Collections.singleton(nfa.start));
        DFAState dfaStart = new DFAState(0);
        dfaStart.isAccept = startSet.stream().anyMatch(s -> s.isAccept);
        stateMap.put(startSet, dfaStart);
        queue.add(startSet);
        int dfaStateId = 1;

        DFA dfa = new DFA(dfaStart);

        while (!queue.isEmpty()) {
            Set<NFAState> currentSet = queue.poll();
            DFAState currentDFAState = stateMap.get(currentSet);

            // 获取所有可能的输入符号
            Set<Character> symbols = new HashSet<>();
            for (NFAState state : currentSet) {
                symbols.addAll(state.transitions.keySet());
            }
            symbols.remove(null); // 移除ε

            for (char symbol : symbols) {
                Set<NFAState> moveSet = move(currentSet, symbol);
                Set<NFAState> closureSet = epsilonClosure(moveSet);

                if (closureSet.isEmpty()) continue;

                DFAState targetDFAState = stateMap.get(closureSet);
                if (targetDFAState == null) {
                    targetDFAState = new DFAState(dfaStateId++);
                    targetDFAState.isAccept = closureSet.stream().anyMatch(s -> s.isAccept);
                    stateMap.put(closureSet, targetDFAState);
                    queue.add(closureSet);
                    dfa.states.add(targetDFAState);
                }
                currentDFAState.transitions.put(symbol, targetDFAState);
            }
        }

        return dfa;
    }

    private static Set<NFAState> epsilonClosure(Set<NFAState> states) {
        Stack<NFAState> stack = new Stack<>();
        Set<NFAState> closure = new HashSet<>(states);
        stack.addAll(states);

        while (!stack.isEmpty()) {
            NFAState state = stack.pop();
            // 假设ε表示为null
            Set<NFAState> epsilonTransitions = state.transitions.get(null);
            if (epsilonTransitions != null) {
                for (NFAState s : epsilonTransitions) {
                    if (!closure.contains(s)) {
                        closure.add(s);
                        stack.push(s);
                    }
                }
            }
        }
        return closure;
    }

    private static Set<NFAState> move(Set<NFAState> states, char symbol) {
        Set<NFAState> result = new HashSet<>();
        for (NFAState state : states) {
            Set<NFAState> trans = state.transitions.get(symbol);
            if (trans != null) {
                result.addAll(trans);
            }
        }
        return result;
    }

    // DFA匹配函数
    public boolean matches(String text) {
        DFAState current = start;
        for (char c : text.toCharArray()) {
            current = current.transitions.get(c);
            if (current == null) {
                return false;
            }
        }
        return current.isAccept;
    }
}

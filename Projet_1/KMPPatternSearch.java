package Projet_1;

import java.io.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class KMPPatternSearch {

    public static void computeLTS(String pattern, int[] LTS) {
        int M = pattern.length();
        LTS[0] = -1;
        LTS[1] = 0;
        int j = 0;

        for (int i = 2; i <= M; i++) {
            while (j > 0 && pattern.charAt(i - 1) != pattern.charAt(j)) {
                j = LTS[j];
            }
            if (pattern.charAt(i - 1) == pattern.charAt(j)) {
                j++;
            }
            LTS[i] = j;
        }
    }

    public static void computeCarryOver(String pattern, int[] LTS, int[] CarryOver) {
        int M = pattern.length();
        System.arraycopy(LTS, 0, CarryOver, 0, LTS.length);

        for (int i = 1; i <= M; i++) {
            int carryOverI = CarryOver[i];
            if (carryOverI == -1) {
                continue;
            }
            if (carryOverI < 0 || carryOverI >= M) {
                continue;
            }
            if (pattern.charAt(i % M) == pattern.charAt(carryOverI)) {
                if (CarryOver[carryOverI] == -1) {
                    CarryOver[i] = -1;
                } else {
                    CarryOver[i] = LTS[LTS[i]];
                }
            }
        }
    }

    public static void KMPSearchInLine(String text, String pattern, int lineNumber, AtomicInteger failCount) {
        int N = text.length();
        int M = pattern.length();
    
        int[] LTS = new int[M + 1];
        int[] CarryOver = new int[M + 1];
    
        computeLTS(pattern, LTS);
        computeCarryOver(pattern, LTS, CarryOver);
    
        int i = 0;
        int j = 0;
        boolean found = false;
    
        while (i < N) {
            if (j == -1 || pattern.charAt(j) == text.charAt(i)) {
                i++;
                j++;
            } else {
                j = CarryOver[j];
            }
    
            if (j == M) {
                // 打印找到的模式位置及所在行的文本
                System.out.printf("Line %d: %s \n",lineNumber, text);
                found = true;
                j = 0;
                break;
            }
        }
    
        if (!found) {
            failCount.incrementAndGet();
        }
    }
    

    public static List<String> readTextFileByLines(String filename) {
        List<String> lines = new ArrayList<>();
        try (BufferedReader file = new BufferedReader(new FileReader(filename))) {
            String buffer;
            while ((buffer = file.readLine()) != null) {
                lines.add(buffer);
            }
        } catch (IOException e) {
            System.out.println("Can't open file " + filename);
            return null;
        }
        return lines;
    }

    public static class ThreadData {
        List<String> lines;
        String pattern;
        AtomicInteger failCount;
        AtomicInteger currentIndex;

        public ThreadData(List<String> lines, String pattern, AtomicInteger failCount, AtomicInteger currentIndex) {
            this.lines = lines;
            this.pattern = pattern;
            this.failCount = failCount;
            this.currentIndex = currentIndex;
        }
    }

    public static class SearchInThread implements Runnable {
        ThreadData data;

        public SearchInThread(ThreadData data) {
            this.data = data;
        }

        @Override
        public void run() {
            int lineIndex;
            while ((lineIndex = data.currentIndex.getAndIncrement()) < data.lines.size()) {
                KMPSearchInLine(data.lines.get(lineIndex), data.pattern, lineIndex + 1, data.failCount);
            }
        }
    }

    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Usage: java KMPPatternSearch <filename> <pattern>");
            return;
        }

        String filename = args[0];
        String pattern = args[1];

        List<String> lines = readTextFileByLines(filename);
        if (lines == null) {
            return;
        }

        AtomicInteger failCount = new AtomicInteger(0);
        AtomicInteger currentIndex = new AtomicInteger(0);

        ThreadData threadData = new ThreadData(lines, pattern, failCount, currentIndex);

        int numThreads = 128; // 可以根据需要调整线程数
        Thread[] threads = new Thread[numThreads];

        // 创建并启动线程
        for (int i = 0; i < numThreads; i++) {
            threads[i] = new Thread(new SearchInThread(threadData));
            threads[i].start();
        }

        // 等待所有线程完成
        for (int i = 0; i < numThreads; i++) {
            try {
                threads[i].join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        if (failCount.get() == lines.size()) {
            System.out.println("404 Text Not Found for pattern: " + pattern);
        }
    }
}
package Projet_1;

import java.io.*;
import java.util.regex.*;
import java.nio.file.*;

public class EgrepClone {

    public static void main(String[] args) {
        // 验证输入参数是否正确
        if (args.length < 2) {
            System.out.println("Usage: java EgrepClone <pattern> <file>");
            return;
        }

        String pattern = args[0];  // 用户输入的正则表达式
        String filePath = args[1]; // 要搜索的文件路径

        // 仅支持规定的正则表达式操作
        if (!isValidPattern(pattern)) {
            System.err.println("Invalid pattern. Only (, ), |, *, ., +, and ASCII letters are allowed.");
            return;
        }

        // 读取文件并根据正则表达式进行匹配
        try {
            Path path = Paths.get(filePath);
            BufferedReader reader = Files.newBufferedReader(path);
            String line;
            int lineNumber = 0;

            // 编译用户输入的正则表达式
            Pattern compiledPattern = Pattern.compile(pattern);

            // 逐行读取文件，并进行匹配
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                Matcher matcher = compiledPattern.matcher(line);
                if (matcher.find()) {
                    // 输出匹配行，并标记行号
                    System.out.println("Line " + lineNumber + ": " + line);
                }
            }
            reader.close();
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        } catch (PatternSyntaxException e) {
            System.err.println("Invalid regular expression syntax: " + e.getMessage());
        }
    }

    // 仅允许 (, ), |, *, ., + 和 ASCII 字符的正则表达式
    private static boolean isValidPattern(String pattern) {
        // 使用正则表达式确保只包含允许的字符
        return pattern.matches("[a-zA-Z|().*+]*");
    }
}

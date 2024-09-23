#include <stdio.h>
#include <string.h>

// 函数声明
void computeLTS(const char* pattern, int M, int* LTS);
void computeCarryOver(const char* pattern, int M, int* LTS, int* CarryOver);

// 计算 LTS 数组
void computeLTS(const char* pattern, int M, int* LTS) {
    LTS[0] = -1;  // 设定LTS[0]为-1
    LTS[1] = 0;   // 处理 LTS[1]

    int j = 0;    // 前缀长度

    for (int i = 2; i < M; i++) {
        while (j > 0 && pattern[i - 1] != pattern[j]) {
            j = LTS[j];  // 回溯前缀长度
        }
        if (pattern[i - 1] == pattern[j]) {
            j++;
        }
        LTS[i] = j;
    }
}

// 计算 CarryOver 数组
void computeCarryOver(const char* pattern, int M, int* LTS, int* CarryOver) {
    // 初始化 CarryOver 数组
    for (int i = 0; i < M; i++) {
        CarryOver[i] = LTS[i];
    }
    
    // 根据规则调整 CarryOver 数组
    for (int i = 1; i < M; i++) {
        if (pattern[i] == pattern[CarryOver[i]] && CarryOver[CarryOver[i]] == -1) {
            CarryOver[i] = -1;
        } else if (pattern[i] == pattern[CarryOver[i]] && CarryOver[CarryOver[i]] != -1) {
            CarryOver[i] = LTS[LTS[i]];
        } 
        // 如果前面的两个条件都不满足，CarryOver[i] 保持为 LTS[i]。
    }
}

int main() {
    const char* pattern = "mamamia";
    int M = strlen(pattern) + 1;  // 模式串长度 + 1 因为 LTS[0] = -1

    int LTS[M];
    int CarryOver[M];

    computeLTS(pattern, M, LTS);

    computeCarryOver(pattern, M, LTS, CarryOver);

    printf("LTS is:\n");
    for (int i = 0; i < M; i++) {
        printf("%d ", LTS[i]);
    }
    printf("\n");

    printf("CarryOver is:\n");
    for (int i = 0; i < M; i++) {
        printf("%d ", CarryOver[i]);
    }
    printf("\n");

    return 0;
}

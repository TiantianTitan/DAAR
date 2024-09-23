#include <stdio.h>
#include <string.h>

void computeLTS(const char* pattern, int M, int* LTS);
void computeCarryOver(const char* pattern, int M, int* LTS, int* CarryOver);

void computeLTS(const char* pattern, int M, int* LTS) {
    LTS[0] = -1;  // LTS[0]固定为-1
    LTS[1] = 0;   // LTS[1]固定为0

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

void computeCarryOver(const char* pattern, int M, int* LTS, int* CarryOver) {

    for (int i = 0; i < M; i++) {
        CarryOver[i] = LTS[i];
    }
    
    for (int i = 1; i < M; i++) {
        if (pattern[i] == pattern[CarryOver[i]] && CarryOver[CarryOver[i]] == -1) {
            CarryOver[i] = -1;
        } else if (pattern[i] == pattern[CarryOver[i]] && CarryOver[CarryOver[i]] != -1) {
            CarryOver[i] = LTS[LTS[i]];
        } 
    }
}

int main() {
    const char* pattern = "mamamia";
    int M = strlen(pattern) + 1; 

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

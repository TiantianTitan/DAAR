#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void computeLTS(const char* pattern, int M, int* LTS);
void computeCarryOver(const char* pattern, int M, int* LTS, int* CarryOver);

void computeLTS(const char* pattern, int M, int* LTS) {
    LTS[0] = -1;  
    LTS[1] = 0;  

    int j = 0;    

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


void KMPSearchInLine(const char* text, const char* pattern, int lineNumber) {
    int N = strlen(text);    
    int M = strlen(pattern); 

    int LTS[M + 1];
    int CarryOver[M + 1];

    computeLTS(pattern, M + 1, LTS);
    computeCarryOver(pattern, M + 1, LTS, CarryOver);

    int i = 0;
    int j = 0;
    int found = 0;

    while (i < N) {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }

        if (j == M) {
            printf("We found the text at line %d, at position %d \n", lineNumber, i - j);
            found = 1;
            j = CarryOver[j];  // 继续寻找下一个匹配
        } else if (i < N && pattern[j] != text[i]) {
            if (j != 0) {
                j = CarryOver[j];
            } else {
                i++;
            }
        }
    }


    if (!found) {
        
    }
}

char** readTextFileByLines(const char* filename, int* lineCount) {
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        printf("Can't open file %s\n", filename);
        return NULL;
    }

    char** lines = NULL;
    char buffer[1024];
    *lineCount = 0;

    while (fgets(buffer, sizeof(buffer), file)) {
        (*lineCount)++;
        lines = realloc(lines, (*lineCount) * sizeof(char*));
        lines[*lineCount - 1] = strdup(buffer); 
    }

    fclose(file);
    return lines;
}

int main() {

    int lineCount = 0;
    const char* pattern = "Chihuahua";
    char** lines = readTextFileByLines("41011-0.txt", &lineCount);
    
    for (int i = 0; i < lineCount; i++) {
        KMPSearchInLine(lines[i], pattern, i + 1);
        free(lines[i]); 
    }

    return 0;
}

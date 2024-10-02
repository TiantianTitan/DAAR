#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>


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


void KMPSearchInLine(const char* text, const char* pattern, int lineNumber, int *failCount) {
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
            printf("We found the text %s at line %d, at position %d \n", pattern, lineNumber, i - j);
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
        (*failCount)++;
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

    int failCount1 = 0;
    int failCount2 = 0;
    int failCount3 = 0;
    int failCount4 = 0;
    int failCount5 = 0;

    const char* pattern1 = "Chihuahua";
    const char* pattern2 = "Pizzi";
    const char* pattern3 = "Pepperoni";
    const char* pattern4 = "Pizza";
    const char* pattern5 = "Poppers";

    char** lines = readTextFileByLines("41011-0.txt", &lineCount);

    
    printf("The Text1 is %s\n", pattern1);
    printf("The Text2 is %s\n", pattern2);
    printf("The Text3 is %s\n", pattern3);
    printf("The Text4 is %s\n", pattern4);
    printf("The Text5 is %s\n", pattern5);

    for (int i = 0; i < lineCount; i++) {

        KMPSearchInLine(lines[i], pattern1, i + 1, &failCount1);
        if (failCount1 == lineCount) 
            printf("404 Text Not Found! \n");


        KMPSearchInLine(lines[i], pattern2, i + 1, &failCount2);
        if (failCount2 == lineCount) 
            printf("404 Text2 Not Found! \n");

    
        KMPSearchInLine(lines[i], pattern3, i + 1, &failCount3);
        if (failCount3 == lineCount) 
            printf("404 Text3 Not Found! \n");


        KMPSearchInLine(lines[i], pattern4, i + 1, &failCount4);
        if (failCount4 == lineCount) 
            printf("404 Text4 Not Found! \n");


        KMPSearchInLine(lines[i], pattern5, i + 1, &failCount5);
        if (failCount5 == lineCount) 
            printf("404 Text5 Not Found! \n");
        
        free(lines[i]); 
    }

    return 0;
}

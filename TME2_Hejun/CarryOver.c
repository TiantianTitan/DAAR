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
            // 发现匹配，打印所在行和行的内容
            printf("Line %d: %s", lineNumber, text);
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


typedef struct {
    char** lines;
    int lineCount;
    const char* pattern;
    int* failCount;
    sem_t* previous_sem;
    sem_t* current_sem;
} ThreadData;

void* searchInThread(void* arg) {
    ThreadData* data = (ThreadData*)arg;

    sem_wait(data->previous_sem);  // 等待前一个线程完成

    // 在每个线程开始时打印对应的 pattern
    printf("Now searching for pattern: %s\n", data->pattern);

    for (int i = 0; i < data->lineCount; i++) {
        KMPSearchInLine(data->lines[i], data->pattern, i + 1, data->failCount);
        if (*(data->failCount) == data->lineCount) {
            printf("404 Text Not Found for pattern: %s\n", data->pattern);
        }
    }

    printf("\n\n");
    sem_post(data->current_sem);  // 通知下一个线程

    return NULL;
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

    pthread_t threads[5];
    sem_t semaphores[6];

    for (int i = 0; i < 6; i++) {
        sem_init(&semaphores[i], 0, 0);  // 初始化信号量
    }

    // 第一个信号量设置为1，启动第一个线程
    sem_post(&semaphores[0]);

    ThreadData threadData[5] = {
        {lines, lineCount, pattern1, &failCount1, &semaphores[0], &semaphores[1]},
        {lines, lineCount, pattern2, &failCount2, &semaphores[1], &semaphores[2]},
        {lines, lineCount, pattern3, &failCount3, &semaphores[2], &semaphores[3]},
        {lines, lineCount, pattern4, &failCount4, &semaphores[3], &semaphores[4]},
        {lines, lineCount, pattern5, &failCount5, &semaphores[4], &semaphores[5]},
    };

    // 创建线程
    for (int i = 0; i < 5; i++) {
        pthread_create(&threads[i], NULL, searchInThread, &threadData[i]);
    }

    // 等待所有线程完成
    for (int i = 0; i < 5; i++) {
        pthread_join(threads[i], NULL);
    }

    // 清理资源
    for (int i = 0; i < 6; i++) {
        sem_destroy(&semaphores[i]);
    }

    for (int i = 0; i < lineCount; i++) {
        free(lines[i]);
    }

    return 0;
}
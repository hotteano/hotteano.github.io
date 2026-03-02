---
title: "C++ Notes"
description: "本章为本人在C++编程方面的学习笔记，内容涵盖了C++语言的基础语法、面向对象编程、STL容器、算法实现等方面。通过系统地整理和总结相关知识点，旨在帮助读者更好地理解和掌握C++编程的核心内容。"
date: "2026-02-26"
draft: false
tags: ["notes", "C++"]
column: "学习笔记"
---

## 编译工具

### GCC（GNU Compiler Collection）、Clang（LLVM的C++编译器）和MSVC（Microsoft Visual C++）

C++ 程序从源代码到可执行文件需要经过**编译**和**链接**两个阶段。不同的编译器有各自的命令行选项和特性。

#### 编译

编译阶段将 `.cpp` 源文件转换为目标文件（`.o` 或 `.obj`）。

**常用编译器命令对比：**

```bash
# GCC / Clang
g++ -c main.cpp -o main.o          # 只编译，不链接
clang++ -c main.cpp -o main.o      # Clang 用法与 GCC 类似

# MSVC (Visual Studio)
cl /c main.cpp                     # 生成 main.obj
```

**常用编译选项：**

```bash
# 优化级别
-O0    # 无优化（调试模式）
-O2    # 常规优化（发布模式）
-O3    # 激进优化
-Os    # 优化代码大小
-g     # 生成调试信息

# C++ 标准版本
-std=c++11
-std=c++14
-std=c++17
-std=c++20

# 警告选项
-Wall          # 启用所有常见警告
-Wextra        # 启用额外警告
-Werror        # 将警告视为错误
-pedantic      # 严格遵循标准
```

> **重要：** 建议在开发阶段使用 `-Wall -Wextra -Werror`，可以尽早发现潜在问题。

**多文件编译示例：**

假设有以下项目结构：
```
project/
├── main.cpp
├── utils.cpp
└── utils.h
```

```cpp
// utils.h
#ifndef UTILS_H
#define UTILS_H

int add(int a, int b);
void print_result(int result);

#endif
```

```cpp
// utils.cpp
#include "utils.h"
#include <iostream>

int add(int a, int b) {
    return a + b;
}

void print_result(int result) {
    std::cout << "Result: " << result << std::endl;
}
```

```cpp
// main.cpp
#include "utils.h"

int main() {
    int sum = add(3, 5);
    print_result(sum);
    return 0;
}
```

编译命令：
```bash
# 分别编译每个源文件
g++ -c -std=c++17 -Wall main.cpp -o main.o
g++ -c -std=c++17 -Wall utils.cpp -o utils.o

# 链接生成可执行文件
g++ main.o utils.o -o my_program
```

> **易错点：** 忘记在编译时包含头文件路径。如果头文件不在当前目录，需要使用 `-I` 选项指定路径：
> ```bash
> g++ -I./include -c main.cpp -o main.o
> ```

##### Volatile关键字的使用

`volatile` 关键字告诉编译器，该变量的值可能随时被外部因素（如硬件、其他线程、信号处理程序）改变，**禁止编译器对该变量进行优化**。

**使用场景：**

1. **硬件寄存器访问**

```cpp
// 假设 0x1000 是硬件寄存器的内存地址
volatile uint32_t* const timer_register = 
    reinterpret_cast<volatile uint32_t*>(0x1000);

void wait_for_timer() {
    // 读取硬件寄存器，每次都必须从内存读取，不能用缓存值
    while (*timer_register != 0) {
        // 等待定时器完成
    }
}
```

> **重要：** 如果没有 `volatile`，编译器可能优化掉循环中的重复读取，导致程序死循环或错过硬件状态变化。

2. **多线程中的标志位（简单的同步机制）**

```cpp
#include <atomic>
#include <thread>
#include <iostream>

// 不推荐：普通 volatile 不能保证原子性和内存序
volatile bool stop_flag = false;

void worker_thread() {
    while (!stop_flag) {
        // 执行任务
    }
    std::cout << "Worker stopped" << std::endl;
}

// 推荐：C++11 以后使用 std::atomic
std::atomic<bool> atomic_stop_flag{false};

void better_worker_thread() {
    while (!atomic_stop_flag.load()) {
        // 执行任务
    }
}
```

> **易错点：** `volatile` **不是**线程同步原语！它不能保证操作的原子性，也不能防止指令重排序。多线程同步应该使用 `std::atomic` 或互斥锁。

3. **信号处理程序中的变量**

```cpp
#include <csignal>
#include <cstdlib>
#include <unistd.h>

volatile sig_atomic_t signal_received = 0;

void signal_handler(int sig) {
    signal_received = 1;  // 必须是 volatile，因为可能在任意时刻被修改
}

int main() {
    std::signal(SIGINT, signal_handler);
    
    while (!signal_received) {
        // 主循环
        sleep(1);
    }
    
    return 0;
}
```

> **重要：** 信号处理程序中只能使用 `volatile sig_atomic_t` 类型的变量，这是标准保证的原子类型。

**总结：什么时候用 volatile？**

| 场景 | 是否使用 volatile | 推荐替代方案 |
|------|------------------|-------------|
| 硬件寄存器访问 | ✅ 必须使用 | - |
| 信号处理程序变量 | ✅ 必须使用 | `sig_atomic_t` |
| 多线程共享变量 | ❌ 不要使用 | `std::atomic` |
| 普通变量优化控制 | ❌ 一般不需要 | 重新设计代码 |

#### 链接

链接阶段将多个目标文件和库文件合并成最终的可执行文件或库。

**链接类型：**

```bash
# 静态链接（将库代码复制到可执行文件中）
g++ main.o -static -o my_program_static

# 动态链接（运行时加载共享库）
g++ main.o -o my_program_dynamic
```

> **重要：** 静态链接的可执行文件更大，但部署简单；动态链接的文件小，但需要确保运行环境有对应的共享库。

**链接库文件：**

```bash
# 链接数学库（libm.a 或 libm.so）
g++ main.o -lm -o my_program

# 链接线程库
g++ main.o -lpthread -o my_program

# 指定库搜索路径
g++ main.o -L./libs -lmylib -o my_program

# 指定运行时库路径（Linux）
g++ main.o -Wl,-rpath,/path/to/libs -lmylib -o my_program
```

> **易错点：** 链接顺序很重要！被依赖的库要放在依赖它的库的后面：
> 正确：main 依赖 libA，libA 依赖 libB
> ```bash
> g++ main.o -lA -lB -o my_program
> ```
> 错误：可能导致未定义引用错误
> ```bash
> g++ main.o -lB -lA -o my_program
> ```
> 


**静态库与动态库的创建和使用：**

```bash
# 创建静态库（.a 文件）
ar rcs libmylib.a file1.o file2.o

# 创建动态库（.so 文件，Linux）
g++ -shared -fPIC file1.cpp file2.cpp -o libmylib.so

# 创建动态库（.dll 文件，Windows）
cl /LD file1.cpp file2.cpp /Femylib.dll
```

**常见链接错误及解决：**

```cpp
// undefined_reference.cpp
void external_function();  // 声明但未定义

int main() {
    external_function();  // 链接错误：undefined reference
    return 0;
}
```

```bash
# 错误示例：
$ g++ undefined_reference.cpp -o test
undefined_reference.cpp:(.text+0x5): undefined reference to `external_function()'
collect2: error: ld returned 1 exit status

# 解决方法：提供包含 external_function 定义的源文件或库
$ g++ undefined_reference.cpp external_lib.cpp -o test
```

> **易错点：** 头文件中声明了函数，但链接时找不到定义。可能原因：
> 1. 忘记编译包含定义的源文件
> 2. 函数定义被 `static` 修饰，只在当前文件可见
> 3. C++ 编译器编译了 C 代码，导致名称修饰（mangling）不匹配

**解决 C/C++ 混编的名称修饰问题：**

```cpp
// 在 C++ 代码中使用 C 库
#ifdef __cplusplus
extern "C" {
#endif

// C 函数的声明
void c_function1();
void c_function2();

#ifdef __cplusplus
}
#endif
```

### CMake（跨平台构建工具）

CMake 是一个跨平台的构建系统生成器，它根据 `CMakeLists.txt` 文件生成特定平台的构建文件（如 Makefile、Visual Studio 项目、Ninja 构建文件等）。

**基本项目结构：**

```
my_project/
├── CMakeLists.txt          # 根 CMake 配置文件
├── src/
│   ├── CMakeLists.txt
│   ├── main.cpp
│   └── utils.cpp
├── include/
│   └── utils.h
└── tests/
    └── test_main.cpp
```

**最简 CMakeLists.txt：**

```cmake
# 指定 CMake 最低版本要求
cmake_minimum_required(VERSION 3.10)

# 定义项目名称和版本
project(MyProject VERSION 1.0 LANGUAGES CXX)

# 指定 C++ 标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 添加可执行文件
add_executable(my_app src/main.cpp src/utils.cpp)

# 指定头文件搜索路径
target_include_directories(my_app PRIVATE include)

# 添加编译选项
target_compile_options(my_app PRIVATE -Wall -Wextra -Wpedantic)
```

**构建步骤：**

```bash
# 1. 创建构建目录（推荐 out-of-source 构建）
mkdir build && cd build

# 2. 生成构建文件
cmake ..

# 3. 编译项目
cmake --build .

# 或者使用原生构建工具（如 make）
make -j$(nproc)  # Linux，使用所有 CPU 核心
```

> **重要：** 始终使用 out-of-source 构建（在单独目录中构建），这样可以保持源代码目录整洁，方便清理构建产物。

**多目标项目示例：**

```cmake
cmake_minimum_required(VERSION 3.10)
project(Calculator VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# === 创建静态库 ===
add_library(mathlib STATIC
    src/add.cpp
    src/subtract.cpp
    src/multiply.cpp
    src/divide.cpp
)

target_include_directories(mathlib PUBLIC
    $<BUILD_INTERFACE:${CMAKE_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)

# === 创建可执行文件 ===
add_executable(calc src/main.cpp)

# 链接库
target_link_libraries(calc PRIVATE mathlib)

# === 创建测试可执行文件 ===
enable_testing()
add_executable(calc_test tests/test_calc.cpp)
target_link_libraries(calc_test PRIVATE mathlib)
add_test(NAME CalcTest COMMAND calc_test)
```

> **易错点：** `target_include_directories` 的可见性选项使用错误：
> - `PRIVATE`：仅当前目标使用
> - `INTERFACE`：仅依赖该目标的目标使用
> - `PUBLIC`：当前目标和依赖该目标的目标都使用

**条件编译和选项：**

```cmake
cmake_minimum_required(VERSION 3.10)
project(AdvancedProject VERSION 1.0)

# 定义选项（可在命令行设置）
option(BUILD_TESTS "Build test programs" ON)
option(ENABLE_OPENMP "Enable OpenMP support" OFF)

set(CMAKE_CXX_STANDARD 17)

add_executable(app src/main.cpp)

# 根据选项条件编译
if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
    message(STATUS "Tests will be built")
else()
    message(STATUS "Tests will NOT be built")
endif()

# 查找和使用外部包
if(ENABLE_OPENMP)
    find_package(OpenMP REQUIRED)
    if(OpenMP_CXX_FOUND)
        target_link_libraries(app PUBLIC OpenMP::OpenMP_CXX)
        target_compile_definitions(app PRIVATE USE_OPENMP)
    endif()
endif()
```

使用选项构建：
```bash
cmake -DBUILD_TESTS=OFF -DENABLE_OPENMP=ON ..
```

**查找和使用第三方库：**

```cmake
# 查找包（需要系统已安装）
find_package(Boost 1.70 REQUIRED COMPONENTS filesystem system)
find_package(Threads REQUIRED)

add_executable(my_app src/main.cpp)

# 链接找到的库
target_link_libraries(my_app 
    PRIVATE 
        Boost::filesystem
        Boost::system
        Threads::Threads
)
```

> **重要：** `find_package` 有两种模式：
> - **Module 模式**：查找 `Find<Package>.cmake` 文件
> - **Config 模式**：查找 `<Package>Config.cmake` 文件（现代 CMake 推荐）

**现代 CMake 最佳实践：**

```cmake
cmake_minimum_required(VERSION 3.15)
project(ModernProject LANGUAGES CXX)

# 使用 target-based 命令（现代 CMake 核心）
add_library(mylib)

target_sources(mylib PRIVATE
    src/mylib.cpp
    src/helper.cpp
)

target_include_directories(mylib PUBLIC
    $<BUILD_INTERFACE:${CMAKE_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)

target_compile_features(mylib PUBLIC cxx_std_17)

target_compile_options(mylib PRIVATE
    $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:-Wall -Wextra -Wpedantic>
    $<$<CXX_COMPILER_ID:MSVC>:/W4 /permissive->
)

# 为不同构建类型设置选项
target_compile_definitions(mylib PRIVATE
    $<$<CONFIG:Debug>:DEBUG_BUILD>
    $<$<CONFIG:Release>:NDEBUG>
)
```

> **易错点：** 避免使用全局命令如 `include_directories()`、`add_definitions()`，它们会影响所有后续目标，导致不可预测的依赖关系。始终使用 `target_xxx` 命令。

**完整的跨平台 CMake 示例：**

```cmake
cmake_minimum_required(VERSION 3.14)
project(CrossPlatformApp VERSION 1.0.0 LANGUAGES CXX)

# C++ 标准设置
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)  # 不使用编译器扩展

# 输出目录设置
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)

# === 源文件 ===
set(SOURCES
    src/main.cpp
    src/core/application.cpp
    src/utils/logger.cpp
)

set(HEADERS
    include/core/application.h
    include/utils/logger.h
)

# === 创建可执行文件 ===
add_executable(${PROJECT_NAME} ${SOURCES} ${HEADERS})

# 包含目录
target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_SOURCE_DIR}/include
)

# 编译选项 - 编译器特定
target_compile_options(${PROJECT_NAME} PRIVATE
    # GCC 和 Clang
    $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:
        -Wall
        -Wextra
        -Wshadow
        -Wnon-virtual-dtor
        -Wpedantic
    >
    # MSVC
    $<$<CXX_COMPILER_ID:MSVC>:
        /W4
        /WX
        /permissive-
        /wd4996  # 禁用特定警告
    >
)

# 根据构建类型设置选项
target_compile_definitions(${PROJECT_NAME} PRIVATE
    $<$<CONFIG:Debug>:DEBUG _DEBUG>
    $<$<CONFIG:Release>:NDEBUG RELEASE>
)

# 平台特定设置
if(WIN32)
    target_compile_definitions(${PROJECT_NAME} PRIVATE PLATFORM_WINDOWS)
    # Windows 特定库
    target_link_libraries(${PROJECT_NAME} PRIVATE ws2_32)
elseif(APPLE)
    target_compile_definitions(${PROJECT_NAME} PRIVATE PLATFORM_MACOS)
    # macOS 特定框架
    find_library(COCOA_LIBRARY Cocoa)
    target_link_libraries(${PROJECT_NAME} PRIVATE ${COCOA_LIBRARY})
else()
    target_compile_definitions(${PROJECT_NAME} PRIVATE PLATFORM_LINUX)
    # Linux 特定库
    target_link_libraries(${PROJECT_NAME} PRIVATE pthread dl)
endif()

# === 安装规则 ===
install(TARGETS ${PROJECT_NAME}
    RUNTIME DESTINATION bin
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
)

install(DIRECTORY include/ DESTINATION include)
```

构建命令：
```bash
# Linux / macOS
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --parallel

# Windows (Visual Studio)
mkdir build && cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release --parallel

# Windows (MinGW)
cmake .. -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release
cmake --build . --parallel
```

> **重要：** 在 Windows 上使用 Visual Studio 生成器时，`-DCMAKE_BUILD_TYPE` 在配置阶段无效，需要在构建时通过 `--config` 指定。

## 基础语法

### 变量和数据类型

C++ 是一种**静态类型语言**，每个变量在使用前必须先声明其类型。变量声明的基本语法如下：

```cpp
type variable_name = initial_value;
```

**基本数据类型及其范围：**

```cpp
#include <iostream>
#include <limits>

int main() {
    // 整型
    int age = 25;                    // 通常 4 字节 (-2^31 到 2^31-1)
    short small = 100;               // 通常 2 字节 (-32768 到 32767)
    long big = 1000000L;             // 通常 4 或 8 字节
    long long huge = 10000000000LL;  // 通常 8 字节
    
    // 无符号整型（只能表示非负数，正数范围扩大一倍）
    unsigned int positive = 4000000000U;
    
    // 浮点型
    float pi = 3.14159f;             // 通常 4 字节，精度约 6-7 位
    double precise = 3.141592653589793; // 通常 8 字节，精度约 15-17 位
    
    // 字符型
    char grade = 'A';                // 1 字节，存储 ASCII 码
    wchar_t wide = L'中';            // 宽字符，存储 Unicode
    
    // 布尔型
    bool isValid = true;             // true 或 false
    
    // 空类型
    void* ptr = nullptr;             // 无类型指针
    
    // 自动类型推导（C++11）
    auto x = 10;          // int
    auto y = 3.14;        // double
    auto z = "hello";     // const char*
    
    // 查看类型大小和范围
    std::cout << "int 大小: " << sizeof(int) << " 字节\n";
    std::cout << "int 最大值: " << std::numeric_limits<int>::max() << "\n";
    std::cout << "int 最小值: " << std::numeric_limits<int>::min() << "\n";
    
    return 0;
}
```

> **重要：** 使用 `auto` 进行类型推导时，必须同时初始化变量，否则编译器无法推导类型。

> **易错点：** 整型除法会截断小数部分！`5 / 2` 结果是 `2`，不是 `2.5`。要得到浮点结果，至少一个操作数必须是浮点类型：`5.0 / 2` 或 `5 / 2.0`。

**变量命名规则：**

```cpp
// ✅ 合法的变量名
int age;
int _count;
int studentName;      // 驼峰命名法
int student_name;     // 下划线命名法
int MAX_SIZE;         // 常量常用全大写

// ❌ 非法的变量名
// int 2name;         // 不能以数字开头
// int class;         // 不能使用关键字
// int my-name;       // 不能包含连字符
```

### 算术与控制语句

#### 算术

##### 基本算术类型

C++ 提供了丰富的算术运算符：

```cpp
#include <iostream>
#include <cmath>

int main() {
    int a = 17, b = 5;
    
    // 基本算术运算符
    std::cout << "a + b = " << (a + b) << "\n";   // 22 (加法)
    std::cout << "a - b = " << (a - b) << "\n";   // 12 (减法)
    std::cout << "a * b = " << (a * b) << "\n";   // 85 (乘法)
    std::cout << "a / b = " << (a / b) << "\n";   // 3 (整数除法，截断小数)
    std::cout << "a % b = " << (a % b) << "\n";   // 2 (取模/求余)
    
    // 浮点数除法
    double x = 17.0, y = 5.0;
    std::cout << "x / y = " << (x / y) << "\n";   // 3.4
    
    // 自增自减运算符
    int c = 5;
    std::cout << "c++ = " << c++ << "\n";   // 输出 5，然后 c 变为 6
    std::cout << "++c = " << ++c << "\n";   // c 先变为 7，然后输出 7
    std::cout << "c-- = " << c-- << "\n";   // 输出 7，然后 c 变为 6
    std::cout << "--c = " << --c << "\n";   // c 先变为 5，然后输出 5
    
    // 复合赋值运算符
    int d = 10;
    d += 5;   // 等价于 d = d + 5，d = 15
    d -= 3;   // 等价于 d = d - 3，d = 12
    d *= 2;   // 等价于 d = d * 2，d = 24
    d /= 4;   // 等价于 d = d / 4，d = 6
    d %= 4;   // 等价于 d = d % 4，d = 2
    
    // 数学函数 (需要 #include <cmath>)
    std::cout << "sqrt(16) = " << sqrt(16) << "\n";      // 4
    std::cout << "pow(2, 3) = " << pow(2, 3) << "\n";    // 8
    std::cout << "abs(-5) = " << abs(-5) << "\n";        // 5
    std::cout << "floor(3.7) = " << floor(3.7) << "\n";  // 3
    std::cout << "ceil(3.2) = " << ceil(3.2) << "\n";    // 4
    std::cout << "round(3.5) = " << round(3.5) << "\n";  // 4
    
    return 0;
}
```

##### 整数

C++ 中的整数类型有不同的存储大小和表示范围：

```cpp
#include <iostream>
#include <cstdint>  // 固定宽度整数类型

int main() {
    // 固定宽度整数类型（推荐在需要精确控制大小时使用）
    int8_t   i8  = 127;          // 8 位有符号整数 (-128 到 127)
    uint8_t  u8  = 255;          // 8 位无符号整数 (0 到 255)
    int16_t  i16 = 32767;        // 16 位有符号整数
    uint16_t u16 = 65535;        // 16 位无符号整数
    int32_t  i32 = 2147483647;   // 32 位有符号整数
    uint32_t u32 = 4294967295U;  // 32 位无符号整数
    int64_t  i64 = 9223372036854775807LL;  // 64 位有符号整数
    uint64_t u64 = 18446744073709551615ULL; // 64 位无符号整数
    
    // 整数后缀
    int a = 42;          // 默认 int
    long b = 42L;        // long
    long long c = 42LL;  // long long
    unsigned d = 42U;    // unsigned int
    unsigned long e = 42UL;   // unsigned long
    
    // 不同进制表示
    int dec = 42;        // 十进制
    int oct = 052;       // 八进制（以 0 开头）
    int hex = 0x2A;      // 十六进制（以 0x 开头）
    int bin = 0b101010;  // 二进制（C++14，以 0b 开头）
    
    std::cout << "十进制 42 = " << dec << "\n";
    std::cout << "八进制 052 = " << oct << "\n";
    std::cout << "十六进制 0x2A = " << hex << "\n";
    std::cout << "二进制 0b101010 = " << bin << "\n";
    
    // 整数溢出
    int8_t small = 127;
    // small++;  // 溢出！结果变成 -128 (undefined behavior for signed)
    
    return 0;
}
```

> **重要：** 有符号整数溢出是**未定义行为(Undefined Behavior)**，程序可能崩溃、产生错误结果或表现异常。无符号整数溢出是明确定义的（回绕）。

##### 浮点数及其运算

```cpp
#include <iostream>
#include <iomanip>  // 用于格式化输出
#include <cmath>
#include <limits>

int main() {
    // 浮点数精度问题
    float f = 0.1f;
    double d = 0.1;
    
    std::cout << std::setprecision(20);
    std::cout << "float 0.1 = " << f << "\n";
    std::cout << "double 0.1 = " << d << "\n";
    
    // 浮点数比较：永远不要直接用 ==
    double a = 0.1 + 0.2;
    double b = 0.3;
    
    // ❌ 错误方式
    if (a == b) {
        std::cout << "相等（但可能不执行）\n";
    }
    
    // ✅ 正确方式：使用 epsilon 比较
    const double EPSILON = 1e-9;
    if (fabs(a - b) < EPSILON) {
        std::cout << "近似相等\n";
    }
    
    // C++11 起推荐的方式
    if (std::abs(a - b) < std::numeric_limits<double>::epsilon() * 100) {
        std::cout << "近似相等（使用 numeric_limits）\n";
    }
    
    // 特殊浮点值
    double inf = 1.0 / 0.0;      // 正无穷
    double nan = 0.0 / 0.0;      // NaN (Not a Number)
    double neg_inf = -1.0 / 0.0; // 负无穷
    
    std::cout << "1.0/0.0 = " << inf << "\n";
    std::cout << "0.0/0.0 = " << nan << "\n";
    std::cout << "-1.0/0.0 = " << neg_inf << "\n";
    
    // 检查 NaN
    if (std::isnan(nan)) {
        std::cout << "是 NaN\n";
    }
    
    // 科学计数法
    double sci = 1.5e3;   // 1500
    double tiny = 1.5e-3; // 0.0015
    
    return 0;
}
```

> **易错点：** 浮点数 `0.1 + 0.2 != 0.3` 在许多编程语言中都成立，这是二进制浮点表示的限制。比较浮点数时始终使用 epsilon 比较法。

##### 布尔类型

```cpp
#include <iostream>

int main() {
    bool flag = true;   // 或 false
    
    // 布尔值在算术运算中会被转换为整数：true -> 1, false -> 0
    int sum = true + true;  // sum = 2
    
    // 非零值在布尔上下文中为 true，零为 false
    bool b1 = 42;    // true
    bool b2 = 0;     // false
    bool b3 = -1;    // true（负数也是 true）
    bool b4 = 0.001; // true
    
    // 逻辑运算符
    bool a = true, b = false;
    std::cout << "a && b = " << (a && b) << "\n";  // 逻辑与 (false)
    std::cout << "a || b = " << (a || b) << "\n";  // 逻辑或 (true)
    std::cout << "!a = " << (!a) << "\n";          // 逻辑非 (false)
    
    // 短路求值
    int x = 0;
    if (false && (++x > 0)) {
        // ++x 不会执行，因为第一个操作数为 false
    }
    std::cout << "x = " << x << "\n";  // x 仍为 0
    
    return 0;
}
```

##### 类型转换

```cpp
#include <iostream>

int main() {
    // 1. 隐式类型转换（自动）
    int i = 10;
    double d = i;  // int -> double，安全
    
    double pi = 3.14;
    int truncated = pi;  // double -> int，小数部分被截断
    std::cout << "truncated = " << truncated << "\n";  // 3
    
    // 2. 显式类型转换（C 风格）- 不推荐
    double x = 3.7;
    int y = (int)x;  // C 风格强制转换
    
    // 3. 显式类型转换（C++ 风格）- 推荐
    
    // static_cast：编译时检查，用于相关类型的转换
    int a = static_cast<int>(3.14);  // 3
    double b = static_cast<double>(5) / 2;  // 2.5
    
    // const_cast：添加或移除 const 属性
    const int val = 10;
    int* ptr = const_cast<int*>(&val);  // 危险！仅在确定对象可修改时使用
    
    // reinterpret_cast：低级类型转换，不检查类型兼容性
    int num = 65;
    char* charPtr = reinterpret_cast<char*>(&num);
    
    // dynamic_cast：用于类层次结构中的安全向下转换（需要虚函数）
    // Base* base = new Derived();
    // Derived* derived = dynamic_cast<Derived*>(base);
    
    // 4. 列表初始化（C++11，窄化转换会报错）
    int m = 3.14;        // 警告，允许
    // int n = {3.14};   // 错误！窄化转换
    int n = {3};         // OK
    
    // 类型提升规则（算术运算时）
    // int + double -> double
    // float + double -> double
    // int + long -> long
    // unsigned + signed -> unsigned（可能产生意外结果！）
    
    unsigned int u = 10;
    int s = -5;
    if (s < u) {
        std::cout << "-5 < 10\n";  // 可能不执行！
    } else {
        std::cout << "由于 unsigned 提升，-5 被认为大于 10\n";
    }
    
    return 0;
}
```

> **重要：** 混合使用有符号和无符号整数时要特别小心！当表达式中同时存在 `signed` 和 `unsigned` 时，`signed` 会被提升为 `unsigned`，导致负数变成很大的正数。

#### 条件语句（if和switch）

```cpp
#include <iostream>

int main() {
    int score = 85;
    
    // if-else if-else 结构
    if (score >= 90) {
        std::cout << "A\n";
    } else if (score >= 80) {
        std::cout << "B\n";
    } else if (score >= 70) {
        std::cout << "C\n";
    } else if (score >= 60) {
        std::cout << "D\n";
    } else {
        std::cout << "F\n";
    }
    
    // 条件运算符（三元运算符）
    int a = 5, b = 3;
    int max = (a > b) ? a : b;  // max = 5
    
    // 嵌套三元运算符（可读性较差，谨慎使用）
    int num = 0;
    std::string result = (num > 0) ? "正数" : (num < 0) ? "负数" : "零";
    
    // switch 语句（仅适用于整型、字符型、枚举）
    char grade = 'B';
    switch (grade) {
        case 'A':
            std::cout << "优秀\n";
            break;  // 不要忘记 break！
        case 'B':
            std::cout << "良好\n";
            break;
        case 'C':
            std::cout << "中等\n";
            break;
        case 'D':
            std::cout << "及格\n";
            break;
        case 'F':
            std::cout << "不及格\n";
            break;
        default:
            std::cout << "无效成绩\n";
            break;
    }
    
    // switch 多个 case 共享代码
    int month = 3;
    switch (month) {
        case 3: case 4: case 5:
            std::cout << "春季\n";
            break;
        case 6: case 7: case 8:
            std::cout << "夏季\n";
            break;
        case 9: case 10: case 11:
            std::cout << "秋季\n";
            break;
        case 12: case 1: case 2:
            std::cout << "冬季\n";
            break;
        default:
            std::cout << "无效月份\n";
    }
    
    // C++17 if with initializer
    // if (auto it = map.find(key); it != map.end()) {
    //     // 使用 it
    // }
    
    return 0;
}
```

> **易错点：** `switch` 语句中忘记写 `break` 会导致"贯穿(fall-through)"，执行多个 case 的代码。这在 C++17 可以用 `[[fallthrough]]` 属性显式标记。

#### 循环语句

```cpp
#include <iostream>
#include <vector>

int main() {
    // 1. for 循环
    for (int i = 0; i < 5; ++i) {
        std::cout << i << " ";
    }
    std::cout << "\n";
    
    // 多个初始化表达式（C++ 允许逗号表达式）
    for (int i = 0, j = 10; i < j; ++i, --j) {
        std::cout << "i=" << i << ", j=" << j << "\n";
    }
    
    // 2. while 循环（先检查条件）
    int count = 0;
    while (count < 5) {
        std::cout << count << " ";
        ++count;
    }
    std::cout << "\n";
    
    // 3. do-while 循环（至少执行一次）
    int n = 0;
    do {
        std::cout << "执行一次，即使条件为假\n";
    } while (n > 0);
    
    // 4. 范围 for 循环（C++11，遍历容器）
    std::vector<int> nums = {1, 2, 3, 4, 5};
    
    // 只读访问（拷贝）
    for (int num : nums) {
        std::cout << num << " ";
        num = 0;  // 不影响原容器
    }
    std::cout << "\n";
    
    // 修改元素（引用）
    for (int& num : nums) {
        num *= 2;  // 每个元素乘以 2
    }
    
    // 避免拷贝（const 引用）
    for (const int& num : nums) {
        std::cout << num << " ";  // 2 4 6 8 10
    }
    std::cout << "\n";
    
    // auto 配合范围 for
    for (const auto& elem : nums) {
        std::cout << elem << " ";
    }
    std::cout << "\n";
    
    // 5. 循环控制语句
    for (int i = 0; i < 10; ++i) {
        if (i == 3) continue;  // 跳过当前迭代
        if (i == 7) break;     // 跳出循环
        std::cout << i << " ";  // 输出: 0 1 2 4 5 6
    }
    std::cout << "\n";
    
    // 6. 嵌套循环和标签
    outer:  // 标签
    for (int i = 0; i < 3; ++i) {
        for (int j = 0; j < 3; ++j) {
            if (i == 1 && j == 1) {
                break;  // 只跳出内层循环
            }
            std::cout << "(" << i << "," << j << ") ";
        }
    }
    std::cout << "\n";
    
    // 7. 无限循环
    // for (;;) { /* ... */ }
    // while (true) { /* ... */ }
    
    return 0;
}
```

> **重要：** 在循环中使用 `auto&` 还是 `const auto&` 取决于是否需要修改元素。如果不修改，使用 `const auto&` 可以避免不必要的拷贝。

#### 数组

```cpp
#include <iostream>
#include <array>    // C++11 std::array
#include <vector>   // 动态数组

int main() {
    // 1. 静态数组（C 风格）
    int arr1[5];           // 未初始化，元素值不确定
    int arr2[5] = {};    // 全部初始化为 0
    int arr3[5] = {1, 2, 3}; // 剩余元素初始化为 0
    int arr4[] = {1, 2, 3, 4, 5}; // 编译器自动推断大小为 5
    
    // 访问元素
    arr1[0] = 10;
    std::cout << "arr1[0] = " << arr1[0] << "\n";
    
    // 数组大小
    int size = sizeof(arr4) / sizeof(arr4[0]);  // 5
    
    // 遍历数组
    for (int i = 0; i < size; ++i) {
        std::cout << arr4[i] << " ";
    }
    std::cout << "\n";
    
    // 2. 多维数组
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };
    
    for (int i = 0; i < 2; ++i) {
        for (int j = 0; j < 3; ++j) {
            std::cout << matrix[i][j] << " ";
        }
        std::cout << "\n";
    }
    
    // 3. C++11 std::array（推荐）
    std::array<int, 5> stdArr = {1, 2, 3, 4, 5};
    
    std::cout << "Size: " << stdArr.size() << "\n";
    std::cout << "First: " << stdArr.front() << "\n";
    std::cout << "Last: " << stdArr.back() << "\n";
    
    // 访问元素（带边界检查）
    std::cout << "stdArr[0] = " << stdArr[0] << "\n";       // 不检查
    std::cout << "stdArr.at(0) = " << stdArr.at(0) << "\n"; // 检查，越界抛异常
    
    // 遍历
    for (const auto& elem : stdArr) {
        std::cout << elem << " ";
    }
    std::cout << "\n";
    
    // 4. 动态数组（std::vector）
    std::vector<int> vec;
    
    // 添加元素
    vec.push_back(1);
    vec.push_back(2);
    vec.push_back(3);
    
    // 预分配空间
    vec.reserve(100);  // 容量设为 100，避免频繁重新分配
    
    // 插入
    vec.insert(vec.begin(), 0);  // 在开头插入 0
    
    // 删除
    vec.pop_back();              // 删除末尾
    vec.erase(vec.begin());      // 删除指定位置
    vec.clear();                 // 清空
    
    // 初始化方式
    std::vector<int> v1(5);          // 5 个 0
    std::vector<int> v2(5, 10);      // 5 个 10
    std::vector<int> v3 = {1,2,3};   // 列表初始化
    std::vector<int> v4{1,2,3};      // 同上
    
    // 获取底层数组指针
    int* rawPtr = vec.data();
    
    return 0;
}
```

> **重要：** C 风格数组在作为函数参数传递时会**退化(decay)**为指针，丢失大小信息。如果需要保留大小，使用引用或 `std::array`/`std::vector`。

> **易错点：** 数组下标越界是 C++ 中最常见的错误之一，且不会自动报错。使用 `std::vector::at()` 或调试工具检测越界。

#### 字符串

```cpp
#include <iostream>
#include <string>       // C++ string 类
#include <cstring>      // C 风格字符串函数
#include <sstream>      // 字符串流

int main() {
    // 1. C 风格字符串（字符数组）
    char str1[] = "Hello";           // 自动包含 '\0'
    char str2[20] = "World";
    char str3[20];
    
    // C 风格字符串操作
    strcpy(str3, str1);              // 复制
    strcat(str3, " ");               // 连接
    strcat(str3, str2);
    
    size_t len = strlen(str1);       // 长度（不包含 '\0'）
    int cmp = strcmp(str1, str2);    // 比较
    
    std::cout << "C string: " << str3 << "\n";
    std::cout << "Length: " << len << "\n";
    
    // 2. C++ string 类（强烈推荐）
    std::string s1 = "Hello";
    std::string s2 = "World";
    std::string s3 = s1 + " " + s2;  // 方便地连接
    
    // 基本操作
    std::cout << "Length: " << s3.length() << "\n";
    std::cout << "Size: " << s3.size() << "\n";
    std::cout << "Empty: " << s3.empty() << "\n";
    std::cout << "First char: " << s3[0] << "\n";
    std::cout << "Last char: " << s3.back() << "\n";
    
    // 子串
    std::string sub = s3.substr(0, 5);  // "Hello"，从位置 0 开始，长度为 5
    
    // 查找
    size_t pos = s3.find("World");      // 返回位置，找不到返回 string::npos
    if (pos != std::string::npos) {
        std::cout << "Found at: " << pos << "\n";
    }
    
    // 插入和删除
    s3.insert(5, ",");                  // "Hello, World"
    s3.erase(5, 1);                     // 删除位置 5 开始的 1 个字符
    s3.replace(6, 5, "C++");            // 替换 "World" 为 "C++"
    
    // 比较
    if (s1 == "Hello") {
        std::cout << "相等\n";
    }
    
    // 转换
    std::string numStr = "42";
    int num = std::stoi(numStr);        // string to int
    double d = std::stod("3.14");       // string to double
    
    std::string fromNum = std::to_string(42);  // int to string
    
    // 迭代
    for (char c : s3) {
        std::cout << c;
    }
    std::cout << "\n";
    
    // C++11 raw string literal（原始字符串，不转义）
    std::string path = R"(C:\Program Files\App\file.txt)";
    std::string json = R"({"name": "John", "age": 30})";
    std::cout << "Path: " << path << "\n";
    
    // 多行 raw string
    std::string multiline = R"(
        Line 1
        Line 2
        Line 3
    )";
    
    // 3. 字符串流（用于格式化）
    std::ostringstream oss;
    oss << "Name: " << "John" << ", Age: " << 25;
    std::string result = oss.str();
    std::cout << result << "\n";
    
    // 解析字符串
    std::string data = "100 200 300";
    std::istringstream iss(data);
    int a, b, c;
    iss >> a >> b >> c;
    std::cout << a << " " << b << " " << c << "\n";
    
    return 0;
}
```

> **重要：** 优先使用 `std::string` 而非 C 风格字符串。`std::string` 自动管理内存，提供了丰富的操作方法，且更安全。

#### 输入与输出

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>

int main() {
    // 1. 标准输入输出
    std::cout << "标准输出\n";
    std::cerr << "标准错误（无缓冲）\n";
    std::clog << "标准日志（有缓冲）\n";
    
    // 2. 格式化输出
    double pi = 3.14159265359;
    
    std::cout << "默认: " << pi << "\n";
    std::cout << "精度3: " << std::setprecision(3) << pi << "\n";
    std::cout << std::fixed;  // 固定小数位
    std::cout << "固定6位: " << std::setprecision(6) << pi << "\n";
    std::cout.unsetf(std::ios::fixed);  // 取消固定格式
    
    // 宽度和对齐
    std::cout << std::setw(10) << std::left << "Name" 
              << std::setw(10) << "Score" << "\n";
    std::cout << std::setw(10) << std::left << "Alice" 
              << std::setw(10) << 95 << "\n";
    
    // 填充字符
    std::cout << std::setfill('0') << std::setw(5) << 42 << "\n";
    std::cout << std::setfill(' ');  // 恢复默认
    
    // 进制
    int num = 255;
    std::cout << "十进制: " << num << "\n";
    std::cout << "八进制: " << std::oct << num << "\n";
    std::cout << "十六进制: " << std::hex << num << "\n";
    std::cout << "大写十六进制: " << std::uppercase << num << "\n";
    std::cout << std::dec << std::nouppercase;  // 恢复
    
    // 布尔值输出
    std::cout << std::boolalpha << true << " " << false << "\n";  // "true false"
    std::cout << std::noboolalpha;  // 恢复 1/0
    
    // 3. 键盘输入
    std::string name;
    int age;
    
    std::cout << "Enter name: ";
    std::cin >> name;  // 读到空白字符停止
    
    std::cout << "Enter age: ";
    std::cin >> age;
    
    std::cin.ignore();  // 忽略换行符
    
    std::string line;
    std::cout << "Enter a line: ";
    std::getline(std::cin, line);  // 读取整行
    
    // 4. 文件输入输出
    // 写入文件
    std::ofstream outFile("data.txt");
    if (outFile.is_open()) {
        outFile << "Hello, File!\n";
        outFile << "Line 2\n";
        outFile.close();
    }
    
    // 读取文件
    std::ifstream inFile("data.txt");
    if (inFile.is_open()) {
        std::string fileLine;
        while (std::getline(inFile, fileLine)) {
            std::cout << fileLine << "\n";
        }
        inFile.close();
    }
    
    // 追加模式
    std::ofstream appendFile("data.txt", std::ios::app);
    appendFile << "Appended line\n";
    appendFile.close();
    
    // 二进制文件
    int data[] = {1, 2, 3, 4, 5};
    std::ofstream binOut("data.bin", std::ios::binary);
    binOut.write(reinterpret_cast<char*>(data), sizeof(data));
    binOut.close();
    
    // 5. 检查输入状态
    int value;
    std::cout << "Enter an integer: ";
    if (!(std::cin >> value)) {
        std::cin.clear();  // 清除错误状态
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');  // 清空缓冲区
        std::cout << "Invalid input!\n";
    }
    
    return 0;
}
```

> **易错点：** 使用 `std::cin >> variable` 后如果要使用 `std::getline()`，必须先调用 `std::cin.ignore()` 清除残留的换行符，否则 `getline` 会读到空行。

#### Goto

```cpp
#include <iostream>

int main() {
    // goto 语句：无条件跳转到指定标签
    // 在现代 C++ 中很少使用，通常可以用循环和函数替代
    
    int i = 0;
    
loop_start:  // 标签
    if (i >= 5) {
        goto loop_end;
    }
    std::cout << i << " ";
    ++i;
    goto loop_start;
    
loop_end:
    std::cout << "\nLoop finished\n";
    
    // 更常见的用途：错误处理和资源清理
    int* ptr1 = nullptr;
    int* ptr2 = nullptr;
    int* ptr3 = nullptr;
    
    ptr1 = new int(1);
    if (!ptr1) goto cleanup;
    
    ptr2 = new int(2);
    if (!ptr2) goto cleanup;
    
    ptr3 = new int(3);
    if (!ptr3) goto cleanup;
    
    // 正常使用资源
    std::cout << *ptr1 << " " << *ptr2 << " " << *ptr3 << "\n";
    
cleanup:
    delete ptr1;
    delete ptr2;
    delete ptr3;
    
    // 现代 C++ 更好的做法：使用 RAII 和智能指针
    // 避免使用 goto
    
    return 0;
}
```

> **重要：** 尽量避免使用 `goto`。它会使代码难以阅读和维护。现代 C++ 中，`goto` 的唯一合理用途是在 C 风格的错误处理中跳转到统一的清理代码，但更好的做法是使用 RAII、智能指针和异常处理。

### 函数和参数传递

#### 函数定义和调用

```cpp
#include <iostream>
#include <vector>

// 函数声明（原型）
int add(int a, int b);
void greet(const std::string& name);

// 函数定义
int add(int a, int b) {
    return a + b;
}

void greet(const std::string& name) {
    std::cout << "Hello, " << name << "!\n";
}

// 重载函数：同名不同参数
int multiply(int a, int b) {
    return a * b;
}

double multiply(double a, double b) {
    return a * b;
}

// 返回多个值（使用引用参数）
void divide(int dividend, int divisor, int& quotient, int& remainder) {
    quotient = dividend / divisor;
    remainder = dividend % divisor;
}

// 返回多个值（使用结构体）
struct Result {
    int quotient;
    int remainder;
};

Result divide2(int dividend, int divisor) {
    return {dividend / divisor, dividend % divisor};
}

// 返回多个值（C++17 结构化绑定）
std::pair<int, int> divide3(int dividend, int divisor) {
    return {dividend / divisor, dividend % divisor};
}

// 递归函数
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// 尾递归（某些编译器可优化）
int factorial_tail(int n, int acc = 1) {
    if (n <= 1) return acc;
    return factorial_tail(n - 1, n * acc);
}

// 函数模板
template<typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// Lambda 表达式（匿名函数）
auto lambda_add = [](int a, int b) -> int {
    return a + b;
};

int main() {
    // 基本调用
    int sum = add(3, 5);
    greet("Alice");
    
    // 函数重载
    std::cout << multiply(3, 4) << "\n";      // int 版本
    std::cout << multiply(3.5, 2.0) << "\n";  // double 版本
    
    // 多返回值
    int q, r;
    divide(17, 5, q, r);
    std::cout << "17 / 5 = " << q << " 余 " << r << "\n";
    
    Result res = divide2(17, 5);
    std::cout << "17 / 5 = " << res.quotient << " 余 " << res.remainder << "\n";
    
    // C++17 结构化绑定
    auto [quot, rem] = divide3(17, 5);
    std::cout << "17 / 5 = " << quot << " 余 " << rem << "\n";
    
    // 递归
    std::cout << "5! = " << factorial(5) << "\n";
    
    // 模板函数
    std::cout << maximum(3, 5) << "\n";       // 自动推导为 int
    std::cout << maximum(3.5, 2.5) << "\n";   // 自动推导为 double
    
    // Lambda
    std::cout << lambda_add(2, 3) << "\n";
    
    // 立即执行的 lambda
    int result = [](int x) { return x * x; }(5);
    std::cout << "5^2 = " << result << "\n";
    
    return 0;
}
```

> **重要：** 函数声明（原型）可以让编译器在函数定义之前就知道函数的签名，这是组织大型代码和多文件项目的基础。

#### 参数传递方式：值传递、引用传递和指针传递

```cpp
#include <iostream>
#include <string>

// 1. 值传递：创建参数的副本，不影响原变量
void byValue(int x) {
    x = 100;  // 只修改副本
}

// 2. 引用传递：使用原变量的别名，可以修改原变量
void byReference(int& x) {
    x = 100;  // 修改原变量
}

// 3. 指针传递：传递地址，可以修改原变量
void byPointer(int* x) {
    if (x != nullptr) {
        *x = 100;  // 解引用修改原变量
    }
}

// const 引用：避免拷贝，但不允许修改（推荐用于大型对象）
void printLargeObject(const std::string& str) {
    // str += "!";  // 错误！不能修改 const 引用
    std::cout << str << "\n";
}

// 对象作为值传递（会调用拷贝构造函数）
class MyClass {
public:
    int value;
    MyClass(int v) : value(v) { 
        std::cout << "Constructor\n"; 
    }
    MyClass(const MyClass& other) : value(other.value) { 
        std::cout << "Copy Constructor\n"; 
    }
};

void takeByValue(MyClass obj) {
    std::cout << "By value: " << obj.value << "\n";
}

void takeByReference(const MyClass& obj) {
    std::cout << "By reference: " << obj.value << "\n";
}

// 输出参数（通过引用返回多个值）
void getMinMax(const int arr[], int size, int& minVal, int& maxVal) {
    if (size <= 0) return;
    minVal = maxVal = arr[0];
    for (int i = 1; i < size; ++i) {
        if (arr[i] < minVal) minVal = arr[i];
        if (arr[i] > maxVal) maxVal = arr[i];
    }
}

// 数组作为参数（退化为指针）
void processArray(int arr[], int size) {  // 等同于 int* arr
    for (int i = 0; i < size; ++i) {
        arr[i] *= 2;
    }
}

// 使用引用保留数组大小信息
void processArrayRef(int (&arr)[5]) {  // 必须传递大小为 5 的数组
    for (int i = 0; i < 5; ++i) {
        arr[i] *= 2;
    }
}

// C++11 完美转发（转发引用）
template<typename T>
void forward(T&& arg) {  // 万能引用
    // std::forward<T>(arg) 保持值的类别
}

int main() {
    int num = 50;
    
    byValue(num);
    std::cout << "After byValue: " << num << "\n";  // 仍为 50
    
    byReference(num);
    std::cout << "After byReference: " << num << "\n";  // 变为 100
    
    num = 50;
    byPointer(&num);
    std::cout << "After byPointer: " << num << "\n";  // 变为 100
    
    // 对比对象传递
    MyClass obj(42);
    std::cout << "--- Pass by value ---\n";
    takeByValue(obj);  // 调用拷贝构造函数
    
    std::cout << "--- Pass by reference ---\n";
    takeByReference(obj);  // 无拷贝
    
    // 数组
    int arr[] = {1, 2, 3, 4, 5};
    processArray(arr, 5);  // 修改原数组
    
    int minVal, maxVal;
    getMinMax(arr, 5, minVal, maxVal);
    std::cout << "Min: " << minVal << ", Max: " << maxVal << "\n";
    
    return 0;
}
```

> **重要：** 对于内置类型（int, double 等），值传递和引用传递性能差异不大。对于大型对象，使用 `const T&` 避免昂贵的拷贝操作。

> **易错点：** 数组作为函数参数时会退化为指针，丢失大小信息。务必同时传递大小参数，或使用引用语法 `T (&arr)[N]` 或 `std::array`/`std::vector`。

#### 内联函数

```cpp
#include <iostream>

// 普通函数：调用时有函数调用的开销（压栈、跳转、返回）
int max(int a, int b) {
    return (a > b) ? a : b;
}

// 内联函数：建议编译器将函数体直接插入调用处，减少调用开销
// inline 只是建议，编译器可能拒绝
inline int maxInline(int a, int b) {
    return (a > b) ? a : b;
}

// 在类定义中直接定义的函数自动成为内联函数
class Calculator {
public:
    // 隐式内联
    int add(int a, int b) {
        return a + b;
    }
    
    // 显式声明内联
    inline int subtract(int a, int b);
};

inline int Calculator::subtract(int a, int b) {
    return a - b;
}

// constexpr 函数（C++11）：编译期可计算的函数，更强版本的"内联"
constexpr int square(int x) {
    return x * x;
}

// 编译期计算
constexpr int result = square(5);  // 编译时计算为 25

// constexpr 函数的限制（C++11/14）
// C++14 放宽了限制，允许变量声明和循环
constexpr int factorial(int n) {
    int result = 1;  // C++14 起允许
    for (int i = 1; i <= n; ++i) {  // C++14 起允许循环
        result *= i;
    }
    return result;
}

// C++17 if constexpr：编译期条件
// template<typename T>
// auto getValue(T t) {
//     if constexpr (std::is_pointer_v<T>) {
//         return *t;
//     } else {
//         return t;
//     }
// }

int main() {
    int a = 3, b = 5;
    
    // 内联函数调用
    int m = maxInline(a, b);
    
    // 编译期计算
    int arr[square(5)];  // 数组大小必须是编译期常量
    
    constexpr int fact5 = factorial(5);
    std::cout << "5! = " << fact5 << "\n";
    
    return 0;
}
```

> **重要：** `inline` 关键字在现代 C++ 中的主要作用不是建议内联优化，而是**允许函数在多个翻译单元中定义**（通常放在头文件中）。实际的函数内联决策由编译器根据优化级别决定。

#### 默认参数

```cpp
#include <iostream>
#include <string>

// 默认参数从右向左指定
void printInfo(const std::string& name, 
               int age = 0, 
               const std::string& country = "Unknown") {
    std::cout << "Name: " << name 
              << ", Age: " << age 
              << ", Country: " << country << "\n";
}

// ❌ 错误：默认参数不能左边有值而右边没有
// void bad(int a = 1, int b, int c = 3);

// ✅ 正确：从右向左依次设置默认值
void good(int a, int b = 2, int c = 3);

// 函数声明和定义分离时，默认参数只能在声明中指定
void setup(int width, int height, int depth = 1);

void setup(int width, int height, int depth) {
    std::cout << width << "x" << height << "x" << depth << "\n";
}

// 默认参数可以是表达式
int getDefaultId() {
    return 999;
}

void registerUser(const std::string& name, int id = getDefaultId()) {
    std::cout << "User: " << name << ", ID: " << id << "\n";
}

// C++ 函数重载与默认参数的结合
class Rectangle {
public:
    // 使用默认参数的版本
    void draw(int x = 0, int y = 0, int width = 100, int height = 100);
    
    // 重载版本
    void draw(const std::string& style);
};

void Rectangle::draw(int x, int y, int width, int height) {
    std::cout << "Draw rect at (" << x << "," << y << ") "
              << "size " << width << "x" << height << "\n";
}

void Rectangle::draw(const std::string& style) {
    std::cout << "Draw rect with style: " << style << "\n";
}

int main() {
    // 使用不同数量的参数
    printInfo("Alice");                          // 使用所有默认值
    printInfo("Bob", 25);                        // country 使用默认值
    printInfo("Charlie", 30, "USA");             // 不使用默认值
    
    // 指定部分参数
    setup(1920, 1080);       // depth = 1
    setup(800, 600, 32);     // 指定所有参数
    
    // 默认参数表达式
    registerUser("David");
    registerUser("Eve", 123);
    
    // 类成员函数
    Rectangle rect;
    rect.draw();                      // 全部默认
    rect.draw(10, 20);                // 部分指定
    rect.draw("dashed");              // 调用重载版本
    
    return 0;
}
```

> **易错点：** 默认参数在函数声明和定义分离时，**只能在声明中指定**，否则会导致编译错误。此外，避免默认参数和函数重载同时使用，容易产生歧义调用。

### 指针和引用

#### 指针的定义和使用

```cpp
#include <iostream>

int main() {
    int num = 42;
    
    // 1. 指针的定义
    int* ptr = &num;  // ptr 存储 num 的地址
    
    // 2. 解引用：获取指针指向的值
    std::cout << "Value: " << *ptr << "\n";    // 42
    std::cout << "Address: " << ptr << "\n";   // 地址（十六进制）
    std::cout << "Num address: " << &num << "\n";  // 同上
    
    // 3. 通过指针修改值
    *ptr = 100;
    std::cout << "New value: " << num << "\n";  // 100
    
    // 4. 空指针
    int* nullPtr = nullptr;  // C++11 推荐
    // int* oldNull = NULL;  // C 风格，不推荐
    // int* worstNull = 0;   // 不推荐使用 0
    
    if (nullPtr == nullptr) {
        std::cout << "Pointer is null\n";
    }
    
    // 5. 野指针（未初始化的指针，危险！）
    // int* wildPtr;  // ❌ 未初始化
    // *wildPtr = 10; // ❌ 可能导致程序崩溃
    
    // 6. 指针的指针
    int** ptrToPtr = &ptr;
    std::cout << "Value via ptrToPtr: " << **ptrToPtr << "\n";  // 100
    
    // 7. 常量指针 vs 指针常量
    int a = 1, b = 2;
    
    // 指向常量的指针：可以改指向，不能改值
    const int* p1 = &a;
    // *p1 = 10;  // 错误！不能通过 p1 修改值
    p1 = &b;      // OK，可以指向其他变量
    
    // 常量指针：不能改指向，可以改值
    int* const p2 = &a;
    *p2 = 10;     // OK
    // p2 = &b;   // 错误！不能改指向
    
    // 指向常量的常量指针：都不能改
    const int* const p3 = &a;
    // *p3 = 10;  // 错误
    // p3 = &b;   // 错误
    
    // 8. 指针运算
    int arr[] = {10, 20, 30, 40, 50};
    int* p = arr;  // 指向数组首元素
    
    std::cout << *p << "\n";      // 10
    std::cout << *(p + 1) << "\n"; // 20（p 指向下一个 int）
    std::cout << *(p + 2) << "\n"; // 30
    
    // 指针减法（计算元素间隔）
    int* end = &arr[4];
    std::cout << "Elements between: " << (end - p) << "\n";  // 4
    
    // 9. void 指针（通用指针）
    void* generic = &num;
    // 必须先转换为具体类型才能解引用
    int* specific = static_cast<int*>(generic);
    std::cout << *specific << "\n";
    
    return 0;
}
```

> **重要：** `const int*` 和 `int* const` 的区别是 C++ 中的经典面试题。记忆口诀："`const` 在 `*` 左边，值不能变；`const` 在 `*` 右边，指向不能变"。

#### 函数指针

```cpp
#include <iostream>

// 普通函数
int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int multiply(int a, int b) {
    return a * b;
}

// 函数指针作为参数
typedef int (*Operation)(int, int);  // 使用 typedef

using Operation2 = int (*)(int, int);  // C++11 using 别名

int calculate(int a, int b, Operation op) {
    return op(a, b);
}

// 函数返回函数指针
Operation getOperation(char op) {
    switch (op) {
        case '+': return add;
        case '-': return subtract;
        case '*': return multiply;
        default: return nullptr;
    }
}

// 更复杂的例子：回调函数
void processArray(int arr[], int size, void (*callback)(int)) {
    for (int i = 0; i < size; ++i) {
        callback(arr[i]);
    }
}

void printInt(int x) {
    std::cout << x << " ";
}

void printSquare(int x) {
    std::cout << x * x << " ";
}

// 成员函数指针
class Calculator {
public:
    int value = 0;
    
    void add(int x) { value += x; }
    void subtract(int x) { value -= x; }
};

// 使用 std::function（C++11，更灵活）
#include <functional>

int main() {
    // 1. 定义函数指针
    int (*funcPtr)(int, int) = add;
    
    // 使用函数指针调用
    std::cout << funcPtr(3, 4) << "\n";  // 7
    
    // 2. 指向不同函数
    funcPtr = subtract;
    std::cout << funcPtr(7, 4) << "\n";  // 3
    
    // 3. 函数指针数组
    int (*opArray[])(int, int) = {add, subtract, multiply};
    std::cout << opArray[0](2, 3) << "\n";  // 5 (add)
    std::cout << opArray[2](2, 3) << "\n";  // 6 (multiply)
    
    // 4. 作为参数传递
    std::cout << calculate(5, 3, add) << "\n";       // 8
    std::cout << calculate(5, 3, multiply) << "\n";  // 15
    
    // 5. 使用 typedef/using 简化
    Operation op = add;
    std::cout << op(10, 20) << "\n";  // 30
    
    // 6. 回调函数
    int arr[] = {1, 2, 3, 4, 5};
    processArray(arr, 5, printInt);     // 1 2 3 4 5
    std::cout << "\n";
    processArray(arr, 5, printSquare);  // 1 4 9 16 25
    std::cout << "\n";
    
    // 7. 成员函数指针
    void (Calculator::*memberPtr)(int) = &Calculator::add;
    
    Calculator calc;
    (calc.*memberPtr)(10);  // 调用 add(10)
    std::cout << "Value: " << calc.value << "\n";  // 10
    
    memberPtr = &Calculator::subtract;
    (calc.*memberPtr)(3);   // 调用 subtract(3)
    std::cout << "Value: " << calc.value << "\n";  // 7
    
    // 8. std::function（更现代的方式）
    std::function<int(int, int)> f = add;
    std::cout << f(2, 3) << "\n";  // 5
    
    // 可以存储 lambda
    f = [](int a, int b) { return a * b; };
    std::cout << f(4, 5) << "\n";  // 20
    
    return 0;
}
```

> **重要：** 现代 C++ 推荐使用 `std::function` 和 lambda 表达式替代原始函数指针，它们更灵活，可以捕获变量，支持更多类型的可调用对象。

#### 内存管理简介

C++ 允许程序员直接管理内存，这提供了灵活性但也带来了责任。

##### Alloc和Free

```cpp
#include <iostream>
#include <cstdlib>  // malloc, free

int main() {
    // C 风格内存管理：malloc / free
    
    // 分配单个 int
    int* p1 = (int*)malloc(sizeof(int));
    if (p1 == nullptr) {
        std::cerr << "Memory allocation failed\n";
        return 1;
    }
    *p1 = 42;
    std::cout << *p1 << "\n";
    free(p1);  // 释放内存
    
    // 分配数组
    int* arr = (int*)malloc(5 * sizeof(int));
    if (arr != nullptr) {
        for (int i = 0; i < 5; ++i) {
            arr[i] = i * 10;
        }
        free(arr);
    }
    
    // calloc：分配并初始化为 0
    int* zeroed = (int*)calloc(5, sizeof(int));  // 5 个 int，全部初始化为 0
    free(zeroed);
    
    // realloc：重新分配大小
    int* resized = (int*)malloc(3 * sizeof(int));
    resized = (int*)realloc(resized, 10 * sizeof(int));  // 扩展到 10 个 int
    free(resized);
    
    return 0;
}
```

> **重要：** 在 C++ 中，**不推荐**使用 `malloc`/`free`，因为它们不会调用构造函数和析构函数。使用 `new`/`delete` 或智能指针。

##### New和Delete

```cpp
#include <iostream>
#include <string>

class MyClass {
public:
    int value;
    MyClass(int v) : value(v) {
        std::cout << "Constructor: " << value << "\n";
    }
    ~MyClass() {
        std::cout << "Destructor: " << value << "\n";
    }
};

int main() {
    // 1. 分配单个对象
    int* p1 = new int;        // 未初始化
    int* p2 = new int();      // 值初始化（0）
    int* p3 = new int(42);    // 初始化为 42
    
    std::cout << *p1 << " " << *p2 << " " << *p3 << "\n";
    
    delete p1;
    delete p2;
    delete p3;
    
    // 2. 分配数组
    int* arr1 = new int[5];           // 5 个未初始化的 int
    int* arr2 = new int[5]();         // 5 个初始化为 0 的 int
    int* arr3 = new int[5]{1,2,3};    // {1,2,3,0,0}
    
    delete[] arr1;  // 数组必须用 delete[]
    delete[] arr2;
    delete[] arr3;
    
    // 3. 分配对象（会调用构造函数）
    MyClass* obj = new MyClass(100);
    delete obj;  // 会调用析构函数
    
    // 4. 分配对象数组
    MyClass* objArr = new MyClass[3]{1, 2, 3};
    delete[] objArr;  // 会调用每个对象的析构函数
    
    // 5. 分配多维数组
    int** matrix = new int*[3];  // 3 行
    for (int i = 0; i < 3; ++i) {
        matrix[i] = new int[4];  // 每行 4 列
    }
    
    // 使用...
    matrix[1][2] = 42;
    
    // 释放多维数组
    for (int i = 0; i < 3; ++i) {
        delete[] matrix[i];
    }
    delete[] matrix;
    
    // 6. 异常安全分配（C++11 nothrow）
    int* safe = new (std::nothrow) int[1000000000000];  // 可能失败
    if (safe == nullptr) {
        std::cerr << "Allocation failed\n";
    } else {
        delete[] safe;
    }
    
    // 7. 定位 new（在已分配的内存上构造对象）
    char buffer[sizeof(MyClass)];
    MyClass* placed = new (buffer) MyClass(200);  // placement new
    placed->~MyClass();  // 必须手动调用析构函数
    
    return 0;
}
```

> **重要：** `new` 和 `delete` 必须配对使用，`new[]` 和 `delete[]` 必须配对使用。混用会导致未定义行为（通常是程序崩溃或内存泄漏）。

> **易错点：**
> 1. `delete` 后没有将指针设为 `nullptr`，形成悬空指针
> 2. 多次 `delete` 同一指针（双重释放）
> 3. `delete` 不是 `new` 分配的内存
> 4. 内存泄漏：分配了内存但没有释放

#### 左值和右值

```cpp
#include <iostream>
#include <string>
#include <vector>

// 左值引用
void process(int& x) {
    std::cout << "Lvalue: " << x << "\n";
}

// 右值引用（C++11）
void process(int&& x) {
    std::cout << "Rvalue: " << x << "\n";
}

// 万能引用模板
template<typename T>
void universal(T&& x) {  // 万能引用
    std::cout << "Universal\n";
}

int getValue() {
    return 42;
}

int main() {
    int a = 10;  // a 是左值，10 是右值
    
    // 左值：有名字，可取地址，可赋值（大部分情况下）
    // 右值：临时值，不能取地址，不能赋值
    
    int& ref = a;        // OK：左值引用绑定左值
    // int& ref2 = 10;   // 错误：不能将左值引用绑定到右值
    
    const int& cref = 10;  // OK：const 左值引用可以绑定右值
    
    int&& rref = 10;      // OK：右值引用绑定右值
    // int&& rref2 = a;   // 错误：不能将右值引用绑定到左值
    
    // std::move：将左值转为右值引用
    int&& rref3 = std::move(a);  // OK，但 a 现在处于"被移动"状态
    
    // 函数重载选择
    process(a);           // 调用左值版本
    process(10);          // 调用右值版本
    process(getValue());  // 调用右值版本
    
    // 移动语义示例
    std::vector<std::string> v1;
    v1.push_back("Hello");
    v1.push_back("World");
    
    std::vector<std::string> v2 = v1;              // 拷贝构造（深拷贝）
    std::vector<std::string> v3 = std::move(v1);   // 移动构造（转移所有权）
    // v1 现在处于有效但未指定状态，不应再使用
    
    std::cout << "v2 size: " << v2.size() << "\n";  // 2
    std::cout << "v3 size: " << v3.size() << "\n";  // 2
    std::cout << "v1 size: " << v1.size() << "\n";  // 0（被移动后）
    
    return 0;
}
```

> **重要：** 右值引用（`&&`）和移动语义是 C++11 的重要特性，允许资源的高效转移而非昂贵的拷贝。使用 `std::move` 可以将左值转换为右值引用，触发移动操作。

#### 智能指针

智能指针是 RAII（资源获取即初始化）原则的应用，自动管理内存生命周期。

##### Unique Pointer

```cpp
#include <iostream>
#include <memory>
#include <vector>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource released\n"; }
    void use() { std::cout << "Using resource\n"; }
};

int main() {
    // 1. 创建 unique_ptr
    std::unique_ptr<int> p1(new int(42));
    auto p2 = std::make_unique<int>(100);  // C++14 推荐方式
    
    // 2. 使用
    std::cout << *p1 << "\n";  // 解引用
    
    // 3. unique_ptr 独占所有权，不能复制
    // std::unique_ptr<int> p3 = p1;  // 错误！不能拷贝
    
    // 但可以转移所有权（移动语义）
    std::unique_ptr<int> p3 = std::move(p1);
    // p1 现在是 nullptr
    
    if (p1 == nullptr) {
        std::cout << "p1 is null\n";
    }
    
    // 4. 自定义删除器
    auto deleter = [](int* p) {
        std::cout << "Custom delete: " << *p << "\n";
        delete p;
    };
    std::unique_ptr<int, decltype(deleter)> p4(new int(50), deleter);
    
    // 5. 管理动态数组
    std::unique_ptr<int[]> arr(new int[5]{1, 2, 3, 4, 5});
    std::cout << arr[2] << "\n";  // 3
    
    // C++14 make_unique 数组
    auto arr2 = std::make_unique<int[]>(10);  // 10 个 int，值初始化
    
    // 6. 容器中的 unique_ptr
    std::vector<std::unique_ptr<Resource>> resources;
    resources.push_back(std::make_unique<Resource>());
    resources.push_back(std::make_unique<Resource>());
    
    // 自动释放所有资源
    resources.clear();
    
    // 7. 释放所有权
    std::unique_ptr<Resource> res = std::make_unique<Resource>();
    Resource* raw = res.release();  // 释放所有权，返回原始指针
    delete raw;  // 手动释放
    
    // 8. 重置
    res.reset(new Resource());  // 释放旧对象，接管新对象
    res.reset();                // 释放对象，设为 nullptr
    
    return 0;
}  // 所有 unique_ptr 自动释放
```

> **重要：** `std::unique_ptr` 是零开销抽象，运行时性能与原始指针相同。它明确表示"独占所有权"的语义，应该作为默认的智能指针选择。

##### Shared Pointer

```cpp
#include <iostream>
#include <memory>
#include <vector>

class Node;

// 注意：如果可能形成循环引用，考虑使用 weak_ptr
class Node {
public:
    int value;
    std::shared_ptr<Node> next;
    // std::weak_ptr<Node> parent;  // 打破循环引用
    
    Node(int v) : value(v) {
        std::cout << "Node " << value << " created\n";
    }
    ~Node() {
        std::cout << "Node " << value << " destroyed\n";
    }
};

int main() {
    // 1. 创建 shared_ptr
    std::shared_ptr<int> p1(new int(42));
    auto p2 = std::make_shared<int>(100);  // 推荐方式，更高效
    
    // 2. 引用计数
    std::cout << "p1 count: " << p1.use_count() << "\n";  // 1
    
    {
        std::shared_ptr<int> p3 = p1;  // 共享所有权
        std::cout << "p1 count: " << p1.use_count() << "\n";  // 2
        std::cout << "p3 count: " << p3.use_count() << "\n";  // 2
    }  // p3 销毁，引用计数 -1
    
    std::cout << "p1 count: " << p1.use_count() << "\n";  // 1
    
    // 3. 可以拷贝
    std::shared_ptr<int> p4 = p1;
    std::cout << "p1 count: " << p1.use_count() << "\n";  // 2
    
    // 4. 自定义删除器
    auto fileDeleter = [](FILE* file) {
        if (file) {
            std::cout << "Closing file\n";
            fclose(file);
        }
    };
    
    // 5. 从 this 创建 shared_ptr（需要继承 enable_shared_from_this）
    struct SharedFromThis : std::enable_shared_from_this<SharedFromThis> {
        std::shared_ptr<SharedFromThis> getShared() {
            return shared_from_this();
        }
    };
    
    auto obj = std::make_shared<SharedFromThis>();
    auto another = obj->getShared();  // 正确的做法
    std::cout << "Count: " << obj.use_count() << "\n";  // 2
    
    // 6. 循环引用问题
    {
        auto node1 = std::make_shared<Node>(1);
        auto node2 = std::make_shared<Node>(2);
        
        node1->next = node2;
        node2->next = node1;  // 循环引用！两个节点都不会被销毁
        
        std::cout << "node1 count: " << node1.use_count() << "\n";  // 2
        std::cout << "node2 count: " << node2.use_count() << "\n";  // 2
    }  // 内存泄漏！
    
    // 7. shared_ptr 和原始指针
    int* raw = new int(10);
    {
        std::shared_ptr<int> sp1(raw);
        // std::shared_ptr<int> sp2(raw);  // 错误！重复管理同一内存
    }
    // delete raw;  // 错误！已经释放
    
    // 8. 数组支持（C++17）
    // std::shared_ptr<int[]> arr(new int[5]{1,2,3,4,5});
    
    return 0;
}
```

> **重要：** `std::shared_ptr` 使用引用计数管理共享所有权，但它有额外的内存开销（控制块）。避免循环引用，必要时使用 `std::weak_ptr`。

##### Weak Pointer

```cpp
#include <iostream>
#include <memory>

class Person;

class Team {
public:
    std::string name;
    std::weak_ptr<Person> leader;  // 使用 weak_ptr 避免循环引用
    
    Team(const std::string& n) : name(n) {
        std::cout << "Team " << name << " created\n";
    }
    ~Team() {
        std::cout << "Team " << name << " destroyed\n";
    }
};

class Person {
public:
    std::string name;
    std::shared_ptr<Team> team;
    
    Person(const std::string& n) : name(n) {
        std::cout << "Person " << name << " created\n";
    }
    ~Person() {
        std::cout << "Person " << name << " destroyed\n";
    }
};

int main() {
    // 1. weak_ptr 不增加引用计数
    std::shared_ptr<int> sp = std::make_shared<int>(42);
    std::weak_ptr<int> wp = sp;
    
    std::cout << "shared_ptr count: " << sp.use_count() << "\n";  // 1
    std::cout << "weak_ptr count: " << wp.use_count() << "\n";    // 1
    
    // 2. 使用前先检查是否有效
    if (auto locked = wp.lock()) {  // lock() 返回 shared_ptr
        std::cout << "Value: " << *locked << "\n";
        std::cout << "shared_ptr count: " << sp.use_count() << "\n";  // 2
    }  // locked 销毁，计数 -1
    
    // 3. 检查是否过期
    std::cout << "Expired: " << wp.expired() << "\n";  // 0 (false)
    
    sp.reset();  // 释放资源
    
    std::cout << "Expired: " << wp.expired() << "\n";  // 1 (true)
    
    // lock() 返回空的 shared_ptr
    if (auto locked = wp.lock()) {
        std::cout << "Won't execute\n";
    } else {
        std::cout << "Resource already released\n";
    }
    
    // 4. 实际应用：缓存观察者模式
    {
        auto team = std::make_shared<Team>("Engineering");
        auto person = std::make_shared<Person>("Alice");
        
        person->team = team;
        team->leader = person;  // weak_ptr，不增加引用计数
        
        std::cout << "Person count: " << person.use_count() << "\n";  // 1
        std::cout << "Team count: " << team.use_count() << "\n";      // 2
        
        // 使用 weak_ptr
        if (auto leader = team->leader.lock()) {
            std::cout << "Team leader: " << leader->name << "\n";
        }
    }  // 都能正确销毁
    
    return 0;
}
```

> **重要：** `std::weak_ptr` 用于"观察"但不拥有对象的场景，典型应用是打破循环引用和实现缓存。

### 头文件与命名空间

#### include <> or ""

```cpp
// main.cpp

// 1. #include <...> - 用于标准库和第三方库头文件
// 编译器在系统包含路径中搜索
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

// 2. #include "..." - 用于项目自身的头文件
// 编译器先在当前目录搜索，再到系统路径
#include "myheader.h"
#include "utils/math_utils.h"

// 3. 现代 C++ 模块（C++20）- 替代头文件
// import std.core;  // 导入标准库模块

int main() {
    // 使用标准库
    std::vector<int> vec = {1, 2, 3};
    
    return 0;
}
```

**头文件保护示例：**

```cpp
// math_utils.h
#ifndef MATH_UTILS_H  // 如果没有定义这个宏
#define MATH_UTILS_H  // 定义它

namespace math {
    int add(int a, int b);
    int subtract(int a, int b);
}

#endif  // MATH_UTILS_H
```

> **重要：**
> - 使用 `< >` 包含系统头文件和标准库
> - 使用 `" "` 包含项目自己的头文件
> - 避免在头文件中使用 `using namespace`，这会污染包含该头文件的所有文件的命名空间

#### using

```cpp
#include <iostream>
#include <vector>
#include <string>

// 1. using 声明：引入特定名称
using std::cout;
using std::endl;

// 2. using 指令：引入整个命名空间（不推荐在头文件中使用）
// using namespace std;

// 3. 命名空间别名
namespace fs = std::filesystem;  // C++17
namespace mu = my::utility::math;

// 4. 类型别名（C++11 using）
using IntVec = std::vector<int>;
using StringPair = std::pair<std::string, std::string>;

// 对比 typedef
typedef std::vector<int> IntVecOld;  // 旧方式

// 5. 函数指针别名
typedef int (*FuncPtr)(int, int);      // typedef 方式
using FuncPtr2 = int (*)(int, int);    // using 方式（更清晰）

// 6. 模板别名（C++11，typedef 无法做到）
template<typename T>
using Vec = std::vector<T>;

Vec<int> v1;      // std::vector<int>
Vec<double> v2;   // std::vector<double>

// 7. 在函数内部使用 using
void demo() {
    using namespace std;  // 只在这个函数内有效
    cout << "Hello" << endl;
}

// 8. 匿名命名空间（只在当前文件可见，替代 static）
namespace {
    int internalVar = 42;  // 只在当前翻译单元可见
    void internalFunc() {}
}

// 9. 嵌套命名空间（C++17 简化语法）
namespace A::B::C {  // C++17
    void func() {}
}

// 等价于
namespace A {
    namespace B {
        namespace C {
            // void func() {}
        }
    }
}

// 10. inline 命名空间（C++11）
namespace lib {
    inline namespace v2 {  // 默认使用 v2
        void api() { std::cout << "v2 API\n"; }
    }
    namespace v1 {
        void api() { std::cout << "v1 API\n"; }
    }
}

int main() {
    // 使用 using 声明
    cout << "Hello" << endl;
    
    // 使用类型别名
    IntVec numbers = {1, 2, 3};
    for (const auto& n : numbers) {
        cout << n << " ";
    }
    cout << endl;
    
    // 调用 inline 命名空间
    lib::api();        // 调用 v2::api()
    lib::v1::api();    // 调用 v1::api()
    
    return 0;
}
```

> **重要：** 在头文件中**永远不要**使用 `using namespace`！这会导致命名空间污染，可能引发难以调试的名字冲突问题。

#### Pragma once和include guards

```cpp
// ============ 方式 1：传统 Include Guards（标准兼容）============
// myheader.h
#ifndef MYHEADER_H
#define MYHEADER_H

// 头文件内容
class MyClass {
public:
    void doSomething();
};

#endif  // MYHEADER_H


// ============ 方式 2：#pragma once（简洁，大部分编译器支持）============
// myheader.h
#pragma once

// 头文件内容
class MyClass {
public:
    void doSomething();
};


// ============ 方式 3：两者结合（最佳实践）============
// myheader.h
#pragma once
#ifndef MYHEADER_H
#define MYHEADER_H

// 头文件内容

#endif  // MYHEADER_H
```

**对比：**

| 特性 | Include Guards | #pragma once |
|------|---------------|--------------|
| 标准性 | C/C++ 标准 | 编译器扩展（但广泛支持） |
| 简洁性 | 较冗长 | 简洁 |
| 冲突风险 | 宏名可能冲突 | 无冲突风险 |
| 编译速度 | 需要打开文件检查 | 更快（编译器可优化） |

> **重要：** 现代 C++ 项目推荐使用 `#pragma once`，因为它更简洁且编译速度略快。但对于需要最大兼容性的库，使用传统的 include guards。

### 预处理与宏定义

```cpp
// ============ 1. 简单宏定义 ============
#define PI 3.14159
#define MAX_SIZE 100
#define GREETING "Hello, World!"

// ============ 2. 带参数的宏（函数宏）============
#define SQUARE(x) ((x) * (x))  // 注意括号！
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define DEBUG_PRINT(msg) std::cout << "[DEBUG] " << msg << std::endl

// 多行宏（使用反斜杠续行）
#define SWAP(a, b) do { \
    typeof(a) temp = a; \
    a = b; \
    b = temp; \
} while(0)

// ============ 3. 条件编译 ============
#define DEBUG

#ifdef DEBUG
    #define LOG(msg) std::cout << "[DEBUG] " << msg << std::endl
#else
    #define LOG(msg)
#endif

// 更复杂的条件
#if defined(DEBUG) && defined(VERBOSE)
    #define DETAIL_LOG(msg) std::cout << msg << std::endl
#elif defined(DEBUG)
    #define DETAIL_LOG(msg)
#else
    #define DETAIL_LOG(msg)
#endif

// 根据平台选择代码
#ifdef _WIN32
    #define PLATFORM "Windows"
    #include <windows.h>
#elif defined(__linux__)
    #define PLATFORM "Linux"
    #include <unistd.h>
#elif defined(__APPLE__)
    #define PLATFORM "macOS"
#endif

// ============ 4. 预定义宏 ============
void showPredefinedMacros() {
    std::cout << "File: " << __FILE__ << "\n";      // 当前文件名
    std::cout << "Line: " << __LINE__ << "\n";      // 当前行号
    std::cout << "Date: " << __DATE__ << "\n";      // 编译日期
    std::cout << "Time: " << __TIME__ << "\n";      // 编译时间
    std::cout << "Function: " << __func__ << "\n";  // 当前函数名（C++11）
    std::cout << "C++ version: " << __cplusplus << "\n";  // C++ 版本
}

// ============ 5. 宏在调试中的应用 ============
#define ASSERT(cond) \
    do { \
        if (!(cond)) { \
            std::cerr << "Assertion failed: " << #cond \
                      << " at " << __FILE__ << ":" << __LINE__ << "\n"; \
            std::abort(); \
        } \
    } while(0)

// # 操作符：将参数转为字符串
#define TO_STRING(x) #x

// ## 操作符：连接
#define CONCAT(a, b) a##b

// ============ 6. 可变参数宏（C++11）============
#define ERROR(fmt, ...) printf("[ERROR] " fmt "\n", ##__VA_ARGS__)

// 更现代的用法
#define LOG_FORMAT(level, fmt, ...) \
    printf("[" level "] %s:%d " fmt "\n", __FILE__, __LINE__, ##__VA_ARGS__)

// ============ 7. 取消宏定义 ============
#undef PI  // 之后 PI 不再可用

// ============ 8. 实际代码示例 ============
#include <iostream>
#include <cassert>

// 使用 constexpr 替代宏（推荐）
constexpr double PI_CONST = 3.14159;
constexpr int MAX_SIZE_CONST = 100;

// 使用模板函数替代宏函数（类型安全，可调试）
template<typename T>
constexpr T square(T x) {
    return x * x;
}

template<typename T>
constexpr T max_val(T a, T b) {
    return (a > b) ? a : b;
}

// 断言宏（实际项目风格）
#ifdef NDEBUG
    #define MY_ASSERT(cond) ((void)0)
#else
    #define MY_ASSERT(cond) \
        ((cond) ? (void)0 : \
         (std::cerr << "Assertion failed: " #cond \
                    << " at " << __FILE__ << ":" << __LINE__ << "\n", \
          std::abort()))
#endif

int main() {
    // 宏使用
    std::cout << "PI = " << PI << "\n";
    std::cout << "Square of 5 = " << SQUARE(5) << "\n";
    std::cout << "Max of 3 and 7 = " << MAX(3, 7) << "\n";
    
    // 现代替代
    std::cout << "Const PI = " << PI_CONST << "\n";
    std::cout << "Template square = " << square(5) << "\n";
    
    // 调试用宏
    LOG("Starting program");
    
    // 预定义宏
    showPredefinedMacros();
    
    // 字符串化
    std::cout << TO_STRING(Hello World) << "\n";  // "Hello World"
    
    // 连接
    int xy = 10;
    std::cout << CONCAT(x, y) << "\n";  // xy，即 10
    
    // 断言
    MY_ASSERT(2 + 2 == 4);
    // MY_ASSERT(2 + 2 == 5);  // 会触发断言失败
    
    return 0;
}
```

> **重要：** 现代 C++ 中，优先使用 `const`/`constexpr`、内联函数和模板替代宏。宏没有类型检查、不受命名空间限制、难以调试，且可能有副作用。

> **易错点：** 宏定义中的参数必须加括号，否则可能出现意外的运算顺序问题。例如 `#define SQUARE(x) x * x`，`SQUARE(1+2)` 会展开为 `1+2*1+2 = 5` 而非 `9`。

## OOP（面向对象编程）

### 结构体

#### struct

**struct vs class 的区别** ⭐

| 特性 | struct | class |
|------|--------|-------|
| 默认访问权限 | public | private |
| 继承默认权限 | public | private |
| 模板参数 | 可以用作模板参数 | 可以用作模板参数 |
| 使用场景 | 简单的数据聚合 | 复杂的封装和继承 |

```cpp
// struct - 默认 public
struct Point {
    int x;  // 默认 public
    int y;
    
    void print() {  // 默认 public
        std::cout << "(" << x << ", " << y << ")" << std::endl;
    }
};

// class - 默认 private
class Point2 {
    int x;  // 默认 private
    int y;
    
public:
    void set(int a, int b) {
        x = a;
        y = b;
    }
};

int main() {
    Point p{1, 2};  // C++11 列表初始化
    p.x = 10;       // OK: struct 成员默认 public
    p.print();      // 输出: (10, 2)
    
    Point2 p2;
    // p2.x = 10;   // Error: class 成员默认 private
    p2.set(1, 2);   // OK: 通过 public 方法访问
}
```

⚠️ **常见错误**: 在 class 中忘记添加 `public:` 标签，导致无法访问成员。

**结构体的使用**

```cpp
// C++20 结构化绑定
struct Student {
    std::string name;
    int age;
    double score;
};

int main() {
    // 多种初始化方式
    Student s1{"Alice", 20, 90.5};  // C++11 列表初始化
    Student s2 = {"Bob", 21, 85.0}; // 传统方式
    
    // C++17 结构化绑定
    auto [name, age, score] = s1;
    std::cout << name << " is " << age << " years old." << std::endl;
}
```

---

#### union

**联合体的作用和内存布局**

联合体所有成员共享同一块内存空间，大小等于最大成员的大小。

```cpp
// 检查系统字节序
union EndianCheck {
    uint32_t i;
    uint8_t c[4];
};

// 节省内存的数据存储
union Data {
    int i;
    float f;
    char str[4];
};

// 带类型标记的联合体 (C++11 匿名联合体)
struct Variant {
    enum Type { INT, FLOAT, STRING } type;
    union {  // 匿名联合体
        int i;
        float f;
        char str[32];
    };
};

int main() {
    EndianCheck e;
    e.i = 0x01020304;
    
    if (e.c[0] == 0x04) {
        std::cout << "Little Endian" << std::endl;
    } else {
        std::cout << "Big Endian" << std::endl;
    }
    
    // 使用匿名联合体
    Variant v;
    v.type = Variant::INT;
    v.i = 42;
}
```

⚠️ **注意**: 联合体只能同时存储一个成员的值，修改一个成员会影响其他成员。

---

#### enum

**传统 enum**

```cpp
// 传统 enum - 存在命名空间污染问题
enum Color {
    RED,      // 0
    GREEN,    // 1
    BLUE      // 2
};

// 可以指定底层类型和值
enum Status : unsigned char {
    OK = 0,
    WARNING = 1,
    ERROR = 2
};

int main() {
    Color c = RED;  // RED 在全局命名空间
    
    // ⚠️ 隐式转换为 int
    int x = RED;    // OK，但可能不是预期行为
    
    // ⚠️ 不同 enum 可以比较
    // if (RED == GREEN)  // 编译通过，但无意义
}
```

**enum class (C++11)** ⭐⭐

```cpp
// 强类型枚举，解决传统 enum 的问题
enum class Color {
    Red,
    Green,
    Blue
};

// 指定底层类型
enum class Status : std::uint8_t {
    OK = 0,
    Warning = 1,
    Error = 2
};

int main() {
    Color c = Color::Red;  // 必须使用作用域解析符
    
    // ⚠️ 不会隐式转换为 int
    // int x = Color::Red;   // Error!
    int x = static_cast<int>(Color::Red);  // OK: 需要显式转换
    
    // ⚠️ 不同类型 enum 不能比较
    // if (Color::Red == Status::OK)  // Error!
}
```

---

#### typedef

**typedef 和 using (C++11)**

```cpp
// 传统 typedef
typedef unsigned int uint;
typedef std::vector<int> IntVector;
typedef void (*FuncPtr)(int, int);  // 函数指针类型

// C++11 using - 更清晰的语法，支持模板别名
typedef unsigned int uint;
using uint = unsigned int;

using IntVector = std::vector<int>;
using FuncPtr = void(*)(int, int);

// using 特有功能：模板别名
template<typename T>
typedef std::vector<T> Vec;  // Error: typedef 不支持模板

template<typename T>
using Vec = std::vector<T>;  // OK: using 支持模板别名

// 使用示例
template<typename T>
using StringMap = std::map<std::string, T>;

int main() {
    Vec<int> numbers = {1, 2, 3};
    StringMap<int> scores{{"Alice", 90}, {"Bob", 85}};
}
```

---

### 类和对象

#### this指针

**this 指针的作用**

```cpp
class Person {
private:
    std::string name;
    int age;
    
public:
    // 1. 区分成员变量和参数名
    void setName(std::string name) {
        this->name = name;  // this->name 是成员变量，name 是参数
    }
    
    // 2. 返回当前对象的引用（实现链式调用）
    Person& setAge(int age) {
        this->age = age;
        return *this;  // 返回当前对象的引用
    }
    
    // 3. 检查自赋值
    Person& operator=(const Person& other) {
        if (this == &other) {  // 检查是否是同一个对象
            return *this;
        }
        name = other.name;
        age = other.age;
        return *this;
    }
};

int main() {
    Person p;
    p.setName("Alice")
     .setAge(20);  // 链式调用
}
```

**什么时候会用到**

| 场景 | 示例 |
|------|------|
| 参数名与成员名冲突 | `this->name = name` |
| 链式调用 | `return *this` |
| 自赋值检查 | `if (this == &other)` |
| 传递当前对象 | `other.func(*this)` |
| CRTP 模式 | `static_cast<Derived*>(this)` |

---

#### const, static和mutable成员 ⭐⭐

**const 成员函数**

```cpp
class Date {
private:
    int year, month, day;
    mutable int cache;  // mutable 允许在 const 函数中修改
    mutable bool cached;
    
public:
    // const 成员函数：承诺不修改对象状态
    int getYear() const {
        // year = 2024;  // Error: 不能在 const 函数中修改成员
        return year;
    }
    
    // 计算日期的缓存值
    int getDayOfWeek() const {
        if (!cached) {
            cache = calculateDayOfWeek();  // OK: cache 是 mutable
            cached = true;
        }
        return cache;
    }
    
    // ⚠️ const 和非 const 重载
    std::string& getData() {
        return data_;  // 返回可修改引用
    }
    
    const std::string& getData() const {
        return data_;  // 返回 const 引用
    }
    
private:
    std::string data_;
    int calculateDayOfWeek() const { return 0; }
};

int main() {
    Date d1;
    const Date d2;
    
    d1.getYear();  // OK: 非 const 对象可以调用 const 函数
    d2.getYear();  // OK: const 对象只能调用 const 函数
    
    // d2.setYear(2024);  // Error: const 对象不能调用非 const 函数
}
```

**static 成员变量和函数**

```cpp
class Counter {
private:
    static int count;       // 声明静态成员变量
    static const int MAX = 100;  // const static 可以在类内初始化
    static constexpr double PI = 3.14159;  // C++11
    
    int id;
    
public:
    Counter() {
        id = ++count;
    }
    
    ~Counter() {
        --count;
    }
    
    // 静态成员函数：属于类，不属于对象
    static int getCount() {
        // return id;   // Error: 静态函数不能访问非静态成员
        return count;   // OK: 只能访问静态成员
    }
    
    int getId() const { return id; }
};

// 必须在类外定义并初始化静态成员变量
int Counter::count = 0;

int main() {
    // 无需创建对象即可调用静态函数
    std::cout << Counter::getCount() << std::endl;  // 0
    
    Counter c1, c2;
    std::cout << c1.getId() << std::endl;      // 1
    std::cout << c2.getId() << std::endl;      // 2
    std::cout << Counter::getCount() << std::endl;  // 2
}
```

⚠️ **常见错误**: 忘记在类外定义静态成员变量，导致链接错误。

**mutable 关键字**

```cpp
class ThreadSafeCounter {
private:
    int count = 0;
    mutable std::mutex mtx;  // mutable 允许在 const 函数中锁定
    
public:
    // const 函数逻辑上不修改对象，但需要加锁
    int get() const {
        std::lock_guard<std::mutex> lock(mtx);  // OK: mtx 是 mutable
        return count;
    }
    
    void increment() {
        std::lock_guard<std::mutex> lock(mtx);
        ++count;
    }
};
```

---

#### public、private和protected访问控制 ⭐⭐

**三种访问修饰符的区别**

| 访问修饰符 | 类内部 | 子类 | 外部 |
|-----------|--------|------|------|
| public | ✓ | ✓ | ✓ |
| protected | ✓ | ✓ | ✗ |
| private | ✓ | ✗ | ✗ |

```cpp
class Base {
public:
    int publicVar = 1;
    
protected:
    int protectedVar = 2;
    
private:
    int privateVar = 3;
};

class Derived : public Base {
public:
    void test() {
        publicVar = 10;      // OK: public 继承后仍是 public
        protectedVar = 20;   // OK: protected 在子类中可访问
        // privateVar = 30;  // Error: private 不可访问
    }
};

int main() {
    Base b;
    b.publicVar = 100;       // OK
    // b.protectedVar = 200; // Error
    // b.privateVar = 300;   // Error
    
    Derived d;
    d.publicVar = 1000;      // OK
    // d.protectedVar = 2000; // Error: protected 在外部不可访问
}
```

---

#### friend

**友元函数和友元类**

```cpp
class Box {
private:
    double width;
    double height;
    
public:
    Box(double w, double h) : width(w), height(h) {}
    
    // 1. 友元函数：允许外部函数访问私有成员
    friend double getArea(const Box& box);
    
    // 2. 友元类：允许另一个类的所有方法访问私有成员
    friend class BoxPrinter;
    
    // 3. 友元成员函数（需要前向声明）
    friend void External::modifyBox(Box& box, double w);
};

// 友元函数定义
double getArea(const Box& box) {
    return box.width * box.height;  // 可以直接访问私有成员
}

// 友元类
class BoxPrinter {
public:
    void print(const Box& box) {
        // 可以访问 Box 的私有成员
        std::cout << "Box: " << box.width << " x " << box.height << std::endl;
    }
};

// 友元成员函数需要在 Box 定义前声明
class External {
public:
    void modifyBox(Box& box, double w);
};
```

⚠️ **破坏封装性的使用建议**: 
- 友元应尽量少用，它破坏了封装性
- 仅在运算符重载（如 `<<`, `>>`）或紧密耦合的类之间使用
- 优先考虑使用 getter/setter 而非友元

---

#### hard copy和soft copy

**深拷贝 vs 浅拷贝** ⭐⭐⭐

```cpp
class ShallowCopy {
private:
    int* data;
    
public:
    ShallowCopy(int val) {
        data = new int(val);
    }
    
    // ⚠️ 默认拷贝构造函数执行浅拷贝
    // 两个对象指向同一块内存！
    ~ShallowCopy() {
        delete data;
    }
};

class DeepCopy {
private:
    int* data;
    size_t size;
    
public:
    DeepCopy(size_t s, int val) : size(s) {
        data = new int[size];
        for (size_t i = 0; i < size; ++i) {
            data[i] = val;
        }
    }
    
    // 拷贝构造函数 - 深拷贝
    DeepCopy(const DeepCopy& other) : size(other.size) {
        data = new int[size];  // 分配新内存
        for (size_t i = 0; i < size; ++i) {
            data[i] = other.data[i];  // 复制数据
        }
    }
    
    // 赋值运算符 - 深拷贝
    DeepCopy& operator=(const DeepCopy& other) {
        // ⚠️ 自赋值检查
        if (this == &other) {
            return *this;
        }
        
        // 分配新内存并复制
        int* newData = new int[other.size];
        for (size_t i = 0; i < other.size; ++i) {
            newData[i] = other.data[i];
        }
        
        // 释放旧内存
        delete[] data;
        
        // 更新成员
        data = newData;
        size = other.size;
        
        return *this;
    }
    
    ~DeepCopy() {
        delete[] data;
    }
};
```

⚠️⚠️ **拷贝构造函数 vs 赋值运算符**

```cpp
class MyClass {
public:
    int* data;
    
    // 拷贝构造函数 - 创建新对象时用已有对象初始化
    MyClass(const MyClass& other) {
        std::cout << "Copy Constructor" << std::endl;
        data = new int(*other.data);
    }
    
    // 赋值运算符 - 已有对象之间的赋值
    MyClass& operator=(const MyClass& other) {
        std::cout << "Copy Assignment" << std::endl;
        if (this != &other) {  // 自赋值检查
            *data = *other.data;  // 注意：这里假设内存已分配
        }
        return *this;
    }
};

int main() {
    MyClass a;
    a.data = new int(10);
    
    MyClass b = a;   // 拷贝构造函数（新对象创建）
    MyClass c(a);    // 拷贝构造函数（显式调用）
    
    MyClass d;
    d = a;           // 赋值运算符（已有对象）
}
```

**规则 of Three/Five** ⭐⭐

```cpp
// Rule of Three (C++98): 如果定义了以下任意一个，应该定义全部三个
// - 析构函数
// - 拷贝构造函数
// - 拷贝赋值运算符

// Rule of Five (C++11): 加上移动语义
// - 析构函数
// - 拷贝构造函数
// - 拷贝赋值运算符
// - 移动构造函数
// - 移动赋值运算符

// Rule of Zero: 优先使用智能指针和容器，避免手动管理资源

class RuleOfFive {
    int* data;
    size_t size;
    
public:
    // 构造函数
    explicit RuleOfFive(size_t s = 0) : size(s), data(new int[s]) {}
    
    // 1. 析构函数
    ~RuleOfFive() { delete[] data; }
    
    // 2. 拷贝构造函数
    RuleOfFive(const RuleOfFive& other) : size(other.size), data(new int[other.size]) {
        std::copy(other.data, other.data + size, data);
    }
    
    // 3. 拷贝赋值运算符
    RuleOfFive& operator=(const RuleOfFive& other) {
        if (this != &other) {
            RuleOfFive temp(other);  // 拷贝并交换惯用法
            swap(temp);
        }
        return *this;
    }
    
    // 4. 移动构造函数 (C++11)
    RuleOfFive(RuleOfFive&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;  // 源对象置空
        other.size = 0;
    }
    
    // 5. 移动赋值运算符 (C++11)
    RuleOfFive& operator=(RuleOfFive&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
    
    void swap(RuleOfFive& other) noexcept {
        using std::swap;
        swap(data, other.data);
        swap(size, other.size);
    }
};
```

---

### 构造函数和析构函数 ⭐⭐⭐

**默认构造函数**

```cpp
class MyClass {
public:
    int x;
    std::string name;
    
    // 默认构造函数
    MyClass() : x(0), name("default") {
        std::cout << "Default constructor" << std::endl;
    }
    
    // 带参数的构造函数
    explicit MyClass(int val) : x(val), name("param") {
        std::cout << "Parameterized constructor" << std::endl;
    }
    
    // 委托构造函数 (C++11)
    MyClass(int val, const std::string& n) : MyClass(val) {
        name = n;
        std::cout << "Delegating constructor" << std::endl;
    }
};

// ⚠️ 隐式转换问题
void func(MyClass obj) { }

int main() {
    MyClass a;           // 默认构造函数
    MyClass b(10);       // 参数化构造函数
    MyClass c{20, "test"}; // C++11 列表初始化
    
    // func(5);  // Error: explicit 阻止隐式转换
}
```

**拷贝构造函数**

```cpp
class Array {
    int* data;
    size_t size;
    
public:
    Array(size_t s) : size(s), data(new int[s]) {}
    
    // 拷贝构造函数
    Array(const Array& other) : size(other.size), data(new int[other.size]) {
        std::copy(other.data, other.data + size, data);
    }
    
    // 禁用拷贝
    // Array(const Array&) = delete;
    
    ~Array() { delete[] data; }
};
```

**移动构造函数 (C++11)**

```cpp
class Buffer {
    char* data;
    size_t size;
    
public:
    Buffer(size_t s) : size(s), data(new char[s]) {}
    
    // 移动构造函数 - 转移资源所有权
    Buffer(Buffer&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;  // 源对象置空，避免重复释放
        other.size = 0;
    }
    
    // 移动赋值运算符
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;      // 释放当前资源
            data = other.data;  // 接管资源
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
    
    ~Buffer() { delete[] data; }
};

Buffer createBuffer() {
    Buffer buf(1000);
    return buf;  // 返回值优化/移动语义
}

int main() {
    Buffer a = createBuffer();  // 移动构造
    Buffer b(500);
    b = createBuffer();          // 移动赋值
}
```

**初始化列表** ⚠️

```cpp
class Member {
public:
    Member(int x) { std::cout << "Member(" << x << ")" << std::endl; }
    Member(const Member&) { std::cout << "Member copy" << std::endl; }
};

class Test {
    const int constVal;      // const 成员必须在初始化列表初始化
    int& ref;                // 引用成员必须在初始化列表初始化
    Member m;                // 没有默认构造函数的成员
    int x, y;
    
public:
    // ⚠️ 初始化顺序由声明顺序决定，不是初始化列表顺序！
    Test(int a, int b) 
        : constVal(a),       // 必须先初始化
          ref(constVal),     // 引用初始化
          m(100),            // 调用 Member(int)
          x(a), 
          y(b)               // 可以用前面初始化的成员
    {
        // 这里赋值会调用拷贝赋值，效率低于初始化列表
        // m = Member(200);  // 先默认构造，再拷贝赋值 - 效率低
    }
};
```

**析构函数的重要性**

```cpp
class Resource {
    FILE* file;
    int* array;
    
public:
    Resource(const char* filename, size_t size) {
        file = fopen(filename, "r");
        array = new int[size];
    }
    
    // ⚠️ 析构函数：确保资源释放，避免内存泄漏
    ~Resource() {
        // 按创建顺序的逆序释放
        delete[] array;      // 先释放 array
        if (file) {
            fclose(file);    // 再关闭文件
        }
    }
};

void riskyFunction() {
    Resource r("data.txt", 1000);
    // 如果这里抛出异常，析构函数仍然会被调用！
    throw std::runtime_error("Oops!");
}  // r 的析构函数自动调用
```

---

### 继承和多态 ⭐⭐⭐

#### 继承的概念和实现

**三种继承方式**

```cpp
class Base {
public:
    int publicVar;
protected:
    int protectedVar;
private:
    int privateVar;
};

// 1. public 继承：保持原有的访问级别
class PublicDerived : public Base {
    // publicVar -> public
    // protectedVar -> protected
    // privateVar -> 不可访问
};

// 2. protected 继承：public 变成 protected
class ProtectedDerived : protected Base {
    // publicVar -> protected
    // protectedVar -> protected
    // privateVar -> 不可访问
};

// 3. private 继承（默认）：全部变成 private
class PrivateDerived : private Base {
    // publicVar -> private
    // protectedVar -> private
    // privateVar -> 不可访问
};
```

**继承中的构造函数调用顺序**

```cpp
class GrandBase {
public:
    GrandBase() { std::cout << "GrandBase" << std::endl; }
};

class Base : public GrandBase {
public:
    Base() { std::cout << "Base" << std::endl; }
};

class Member {
public:
    Member() { std::cout << "Member" << std::endl; }
};

class Derived : public Base {
    Member m;  // 成员对象
public:
    // 构造顺序：GrandBase -> Base -> Member -> Derived
    Derived() { std::cout << "Derived" << std::endl; }
    // 析构顺序相反
};

int main() {
    Derived d;
    // 输出:
    // GrandBase
    // Base
    // Member
    // Derived
}
```

---

#### 多态的实现和应用

**静态多态 vs 动态多态**

```cpp
// ========== 静态多态（编译期）==========
// 1. 函数重载
void print(int x) { std::cout << "int: " << x << std::endl; }
void print(double x) { std::cout << "double: " << x << std::endl; }
void print(const std::string& s) { std::cout << "string: " << s << std::endl; }

// 2. 模板
class Rectangle { public: void draw() const { std::cout << "Rectangle" << std::endl; } };
class Circle { public: void draw() const { std::cout << "Circle" << std::endl; } };

template<typename T>
void drawShape(const T& shape) {
    shape.draw();  // 编译期确定调用哪个 draw
}

// 3. CRTP (Curiously Recurring Template Pattern)
template<typename Derived>
class Shape {
public:
    void draw() const {
        static_cast<const Derived*>(this)->drawImpl();
    }
};

// ========== 动态多态（运行期）==========
class Animal {
public:
    virtual void speak() const {  // 虚函数
        std::cout << "Some sound" << std::endl;
    }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void speak() const override {  // 覆盖虚函数
        std::cout << "Woof!" << std::endl;
    }
};

class Cat : public Animal {
public:
    void speak() const override {
        std::cout << "Meow!" << std::endl;
    }
};

int main() {
    // 静态多态
    print(42);           // int 版本
    print(3.14);         // double 版本
    
    Rectangle r;
    Circle c;
    drawShape(r);        // Rectangle::draw
    drawShape(c);        // Circle::draw
    
    // 动态多态
    Animal* animals[] = { new Dog(), new Cat() };
    for (auto* animal : animals) {
        animal->speak();  // 运行时确定调用哪个版本
    }
}
```

---

#### 虚函数和纯虚函数 ⭐⭐⭐

**virtual 关键字**

```cpp
class Base {
public:
    // 虚函数 - 可以在子类中覆盖
    virtual void func1() { std::cout << "Base::func1" << std::endl; }
    
    // 纯虚函数 - 抽象方法，子类必须实现
    virtual void func2() = 0;
    
    // ⚠️ 虚析构函数 - 确保通过基类指针删除派生类对象时正确析构
    virtual ~Base() { std::cout << "Base destructor" << std::endl; }
};

class Derived : public Base {
public:
    void func1() override {  // C++11 override 关键字
        std::cout << "Derived::func1" << std::endl;
    }
    
    void func2() override {
        std::cout << "Derived::func2" << std::endl;
    }
    
    ~Derived() { std::cout << "Derived destructor" << std::endl; }
};
```

**虚函数表原理**

```cpp
class Base {
    int x;
public:
    virtual void f() {}
    virtual void g() {}
};

class Derived : public Base {
    int y;
public:
    void f() override {}  // 覆盖 Base::f
    // g() 继承自 Base
    virtual void h() {}   // 新增虚函数
};

// 内存布局示意：
// Base 对象: [vptr][x]
//              |
//              v
//           [Base::f][Base::g]
//
// Derived 对象: [vptr][x][y]
//                |
//                v
//             [Derived::f][Base::g][Derived::h]

// ⚠️ 虚函数的开销：
// 1. 每个对象增加一个指针（vptr）的大小
// 2. 虚函数调用通过指针间接调用，有轻微性能损失
// 3. 内联优化可能失效
```

**纯虚函数和抽象类**

```cpp
// 抽象类 - 包含纯虚函数的类，不能实例化
class Shape {
public:
    virtual double area() const = 0;      // 纯虚函数
    virtual double perimeter() const = 0;  // 纯虚函数
    
    virtual void print() const {           // 可以有实现的虚函数
        std::cout << "Area: " << area() << std::endl;
    }
    
    virtual ~Shape() = default;
};

// 具体类 - 实现所有纯虚函数
class Rectangle : public Shape {
    double width, height;
    
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double area() const override {
        return width * height;
    }
    
    double perimeter() const override {
        return 2 * (width + height);
    }
};

// Shape s;           // Error: 抽象类不能实例化
Rectangle r(3, 4);   // OK
Shape* s = &r;       // OK: 可以用指针/引用指向派生类
```

**虚析构函数** ⚠️⚠️⚠️

```cpp
class Base {
public:
    // ⚠️ 如果类有任何虚函数，析构函数必须是虚函数！
    virtual ~Base() {
        std::cout << "Base destructor" << std::endl;
    }
};

class Derived : public Base {
    int* data;
public:
    Derived() : data(new int[100]) {}
    
    ~Derived() {
        delete[] data;  // 如果 Base 析构不是虚函数，这行不会执行！
        std::cout << "Derived destructor" << std::endl;
    }
};

int main() {
    Base* ptr = new Derived();
    delete ptr;  // 如果 ~Base 不是虚函数，只调用 ~Base()，内存泄漏！
}
```

---

#### 抽象类和接口

**抽象类的定义**

```cpp
// C++ 没有 interface 关键字，用纯虚函数类实现
class IPrintable {
public:
    virtual void print() const = 0;
    virtual ~IPrintable() = default;
};

class ISerializable {
public:
    virtual std::string serialize() const = 0;
    virtual void deserialize(const std::string& data) = 0;
    virtual ~ISerializable() = default;
};

// 多重继承实现接口
class Document : public IPrintable, public ISerializable {
    std::string content;
    
public:
    // 实现 IPrintable
    void print() const override {
        std::cout << content << std::endl;
    }
    
    // 实现 ISerializable
    std::string serialize() const override {
        return content;
    }
    
    void deserialize(const std::string& data) override {
        content = data;
    }
};
```

**接口设计模式**

```cpp
// 策略模式 - 使用接口实现可替换算法
class ISortStrategy {
public:
    virtual void sort(std::vector<int>& data) = 0;
    virtual ~ISortStrategy() = default;
};

class QuickSort : public ISortStrategy {
public:
    void sort(std::vector<int>& data) override {
        quickSort(data, 0, data.size() - 1);
    }
private:
    void quickSort(std::vector<int>&, int, int) { /* ... */ }
};

class MergeSort : public ISortStrategy {
public:
    void sort(std::vector<int>& data) override {
        // 归并排序实现
    }
};

class Sorter {
    std::unique_ptr<ISortStrategy> strategy;
    
public:
    void setStrategy(std::unique_ptr<ISortStrategy> s) {
        strategy = std::move(s);
    }
    
    void sort(std::vector<int>& data) {
        if (strategy) {
            strategy->sort(data);
        }
    }
};
```

---

### 运算符重载 ⭐⭐

**可重载和不可重载的运算符** ⚠️

```cpp
class Complex {
    double real, imag;
    
public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}
    
    // ===== 可重载的运算符 =====
    
    // 算术运算符 - 成员函数
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }
    
    // 复合赋值运算符
    Complex& operator+=(const Complex& other) {
        real += other.real;
        imag += other.imag;
        return *this;
    }
    
    // 一元运算符
    Complex operator-() const {
        return Complex(-real, -imag);
    }
    
    // 前缀递增
    Complex& operator++() {
        ++real;
        return *this;
    }
    
    // 后缀递增 ⚠️ int 参数用于区分前缀/后缀
    Complex operator++(int) {
        Complex temp(*this);
        ++real;
        return temp;
    }
    
    // 下标运算符
    double operator[](int index) const {
        return (index == 0) ? real : imag;
    }
    
    // 函数调用运算符（仿函数）
    double operator()(double x) const {
        return real * x + imag;
    }
    
    // ===== 不可重载的运算符 =====
    // . (成员访问)
    // .* (成员指针访问)
    // :: (作用域解析)
    // ?: (三元条件)
    // sizeof
    // typeid
    // static_cast, dynamic_cast, const_cast, reinterpret_cast
    
    // 友元声明，用于非成员函数重载
    friend std::ostream& operator<<(std::ostream& os, const Complex& c);
    friend std::istream& operator>>(std::istream& is, Complex& c);
};

// 输入输出运算符 - 必须是非成员函数
std::ostream& operator<<(std::ostream& os, const Complex& c) {
    os << "(" << c.real << ", " << c.imag << "i)";
    return os;
}

std::istream& operator>>(std::istream& is, Complex& c) {
    is >> c.real >> c.imag;
    return is;
}
```

**成员函数 vs 非成员函数重载**

```cpp
class Vector2D {
    double x, y;
    
public:
    Vector2D(double x = 0, double y = 0) : x(x), y(y) {}
    
    // 成员函数重载：左操作数必须是 Vector2D
    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }
    
    // 非成员函数重载：允许隐式转换
    friend Vector2D operator*(double scalar, const Vector2D& v) {
        return Vector2D(scalar * v.x, scalar * v.y);
    }
    
    Vector2D operator*(double scalar) const {
        return Vector2D(x * scalar, y * scalar);
    }
};

int main() {
    Vector2D v1(1, 2), v2(3, 4);
    
    Vector2D v3 = v1 + v2;     // OK: 成员函数
    Vector2D v4 = 2.0 * v1;    // OK: 非成员函数
    Vector2D v5 = v1 * 2.0;    // OK: 成员函数
    // Vector2D v6 = v1 * 2;   // 如果只有成员函数，int 会隐式转换
}
```

⚠️ **最佳实践**: 对称的运算符（+、-、*、/）建议实现为非成员函数，以支持左右操作数的隐式转换。

---

### 模板编程与元编程

#### 模板的定义和使用 ⭐⭐

**函数模板**

```cpp
// 通用交换函数
template<typename T>
void swap(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}

// 多类型参数模板
template<typename T, typename U>
auto add(T a, U b) -> decltype(a + b) {
    return a + b;
}

// C++14 自动推导返回类型
template<typename T, typename U>
auto multiply(T a, U b) {
    return a * b;
}

// 非类型模板参数
template<typename T, size_t N>
size_t arraySize(const T (&)[N]) {
    return N;  // 编译期获取数组大小
}

int main() {
    int x = 1, y = 2;
    swap(x, y);  // 编译器推导为 swap<int>
    
    double a = 1.5;
    auto result = add(x, a);  // 推导为 add<int, double>
    
    int arr[10];
    std::cout << arraySize(arr) << std::endl;  // 10
}
```

**类模板**

```cpp
template<typename T>
class Stack {
private:
    std::vector<T> data;
    
public:
    void push(const T& value) {
        data.push_back(value);
    }
    
    void pop() {
        if (!data.empty()) {
            data.pop_back();
        }
    }
    
    T& top() {
        return data.back();
    }
    
    bool empty() const {
        return data.empty();
    }
    
    // 模板类内的模板方法
    template<typename U>
    void pushMultiple(U begin, U end) {
        for (auto it = begin; it != end; ++it) {
            push(*it);
        }
    }
};

// 模板别名
template<typename T>
using IntMap = std::map<int, T>;

int main() {
    Stack<int> intStack;
    intStack.push(10);
    intStack.push(20);
    
    Stack<std::string> stringStack;
    stringStack.push("Hello");
    
    IntMap<std::string> map;  // std::map<int, std::string>
}
```

---

#### 模板特化和偏特化

**全特化**

```cpp
template<typename T>
class Storage {
public:
    void store(const T& value) {
        std::cout << "General storage" << std::endl;
        data = value;
    }
private:
    T data;
};

// 全特化：针对特定类型的完全定制
template<>
class Storage<bool> {
public:
    void store(bool value) {
        std::cout << "Optimized bool storage" << std::endl;
        // 使用位运算优化存储
        data = value ? 1 : 0;
    }
private:
    unsigned char data;
};

// 函数模板全特化
template<typename T>
bool isEqual(T a, T b) {
    return a == b;
}

template<>
bool isEqual<double>(double a, double b) {
    const double EPSILON = 1e-9;
    return std::abs(a - b) < EPSILON;
}
```

**偏特化**

```cpp
template<typename T, typename U>
class Pair {
public:
    void describe() { std::cout << "General Pair" << std::endl; }
};

// 偏特化1：第一个类型为指针
template<typename T, typename U>
class Pair<T*, U> {
public:
    void describe() { std::cout << "First is pointer" << std::endl; }
};

// 偏特化2：两个类型相同
template<typename T>
class Pair<T, T> {
public:
    void describe() { std::cout << "Same types" << std::endl; }
};

// 偏特化3：指针类型
template<typename T, typename U>
class Pair<T*, U*> {
public:
    void describe() { std::cout << "Both are pointers" << std::endl; }
};

int main() {
    Pair<int, double> p1;      // General Pair
    Pair<int*, double> p2;     // First is pointer
    Pair<int, int> p3;         // Same types
    Pair<int*, double*> p4;    // Both are pointers
}
```

---

#### 模板元编程简介

**编译期计算**

```cpp
// 编译期阶乘计算
template<int N>
struct Factorial {
    static constexpr int value = N * Factorial<N - 1>::value;
};

template<>
struct Factorial<0> {
    static constexpr int value = 1;
};

// C++14/17 变量模板
template<int N>
constexpr int factorial = Factorial<N>::value;

// C++17 constexpr if
template<int N>
constexpr int fibonacci() {
    if constexpr (N <= 1) {
        return N;
    } else {
        return fibonacci<N - 1>() + fibonacci<N - 2>();
    }
}

// SFINAE - 条件模板启用
template<typename T>
std::enable_if_t<std::is_integral_v<T>, T>
doubleValue(T value) {
    return value * 2;
}

template<typename T>
std::enable_if_t<std::is_floating_point_v<T>, T>
doubleValue(T value) {
    return value * 2.0;
}

// C++20 concepts (更简洁的 SFINAE)
template<typename T>
concept Arithmetic = std::is_arithmetic_v<T>;

template<Arithmetic T>
T add(T a, T b) {
    return a + b;
}

int main() {
    constexpr int fact5 = Factorial<5>::value;  // 120，编译期计算
    constexpr int fib10 = fibonacci<10>();       // 55，编译期计算
    
    int x = doubleValue(5);      // 调用整数版本
    double y = doubleValue(3.5); // 调用浮点版本
}
```

---

### Friend Class

**友元类的使用场景**

```cpp
// 场景1：紧密耦合的类需要互相访问私有成员
class Engine;

class Car {
private:
    int speed;
    Engine* engine;
    
public:
    Car();
    void accelerate();
    
    friend class Engine;  // Engine 可以访问 Car 的私有成员
};

class Engine {
private:
    int horsepower;
    Car* car;
    
public:
    void setCar(Car* c) { car = c; }
    
    void boost() {
        // 可以直接访问 Car 的私有成员
        if (car) {
            car->speed += 50;  // 访问私有成员 speed
        }
    }
    
    friend class Car;  // Car 也可以访问 Engine 的私有成员
};

Car::Car() : speed(0), engine(new Engine()) {
    engine->setCar(this);
    // 可以访问 Engine 的私有成员
    engine->horsepower = 200;
}

// 场景2：容器类和迭代器类
class Container;

class Iterator {
private:
    Container* container;
    size_t index;
    
public:
    Iterator(Container* c, size_t i) : container(c), index(i) {}
    
    int& operator*();
    Iterator& operator++();
    
    friend class Container;  // Container 可以创建 Iterator
};

class Container {
private:
    int data[100];
    size_t size;
    
public:
    Iterator begin() { return Iterator(this, 0); }
    Iterator end() { return Iterator(this, size); }
    
    friend class Iterator;  // Iterator 可以访问 data
};

int& Iterator::operator*() {
    return container->data[index];  // 访问 Container 的私有成员
}

Iterator& Iterator::operator++() {
    ++index;
    return *this;
}

// ⚠️ 友元关系不传递、不继承
class A { friend class B; };
class B { friend class C; };
// C 不是 A 的友元！
```

---

### Nested Class

**嵌套类的定义和访问**

```cpp
class Outer {
private:
    int outerPrivate;
    static int outerStatic;
    
public:
    int outerPublic;
    
    // 嵌套类定义
    class Inner {
    private:
        int innerPrivate;
        
    public:
        int innerPublic;
        
        void show() {
            std::cout << "Inner class" << std::endl;
            // ⚠️ 不能直接访问 Outer 的非静态成员
            // outerPrivate = 10;  // Error!
            
            // 可以访问静态成员
            outerStatic = 20;  // OK
        }
        
        // 通过 Outer 对象访问
        void accessOuter(Outer& outer) {
            outer.outerPrivate = 30;  // OK: 可以访问 Outer 的私有成员
            outer.outerPublic = 40;   // OK
        }
    };
    
    // 嵌套类的使用
    Inner inner;  // Outer 对象可以包含 Inner 对象
    
    void test() {
        Inner i;           // 在类内部可以直接使用 Inner
        i.innerPublic = 10; // 可以访问 public 成员
        // i.innerPrivate = 20;  // Error: private 成员不可访问
    }
};

int Outer::outerStatic = 0;

// 类外定义嵌套类方法
class Outer::Inner2 {
public:
    void func();
};

void Outer::Inner2::func() {
    // 实现
}

int main() {
    // 在类外需要使用作用域解析符
    Outer::Inner innerObj;
    innerObj.innerPublic = 100;
    // innerObj.innerPrivate = 200;  // Error
    
    Outer outer;
    outer.test();
}
```

### STL（标准模板库）

STL（Standard Template Library，标准模板库）是 C++ 标准库的核心组成部分，提供了通用的容器、算法、迭代器和函数对象，是高效 C++ 编程的基础。

#### STL容器：vector、list、map等

STL 容器分为序列容器、关联容器和无序关联容器三大类。

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <deque>
#include <array>
#include <forward_list>
#include <set>
#include <map>
#include <unordered_set>
#include <unordered_map>

int main() {
    // ==================== 序列容器 ====================
    
    // vector: 动态数组，随机访问 O(1)，尾部插入删除 O(1)
    std::vector<int> vec = {1, 2, 3, 4, 5};
    vec.push_back(6);                    // 尾部添加
    vec.insert(vec.begin() + 2, 10);     // 在索引2插入
    vec.erase(vec.begin());              // 删除第一个元素
    
    std::cout << "Vector: ";
    for (const auto& item : vec) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
    
    // list: 双向链表，任意位置插入删除 O(1)
    std::list<int> lst = {1, 2, 3};
    lst.push_back(4);
    lst.push_front(0);
    lst.insert(++lst.begin(), 99);       // 在第二个位置插入
    
    // deque: 双端队列，两端操作 O(1)，支持随机访问
    std::deque<int> deq = {1, 2, 3};
    deq.push_back(4);
    deq.push_front(0);
    
    // array: 固定大小数组（C++11）
    std::array<int, 5> arr = {1, 2, 3, 4, 5};
    std::cout << "Array size: " << arr.size() << std::endl;
    
    // forward_list: 单向链表，更省内存
    std::forward_list<int> flst = {1, 2, 3};
    flst.push_front(0);                  // 只能头部插入
    
    // ==================== 关联容器（基于红黑树）====================
    
    // set: 有序唯一集合，操作 O(log n)
    std::set<int> s = {3, 1, 4, 1, 5};   // 重复被忽略，自动排序
    s.insert(2);
    s.erase(3);
    
    // multiset: 有序可重复集合
    std::multiset<int> ms = {1, 2, 2, 3, 3, 3};
    std::cout << "Count of 3: " << ms.count(3) << std::endl;
    
    // map: 有序键值对
    std::map<std::string, int> scores;
    scores["Alice"] = 90;
    scores.insert({"Bob", 85});          // C++11 列表初始化
    
    for (const auto& [name, score] : scores) {  // C++17 结构化绑定
        std::cout << name << ": " << score << std::endl;
    }
    
    // multimap: 可重复键
    std::multimap<std::string, int> mm;
    mm.insert({"Alice", 90});
    mm.insert({"Alice", 95});
    
    // ==================== 无序关联容器（基于哈希表，C++11）====================
    
    // unordered_set: 无序唯一集合，平均 O(1)
    std::unordered_set<int> us = {3, 1, 4, 1, 5};
    
    // unordered_map: 无序键值对
    std::unordered_map<std::string, int> um;
    um["apple"] = 5;
    um["banana"] = 3;
    
    return 0;
}
```

> **重要：** 选择容器的关键原则：
> - 需要频繁随机访问 → 使用 `vector`
> - 频繁在中间插入删除 → 使用 `list`
> - 频繁在两端插入删除 → 使用 `deque`
> - 需要有序且去重 → 使用 `set`/`map`
> - 只需快速查找，不关心顺序 → 使用 `unordered_set`/`unordered_map`

#### STL算法：sort、find、accumulate等

STL 算法库提供了大量通用的算法，通过迭代器操作容器。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <functional>

int main() {
    std::vector<int> vec = {3, 1, 4, 1, 5, 9, 2, 6};
    
    // ==================== 排序算法 ====================
    
    // sort: 快速排序（通常 introsort）
    std::sort(vec.begin(), vec.end());
    
    // 降序排序
    std::sort(vec.begin(), vec.end(), std::greater<int>());
    
    // stable_sort: 稳定排序，保持相等元素的相对顺序
    std::stable_sort(vec.begin(), vec.end());
    
    // partial_sort: 部分排序，前 n 个元素有序
    std::partial_sort(vec.begin(), vec.begin() + 3, vec.end());
    
    // nth_element: 使第 n 个元素处于排序后的位置
    std::nth_element(vec.begin(), vec.begin() + 4, vec.end());
    
    // ==================== 查找算法 ====================
    
    vec = {3, 1, 4, 1, 5, 9, 2, 6};
    
    // find: 线性查找
    auto it = std::find(vec.begin(), vec.end(), 5);
    if (it != vec.end()) {
        std::cout << "Found 5 at position " << std::distance(vec.begin(), it) << std::endl;
    }
    
    // binary_search: 二分查找（要求已排序）
    std::sort(vec.begin(), vec.end());
    bool found = std::binary_search(vec.begin(), vec.end(), 5);
    
    // lower_bound: 第一个不小于目标的位置
    auto lb = std::lower_bound(vec.begin(), vec.end(), 4);
    
    // upper_bound: 第一个大于目标的位置
    auto ub = std::upper_bound(vec.begin(), vec.end(), 4);
    
    // equal_range: 返回 lower_bound 和 upper_bound
    auto range = std::equal_range(vec.begin(), vec.end(), 1);
    
    // find_if: 条件查找
    auto it2 = std::find_if(vec.begin(), vec.end(), [](int x) { return x > 5; });
    
    // ==================== 数值算法 ====================
    
    // accumulate: 累加
    int sum = std::accumulate(vec.begin(), vec.end(), 0);
    
    // 累乘
    int product = std::accumulate(vec.begin(), vec.end(), 1, std::multiplies<int>());
    
    // inner_product: 内积
    std::vector<int> vec2 = {1, 2, 3, 4, 5, 6, 7, 8};
    int dot = std::inner_product(vec.begin(), vec.begin() + 3, vec2.begin(), 0);
    
    // partial_sum: 前缀和
    std::vector<int> prefix(vec.size());
    std::partial_sum(vec.begin(), vec.end(), prefix.begin());
    
    // ==================== 修改算法 ====================
    
    // copy
    std::vector<int> copy(vec.size());
    std::copy(vec.begin(), vec.end(), copy.begin());
    
    // fill
    std::fill(copy.begin(), copy.end(), 0);
    
    // generate
    int n = 0;
    std::generate(copy.begin(), copy.end(), [&n]() { return n++; });
    
    // replace
    std::replace(copy.begin(), copy.end(), 3, 99);
    
    // remove-erase 惯用法
    vec = {1, 2, 3, 2, 4, 2, 5};
    vec.erase(std::remove(vec.begin(), vec.end(), 2), vec.end());
    // vec: 1, 3, 4, 5
    
    // unique: 去重（相邻重复）
    vec = {1, 1, 2, 2, 2, 3, 3};
    vec.erase(std::unique(vec.begin(), vec.end()), vec.end());
    
    // reverse
    std::reverse(vec.begin(), vec.end());
    
    // rotate
    vec = {1, 2, 3, 4, 5};
    std::rotate(vec.begin(), vec.begin() + 2, vec.end());
    // vec: 3, 4, 5, 1, 2
    
    // ==================== 集合算法 ====================
    
    std::vector<int> set1 = {1, 2, 3, 4, 5};
    std::vector<int> set2 = {4, 5, 6, 7, 8};
    std::vector<int> result;
    
    // set_union: 并集
    std::set_union(set1.begin(), set1.end(), set2.begin(), set2.end(), 
                   std::back_inserter(result));
    
    // set_intersection: 交集
    result.clear();
    std::set_intersection(set1.begin(), set1.end(), set2.begin(), set2.end(),
                          std::back_inserter(result));
    
    // set_difference: 差集
    result.clear();
    std::set_difference(set1.begin(), set1.end(), set2.begin(), set2.end(),
                        std::back_inserter(result));
    
    // ==================== 其他算法 ====================
    
    // count/count_if
    int count = std::count(vec.begin(), vec.end(), 5);
    int count_if_result = std::count_if(vec.begin(), vec.end(), 
                                        [](int x) { return x % 2 == 0; });
    
    // all_of/any_of/none_of (C++11)
    bool all_positive = std::all_of(vec.begin(), vec.end(), 
                                    [](int x) { return x > 0; });
    
    // min_element/max_element/minmax_element
    auto min_it = std::min_element(vec.begin(), vec.end());
    auto max_it = std::max_element(vec.begin(), vec.end());
    
    return 0;
}
```

> **易错点：** `remove` 不会真正删除元素，只是将要保留的元素移到前面，返回新的逻辑结尾。必须使用 `erase` 真正删除元素（remove-erase 惯用法）。

#### STL迭代器：输入迭代器、输出迭代器、前向迭代器等

迭代器是 STL 的通用访问接口，不同的迭代器类别支持不同的操作。

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <forward_list>
#include <iterator>

int main() {
    // ==================== 迭代器类别 ====================
    // 1. 输入迭代器：只读，单次遍历（istream_iterator）
    // 2. 输出迭代器：只写，单次遍历（ostream_iterator, back_inserter）
    // 3. 前向迭代器：可读写，多次遍历，只能前进（forward_list）
    // 4. 双向迭代器：可前进后退（list, set, map）
    // 5. 随机访问迭代器：可任意位置访问（vector, deque, array）
    
    std::vector<int> vec = {1, 2, 3, 4, 5};
    std::list<int> lst = {1, 2, 3, 4, 5};
    
    // ==================== vector - 随机访问迭代器 ====================
    auto vit = vec.begin();
    std::cout << "vec[2] via iterator: " << *(vit + 2) << std::endl;  // 支持算术运算
    std::cout << "Distance: " << (vec.end() - vit) << std::endl;
    std::advance(vit, 3);  // 向前移动 3 步
    
    // ==================== list - 双向迭代器 ====================
    auto lit = lst.begin();
    ++lit;
    --lit;
    // lit + 2;  // 错误！双向迭代器不支持算术运算
    std::advance(lit, 2);  // 正确，但内部是循环 ++
    
    // ==================== 插入迭代器 ====================
    std::vector<int> dest;
    auto back_it = std::back_inserter(dest);  // 尾部插入
    *back_it = 1;  // 相当于 dest.push_back(1)
    *back_it = 2;
    
    // 流迭代器
    std::ostream_iterator<int> output_it(std::cout, " ");
    std::copy(vec.begin(), vec.end(), output_it);
    std::cout << std::endl;
    
    // 反向迭代器
    std::cout << "Reverse: ";
    for (auto rit = vec.rbegin(); rit != vec.rend(); ++rit) {
        std::cout << *rit << " ";
    }
    std::cout << std::endl;
    
    // ==================== 迭代器辅助函数 ====================
    // std::next, std::prev (C++11)
    auto next_it = std::next(vec.begin(), 2);
    auto prev_it = std::prev(vec.end(), 2);
    
    // std::distance
    auto dist = std::distance(vec.begin(), vec.end());
    
    return 0;
}
```

> **重要：** 迭代器可能因容器修改而失效。`vector` 插入元素后所有迭代器可能失效；`list` 插入不会使迭代器失效。使用前要解容器的迭代器失效规则。

#### STL函数对象和lambda表达式

函数对象（Functor）是重载了 `operator()` 的类，可以像函数一样调用。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>

// 自定义函数对象
class GreaterThan {
private:
    int threshold;
    
public:
    explicit GreaterThan(int t) : threshold(t) {}
    
    bool operator()(int value) const {
        return value > threshold;
    }
};

// 带状态的函数对象
class SumAccumulator {
private:
    double sum = 0;
    int count = 0;
    
public:
    void operator()(double value) {
        sum += value;
        ++count;
    }
    
    double getAverage() const { return count > 0 ? sum / count : 0; }
};

int main() {
    std::vector<int> nums = {1, 5, 3, 8, 2, 9, 4, 7, 6};
    
    // ==================== 标准函数对象 ====================
    std::plus<int> add;
    std::greater<int> greater_than;
    std::less<int> less_than;
    
    std::cout << "10 + 5 = " << add(10, 5) << std::endl;
    
    // ==================== 自定义函数对象 ====================
    auto it = std::find_if(nums.begin(), nums.end(), GreaterThan(5));
    if (it != nums.end()) {
        std::cout << "First number > 5: " << *it << std::endl;
    }
    
    // 带状态的函数对象
    SumAccumulator acc = std::for_each(nums.begin(), nums.end(), SumAccumulator());
    std::cout << "Average: " << acc.getAverage() << std::endl;
    
    // ==================== Lambda 表达式 ====================
    
    // 基本语法: [捕获](参数) -> 返回类型 { 函数体 }
    
    // 简单 lambda
    auto square = [](int x) { return x * x; };
    std::cout << "Square of 5: " << square(5) << std::endl;
    
    // 值捕获
    int threshold = 5;
    auto greater_than_threshold = [threshold](int x) {
        return x > threshold;
    };
    
    // 引用捕获
    int sum = 0;
    std::for_each(nums.begin(), nums.end(), [&sum](int x) { sum += x; });
    
    // 隐式捕获 [=] 值捕获所有，[&] 引用捕获所有
    auto lambda1 = [=](int x) { return x > threshold; };
    auto lambda2 = [&]() { ++threshold; };
    
    // C++14 泛型 lambda
    auto generic_add = [](auto a, auto b) { return a + b; };
    std::cout << "generic_add(1, 2) = " << generic_add(1, 2) << std::endl;
    std::cout << "generic_add(1.5, 2.5) = " << generic_add(1.5, 2.5) << std::endl;
    
    // ==================== Lambda 在算法中的应用 ====================
    
    // 排序
    std::sort(nums.begin(), nums.end(), [](int a, int b) { return a > b; });
    
    // 查找
    auto it2 = std::find_if(nums.begin(), nums.end(), [](int x) {
        return x % 2 == 0 && x > 5;
    });
    
    // 变换
    std::vector<int> squared;
    std::transform(nums.begin(), nums.end(), std::back_inserter(squared),
                   [](int x) { return x * x; });
    
    // 计数
    int even_count = std::count_if(nums.begin(), nums.end(),
                                   [](int x) { return x % 2 == 0; });
    
    // 删除满足条件的元素
    nums.erase(std::remove_if(nums.begin(), nums.end(),
                              [](int x) { return x < 5; }), nums.end());
    
    // ==================== std::function ====================
    std::function<int(int, int)> operation;
    
    operation = [](int a, int b) { return a + b; };
    std::cout << "Add: " << operation(3, 4) << std::endl;
    
    operation = [](int a, int b) { return a * b; };
    std::cout << "Multiply: " << operation(3, 4) << std::endl;
    
    return 0;
}
```

> **重要：** C++14 的泛型 Lambda 大大增强了 Lambda 的灵活性。`std::function` 可以存储任何可调用对象，但有一定的性能开销。

#### STL适配器：stack、queue、priority_queue等

容器适配器是在其他容器之上提供特殊接口的容器。

```cpp
#include <iostream>
#include <stack>
#include <queue>
#include <vector>
#include <functional>

struct Task {
    std::string name;
    int priority;
    
    bool operator<(const Task& other) const {
        return priority < other.priority;  // priority_queue 默认是大顶堆
    }
};

int main() {
    // ==================== stack ====================
    std::stack<int> stk;
    
    stk.push(1);
    stk.push(2);
    stk.push(3);
    
    std::cout << "Stack top: " << stk.top() << std::endl;
    stk.pop();
    std::cout << "Stack size: " << stk.size() << std::endl;
    
    // 遍历（需要复制）
    std::stack<int> stk_copy = stk;
    std::cout << "Stack contents: ";
    while (!stk_copy.empty()) {
        std::cout << stk_copy.top() << " ";
        stk_copy.pop();
    }
    std::cout << std::endl;
    
    // ==================== queue ====================
    std::queue<int> q;
    
    q.push(1);
    q.push(2);
    q.push(3);
    
    std::cout << "Queue front: " << q.front() << std::endl;
    std::cout << "Queue back: " << q.back() << std::endl;
    q.pop();
    std::cout << "Queue front after pop: " << q.front() << std::endl;
    
    // ==================== priority_queue ====================
    
    // 默认大顶堆
    std::priority_queue<int> max_heap;
    max_heap.push(3);
    max_heap.push(1);
    max_heap.push(4);
    
    std::cout << "Max heap (descending): ";
    while (!max_heap.empty()) {
        std::cout << max_heap.top() << " ";
        max_heap.pop();
    }
    std::cout << std::endl;
    
    // 小顶堆
    std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap;
    min_heap.push(3);
    min_heap.push(1);
    min_heap.push(4);
    
    std::cout << "Min heap (ascending): ";
    while (!min_heap.empty()) {
        std::cout << min_heap.top() << " ";
        min_heap.pop();
    }
    std::cout << std::endl;
    
    // 自定义类型的 priority_queue
    std::priority_queue<Task> task_queue;
    task_queue.push({"Write code", 3});
    task_queue.push({"Fix bug", 5});
    task_queue.push({"Write docs", 1});
    
    std::cout << "Tasks by priority:" << std::endl;
    while (!task_queue.empty()) {
        auto task = task_queue.top();
        task_queue.pop();
        std::cout << "  [" << task.priority << "] " << task.name << std::endl;
    }
    
    return 0;
}
```

> **重要：** `stack`、`queue` 和 `priority_queue` 不提供迭代器，也不允许遍历。如果需要遍历，需要复制容器或使用其他数据结构。

### 异常处理

异常处理是 C++ 中处理错误和异常情况的重要机制。

#### try、catch和throw

```cpp
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

// 自定义异常类
class MyException : public std::exception {
private:
    std::string message;
    int errorCode;
    
public:
    MyException(const std::string& msg, int code) 
        : message(msg), errorCode(code) {}
    
    const char* what() const noexcept override {
        return message.c_str();
    }
    
    int getErrorCode() const { return errorCode; }
};

// 可能抛出异常的函数
double divide(double a, double b) {
    if (b == 0) {
        throw std::runtime_error("Division by zero!");
    }
    return a / b;
}

int main() {
    // ==================== 基本异常处理 ====================
    try {
        double result = divide(10, 0);
        std::cout << "Result: " << result << std::endl;
    } catch (const std::runtime_error& e) {
        std::cerr << "Runtime error: " << e.what() << std::endl;
    }
    
    // ==================== 多个 catch 块 ====================
    try {
        std::vector<int> data = {1, 2, 3};
        // data.at(10) = 5;  // 抛出 out_of_range
        throw MyException("Custom error", 42);
    } catch (const std::out_of_range& e) {
        std::cerr << "Out of range: " << e.what() << std::endl;
    } catch (const MyException& e) {
        std::cerr << "MyException: " << e.what() << ", Code: " << e.getErrorCode() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Standard exception: " << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown exception caught" << std::endl;
        throw;  // 重新抛出
    }
    
    // ==================== 函数try块（用于构造函数）====================
    class Resource {
    private:
        int* data;
    public:
        Resource() try : data(new int[1000000000]) {
            std::cout << "Resource acquired" << std::endl;
        } catch (const std::bad_alloc& e) {
            std::cerr << "Failed to allocate: " << e.what() << std::endl;
            throw;
        }
        ~Resource() { delete[] data; }
    };
    
    // ==================== noexcept 说明符 ====================
    auto safeFunction = []() noexcept {
        // 承诺不抛出异常
    };
    
    return 0;
}
```

> **重要：** 总是按引用捕获异常（`const ExceptionType&`），避免对象切片问题。基类析构函数应该声明为虚函数。

#### assert

```cpp
#include <iostream>
#include <cassert>
#include <cmath>

// 自定义 assert 消息（C++17）
#ifdef NDEBUG
    #define ASSERT_WITH_MSG(condition, msg) ((void)0)
#else
    #define ASSERT_WITH_MSG(condition, msg) \
        do { \
            if (!(condition)) { \
                std::cerr << "Assertion failed: " << #condition \
                         << "\nMessage: " << msg \
                         << "\nFile: " << __FILE__ \
                         << "\nLine: " << __LINE__ << std::endl; \
                std::abort(); \
            } \
        } while (0)
#endif

// 静态断言（编译期）
template<typename T>
void processPositive(T value) {
    static_assert(std::is_arithmetic<T>::value, "T must be arithmetic type");
    assert(value > 0);  // 运行期断言
    std::cout << "Processing: " << value << std::endl;
}

class Vector3D {
private:
    double x, y, z;
    
public:
    Vector3D(double x, double y, double z) : x(x), y(y), z(z) {
        assert(std::isfinite(x) && std::isfinite(y) && std::isfinite(z));
    }
    
    double normalize() {
        double len = std::sqrt(x*x + y*y + z*z);
        assert(len > 0 && "Cannot normalize zero vector");
        
        x /= len; y /= len; z /= len;
        
        // 后置条件检查
        double newLen = std::sqrt(x*x + y*y + z*z);
        assert(std::abs(newLen - 1.0) < 1e-10);
        
        return len;
    }
};

int main() {
    // 基本 assert
    int x = 5;
    assert(x > 0);
    
    // 带消息的断言
    ASSERT_WITH_MSG(x == 5, "x should be 5");
    
    // 静态断言
    processPositive(3.14);
    
    // 使用断言的类
    Vector3D v(3, 4, 0);
    double originalLen = v.normalize();
    
    // ⚠️ 不要在 assert 中包含副作用！
    // 错误：assert(++i > 0);  // 在 release 中不会执行！
    
    return 0;
}
```

> **重要：** `assert` 在定义了 `NDEBUG` 的发布版本中会被移除。永远不要在 `assert` 中包含副作用代码。使用 `static_assert` 进行编译期检查。

#### nothrow

```cpp
#include <iostream>
#include <new>  // for std::nothrow

class MyClass {
public:
    MyClass() { std::cout << "MyClass constructed" << std::endl; }
    ~MyClass() { std::cout << "MyClass destroyed" << std::endl; }
};

int main() {
    // ==================== nothrow new ====================
    
    // 普通 new 失败时抛出 std::bad_alloc
    // nothrow new 失败时返回 nullptr
    
    int* p1 = new (std::nothrow) int[1000000000];
    if (p1 == nullptr) {
        std::cerr << "Memory allocation failed!" << std::endl;
    } else {
        std::cout << "Memory allocated successfully" << std::endl;
        delete[] p1;
    }
    
    // 对象分配
    MyClass* obj = new (std::nothrow) MyClass();
    if (obj == nullptr) {
        std::cerr << "Object allocation failed!" << std::endl;
    } else {
        delete obj;
    }
    
    // ==================== 比较 ====================
    
    // 异常版本
    try {
        int* p2 = new int[10000000000];
        delete[] p2;
    } catch (const std::bad_alloc& e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }
    
    // nothrow 版本
    int* p3 = new (std::nothrow) int[10000000000];
    if (p3 == nullptr) {
        std::cerr << "Allocation returned nullptr" << std::endl;
    } else {
        delete[] p3;
    }
    
    // ==================== 使用场景 ====================
    // 1. 实时系统：不能容忍异常带来的开销
    // 2. 需要手动检查分配结果的情况
    // 3. 分配失败后有回退策略的情况
    
    auto allocateWithFallback = [](size_t size) -> int* {
        int* p = new (std::nothrow) int[size];
        if (p == nullptr) {
            std::cerr << "Full allocation failed, trying smaller..." << std::endl;
            p = new (std::nothrow) int[size / 2];
        }
        return p;
    };
    
    int* fallback_p = allocateWithFallback(10000000000);
    if (fallback_p) {
        std::cout << "Fallback allocation succeeded" << std::endl;
        delete[] fallback_p;
    }
    
    return 0;
}
```

> **重要：** `nothrow` 只针对内存分配失败。如果构造函数抛出异常，仍然会传播。nothrow 主要用于需要精细控制或无法使用异常处理的场景。

## Modern C++特性

### C++11新特性

C++11是现代C++的里程碑版本，引入了众多革命性特性，彻底改变了C++的编程范式。

#### 1. auto 关键字 - 自动类型推导

`auto` 让编译器自动推导变量类型，简化代码编写，特别是在处理复杂类型时。

```cpp
#include <vector>
#include <map>
#include <string>

int main() {
    // 基本用法
    auto i = 42;           // int
    auto d = 3.14;         // double
    auto s = "hello";      // const char*
    
    // 复杂类型推导 - 避免冗长的类型书写
    std::vector<std::map<std::string, int>> vec;
    
    // 传统写法：std::vector<std::map<std::string, int>>::iterator it = vec.begin();
    auto it = vec.begin();  // 简洁清晰
    
    // 范围for循环中使用
    for (auto& elem : vec) {
        // elem 自动推导为 std::map<std::string, int>&
    }
    
    return 0;
}
```

> **重要：** `auto` 会**去除**引用和cv限定符（const/volatile）。如需保留，需显式添加 `&` 或 `const`。

> **易错点：** 使用 `auto` 推导初始化列表时，`auto x = {1, 2, 3}` 推导为 `std::initializer_list<int>`，而非 `std::vector<int>`。

#### 2. 范围for循环 (Range-based for loop)

简洁地遍历容器或数组，代码更直观安全。

```cpp
#include <vector>
#include <iostream>
#include <map>

int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    // 值拷贝方式遍历（修改不影响原容器）
    for (auto x : vec) {
        x *= 2;  // 只修改拷贝，原vec不变
    }
    
    // 引用方式遍历（可修改原容器）
    for (auto& x : vec) {
        x *= 2;  // 原vec被修改
    }
    
    // const引用方式（只读，性能更好）
    for (const auto& x : vec) {
        std::cout << x << " ";
    }
    
    // 遍历map
    std::map<std::string, int> scores = {{"Alice", 90}, {"Bob", 85}};
    for (const auto& [name, score] : scores) {  // C++17结构化绑定，C++11需用pair
        std::cout << name << ": " << score << std::endl;
    }
    
    return 0;
}
```

> **重要：** 范围for循环依赖于 `std::begin()` 和 `std::end()`，自定义容器需提供这些接口。

> **易错点：** 不要在范围for循环中修改容器大小（增删元素），会导致迭代器失效。

#### 3. 智能指针 (Smart Pointers)

自动管理内存，避免内存泄漏和悬挂指针问题。

```cpp
#include <memory>
#include <iostream>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource released\n"; }
    void doWork() { std::cout << "Working\n"; }
};

int main() {
    // unique_ptr - 独占所有权，不可复制，可移动
    {
        std::unique_ptr<Resource> res = std::make_unique<Resource>();
        res->doWork();
        // 离开作用域自动释放
    }
    
    // shared_ptr - 共享所有权，引用计数
    {
        std::shared_ptr<Resource> res1 = std::make_shared<Resource>();
        {
            std::shared_ptr<Resource> res2 = res1;  // 引用计数+1
            std::cout << "Count: " << res1.use_count() << std::endl;  // 2
        }  // 引用计数-1，但不释放
        std::cout << "Count: " << res1.use_count() << std::endl;  // 1
    }  // 引用计数为0，释放资源
    
    // weak_ptr - 弱引用，不增加引用计数，用于打破循环引用
    std::weak_ptr<Resource> weak;
    {
        std::shared_ptr<Resource> shared = std::make_shared<Resource>();
        weak = shared;
        std::cout << "Expired: " << weak.expired() << std::endl;  // 0 (false)
        
        if (auto locked = weak.lock()) {  // 使用时需lock转换为shared_ptr
            locked->doWork();
        }
    }
    std::cout << "Expired: " << weak.expired() << std::endl;  // 1 (true)
    
    return 0;
}
```

> **重要：** 优先使用 `std::make_unique` 和 `std::make_shared`，它们更安全（异常安全）且效率更高。

> **易错点：** 不要用裸指针创建多个 `shared_ptr`，会导致多次释放。正确做法：`auto p = std::make_shared<T>()`，然后传递 `p`。

#### 4. Lambda 表达式

匿名函数，简化回调和临时函数对象的编写。

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9};
    
    // 基本语法: [捕获](参数) -> 返回类型 { 函数体 }
    
    // 1. 无捕获lambda
    auto print = [](int x) { std::cout << x << " "; };
    std::for_each(nums.begin(), nums.end(), print);
    
    // 2. 值捕获（捕获时复制）
    int factor = 2;
    auto multiply = [factor](int x) { return x * factor; };
    // factor 的修改不影响lambda内部
    
    // 3. 引用捕获
    int sum = 0;
    std::for_each(nums.begin(), nums.end(), [&sum](int x) { sum += x; });
    
    // 4. 隐式捕获
    auto lambda1 = [=]() { return factor + sum; };  // 全部值捕获
    auto lambda2 = [&]() { return factor + sum; };  // 全部引用捕获
    auto lambda3 = [=, &sum]() { return factor + sum; };  // factor值捕获，sum引用捕获
    
    // 5. mutable lambda（允许修改值捕获的变量）
    int count = 0;
    auto counter = [count]() mutable { return ++count; };
    std::cout << counter() << std::endl;  // 1
    std::cout << counter() << std::endl;  // 2
    std::cout << count << std::endl;      // 0 (原变量不变)
    
    // 实际应用：自定义排序
    std::sort(nums.begin(), nums.end(), 
              [](int a, int b) { return a > b; });  // 降序排序
    
    return 0;
}
```

> **重要：** Lambda默认是 `const` 的，要修改捕获变量需加 `mutable` 关键字，或使用引用捕获。

> **易错点：** 以引用方式捕获局部变量，在lambda超出该变量作用域后使用会导致悬空引用崩溃。

#### 5. 右值引用与移动语义

避免不必要的拷贝，大幅提升性能，特别是在处理大对象时。

```cpp
#include <iostream>
#include <vector>
#include <string>

class BigData {
    int* data;
    size_t size;
public:
    // 构造函数
    BigData(size_t n) : size(n), data(new int[n]) {
        std::cout << "Constructor\n";
    }
    
    // 析构函数
    ~BigData() { 
        delete[] data; 
        std::cout << "Destructor\n";
    }
    
    // 拷贝构造函数（深拷贝）
    BigData(const BigData& other) : size(other.size), data(new int[other.size]) {
        std::copy(other.data, other.data + size, data);
        std::cout << "Copy Constructor\n";
    }
    
    // 拷贝赋值运算符
    BigData& operator=(const BigData& other) {
        std::cout << "Copy Assignment\n";
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = new int[size];
            std::copy(other.data, other.data + size, data);
        }
        return *this;
    }
    
    // 移动构造函数（转移资源所有权）
    BigData(BigData&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;  // 将源对象置空
        other.size = 0;
        std::cout << "Move Constructor\n";
    }
    
    // 移动赋值运算符
    BigData& operator=(BigData&& other) noexcept {
        std::cout << "Move Assignment\n";
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
};

// 工厂函数返回临时对象
BigData createData() {
    BigData d(1000);
    return d;  // NRVO/移动语义优化
}

int main() {
    // 场景1：使用临时对象（右值）
    BigData d1 = createData();  // 触发移动构造（或NRVO优化直接构造）
    
    // 场景2：显式移动
    BigData d2(500);
    BigData d3 = std::move(d2);  // d2资源被转移，现在d2为空
    // d2 现在处于"有效但未指定状态"，不要再使用
    
    // 场景3：emplace_back 避免拷贝
    std::vector<BigData> vec;
    vec.reserve(10);
    vec.emplace_back(100);  // 直接在vector内存中构造，无拷贝/移动
    
    return 0;
}
```

> **重要：** 被 `std::move` 的对象虽然仍有效（可析构、可赋值），但值未指定，不要再依赖其原有值。

> **易错点：** 移动构造函数和移动赋值必须标记 `noexcept`，否则标准库容器在某些操作（如扩容）时不会使用它们，导致性能损失。

#### 6. 初始化列表 (Initializer List)

统一初始化语法，避免窄化转换，支持自定义类型的列表初始化。

```cpp
#include <vector>
#include <map>
#include <string>

class MyClass {
    int x, y, z;
public:
    // 构造函数支持初始化列表
    MyClass(int a, int b, int c) : x(a), y(b), z(c) {}
    
    // std::initializer_list 构造函数
    MyClass(std::initializer_list<int> list) {
        auto it = list.begin();
        x = (it != list.end()) ? *it++ : 0;
        y = (it != list.end()) ? *it++ : 0;
        z = (it != list.end()) ? *it++ : 0;
    }
};

int main() {
    // 统一初始化语法 {}
    int a{5};           // 直接初始化
    int b = {10};       // 拷贝初始化（效果相同）
    
    // 防止窄化转换（编译错误）
    // int c{3.14};     // ERROR: double 到 int 是窄化转换
    int d(3.14);        // OK，但会截断（传统语法的坑）
    
    // 容器初始化
    std::vector<int> vec{1, 2, 3, 4, 5};
    std::map<std::string, int> map{{"Alice", 90}, {"Bob", 85}};
    
    // 自定义类型
    MyClass obj1{1, 2, 3};     // 调用 initializer_list 构造
    MyClass obj2 = {4, 5, 6};  // 同上
    
    // 数组风格初始化
    int arr[]{1, 2, 3, 4, 5};
    
    // auto 与初始化列表
    auto list = {1, 2, 3};  // std::initializer_list<int>
    
    return 0;
}
```

> **重要：** 统一初始化 `{}` 会进行窄化转换检查，是更安全的初始化方式，应优先使用。

> **易错点：** 当类同时有普通构造函数和 `std::initializer_list` 构造函数时，`{}` 初始化优先匹配 `initializer_list` 版本，可能导致意外行为。

#### 7. nullptr - 空指针常量

类型安全的空指针，替代有歧义的 `NULL` 和 `0`。

```cpp
#include <iostream>

void foo(int x) {
    std::cout << "foo(int): " << x << std::endl;
}

void foo(int* p) {
    std::cout << "foo(int*): " << p << std::endl;
}

void foo(double* p) {
    std::cout << "foo(double*): " << p << std::endl;
}

int main() {
    // NULL 通常被定义为 0 或 (void*)0，类型不明确
    foo(NULL);      // 调用 foo(int)，可能不是预期行为！
    foo(0);         // 调用 foo(int)
    
    // nullptr 类型为 std::nullptr_t，可隐式转换为任意指针类型
    foo(nullptr);   // 编译错误！存在歧义：int* 和 double*
    foo(static_cast<int*>(nullptr));  // 明确调用 foo(int*)
    
    // 检查空指针的正确方式
    int* p = nullptr;
    if (p == nullptr) {  // 清晰明确
        std::cout << "p is null\n";
    }
    
    return 0;
}
```

> **重要：** 始终使用 `nullptr` 代替 `NULL` 或 `0`，它是类型安全的，能避免重载解析的歧义。

#### 8. 类型别名 - using

比 `typedef` 更直观、功能更强的类型别名机制。

```cpp
#include <vector>
#include <map>
#include <functional>

// 函数指针类型：传统typedef vs using
typedef void (*FuncPtr_old)(int, int);
using FuncPtr = void (*)(int, int);  // 更清晰，与变量声明一致

// 模板别名 - typedef 无法实现
template<typename T>
using Vec = std::vector<T>;  // 模板类型别名

template<typename K, typename V>
using Map = std::map<K, V>;

// 复杂类型的简化
template<typename T>
using Callback = std::function<void(T)>;

int main() {
    Vec<int> v;           // 等价于 std::vector<int>
    Map<std::string, int> m;
    
    // 与模板结合使用
    Callback<int> onComplete = [](int result) {
        // 处理结果
    };
    
    return 0;
}
```

> **重要：** 模板别名只能用 `using`，这是C++11替代 `typedef` 的关键优势。

### C++14新特性

C++14在C++11基础上进行了小幅但实用的改进，主要是对泛型和lambda的增强。

#### 1. 泛型 Lambda

Lambda参数可以使用 `auto`，实现类似模板的功能。

```cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    // C++11: 只能指定具体类型
    // auto lambda = [](int x) { return x * 2; };
    
    // C++14: 泛型lambda，参数使用auto
    auto multiply = [](auto a, auto b) { 
        return a * b; 
    };
    
    // 可用于多种类型
    std::cout << multiply(3, 4) << std::endl;        // int: 12
    std::cout << multiply(2.5, 4.0) << std::endl;    // double: 10
    std::cout << multiply(std::string("Hi"), 3) << std::endl;  // string: HiHiHi
    
    // 泛型lambda在STL中的应用
    std::vector<int> nums = {1, 2, 3, 4, 5};
    std::vector<std::string> strs = {"a", "b", "c"};
    
    auto print = [](const auto& elem) {
        std::cout << elem << " ";
    };
    
    for (const auto& n : nums) print(n);
    for (const auto& s : strs) print(s);
    
    return 0;
}
```

> **重要：** 泛型lambda实际上生成了一个带有模板 `operator()` 的匿名仿函数类。

#### 2. Lambda 捕获表达式

允许在捕获列表中初始化变量。

```cpp
#include <iostream>
#include <memory>

int main() {
    int x = 10;
    
    // C++11: 只能捕获现有变量
    // auto f = [x]() { return x * 2; };
    
    // C++14: 捕获时初始化新变量
    auto f = [y = x + 5]() {  // y是新变量，值为15
        return y;
    };
    std::cout << f() << std::endl;  // 15
    
    // 移动捕获 - 特别有用！
    auto ptr = std::make_unique<int>(42);
    
    // C++11无法直接移动捕获unique_ptr，C++14可以：
    auto task = [p = std::move(ptr)]() {
        std::cout << *p << std::endl;
    };
    // ptr 现在为空（被移动到lambda中）
    
    task();  // 输出 42
    
    // 通用捕获模式
    auto multiplier = [factor = 2](auto x) {
        return x * factor;
    };
    
    return 0;
}
```

> **重要：** 捕获表达式 `[var = expr]` 创建的是lambda的新数据成员，而非外部变量的引用。

> **易错点：** 捕获表达式在lambda定义时求值，而非调用时。不要在捕获表达式中使用可能变化的值。

#### 3. 自动返回类型推导

函数返回类型可由编译器自动推导。

```cpp
#include <vector>

// C++11: 需要尾置返回类型
template<typename T, typename U>
auto add_old(T t, U u) -> decltype(t + u) {
    return t + u;
}

// C++14: 自动推导返回类型
template<typename T, typename U>
auto add(T t, U u) {  // 返回类型自动推导为 decltype(t + u)
    return t + u;
}

// 可用于普通函数（不仅模板）
auto createVector() {
    return std::vector<int>{1, 2, 3};  // 返回类型推导为 std::vector<int>
}

// 递归函数需要显式声明（C++14无法推导递归）
auto factorial(int n) -> int {  // 递归必须显式声明返回类型
    return n <= 1 ? 1 : n * factorial(n - 1);
}

int main() {
    auto result = add(1, 2.5);  // double
    auto vec = createVector();
    return 0;
}
```

> **重要：** 如果函数有多个返回语句，它们必须推导出**相同**的类型，否则编译错误。

> **易错点：** 返回类型推导依赖于所有返回表达式的类型一致性。混合返回 `int` 和 `double` 会导致推导失败。

#### 4. 变量模板

可以定义变量模板。

```cpp
#include <iostream>
#include <type_traits>

// 常量变量模板
template<typename T>
constexpr T pi = T(3.1415926535897932385);

// 类型特征变量模板
template<typename T>
constexpr bool is_pointer_v = std::is_pointer<T>::value;

// 使用
int main() {
    // 获取不同类型的pi值
    std::cout << pi<int> << std::endl;       // 3
    std::cout << pi<double> << std::endl;    // 3.14159...
    std::cout << pi<float> << std::endl;     // 3.14159f
    
    // 类型检查
    static_assert(is_pointer_v<int*> == true);
    static_assert(is_pointer_v<int> == false);
    
    return 0;
}
```

> **重要：** C++14引入变量模板的概念，C++17中标准库大量添加了 `_v` 后缀的变量模板（如 `is_integral_v`）。

#### 5. std::make_unique

补充了与 `make_shared` 对应的工厂函数。

```cpp
#include <memory>

class Widget {
    int id;
public:
    Widget(int i) : id(i) {}
    int getId() const { return id; }
};

int main() {
    // C++11: 没有 make_unique，需要直接构造
    // std::unique_ptr<Widget> w(new Widget(42));  // 不够安全
    
    // C++14: 使用 make_unique
    auto w1 = std::make_unique<Widget>(42);  // 更安全，异常安全
    
    // 数组版本
    auto arr = std::make_unique<int[]>(10);  // 10个int的数组
    arr[0] = 100;
    
    // 对比：make_shared vs make_unique
    auto shared = std::make_shared<Widget>(100);
    auto unique = std::make_unique<Widget>(200);
    
    return 0;
}
```

> **重要：** `std::make_unique` 提供了异常安全性。如果构造函数抛异常，不会泄漏已分配的内存。

#### 6. 放宽的 constexpr 函数限制

C++14允许 constexpr 函数包含更多语句。

```cpp
#include <array>

// C++11 constexpr: 只能有单个return语句
// C++14 constexpr: 允许局部变量、循环、if语句等

constexpr int factorial(int n) {
    int result = 1;  // C++11不允许：局部变量
    for (int i = 1; i <= n; ++i) {  // C++11不允许：循环
        result *= i;
    }
    return result;
}

constexpr int fibonacci(int n) {
    if (n <= 1) return n;  // C++11不允许：多个return
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 实际应用：编译期计算数组
int main() {
    constexpr int fact5 = factorial(5);  // 120，编译期计算
    
    std::array<int, factorial(5)> arr;   // 编译期确定数组大小
    
    return 0;
}
```

> **重要：** C++14的 constexpr 函数几乎与普通函数一样灵活，但所有操作必须是编译期可确定的。

### C++17新特性

C++17是渐进式改进，引入了许多让代码更简洁、更安全的特性。

#### 1. 结构化绑定 (Structured Bindings)

一键解构tuple、pair和struct，告别繁琐的 `std::get`。

```cpp
#include <tuple>
#include <map>
#include <string>
#include <utility>

struct Point {
    double x, y, z;
};

int main() {
    // 解构pair
    std::pair<int, std::string> p = {42, "answer"};
    auto [num, str] = p;  // num=42, str="answer"
    
    // 解构tuple
    std::tuple<int, double, char> t = {1, 3.14, 'a'};
    auto [i, d, c] = t;
    
    // 解构struct（公开非静态数据成员）
    Point pt{1.0, 2.0, 3.0};
    auto [x, y, z] = pt;
    
    // 遍历map的神器
    std::map<std::string, int> scores{{"Alice", 90}, {"Bob", 85}};
    for (const auto& [name, score] : scores) {
        // 不再需要：const auto& pair，然后 pair.first, pair.second
        std::cout << name << ": " << score << std::endl;
    }
    
    // 修改绑定值（使用引用）
    auto& [ref_x, ref_y, ref_z] = pt;
    ref_x = 10.0;  // pt.x 也被修改
    
    // 忽略某些值（C++17不能直接忽略，C++20可以）
    auto [first, second, third] = t;  // 必须全部绑定
    
    return 0;
}
```

> **重要：** 结构化绑定创建了**别名**，而非副本。使用 `auto&` 或 `const auto&` 可以避免拷贝大对象。

> **易错点：** 绑定数组时，`auto [a, b, c]` 是拷贝，如需修改原数组，使用 `auto& [a, b, c]`。

#### 2. if/switch 语句初始化

在条件语句中直接初始化变量，缩小作用域。

```cpp
#include <map>
#include <string>
#include <iostream>
#include <mutex>

int main() {
    std::map<std::string, int> data{{"key", 42}};
    
    // C++17前：需要在if外声明变量
    // auto it = data.find("key");
    // if (it != data.end()) { ... }
    
    // C++17: if 带初始化
    if (auto it = data.find("key"); it != data.end()) {
        // it 只在if语句内有效
        std::cout << "Found: " << it->second << std::endl;
    }  // it 在这里销毁
    // it 在这里不可见（编译错误）
    
    // switch 带初始化
    switch (int x = rand() % 10; x) {
        case 0: std::cout << "Zero"; break;
        default: std::cout << "Non-zero: " << x; break;
    }
    
    // 配合锁使用 - 自动管理锁的生命周期
    std::mutex mtx;
    if (std::lock_guard<std::mutex> lock(mtx); true) {
        // 临界区代码，lock在此自动释放
    }
    
    return 0;
}
```

> **重要：** 初始化语句中声明的变量只在整个if/switch语句块中有效，有助于限制变量作用域。

#### 3. 类模板参数推导 (CTAD)

构造模板类时自动推导模板参数。

```cpp
#include <vector>
#include <map>
#include <tuple>
#include <string>
#include <memory>

// C++17前：必须显式指定模板参数
// std::pair<int, std::string> p(1, "one");

// C++17: 编译器自动推导
int main() {
    // pair和tuple
    std::pair p(1, "one");           // 推导为 pair<int, const char*>
    std::tuple t(1, 2.5, "hello");   // 推导为 tuple<int, double, const char*>
    
    // 容器
    std::vector vec{1, 2, 3};        // vector<int>
    std::map m{{"a", 1}, {"b", 2}};  // map<const char*, int>
    
    // 智能指针（配合make函数）
    auto ptr = std::make_unique<int>(42);
    
    // 自定义推导指引（Deduction Guides）
    // 可指导编译器如何推导复杂场景
    
    return 0;
}
```

> **重要：** CTAD减少了模板参数的冗余书写，但要注意类型推导可能与你预期不同（如 `const char*` 而非 `std::string`）。

#### 4. constexpr if - 编译期条件

在模板中根据类型进行编译期分支，替代SFINAE。

```cpp
#include <type_traits>
#include <iostream>
#include <vector>
#include <string>

// C++17前：使用模板特化或SFINAE
// C++17: constexpr if

template<typename T>
void print(const T& value) {
    if constexpr (std::is_integral_v<T>) {
        // 只有T是整数类型时，这部分才会编译
        std::cout << "Integer: " << value << std::endl;
    } else if constexpr (std::is_same_v<T, std::string>) {
        std::cout << "String: " << value << std::endl;
    } else {
        std::cout << "Other: " << value << std::endl;
    }
}

// 实际应用：统一的序列化接口
template<typename T>
std::string serialize(const T& value) {
    if constexpr (std::is_arithmetic_v<T>) {
        return std::to_string(value);
    } else if constexpr (std::is_same_v<T, std::string>) {
        return "\"" + value + "\"";
    } else {
        // 容器类型
        std::string result = "[";
        bool first = true;
        for (const auto& elem : value) {
            if (!first) result += ", ";
            result += serialize(elem);
            first = false;
        }
        result += "]";
        return result;
    }
}

int main() {
    print(42);           // Integer
    print(3.14);         // Other
    print(std::string("hello"));  // String
    
    std::vector<int> vec{1, 2, 3};
    std::cout << serialize(vec) << std::endl;  // [1, 2, 3]
    
    return 0;
}
```

> **重要：** `if constexpr` 是编译期分支，不满足条件的分支**完全不编译**，可用于处理模板中不存在的成员或方法。

> **易错点：** `if constexpr` 只在模板上下文中有效，普通函数中它只是普通if，不会导致分支被丢弃。

#### 5. std::string_view

零拷贝的字符串视图，替代const string&作为函数参数。

```cpp
#include <string>
#include <string_view>
#include <iostream>

// 旧方式：接收const string&，C风格字符串会隐式构造
void process_string_old(const std::string& s) {
    std::cout << s << std::endl;
}

// 新方式：使用string_view，无拷贝，支持所有字符串类型
void process_string(std::string_view sv) {
    // 提供与string类似的接口
    std::cout << "Length: " << sv.size() << ", Content: " << sv << std::endl;
    
    // 子串操作（零拷贝，仅移动指针和长度）
    auto sub = sv.substr(0, 5);  // O(1)，不分配新内存
    
    // 注意：string_view 不拥有内存！
}

int main() {
    std::string str = "Hello, World!";
    const char* cstr = "C-style string";
    
    // 都可以无缝传递，无内存分配
    process_string(str);      // string
    process_string(cstr);     // const char*
    process_string("literal"); // 字符串字面量
    
    // 从子串创建，无拷贝
    std::string_view view(str.c_str() + 7, 5);
    std::cout << view << std::endl;  // World
    
    return 0;
}
```

> **重要：** `string_view` 是**非 owning** 视图，确保被引用的字符串在 view 生命周期内有效。不要返回局部变量的 `string_view`。

> **易错点：** `string_view` 不是以null结尾的！使用C API需要显式构造 `std::string`。

#### 6. std::optional

表示可能不存在的值，替代返回特殊值或抛出异常。

```cpp
#include <optional>
#include <iostream>
#include <string>

// 可能失败的查找操作
std::optional<int> find_user_age(const std::string& name) {
    if (name == "Alice") return 30;
    if (name == "Bob") return 25;
    return std::nullopt;  // 表示无值
}

// 带默认值的场景
std::optional<std::string> get_config(const std::string& key) {
    // 模拟配置读取
    if (key == "host") return "localhost";
    return std::nullopt;
}

int main() {
    // 检查是否有值
    auto age = find_user_age("Alice");
    if (age.has_value()) {
        std::cout << "Age: " << age.value() << std::endl;
    }
    
    // 更简洁的写法
    if (age) {
        std::cout << "Age: " << *age << std::endl;  // 解引用
    }
    
    // 安全取值（带默认值）
    auto unknown_age = find_user_age("Unknown");
    std::cout << unknown_age.value_or(-1) << std::endl;  // -1
    
    // 原地构造
    std::optional<std::string> opt;
    opt.emplace("constructed in place");  // 避免拷贝
    
    // 重置为空
    opt.reset();
    
    return 0;
}
```

> **重要：** `std::optional` 比返回特殊值（如-1、nullptr）更清晰、更安全，语义明确。

> **易错点：** 直接解引用空的 `optional` 是未定义行为！务必先检查或使用 `value_or`。

#### 7. 折叠表达式 (Fold Expressions)

简化可变参数模板的编写。

```cpp
#include <iostream>

// C++11/14: 需要递归展开
// C++17: 一元右折叠

template<typename... Args>
auto sum(Args... args) {
    return (args + ...);  // 一元右折叠: (a + (b + (c + ...)))
}

template<typename... Args>
void print_all(Args... args) {
    (std::cout << ... << args) << std::endl;  // 折叠输出
}

template<typename... Args>
bool all_true(Args... args) {
    return (args && ...);  // 逻辑与折叠
}

template<typename T, typename... Args>
void push_all(std::vector<T>& vec, Args... args) {
    (vec.push_back(args), ...);  // 逗号运算符折叠
}

int main() {
    std::cout << sum(1, 2, 3, 4, 5) << std::endl;  // 15
    print_all("Hello", " ", "World", "!");  // Hello World!
    
    std::cout << std::boolalpha;
    std::cout << all_true(true, true, true) << std::endl;   // true
    std::cout << all_true(true, false, true) << std::endl;  // false
    
    return 0;
}
```

> **重要：** 折叠表达式支持多种运算符：`+`, `-`, `*`, `/`, `%`, `^`, `&`, `|`, `<<`, `>>`, `&&`, `||`, `,`。

#### 8. 内联变量 (Inline Variables)

允许在头文件中定义变量，解决跨翻译单元的变量定义问题。

```cpp
// config.h - 头文件
#pragma once
#include <string>

// C++17前：头文件中定义变量会导致多重定义错误
// 需要用 extern 声明，在单个 cpp 文件中定义

// C++17: 内联变量可在头文件中定义
inline constexpr int MAX_BUFFER_SIZE = 4096;
inline const std::string APP_NAME = "MyApp";

// 模板类的静态成员也可内联
template<typename T>
class Singleton {
    inline static T* instance = nullptr;  // C++17前需在类外定义
public:
    static T& getInstance() {
        if (!instance) instance = new T();
        return *instance;
    }
};
```

> **重要：** `inline` 变量在所有翻译单元中共享同一地址，解决了头文件定义全局变量的难题。

### C++20新特性

C++20是C++11之后最大的版本，引入概念、协程、模块等革命性特性。

#### 1. 概念 (Concepts)

对模板参数进行约束，让编译错误更易读，代码更清晰。

```cpp
#include <concepts>
#include <vector>
#include <iostream>

// 定义概念：可相加的类型
template<typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::convertible_to<T>;  // 要求支持+运算且结果可转为T
};

// 定义概念：数值类型
template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

// 定义概念：可迭代
template<typename T>
concept Iterable = requires(T t) {
    { t.begin() } -> std::input_or_output_iterator;
    { t.end() } -> std::input_or_output_iterator;
};

// 使用概念约束模板
// 语法1：requires子句
template<typename T>
    requires Addable<T>
T add(T a, T b) {
    return a + b;
}

// 语法2：简写形式（推荐）
auto multiply(Numeric auto a, Numeric auto b) {
    return a * b;
}

// 语法3：模板参数直接约束
template<Iterable Container>
void print_all(const Container& c) {
    for (const auto& elem : c) {
        std::cout << elem << " ";
    }
    std::cout << std::endl;
}

// 组合概念
template<typename T>
concept AddableNumeric = Numeric<T> && Addable<T>;

// 使用标准库概念
#include <ranges>
template<std::ranges::range R>
auto sum_range(R&& r) {
    return std::ranges::fold_left(r, 0, std::plus{});
}

int main() {
    std::cout << add(1, 2) << std::endl;        // OK
    std::cout << add(1.5, 2.5) << std::endl;    // OK
    // add("hello", "world");  // 编译错误：不满足Addable概念
    
    std::vector<int> vec{1, 2, 3, 4, 5};
    print_all(vec);  // OK
    
    return 0;
}
```

> **重要：** Concepts让模板错误从几百行晦涩的SFINAE错误变成清晰的"不满足XXX概念"。

#### 2. 范围库 (Ranges)

惰性求值的管道操作，让数据处理代码更优雅。

```cpp
#include <ranges>
#include <vector>
#include <iostream>
#include <algorithm>

int main() {
    std::vector<int> nums{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // 传统方式：多个独立算法调用
    std::vector<int> temp;
    std::copy_if(nums.begin(), nums.end(), std::back_inserter(temp),
                 [](int n) { return n % 2 == 0; });
    std::vector<int> result;
    std::transform(temp.begin(), temp.end(), std::back_inserter(result),
                   [](int n) { return n * n; });
    
    // C++20 Ranges: 管道操作，惰性求值
    auto view = nums 
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; });
    
    // 遍历时才真正计算
    for (int n : view) {
        std::cout << n << " ";  // 4 16 36 64 100
    }
    std::cout << std::endl;
    
    // 更多视图操作
    auto view2 = nums
        | std::views::drop(3)     // 跳过前3个
        | std::views::take(4)     // 取4个
        | std::views::reverse;    // 反转
    
    // 生成无限序列
    auto even_numbers = std::views::iota(0)  // 0, 1, 2, 3, ...
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::take(10);  // 取前10个偶数
    
    // 转换为容器
    std::vector<int> collected(view.begin(), view.end());
    
    // 范围算法（不再需要传递begin/end迭代器）
    std::ranges::sort(nums, std::greater{});  // 降序排序
    
    return 0;
}
```

> **重要：** Ranges视图是**惰性**的，只有在遍历时才会执行计算。可以组合无限序列而不会内存溢出。

#### 3. 协程 (Coroutines)

支持挂起和恢复执行的函数，用于异步编程和生成器。

```cpp
#include <coroutine>
#include <iostream>
#include <optional>

// 简单的生成器实现
template<typename T>
struct Generator {
    struct promise_type {
        T current_value;
        
        auto get_return_object() {
            return Generator{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        auto initial_suspend() { return std::suspend_always{}; }
        auto final_suspend() noexcept { return std::suspend_always{}; }
        void unhandled_exception() { std::terminate(); }
        void return_void() {}
        
        auto yield_value(T value) {
            current_value = value;
            return std::suspend_always{};
        }
    };
    
    using Handle = std::coroutine_handle<promise_type>;
    Handle handle;
    
    explicit Generator(Handle h) : handle(h) {}
    ~Generator() { if (handle) handle.destroy(); }
    
    // 禁止拷贝，允许移动
    Generator(const Generator&) = delete;
    Generator& operator=(const Generator&) = delete;
    Generator(Generator&& other) : handle(other.handle) { other.handle = nullptr; }
    
    class Iterator {
        Handle handle;
    public:
        explicit Iterator(Handle h) : handle(h) {}
        
        Iterator& operator++() {
            handle.resume();
            return *this;
        }
        
        bool operator!=(const Iterator& other) const {
            return handle != other.handle;
        }
        
        T operator*() const {
            return handle.promise().current_value;
        }
    };
    
    Iterator begin() {
        handle.resume();
        return Iterator(handle);
    }
    
    Iterator end() {
        return Iterator(nullptr);
    }
};

// 使用协程定义斐波那契数列生成器
Generator<int> fibonacci(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; ++i) {
        co_yield a;  // 挂起并返回值
        int next = a + b;
        a = b;
        b = next;
    }
}

// 无限序列生成器
Generator<int> counter(int start = 0) {
    while (true) {
        co_yield start++;
    }
}

int main() {
    std::cout << "Fibonacci (10 terms): ";
    for (auto n : fibonacci(10)) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    
    std::cout << "Counter: ";
    auto c = counter(100);
    auto it = c.begin();
    for (int i = 0; i < 5; ++i, ++it) {
        std::cout << *it << " ";  // 100 101 102 103 104
    }
    std::cout << std::endl;
    
    return 0;
}
```

> **重要：** 协程的 `co_await`, `co_yield`, `co_return` 三个关键字会改变普通函数为协程。协程状态存储在堆上。

> **易错点：** 协程需要自定义 promise_type 来定义行为，标准库尚未提供通用的 `std::generator`，需要自己实现或使用第三方库。

#### 4. 模块 (Modules)

替代头文件，加快编译速度，解决宏污染问题。

```cpp
// ===== math_module.ixx (模块接口文件) =====
export module math;  // 声明模块名

import <string>;     // 导入标准库模块（C++23）

// 导出声明
export int add(int a, int b);

// 导出类
export class Calculator {
public:
    int multiply(int a, int b);
    static std::string version();
};

// 导出模板
export template<typename T>
T square(T value) {
    return value * value;
}

// ===== math_module.cpp (模块实现文件) =====
module math;  // 实现模块

int add(int a, int b) {
    return a + b;
}

int Calculator::multiply(int a, int b) {
    return a * b;
}

std::string Calculator::version() {
    return "Math Module v1.0";
}

// ===== main.cpp (使用模块) =====
import math;  // 导入模块（无重复定义问题）
// 对比：#include "math.h" 会复制文本，可能导致重复定义

int main() {
    int sum = add(3, 4);
    Calculator calc;
    int product = calc.multiply(5, 6);
    auto sq = square(5.5);  // 模板实例化
    
    return 0;
}
```

> **重要：** 模块**不是**文本替换（不像 `#include`），而是编译后的二进制接口，编译速度可提升10倍以上。

> **易错点：** 模块和头文件可以共存，但不能混用宏来条件导出。模块不支持宏导出（这是设计上的优点）。

#### 5. 三路比较运算符 (<=>)

自动生成所有比较运算符，简化类定义。

```cpp
#include <compare>
#include <iostream>
#include <string>

class Version {
    int major, minor, patch;
public:
    Version(int m, int n, int p) : major(m), minor(n), patch(p) {}
    
    // 定义 <=> 自动生成 ==, !=, <, <=, >, >=
    auto operator<=>(const Version&) const = default;
    
    // C++20前需要写6个比较运算符！
    // bool operator==(const Version& other) const { ... }
    // bool operator!=(const Version& other) const { ... }
    // bool operator<(const Version& other) const { ... }
    // ... 等等
};

// 自定义比较逻辑
class Person {
    std::string name;
    int age;
public:
    Person(std::string n, int a) : name(std::move(n)), age(a) {}
    
    // 自定义 <=>：先比年龄，再比名字
    std::strong_ordering operator<=>(const Person& other) const {
        if (auto cmp = age <=> other.age; cmp != 0) return cmp;
        return name <=> other.name;
    }
    
    // == 可能需要单独定义（如果成员比较逻辑不同）
    bool operator==(const Person& other) const = default;
};

int main() {
    Version v1(1, 0, 0), v2(1, 1, 0);
    
    if (v1 < v2) std::cout << "v1 < v2" << std::endl;
    if (v1 <= v2) std::cout << "v1 <= v2" << std::endl;
    if (v1 != v2) std::cout << "v1 != v2" << std::endl;
    
    // <=> 返回三种结果类型：strong_ordering, weak_ordering, partial_ordering
    auto result = 5 <=> 10;  // strong_ordering::less
    
    return 0;
}
```

> **重要：** `= default` 生成的 `<=>` 按成员字典序比较。如有自定义需求，需手动实现。

#### 6. 指定初始化 (Designated Initialization)

像C语言一样按名称初始化结构体成员。

```cpp
#include <iostream>
#include <string>

struct Point {
    double x;
    double y;
    double z = 0.0;  // 默认成员初始化器
};

struct Config {
    std::string host = "localhost";
    int port = 8080;
    bool ssl = false;
};

int main() {
    // C++20: 指定初始化
    Point p1{.x = 1.0, .y = 2.0};        // z 使用默认值 0.0
    Point p2{.x = 3.0, .y = 4.0, .z = 5.0};
    
    // 乱序初始化（C++20允许）
    Point p3{.y = 10.0, .x = 5.0};  // 但顺序初始化更推荐
    
    // 实际应用：配置结构
    Config prod{.host = "api.example.com", .port = 443, .ssl = true};
    Config local{.port = 3000};  // 其他用默认值
    
    // 与初始化列表结合
    Point points[] = {
        {.x = 0, .y = 0},
        {.x = 1, .y = 1},
        {.x = 2, .y = 4, .z = 8}
    };
    
    return 0;
}
```

> **重要：** 指定初始化必须按成员声明顺序进行（C++20不允许乱序），且不能跳过成员。

#### 7. consteval 和 constinit

更强的编译期保证。

```cpp
#include <iostream>

// consteval: 强制编译期求值，运行时调用是编译错误
consteval int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; ++i) {
        result *= i;
    }
    return result;
}

// constexpr: 编译期或运行期都可以
constexpr int maybe_compile_time(int n) {
    return n * 2;
}

// constinit: 强制静态/线程局部变量编译期初始化
constinit int global_value = factorial(5);  // 120，编译期确定
// constinit int bad = maybe_compile_time(rand());  // 错误：rand()不是编译期常量

int main() {
    constexpr int f5 = factorial(5);   // OK，编译期
    // int f = factorial(6);            // 错误：运行时调用consteval函数
    
    int runtime = 10;
    int m = maybe_compile_time(runtime);  // OK，运行期求值
    constexpr int c = maybe_compile_time(10);  // OK，编译期求值
    
    // constinit 变量可以在运行期修改
    global_value = 100;  // OK
    
    return 0;
}
```

> **重要：** `consteval` = 必须是编译期；`constexpr` = 可以是编译期；`constinit` = 必须编译期初始化但可运行期修改。

#### 8. 日历和时区库

现代日期时间处理，告别C风格time.h。

```cpp
#include <chrono>
#include <iostream>
#include <format>

int main() {
    namespace chrono = std::chrono;
    
    // 系统时间点
    auto now = chrono::system_clock::now();
    
    // 日期字面量（C++20）
    using namespace chrono;
    auto birthday = 1990y/January/15d;  // 1990年1月15日
    
    // 时间间隔
    auto duration = 2h + 30min + 45s;
    std::cout << "Duration: " << duration << std::endl;
    
    // 日期运算
    auto tomorrow = chrono::floor<days>(now) + days(1);
    auto next_week = chrono::floor<days>(now) + weeks(1);
    
    // 格式化输出（C++20）
    // std::cout << std::format("{:%Y-%m-%d %H:%M:%S}", now) << std::endl;
    
    // 时区处理（C++20）
    // auto tz = chrono::locate_zone("Asia/Shanghai");
    // auto local_time = chrono::zoned_time(tz, now);
    
    // 常见操作
    auto today = chrono::floor<days>(now);
    chrono::year_month_day ymd(today);
    std::cout << "Year: " << (int)ymd.year() << std::endl;
    
    return 0;
}
```

> **重要：** C++20的 `<chrono>` 提供了类型安全的时间计算，不同的时间单位不能隐式混用（如秒和毫秒）。

---

> **学习建议：**
> - **C++11** 是必学的现代C++基础，所有新特性都应该掌握
> - **C++14/17** 提供了便利的语法糖，逐步学习即可
> - **C++20** 的 Concepts 和 Ranges 改变了编程范式，值得深入学习
> - **编译器支持：** GCC 10+、Clang 10+、MSVC 2019+ 对 C++20 支持较好
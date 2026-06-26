---
title: "C++ Notes (Part 1): 编译工具与构建系统"
description: "C++ 编译工具链学习笔记：GCC/Clang/MSVC 常用选项、编译链接原理、静态/动态库以及 CMake 构建系统。"
date: "2026-02-26"
draft: false
tags: ["notes", "C++"]
column: "学习笔记"
series: "C++ Notes"
---

> 这是 **C++ Notes** 系列的第一期，本系列将 C++ 学习笔记按主题拆分为多期，便于阅读和检索。

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


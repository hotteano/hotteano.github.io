---
title: "C++ Notes (Part 2): 基础语法"
description: "C++ 基础语法学习笔记：变量与数据类型、控制语句、函数和参数传递、指针与引用、头文件、命名空间、预处理与宏定义。"
date: "2026-02-27"
draft: false
tags: ["notes", "C++"]
column: "学习笔记"
series: "C++ Notes"
---

> 这是 **C++ Notes** 系列的第二期，上一期见系列导航。
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


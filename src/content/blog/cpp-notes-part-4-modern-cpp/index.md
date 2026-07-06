---
title: "C++ Notes (Part 4): Modern C++ 特性"
description: "Modern C++ 学习笔记：C++11 / C++14 / C++17 / C++20 新特性概览。"
date: "2026-03-01"
draft: false
tags: ["notes", "C++"]
column: "学习笔记"
series: "C++ Notes"
track: "cs-fundamentals"
trackStage: "programming"
trackOrder: 4
---

> 这是 **C++ Notes** 系列的第四期，也是最后一期。
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

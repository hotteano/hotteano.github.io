---
title: "C++ Notes (Part 3): 面向对象编程"
description: "C++ 面向对象编程学习笔记：结构体、类与对象、构造与析构、继承与多态、运算符重载、模板元编程、STL 与异常处理。"
date: "2026-02-28"
draft: false
tags: ["notes", "C++"]
column: "学习笔记"
series: "C++ Notes"
---

> 这是 **C++ Notes** 系列的第三期。
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


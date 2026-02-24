---
title: "第五节补充内容"
description: "线性递推关系"
date: "2026-02-24"
draft: false
tags: ["notes", "combinatorics"]
---


## 5.1 线性递推关系（补充内容）

### 5.1.1 齐次线性递推

**定义**：$k$ 阶齐次线性递推关系形如：

$$a_n = c_1 a_{n-1} + c_2 a_{n-2} + \cdots + c_k a_{n-k}$$

其中 $c_1, c_2, \ldots, c_k$ 为常数，且 $c_k \neq 0$。

---

**特征方程法**：

为了求解上述递推关系，我们假设解的形式为 $a_n = r^n$，代入递推式得到：

$$r^n = c_1 r^{n-1} + c_2 r^{n-2} + \cdots + c_k r^{n-k}$$

两边除以 $r^{n-k}$，得到**特征方程**：

$$r^k = c_1 r^{k-1} + c_2 r^{k-2} + \cdots + c_k$$

即：

$$r^k - c_1 r^{k-1} - c_2 r^{k-2} - \cdots - c_k = 0$$

---

**不同根的情况**：

若特征方程有 $k$ 个互不相同的根 $r_1, r_2, \ldots, r_k$，则通解为：

$$a_n = A_1 r_1^n + A_2 r_2^n + \cdots + A_k r_k^n$$

其中 $A_1, A_2, \ldots, A_k$ 为由初始条件确定的常数。

---

**重根的情况**：

若特征方程有重根，设 $r$ 是 $m$ 重根，则对应的解包含以下 $m$ 项：

$$(B_0 + B_1 n + B_2 n^2 + \cdots + B_{m-1} n^{m-1}) \cdot r^n$$

其中 $B_0, B_1, \ldots, B_{m-1}$ 为待定常数。

---

**例子：Fibonacci数列**

Fibonacci数列定义为：

$$F_n = F_{n-1} + F_{n-2}, \quad F_0 = 0, \quad F_1 = 1$$

特征方程为：

$$r^2 = r + 1 \quad \Rightarrow \quad r^2 - r - 1 = 0$$

解得：

$$r_{1,2} = \frac{1 \pm \sqrt{5}}{2}$$

设 $\phi = \frac{1 + \sqrt{5}}{2}$（黄金比例），$\psi = \frac{1 - \sqrt{5}}{2}$。

通解为：

$$F_n = A \cdot \phi^n + B \cdot \psi^n$$

利用初始条件 $F_0 = 0, F_1 = 1$：

$$
\begin{cases}
A + B = 0 \\
A\phi + B\psi = 1
\end{cases}
$$

解得：

$$A = \frac{1}{\sqrt{5}}, \quad B = -\frac{1}{\sqrt{5}}$$

因此Fibonacci数列的**Binet公式**为：

$$F_n = \frac{1}{\sqrt{5}}\left[\left(\frac{1+\sqrt{5}}{2}\right)^n - \left(\frac{1-\sqrt{5}}{2}\right)^n\right]$$

---

### 5.1.2 非齐次线性递推

**定义**：$k$ 阶非齐次线性递推关系形如：

$$a_n = c_1 a_{n-1} + c_2 a_{n-2} + \cdots + c_k a_{n-k} + f(n)$$

其中 $f(n) \not\equiv 0$ 称为非齐次项。

---

**解法**：

非齐次线性递推的通解由两部分组成：

$$a_n = a_n^{(h)} + a_n^{(p)}$$

其中：
- $a_n^{(h)}$ 是对应齐次方程的通解（由特征方程法求得）
- $a_n^{(p)}$ 是非齐次方程的**特解**

---

**求特解的方法**：

**1. 常数变易法（待定系数法）**

根据 $f(n)$ 的形式猜测特解的形式，常见的对应关系：

| $f(n)$ 的形式 | 特解 $a_n^{(p)}$ 的猜测形式 |
|:---|:---|
| 常数 $C$ | 常数 $A$ |
| 多项式 $P_m(n)$ | 同次多项式 $Q_m(n)$ |
| $C \cdot r^n$（$r$ 不是特征根）| $A \cdot r^n$ |
| $C \cdot r^n$（$r$ 是 $m$ 重特征根）| $A \cdot n^m \cdot r^n$ |
| $\cos(\omega n)$ 或 $\sin(\omega n)$ | $A\cos(\omega n) + B\sin(\omega n)$ |

**2. 叠加原理**

若 $f(n) = f_1(n) + f_2(n)$，且 $a_n^{(p_1)}$ 是对应 $f_1(n)$ 的特解，$a_n^{(p_2)}$ 是对应 $f_2(n)$ 的特解，则：

$$a_n^{(p)} = a_n^{(p_1)} + a_n^{(p_2)}$$

---

**例子：带常数项的递推**

求解：$a_n = 3a_{n-1} - 2a_{n-2} + 4$，其中 $a_0 = 1, a_1 = 3$

**步骤1**：求齐次通解

特征方程：$r^2 - 3r + 2 = 0 \Rightarrow (r-1)(r-2) = 0$

根为 $r_1 = 1, r_2 = 2$

齐次通解：$a_n^{(h)} = C_1 \cdot 1^n + C_2 \cdot 2^n = C_1 + C_2 \cdot 2^n$

**步骤2**：求特解

由于 $f(n) = 4$ 是常数，且 $r = 1$ 是特征根（单根），设特解：

$$a_n^{(p)} = A \cdot n$$

代入原递推式：

$$An = 3A(n-1) - 2A(n-2) + 4$$

$$An = 3An - 3A - 2An + 4A + 4$$

$$An = An + A + 4$$

比较系数：$0 = A + 4 \Rightarrow A = -4$

所以特解为 $a_n^{(p)} = -4n$

**步骤3**：求通解并确定常数

$$a_n = C_1 + C_2 \cdot 2^n - 4n$$

利用初始条件：

- $a_0 = 1$：$C_1 + C_2 = 1$
- $a_1 = 3$：$C_1 + 2C_2 - 4 = 3 \Rightarrow C_1 + 2C_2 = 7$

解得：$C_2 = 6, C_1 = -5$

**最终解**：

$$a_n = -5 + 6 \cdot 2^n - 4n = 6 \cdot 2^n - 4n - 5$$

---

### 5.1.3 生成函数解递推

生成函数是求解递推关系的强大工具，特别适用于复杂的递推关系。

---

**基本步骤**：

**步骤1**：设生成函数

设数列 $\{a_n\}$ 的普通生成函数为：

$$G(x) = \sum_{n=0}^{\infty} a_n x^n$$

**步骤2**：利用递推关系建立方程

将递推关系两边乘以 $x^n$ 并求和，通过代数变形得到关于 $G(x)$ 的方程。

**步骤3**：求解生成函数

解出 $G(x)$ 的封闭形式。

**步骤4**：展开生成函数

将 $G(x)$ 展开为幂级数，$x^n$ 的系数即为 $a_n$。

---

**例子：用生成函数解Fibonacci数列**

递推关系：$F_n = F_{n-1} + F_{n-2}$，$F_0 = 0, F_1 = 1$

设生成函数：

$$G(x) = \sum_{n=0}^{\infty} F_n x^n = F_0 + F_1 x + F_2 x^2 + \cdots$$

利用递推关系（对 $n \geq 2$）：

$$\sum_{n=2}^{\infty} F_n x^n = \sum_{n=2}^{\infty} F_{n-1} x^n + \sum_{n=2}^{\infty} F_{n-2} x^n$$

左边：$G(x) - F_0 - F_1 x = G(x) - x$

右边第一项：$x \sum_{n=2}^{\infty} F_{n-1} x^{n-1} = x \sum_{m=1}^{\infty} F_m x^m = x(G(x) - F_0) = xG(x)$

右边第二项：$x^2 \sum_{n=2}^{\infty} F_{n-2} x^{n-2} = x^2 G(x)$

因此：

$$G(x) - x = xG(x) + x^2 G(x)$$

$$G(x) = \frac{x}{1 - x - x^2}$$

对分母因式分解：$1 - x - x^2 = (1 - \phi x)(1 - \psi x)$，其中 $\phi = \frac{1+\sqrt{5}}{2}, \psi = \frac{1-\sqrt{5}}{2}$

部分分式分解：

$$\frac{x}{1 - x - x^2} = \frac{A}{1 - \phi x} + \frac{B}{1 - \psi x}$$

解得：$A = \frac{1}{\sqrt{5}}, B = -\frac{1}{\sqrt{5}}$

因此：

$$G(x) = \frac{1}{\sqrt{5}} \cdot \frac{1}{1 - \phi x} - \frac{1}{\sqrt{5}} \cdot \frac{1}{1 - \psi x}$$

利用 $\frac{1}{1 - rx} = \sum_{n=0}^{\infty} r^n x^n$，得到：

$$G(x) = \sum_{n=0}^{\infty} \frac{1}{\sqrt{5}}(\phi^n - \psi^n) x^n$$

对比系数，得到Binet公式：

$$F_n = \frac{1}{\sqrt{5}}\left[\left(\frac{1+\sqrt{5}}{2}\right)^n - \left(\frac{1-\sqrt{5}}{2}\right)^n\right]$$

---

**非齐次递推的生成函数法**

对于非齐次递推 $a_n = c_1 a_{n-1} + \cdots + c_k a_{n-k} + f(n)$，方法类似：

1. 设 $G(x) = \sum a_n x^n$，$F(x) = \sum f(n) x^n$
2. 建立方程并求解 $G(x)$
3. $G(x)$ 通常形如：$G(x) = \frac{P(x) + F(x)}{Q(x)}$，其中 $Q(x)$ 由特征多项式决定

---

**总结**：

| 方法 | 适用场景 | 优点 |
|:---|:---|:---|
| 特征方程法 | 常系数线性递推 | 直接、系统 |
| 生成函数法 | 各种递推（含非齐次、变系数）| 通用性强，可处理复杂情况 |
| 待定系数法 | 特定形式的非齐次项 | 计算简单 |

生成函数法的优势在于它能统一处理齐次和非齐次递推，且易于处理复杂的初始条件和递推形式。

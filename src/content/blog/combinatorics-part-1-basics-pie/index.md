---
title: "组合学笔记 (Part 1): 基础计数与偏序集"
description: "组合学学习笔记（上）：集合与加乘原理、排列组合与恒等式、偏序集、链与反链、容斥原理与莫比乌斯反演。"
date: "2026-02-24"
draft: false
tags: ["notes", "combinatorics"]
column: "学习笔记"
series: "组合学笔记"
track: "cs-fundamentals"
trackStage: "algorithms"
trackOrder: 12
---

> 这是 **组合学笔记** 系列的第一期。

## 1. 集合与加乘原理

### 1.1 集合的基本概念

**定义 1.1**（集合） 集合是由确定的不同对象组成的整体，这些对象称为集合的元素。

一般用大写字母 $A, B, C, \ldots$ 表示集合，用小写字母 $a, b, c, \ldots$ 表示元素。

- 若 $a$ 是集合 $A$ 的元素，记作 $a \in A$（读作"$a$ 属于 $A$"）
- 若 $a$ 不是集合 $A$ 的元素，记作 $a \notin A$（读作"$a$ 不属于 $A$"）

**定义 1.2**（集合的表示法） 集合主要有两种表示方法：

1. **列举法**：将集合的所有元素一一列举出来，用花括号括起来。
   $$A = \{1, 2, 3, 4, 5\}$$

2. **描述法**：用集合中元素所满足的性质来描述集合。
   $$A = \{x \mid x \text{ 是正整数}, x \leq 5\}$$

**定义 1.3**（空集） 不含任何元素的集合称为空集，记作 $\varnothing$ 或 $\emptyset$。

**定义 1.4**（全集） 在特定问题中，包含所讨论的所有元素的集合称为全集，通常记作 $U$ 或 $\Omega$。

### 1.2 集合间的关系

**定义 1.5**（子集） 设 $A, B$ 是两个集合，若对于任意 $x \in A$ 都有 $x \in B$，则称 $A$ 是 $B$ 的子集，记作 $A \subseteq B$ 或 $B \supseteq A$。

**定义 1.6**（真子集） 若 $A \subseteq B$ 且 $A \neq B$，则称 $A$ 是 $B$ 的真子集，记作 $A \subsetneq B$。

**定义 1.7**（集合相等） 若 $A \subseteq B$ 且 $B \subseteq A$，则称集合 $A$ 与 $B$ 相等，记作 $A = B$。

**定理 1.1**（子集的基本性质） 设 $A, B, C$ 是任意集合，则：
1. 自反性：$A \subseteq A$
2. 反对称性：若 $A \subseteq B$ 且 $B \subseteq A$，则 $A = B$
3. 传递性：若 $A \subseteq B$ 且 $B \subseteq C$，则 $A \subseteq C$
4. 空集是任何集合的子集：$\varnothing \subseteq A$

### 1.3 集合的运算

**定义 1.8**（并集） 集合 $A$ 与 $B$ 的并集定义为：
$$A \cup B = \{x \mid x \in A \text{ 或 } x \in B\}$$

**定义 1.9**（交集） 集合 $A$ 与 $B$ 的交集定义为：
$$A \cap B = \{x \mid x \in A \text{ 且 } x \in B\}$$

若 $A \cap B = \varnothing$，则称 $A$ 与 $B$ 不相交。

**定义 1.10**（差集） 集合 $A$ 与 $B$ 的差集定义为：
$$A \setminus B = \{x \mid x \in A \text{ 且 } x \notin B\}$$

**定义 1.11**（补集） 设 $U$ 为全集，$A \subseteq U$，则 $A$ 的补集定义为：
$$\overline{A} = U \setminus A = \{x \mid x \in U \text{ 且 } x \notin A\}$$

**定理 1.2**（德摩根律） 设 $A, B$ 是全集 $U$ 的子集，则：
1. $\overline{A \cup B} = \overline{A} \cap \overline{B}$
2. $\overline{A \cap B} = \overline{A} \cup \overline{B}$

### 1.4 幂集

**定义 1.12**（幂集） 集合 $A$ 的所有子集组成的集合称为 $A$ 的幂集，记作 $\mathcal{P}(A)$ 或 $2^A$，即：
$$\mathcal{P}(A) = \{X \mid X \subseteq A\}$$

**定理 1.3**（幂集的基数） 若 $|A| = n$（即 $A$ 含有 $n$ 个元素），则：
$$|\mathcal{P}(A)| = 2^n$$

### 1.5 加法原理

**定理 1.4**（加法原理，分类计数原理） 设完成一件事有 $k$ 类不同的方法，第 $i$ 类方法有 $n_i$ 种具体的方式（$i = 1, 2, \ldots, k$），且任何两类方法之间没有公共的方式（即各类方法互斥），则完成这件事共有：
$$N = n_1 + n_2 + \cdots + n_k = \sum_{i=1}^{k} n_i$$
种不同的方法。

### 1.6 乘法原理

**定理 1.5**（乘法原理，分步计数原理） 设完成一件事需要 $k$ 个步骤，第 $i$ 步有 $n_i$ 种不同的方法（$i = 1, 2, \ldots, k$），且各步的选择相互独立，则完成这件事共有：
$$N = n_1 \times n_2 \times \cdots \times n_k = \prod_{i=1}^{k} n_i$$
种不同的方法。

---

## 2. 组合数排列数与恒等式

### 2.1 排列数

**定义**（排列） 从 $n$ 个不同元素中取出 $k$ 个元素（$0 \leq k \leq n$），按照一定顺序排成一列，称为从 $n$ 个元素中取 $k$ 个元素的一个**排列**。所有不同排列的个数称为**排列数**，记作 $P(n,k)$ 或 $A_n^k$。

**公式**：
$$P(n,k) = \frac{n!}{(n-k)!} = n(n-1)(n-2)\cdots(n-k+1)$$

**特例**：当 $k = n$ 时，$P(n,n) = n!$，即 $n$ 个元素的全排列数为 $n!$。

### 2.2 组合数

**定义**（组合） 从 $n$ 个不同元素中取出 $k$ 个元素（$0 \leq k \leq n$），不考虑顺序，称为从 $n$ 个元素中取 $k$ 个元素的一个**组合**。所有不同组合的个数称为**组合数**，记作 $\binom{n}{k}$ 或 $C_n^k$。

**公式**：
$$\binom{n}{k} = \frac{n!}{k!(n-k)!} = \frac{n(n-1)\cdots(n-k+1)}{k!}$$

**约定**：当 $k < 0$ 或 $k > n$ 时，规定 $\binom{n}{k} = 0$。

**性质 1：边界值**
$$\binom{n}{0} = \binom{n}{n} = 1, \quad \binom{n}{1} = \binom{n}{n-1} = n$$

**性质 2：对称性**
$$\binom{n}{k} = \binom{n}{n-k}$$

### 2.3 帕斯卡恒等式

**定理**（Pascal's Identity）：对于整数 $n \geq 1$ 和 $0 \leq k \leq n$，有：
$$\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$$

**组合证明**：考虑集合 $S = \{1, 2, \ldots, n\}$，将所有 $k$ 元子集按是否包含元素 $n$ 分成两类：
- 包含元素 $n$ 的 $k$ 元子集：需要从其余 $n-1$ 个元素中选 $k-1$ 个，个数为 $\binom{n-1}{k-1}$
- 不包含元素 $n$ 的 $k$ 元子集：需要从其余 $n-1$ 个元素中选 $k$ 个，个数为 $\binom{n-1}{k}$

由加法原理即得结论。

### 2.4 范德蒙德恒等式

**定理**（Vandermonde's Identity）：对于非负整数 $m, n, r$（其中 $r \leq \min\{m,n\}$），有：
$$\binom{m+n}{r} = \sum_{k=0}^{r} \binom{m}{k}\binom{n}{r-k}$$

**组合证明**：考虑两个不相交的集合 $A$ 和 $B$，其中 $|A| = m$，$|B| = n$。
- **左边**：$\binom{m+n}{r}$ 表示从 $A \cup B$ 中选取 $r$ 个元素的方法数。
- **右边**：按从 $A$ 中选取的元素个数 $k$ 分类，方法数为 $\binom{m}{k}\binom{n}{r-k}$

**推论 1**（Chu-Vandermonde）：令 $m = n = r$，得：
$$\sum_{k=0}^{n} \binom{n}{k}^2 = \binom{2n}{n}$$

### 2.5 二项式定理

**定理**：对于任意实数 $x, y$ 和正整数 $n$，有：
$$(x+y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k$$

**推论 1**：令 $x = y = 1$，得：
$$\sum_{k=0}^{n} \binom{n}{k} = 2^n$$

**推论 2**：令 $x = 1, y = -1$，得：
$$\sum_{k=0}^{n} (-1)^k \binom{n}{k} = 0 \quad (n \geq 1)$$

### 2.6 曲棍球棒恒等式（Hockey-Stick Identity）

**定理**：对于 $0 \leq r \leq n$：
$$\sum_{k=r}^{n} \binom{k}{r} = \binom{n+1}{r+1}$$

### 2.7 插板法（Stars and Bars）

**问题**：将 $n$ 个相同的小球放入 $m$ 个不同的盒子，允许空盒，有多少种方法？

**定理**：方法数为：
$$\binom{n+m-1}{m-1} = \binom{n+m-1}{n}$$

**不允许空盒的情形**：方法数为 $\binom{n-1}{m-1}$（要求 $n \geq m$）

### 2.8 算两次原理（Double Counting）

**原理**：对同一组对象用两种不同方式计数，所得结果相等。

**例题**（证明 $k\binom{n}{k} = n\binom{n-1}{k-1}$）：

算两次对象：从 $n$ 人中选 $k$ 人委员会并指定其中一人为主席的方案。
- 先选委员会再选主席：$k\binom{n}{k}$
- 先选主席再选委员会：$n\binom{n-1}{k-1}$

故 $k\binom{n}{k} = n\binom{n-1}{k-1}$。

### 2.9 双射计数（Bijective Proof）

**原理**：若存在集合 $A$ 到集合 $B$ 的双射（一一对应），则 $|A| = |B|$。

**例题**（组合数对称性）：定义 $f: A \to B$ 为 $f(S) = \{1,\ldots,n\} \setminus S$（取补集），这是双射，故 $\binom{n}{k} = \binom{n}{n-k}$。

---

## 3. 偏序集、容斥原理与莫比乌斯变换

### 3.1 偏序集基础

**定义**（偏序关系）：设 $P$ 是一个集合，$R$ 是 $P$ 上的二元关系。若 $R$ 满足：
1. **自反性**：$\forall x \in P, x \leq x$
2. **反对称性**：$\forall x, y \in P$，若 $x \leq y$ 且 $y \leq x$，则 $x = y$
3. **传递性**：$\forall x, y, z \in P$，若 $x \leq y$ 且 $y \leq z$，则 $x \leq z$

则称 $R$ 为 $P$ 上的**偏序关系**，$(P, \leq)$ 称为**偏序集**（poset）。

**例 1**（幂集上的包含关系）：设 $S$ 是 $n$ 元集，$P = 2^S$ 是 $S$ 的幂集。定义 $A \leq B$ 当且仅当 $A \subseteq B$，则 $(2^S, \subseteq)$ 是偏序集，称为**布尔格** $B_n$。

**例 2**（整除关系）：设 $P = \mathbb{Z}^+$，定义 $a \leq b$ 当且仅当 $a \mid b$，则 $(\mathbb{Z}^+, \mid)$ 是偏序集。

### 3.2 链与反链

**定义**（链）：偏序集 $(P, \leq)$ 的子集 $C \subseteq P$ 称为**链**，若 $C$ 中任意两个元素都可比较。

**定义**（反链）：子集 $A \subseteq P$ 称为**反链**，若 $A$ 中任意两个不同元素都不可比较。

### 3.3 Sperner 定理

**定理**（Sperner, 1928）：设 $S$ 是 $n$ 元集，$B_n = 2^S$ 是布尔格。则 $B_n$ 中最大反链的大小为 $\binom{n}{\lfloor n/2 \rfloor}$。

**证明**（LYM不等式）：设 $\mathcal{F} \subseteq B_n$ 是反链，则：
$$\sum_{A \in \mathcal{F}} \frac{1}{\binom{n}{|A|}} \leq 1$$

由于对所有 $k$，$\binom{n}{k} \leq \binom{n}{\lfloor n/2 \rfloor}$，故：
$$|\mathcal{F}| \leq \binom{n}{\lfloor n/2 \rfloor}$$

### 3.4 容斥原理（PIE）

**定理**（容斥原理）：设 $A_1, A_2, \ldots, A_n$ 是有限全集 $U$ 的子集，则

$$\left| \bigcup_{i=1}^n A_i \right| = \sum_{k=1}^n (-1)^{k+1} \sum_{1 \leq i_1 < i_2 < \cdots < i_k \leq n} |A_{i_1} \cap A_{i_2} \cap \cdots \cap A_{i_k}|$$

等价地，补集的交：
$$\left| \bigcap_{i=1}^n A_i^c \right| = |U| - \sum_{i} |A_i| + \sum_{i<j} |A_i \cap A_j| - \sum_{i<j<k} |A_i \cap A_j \cap A_k| + \cdots + (-1)^n |A_1 \cap \cdots \cap A_n|$$

**应用 1：错排问题**

**错排数** $D_n$（无不动点的排列数）：
$$D_n = n! \sum_{k=0}^n \frac{(-1)^k}{k!} = \left\lfloor \frac{n!}{e} + \frac{1}{2} \right\rfloor$$

**应用 2：欧拉函数**

若 $n = p_1^{a_1} \cdots p_r^{a_r}$，则：
$$\varphi(n) = n \prod_{i=1}^r \left(1 - \frac{1}{p_i}\right)$$

### 3.5 莫比乌斯反演

**定义**（莫比乌斯函数）：偏序集上的莫比乌斯函数 $\mu$ 定义为：
- $\mu(x, x) = 1$
- 对 $x < y$：$\mu(x, y) = -\sum_{x \leq z < y} \mu(x, z)$

**定理**（莫比乌斯反演）：设 $(P, \leq)$ 是局部有限偏序集，$f, g: P \to \mathbb{R}$。若 $g(y) = \sum_{x \leq y} f(x)$，则：
$$f(y) = \sum_{x \leq y} \mu(x, y) g(x)$$

**例 1**（布尔格）：$\mu(A, B) = (-1)^{|B| - |A|}$

**例 2**（整除格）：若 $d \mid m$，则 $\mu(d, m) = \mu(m/d)$（经典数论莫比乌斯函数）

**经典莫比乌斯反演**：设 $f, g: \mathbb{Z}^+ \to \mathbb{R}$。
- 若 $g(n) = \sum_{d|n} f(d)$，则 $f(n) = \sum_{d|n} \mu(d) g(n/d)$

---


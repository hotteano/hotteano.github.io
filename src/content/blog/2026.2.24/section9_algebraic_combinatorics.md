# 9. 组合代数

组合代数是组合数学中运用代数工具（特别是线性代数、多项式理论和群论）解决组合问题的重要分支。本章将探讨一系列经典的代数组合问题，从奇镇偶镇问题到设计理论，展示代数方法的强大威力。

---

## 9.1 奇镇与偶镇问题

### 9.1.1 奇镇问题描述

**问题设定**：假设有一个小镇，镇上有 $n$ 个居民。每个居民组织一个俱乐部，俱乐部成员是这 $n$ 个居民的子集。规定：任意两个不同俱乐部的交集都包含奇数个成员。问：最多可以有多少个俱乐部？

**定理 9.1（奇镇上界定理）**：在满足上述条件的奇镇中，俱乐部数量不超过 $n$。

### 9.1.2 线性代数证明

**证明**：将每个俱乐部 $A_i$ 表示为 $\mathbb{F}_2^n$ 中的特征向量 $\mathbf{v}_i$，其中第 $j$ 个分量为 1 当且仅当第 $j$ 个居民在俱乐部 $A_i$ 中。

任意两个俱乐部的交集大小为：
$$|A_i \cap A_j| = \mathbf{v}_i \cdot \mathbf{v}_j = \sum_{k=1}^{n} v_{i,k} v_{j,k}$$

条件表明：对于 $i \neq j$，$\mathbf{v}_i \cdot \mathbf{v}_j \equiv 1 \pmod{2}$。

**关键引理**：这些向量在 $\mathbb{F}_2$ 上线性无关。

假设存在线性关系 $\sum_{i=1}^{m} c_i \mathbf{v}_i = \mathbf{0}$，其中 $c_i \in \mathbb{F}_2$。

与 $\mathbf{v}_j$ 作内积：
$$\left(\sum_{i=1}^{m} c_i \mathbf{v}_i\right) \cdot \mathbf{v}_j = c_j (\mathbf{v}_j \cdot \mathbf{v}_j) + \sum_{i \neq j} c_i (\mathbf{v}_i \cdot \mathbf{v}_j) = 0$$

由于 $\mathbf{v}_j \cdot \mathbf{v}_j = |A_j| \equiv 0$ 或 $1 \pmod{2}$，且 $\mathbf{v}_i \cdot \mathbf{v}_j \equiv 1$ 对于 $i \neq j$。

若假设所有 $|A_j|$ 为偶数，则：
$$0 + \sum_{i \neq j} c_i = 0 \implies \sum_{i \neq j} c_i = 0$$

这给出方程组，可证所有 $c_i = 0$。

因此 $\{\mathbf{v}_1, \ldots, \mathbf{v}_m\}$ 线性无关，故 $m \leq n$。 $\square$

**构造达到上界**：取标准基向量 $\mathbf{e}_1, \ldots, \mathbf{e}_n$ 及其全1向量 $\mathbf{1}$，适当调整可得 $n$ 个俱乐部。

### 9.1.3 偶镇问题描述与解

**问题设定**：偶镇中规定任意两个不同俱乐部的交集都包含**偶数**个成员。问：最多可以有多少个俱乐部？

**定理 9.2（偶镇上界定理）**：偶镇中俱乐部数量的最大值为 $2^{\lfloor n/2 \rfloor}$。

**证明概要**：

构造性下界：将 $n$ 个居民分成 $\lfloor n/2 \rfloor$ 对（若 $n$ 为奇数则剩一个）。每对可以要么都在俱乐部中，要么都不在。这给出 $2^{\lfloor n/2 \rfloor}$ 个俱乐部，任意两个交为偶数。

上界证明：利用线性代数，考虑这些特征向量张成的空间。由于两两内积为0，这些向量在适当定义的二次型下是"自正交"的，故维度不超过 $\lfloor n/2 \rfloor$。 $\square$

### 9.1.4 与线性空间的关系

奇镇偶镇问题揭示了组合结构与线性空间之间的深刻联系：

1. **奇镇对应**：$\mathbb{F}_2^n$ 中的向量组，非对角内积为1
2. **偶镇对应**：完全迷向子空间（totally isotropic subspace）

**定义 9.1（迷向向量）**：对于对称双线性形式 $B$，若 $B(v, v) = 0$，则称 $v$ 为迷向向量。

**定理 9.3（Witt定理）**：在特征不为2的域上，极大迷向子空间的维数相同。

### 9.1.5 推广到模 $p$ 情形

**模 $p$ 奇镇问题**：设 $p$ 为素数，要求任意两个俱乐部的交集大小 $\not\equiv 0 \pmod{p}$。

**定理 9.4（Alon-Babai-Suzuki）**：在 $\mathbb{F}_p$ 上，若要求任意两个集合的交 $\not\equiv 0 \pmod{p}$，则集合族大小不超过 $(p-1)n$。

**Frankl-Wilson定理**：设 $\mathcal{F}$ 是 $[n]$ 的子集族，若对所有 $A, B \in \mathcal{F}$，$|A \cap B| \in L$ 其中 $|L| = s$，则：
$$|\mathcal{F}| \leq \sum_{i=0}^{s} \binom{n}{i}$$

---

## 9.2 多项式空间方法

多项式空间方法是组合数学中强有力的技术，通过构造适当的多项式并分析其性质来得到组合上界。

### 9.2.1 Larman-Rogers-Seidel定理

**定理 9.5（Larman-Rogers-Seidel, 1977）**：设 $S \subset \mathbb{R}^n$ 是有限点集，满足：
- 任意两点距离为 $a$ 或 $b$（$a \neq b$）

则 $|S| \leq \frac{(n+1)(n+4)}{2}$。

**证明思路**：

对每个点 $\mathbf{x} \in S$，定义多项式：
$$f_{\mathbf{x}}(\mathbf{y}) = (\|\mathbf{y} - \mathbf{x}\|^2 - a^2)(\|\mathbf{y} - \mathbf{x}\|^2 - b^2)$$

这些多项式满足：
- $f_{\mathbf{x}}(\mathbf{x}) = a^2 b^2 \neq 0$
- $f_{\mathbf{x}}(\mathbf{y}) = 0$ 对于 $\mathbf{y} \neq \mathbf{x}$

证明 $\{f_{\mathbf{x}}\}$ 线性无关，且它们都属于由 $\{1, y_i, y_i^2, y_i y_j\}$ 张成的空间，维数为 $\frac{(n+1)(n+4)}{2}$。 $\square$

### 9.2.2 复线性化技术

复线性化是将非线性约束转化为多项式恒等式的技术。

**基本思想**：给定约束条件 $P(\mathbf{x}) = 0$，构造多项式空间并分析线性关系。

**定理 9.6**：设 $\mathcal{F} \subset 2^{[n]}$，若对所有 $A \neq B \in \mathcal{F}$，$|A \cap B| \in L$ 其中 $|L| = s$，则 $|\mathcal{F}| \leq \sum_{i=0}^{s} \binom{n}{i}$。

**证明**：对每个 $A \in \mathcal{F}$，定义：
$$f_A(\mathbf{x}) = \prod_{\ell \in L} (\sum_{i \in A} x_i - \ell)$$

在特征向量 $\mathbf{1}_B$ 处取值，利用交集条件证明线性无关性。

### 9.2.3 Deza-Frankl-Singhi定理

**定理 9.7（Deza-Frankl-Singhi）**：设 $\mathcal{F}$ 是 $[n]$ 的 $k$-子集族，若任意两个集合的交大小属于集合 $L = \{\ell_1, \ldots, \ell_s\}$，则：
$$|\mathcal{F}| \leq \binom{n}{s}$$

**证明要点**：

1. 构造多元多项式空间
2. 对每个 $A \in \mathcal{F}$，定义多项式：
   $$f_A(\mathbf{x}) = \prod_{i=1}^{s}\left(\sum_{j \in A} x_j - \ell_i\right)$$

3. 在点 $\mathbf{1}_B$（$B \in \mathcal{F}$）处验证：
   - $f_A(\mathbf{1}_A) \neq 0$
   - $f_A(\mathbf{1}_B) = 0$ 对于 $A \neq B$

4. 证明这些多项式线性无关且属于维数为 $\binom{n}{s}$ 的空间。 $\square$

---

## 9.3 相交的集合族

### 9.3.1 Fisher不等式

**定理 9.8（Fisher不等式）**：设 $\mathcal{F} = \{A_1, \ldots, A_m\}$ 是 $[n]$ 的子集族，满足：
- 每个 $|A_i| = k$
- 任意两个不同集合的交 $|A_i \cap A_j| = \lambda$（常数）

若 $0 < \lambda < k$，则 $m \leq n$。

**线性代数证明**：

设 $M$ 为 $m \times n$ 的关联矩阵，$M_{ij} = 1$ 当且仅当 $j \in A_i$。

考虑 $MM^T$，这是一个 $m \times m$ 矩阵：
- 对角线：$(MM^T)_{ii} = k$
- 非对角线：$(MM^T)_{ij} = \lambda$（$i \neq j$）

即：
$$MM^T = (k - \lambda)I_m + \lambda J_m$$

其中 $J_m$ 是全1矩阵。其特征值为：
- $k - \lambda + m\lambda = k + (m-1)\lambda$（重数1）
- $k - \lambda$（重数 $m-1$）

由于 $\lambda < k$，所有特征值正，故 $\text{rank}(MM^T) = m$。

但 $\text{rank}(MM^T) \leq \text{rank}(M) \leq n$，因此 $m \leq n$。 $\square$

### 9.3.2 de Bruijn-Erdős定理

**定理 9.9（de Bruijn-Erdős, 1948）**：设 $P$ 是平面上 $n$ 个不共线点，$L$ 是过至少两点的直线族，则 $|L| \geq n$。

**等价形式（对偶）**：设 $\mathcal{F}$ 是 $[n]$ 的非空真子集族，满足任意两点恰在一个集合中同时出现，则 $|\mathcal{F}| \geq n$。

**证明**：利用关联矩阵和Fisher不等式的对偶形式。

### 9.3.3 Ray-Chaudhuri-Wilson定理

**定理 9.10（Ray-Chaudhuri-Wilson, 1975）**：设 $\mathcal{F}$ 是 $[n]$ 的 $k$-一致子集族，若任意两个集合的交大小属于集合 $L$ 且 $|L| = s$，则：
$$|\mathcal{F}| \leq \binom{n}{s}$$

**证明**（多项式空间方法）：

对每个 $A \in \mathcal{F}$，定义多项式 $f_A \in \mathbb{R}[x_1, \ldots, x_n]$：
$$f_A(\mathbf{x}) = \prod_{\ell \in L} (\sum_{i \in A} x_i - \ell)$$

在 $\mathbf{v}_B = \mathbf{1}_B$（$B \in \mathcal{F}$）处取值：
- $f_A(\mathbf{v}_A) = \prod_{\ell \in L} (k - \ell) \neq 0$
- $f_A(\mathbf{v}_B) = 0$ 对于 $A \neq B$（因 $|A \cap B| \in L$）

故 $\{f_A : A \in \mathcal{F}\}$ 线性无关。

每个 $f_A$ 可约化为次数 $\leq s$ 的多项式，因 $\sum_{i \in A} x_i$ 是线性的。

次数 $\leq s$ 的多项式空间的维数为 $\sum_{i=0}^{s} \binom{n}{i} \leq \binom{n}{s}$（当 $s \leq n/2$）。 $\square$

### 9.3.4 线性分水岭定理

**定理 9.11（线性分水岭，Alon）**：设 $\mathcal{F} \subset 2^{[n]}$，若对所有 $A \in \mathcal{F}$，$|A| \equiv a \pmod{p}$，对所有 $A \neq B \in \mathcal{F}$，$|A \cap B| \equiv b \pmod{p}$，且 $a \not\equiv b \pmod{p}$，则：
$$|\mathcal{F}| \leq n$$

**证明**：在 $\mathbb{F}_p$ 上考虑关联矩阵 $M$。则：
$$MM^T = (a-b)I + bJ$$

由于 $a \not\equiv b$，矩阵可逆，故 $|\mathcal{F}| = \text{rank}(MM^T) \leq n$。 $\square$

### 9.3.5 Sperner定理变种

**Sperner定理回顾**：$[n]$ 的反链最大大小为 $\binom{n}{\lfloor n/2 \rfloor}$。

**LYM不等式（Lubell-Yamamoto-Meshalkin）**：

对反链 $\mathcal{F} \subset 2^{[n]}$：
$$\sum_{A \in \mathcal{F}} \frac{1}{\binom{n}{|A|}} \leq 1$$

**证明**：随机选取 $[n]$ 的一个全序，对 $A \in \mathcal{F}$，设 $E_A$ 为 $A$ 中元素在此序中连续出现的事件。则：
$$P(E_A) = \frac{|A|!(n-|A|)!}{n!} = \frac{1}{\binom{n}{|A|}}$$

由于 $\mathcal{F}$ 是反链，$E_A$ 互斥，故：
$$\sum_{A \in \mathcal{F}} P(E_A) \leq 1$$ $\square$

**Sperner定理证明**：由LYM不等式：
$$\sum_{A \in \mathcal{F}} \frac{1}{\binom{n}{|A|}} \leq 1 \implies \frac{|\mathcal{F}|}{\binom{n}{\lfloor n/2 \rfloor}} \leq 1$$

**Erdős-Ko-Rado定理**

**定理 9.12（Erdős-Ko-Rado, 1961）**：设 $n \geq 2k$，$\mathcal{F}$ 是 $[n]$ 的 $k$-子集族，且两两相交，则：
$$|\mathcal{F}| \leq \binom{n-1}{k-1}$$

等号成立当且仅当 $\mathcal{F}$ 是星形族（所有集合含固定元素）。

**证明**（Katona的循环证法）：

考虑 $[n]$ 的循环排列 $(1, 2, \ldots, n)$。每个 $k$-区间（连续 $k$ 个元素）在此排列中形成相交族。

关键观察：在循环排列中，相交的 $k$-区间至多 $k$ 个（由鸽巢原理）。

共有 $(n-1)!$ 个循环排列，每个 $k$-集在 $(n-k)!k!$ 个排列中是区间。

计数得：
$$|\mathcal{F}| \cdot (n-k)!k! \cdot k \leq (n-1)! \cdot k$$

即 $|\mathcal{F}| \leq \frac{(n-1)!}{(n-k)!k!} = \binom{n-1}{k-1}$。 $\square$

### 9.3.6 向日葵定理

**定义 9.2（向日葵）**：集合族 $\{S_1, \ldots, S_m\}$ 称为向日葵，如果存在核 $K$ 使得对所有 $i \neq j$，$S_i \cap S_j = K$。

**定理 9.13（Erdős-Rado向日葵引理）**：设 $\mathcal{F}$ 是 $[n]$ 的 $k$-一致集合族，若：
$$|\mathcal{F}| > k!(m-1)^k$$

则 $\mathcal{F}$ 包含 $m$ 个集合的向日葵。

**证明**（归纳法）：

对 $k$ 归纳。$k=1$ 显然。

对 $k > 1$，取极大不交子族 $\{A_1, \ldots, A_t\}$。

若 $t \geq m$，已得向日葵（核为空）。

若 $t < m$，则 $A = \bigcup_{i=1}^{t} A_i$ 与所有集合相交，$|A| < mk$。

由鸽巢原理，存在 $x \in A$ 属于至少 $\frac{|\mathcal{F}|}{mk} > (k-1)!(m-1)^{k-1}$ 个集合。

对这些集合去掉 $x$，用归纳假设。 $\square$

---

## 9.4 关联结构

### 9.4.1 关联结构基本定义

**定义 9.3（关联结构）**：关联结构是三元组 $(P, B, I)$，其中：
- $P$ 是点集
- $B$ 是区组（block）集
- $I \subseteq P \times B$ 是关联关系

**关联矩阵**：$|P| \times |B|$ 矩阵 $M$，$M_{pb} = 1$ 当且仅当 $(p, b) \in I$。

### 9.4.2 t-设计与BIBD

**定义 9.4（$t$-$(v, k, \lambda)$设计）**：设 $P$ 是 $v$ 元集，$B$ 是 $k$-子集族，若任意 $t$ 元子集恰含于 $\lambda$ 个区组中，则称 $(P, B)$ 为 $t$-$(v, k, \lambda)$设计。

**基本参数关系**：
$$\lambda \binom{v}{t} = b \binom{k}{t}$$

其中 $b = |B|$。特别地，$t=2$ 时为BIBD（平衡不完全区组设计）。

**定义 9.5（BIBD）**：$2$-$(v, k, \lambda)$设计称为BIBD，满足：
- 每点出现在 $r$ 个区组中：$r(k-1) = \lambda(v-1)$
- 区组数：$bk = vr$

### 9.4.3 Fisher不等式在区组设计中的应用

**定理 9.14**：在BIBD中，若 $k < v$，则 $b \geq v$。

**证明**：即Fisher不等式。利用 $MM^T = (r-\lambda)I + \lambda J$，证明其可逆。 $\square$

**对称BIBD**：$b = v$（从而 $r = k$）。

**定理 9.15**：在对称BIBD中，任意两个区组恰交于 $\lambda$ 个点。

### 9.4.4 法诺平面

**法诺平面（Fano Plane）**：唯一的 $2$-$(7, 3, 1)$设计。

- 点集：$\{1, 2, 3, 4, 5, 6, 7\}$
- 区组（直线）：$\{123, 145, 167, 246, 257, 347, 356\}$

**几何表示**：

```
      1
     / \
    2---3
   / \ / \
  4---5---6
   \  |  /
    \ | /
      7
```

**性质**：
- 7点7线，每线3点，每点在3线上
- 阶为2的射影平面
- 自同构群阶为168

### 9.4.5 对偶设计

**定义 9.6（对偶设计）**：给定设计 $\mathcal{D} = (P, B, I)$，其对偶 $\mathcal{D}^T = (B, P, I^T)$ 其中 $(b, p) \in I^T$ 当且仅当 $(p, b) \in I$。

**性质**：
- BIBD的对偶未必是BIBD
- 对称BIBD的对偶仍为对称BIBD

### 9.4.6 Hall-Connor定理

**定理 9.16（Hall-Connor）**：对称BIBD的可嵌入性定理。关于可嵌入特定子设计的充要条件。

### 9.4.7 拉格朗日四平方定理

**定理 9.17（拉格朗日四平方定理）**：每个正整数可表示为四个整数的平方和。

**组合证明（借助设计理论）**：

利用Hurwitz四元数或Jacobi的 theta 函数恒等式。

**组合解释**：考虑将 $n$ 表示为：
$$n = x_1^2 + x_2^2 + x_3^2 + x_4^2$$

解的个数与某些设计的参数相关。

---

## 9.5 Hadamard矩阵与设计

### 9.5.1 Hadamard矩阵的定义和性质

**定义 9.7（Hadamard矩阵）**：$n$ 阶 Hadamard 矩阵 $H$ 是 $\{1, -1\}$ 元矩阵，满足：
$$HH^T = nI_n$$

即行向量两两正交。

**必要条件**：若 $n$ 阶 Hadamard 矩阵存在，则 $n = 1, 2$ 或 $n \equiv 0 \pmod{4}$。

**Hadamard猜想**：对所有 $n \equiv 0 \pmod{4}$，$n$ 阶 Hadamard 矩阵存在。

**已知结果**：$n < 668$ 时猜想成立。

**标准形**：第一行第一列全为1的 Hadamard 矩阵。

### 9.5.2 Hadamard设计

**构造**：设 $H$ 是 $4m$ 阶标准形 Hadamard 矩阵，删去第一行第一列，将 $-1$ 改为0，得 $(4m-1) \times (4m-1)$ 的 $(0,1)$-矩阵 $A$。

**定理 9.18**：$A$ 是对称BIBD的关联矩阵，参数为：
$$(v, b, r, k, \lambda) = (4m-1, 4m-1, 2m-1, 2m-1, m-1)$$

称为 **Hadamard $2$-设计**。

**证明**：由 $HH^T = nI$ 直接计算。 $\square$

### 9.5.3 会议矩阵

**定义 9.8（会议矩阵）**：$n$ 阶会议矩阵 $C$ 满足：
- 对角线为0
- 非对角线为 $\pm 1$
- $CC^T = (n-1)I$

**存在条件**：$n$ 阶会议矩阵存在仅当 $n \equiv 2 \pmod{4}$ 且 $n-1$ 为两平方和。

### 9.5.4 Paley矩阵

**Paley构造**：设 $q$ 为素数幂，$q \equiv 3 \pmod{4}$。

定义 $q \times q$ 矩阵 $Q$（Jacobsthal矩阵）：
$$Q_{ij} = \chi(j-i)$$

其中 $\chi$ 为有限域 $\mathbb{F}_q$ 的二次特征（Legendre符号）。

**定理 9.19**：
$$H = \begin{pmatrix} 1 & \mathbf{1}^T \\ \mathbf{1} & Q - I \end{pmatrix}$$

是 $q+1$ 阶 Hadamard 矩阵。

**证明关键**：利用二次特征的积性：$\sum_{x} \chi(x)\chi(x+a) = -1$ 对于 $a \neq 0$。 $\square$

### 9.5.5 克罗内克积

**定义 9.9（克罗内克积）**：设 $A = (a_{ij})$ 为 $m \times n$ 矩阵，$B$ 为 $p \times q$ 矩阵，则：
$$A \otimes B = \begin{pmatrix} a_{11}B & \cdots & a_{1n}B \\ \vdots & \ddots & \vdots \\ a_{m1}B & \cdots & a_{mn}B \end{pmatrix}$$

是 $mp \times nq$ 矩阵。

**性质**：
- $(A \otimes B)(C \otimes D) = AC \otimes BD$
- $(A \otimes B)^T = A^T \otimes B^T$

**定理 9.20**：若 $H_m, H_n$ 分别为 $m, n$ 阶 Hadamard 矩阵，则 $H_m \otimes H_n$ 是 $mn$ 阶 Hadamard 矩阵。

**证明**：
$$(H_m \otimes H_n)(H_m \otimes H_n)^T = H_mH_m^T \otimes H_nH_n^T = mI_m \otimes nI_n = mnI_{mn}$$ $\square$

### 9.5.6 BRC定理（Bruck-Ryser-Chowla）

**定理 9.21（BRC定理）**：设对称BIBD参数为 $(v, k, \lambda)$ 存在，则：

1. 若 $v$ 为偶数，则 $k - \lambda$ 为完全平方数
2. 若 $v$ 为奇数，则方程：
   $$x^2 = (k-\lambda)y^2 + (-1)^{(v-1)/2}\lambda z^2$$
   有不全为零的整数解

**证明概要**：利用关联矩阵 $M$ 满足 $MM^T = (k-\lambda)I + \lambda J$，通过行列式计算和二次型理论。 $\square$

### 9.5.7 Bruck-Ryser定理

**定理 9.22（Bruck-Ryser）**：有限射影平面阶为 $n$ 时，若 $n \equiv 1, 2 \pmod{4}$，则 $n$ 必为两平方和。

**推论**：阶为6的射影平面不存在。

---

## 9.6 Steiner系统

### 9.6.1 Steiner三元系STS(v)

**定义 9.10（Steiner三元系）**：$STS(v)$ 是 $2$-$(v, 3, 1)$设计，即每对点恰在一个区组（三元组）中。

**存在定理（Kirkman, 1847）**：$STS(v)$ 存在当且仅当 $v \equiv 1$ 或 $3 \pmod{6}$。

**必要性证明**：
- 每点关联 $r = \frac{v-1}{2}$ 个区组，故 $v$ 为奇数
- 区组数 $b = \frac{v(v-1)}{6}$ 为整数，故 $v \equiv 0, 1, 3, 4 \pmod{6}$

结合得 $v \equiv 1, 3 \pmod{6}$。

**构造方法**：
- **直接构造**：对 $v = 2^n - 1$，利用向量空间结构
- **递归构造**：若 $STS(v_1), STS(v_2)$ 存在，可构造 $STS(v_1v_2)$

### 9.6.2 Kirkman女学生问题

**问题陈述（1850年）**：15名女学生每天排成5行3人散步，连续7天。要求任意两人恰同行一次。

**解**：$STS(15)$ 的 **可分解** 设计，即 Kirkman 三元系 $KTS(15)$。

**可分解设计**：区组可划分为平行类（每点恰出现一次的区组集）。

**存在定理**：$KTS(v)$ 存在当且仅当 $v \equiv 3 \pmod{6}$。

**Ray-Chaudhuri-Wilson定理（1971）**：解决了Kirkman女学生问题的一般情形。

### 9.6.3 Steiner四元系

**定义 9.11（Steiner四元系）**：$SQS(v)$ 是 $3$-$(v, 4, 1)$设计，即每三个点恰在一个四元组中。

**存在定理（Hanani, 1960）**：$SQS(v)$ 存在当且仅当 $v \equiv 2$ 或 $4 \pmod{6}$。

**递推构造**：
- 若 $SQS(v)$ 存在，则 $SQS(2v)$ 存在
- 若 $SQS(v), SQS(w)$ 存在，则 $SQS(vw)$ 存在

---

## 9.7 差集与正交拉丁方

### 9.7.1 差集的定义和性质

**定义 9.12（差集）**：群 $G$（$|G| = v$）的子集 $D$（$|D| = k$）称为 $(v, k, \lambda)$-差集，如果映射：
$$\delta: D \times D \setminus \Delta \to G \setminus \{0\}, \quad (d_1, d_2) \mapsto d_1 - d_2$$

是 $\lambda$-对1的（即每个非零元恰表示为 $\lambda$ 个差）。

**等价条件**：在群环 $\mathbb{Z}[G]$ 中：
$$DD^{(-1)} = k \cdot 1_G + \lambda \sum_{g \neq 0} g = (k-\lambda) \cdot 1_G + \lambda G$$

其中 $D^{(-1)} = \sum_{d \in D} d^{-1}$。

**发展矩阵**：差集可发展为对称BIBD。

**定理 9.23**：$(v, k, \lambda)$-差集发展给出 $2$-$(v, k, \lambda)$对称设计。

### 9.7.2 Singer差集

**定理 9.24（Singer, 1938）**：在 $\mathbb{F}_q^{n+1}$ 的射影空间 $PG(n, q)$ 中，存在循环差集，参数为：
$$v = \frac{q^{n+1}-1}{q-1}, \quad k = \frac{q^n-1}{q-1}, \quad \lambda = \frac{q^{n-1}-1}{q-1}$$

**构造**：利用有限域 $\mathbb{F}_{q^{n+1}}$ 的乘法群。

**特例**（$n=2$）：
$$v = q^2 + q + 1, \quad k = q + 1, \quad \lambda = 1$$

对应于射影平面 $PG(2, q)$。

### 9.7.3 正交拉丁方的定义

**定义 9.13（拉丁方）**：$n$ 阶拉丁方是 $n \times n$ 阵列，填入 $\{1, \ldots, n\}$，每行每列各符号恰出现一次。

**定义 9.14（正交拉丁方，MOLS）**：两个拉丁方 $L_1, L_2$ 正交，如果所有有序对 $(L_1(i,j), L_2(i,j))$ 互不相同。

**记法**：$N(n)$ 表示 $n$ 阶两两正交拉丁方的最大个数。

**基本界限**：$N(n) \leq n-1$。

**证明**：不失一般性，设拉丁方第一行均为 $(1, 2, \ldots, n)$。则 $(2,2)$ 位置不能有相同符号，且需与第一行形成新对。最多 $n-1$ 个拉丁方可同时满足。 $\square$

### 9.7.4 Euler三十六军官问题

**问题（1782年）**：36名军官，来自6个团，每团6种军衔。能否排成 $6 \times 6$ 方阵，使每行每列的6名军官来自不同团且有不同军衔？

**等价表述**：是否存在一对6阶正交拉丁方？

**Euler猜想**：$N(4k+2) = 1$，即 $n \equiv 2 \pmod{4}$ 时无正交拉丁方对。

**Bose-Shrikhande-Parker（1959-60）**：证明 Euler 猜想错误！$N(10) \geq 2$，实际上 $N(6k+2) \geq 2$ 对 $k \geq 2$。

### 9.7.5 Bose-Shrikhande-Parker定理

**定理 9.25（Bose-Shrikhande-Parker）**：对所有 $n \neq 2, 6$，有 $N(n) \geq 2$。

**证明概要**：利用正交数组、有限域和差集构造。

**构造方法**：
- $n = p^k$（素数幂）：$N(n) = n-1$
- 积构造：$N(mn) \geq \min(N(m), N(n))$

### 9.7.6 MOLS与有限射影平面的关系

**定理 9.26**：存在 $n-1$ 个 $n$ 阶两两正交拉丁方，当且仅当存在 $n$ 阶射影平面。

**证明概要**：

（$\Rightarrow$）给定 $n-1$ 个MOLS $L_1, \ldots, L_{n-1}$：
- 点：$(i, j)$ 其中 $1 \leq i, j \leq n$，加上无穷远点
- 直线：
  - 水平线：$\{(i, j) : j \in [n]\}$（$n$ 条）
  - 垂直线：$\{(i, j) : i \in [n]\}$（$n$ 条）
  - 对每个 $L_k$ 和符号 $s$，线 $\{(i, j) : L_k(i, j) = s\}$（$n(n-1)$ 条）
  - 无穷远线

（$\Leftarrow$）给定射影平面，固定两点 $P, Q$，去掉线 $PQ$ 得仿射平面。对其余点按坐标编号，构造拉丁方。 $\square$

**推论**：$N(n) = n-1$ 当且仅当存在 $n$ 阶射影平面。

---

## 本章总结

本章系统介绍了组合代数的核心内容：

1. **奇镇偶镇问题**：展示了线性代数在解决交集问题中的威力，通过 $\mathbb{F}_2^n$ 向量空间方法得到优雅的上界。

2. **多项式空间方法**：Larman-Rogers-Seidel、Deza-Frankl-Singhi等定理展示了多项式方法在距离集和相交族问题中的应用。

3. **相交集合族**：从Fisher不等式到Erdős-Ko-Rado定理，系统地研究了各种相交条件下的集合族上界。

4. **关联结构**：引入了设计理论的基本框架，包括 $t$-设计、BIBD和法诺平面等经典对象。

5. **Hadamard矩阵**：探讨了Hadamard矩阵的构造（Paley、克罗内克积）及其与设计理论的联系。

6. **Steiner系统**：介绍了Steiner三元系和四元系的存在性定理及其组合构造。

7. **差集与正交拉丁方**：从差集的代数性质到正交拉丁方的几何解释，揭示了组合结构与有限几何的深刻联系。

这些方法和技术在现代组合数学、编码理论、密码学和实验设计中都有广泛应用。

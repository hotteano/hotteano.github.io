---
title: "算法设计与分析"
description: "本章为本人在算法设计与分析方面的学习笔记，内容涵盖了算法的基本概念、复杂度分析、分治策略、动态规划、贪心算法等方面。通过系统地整理和总结相关知识点，旨在帮助读者更好地理解和掌握算法设计与分析的核心内容。"
date: "2026-02-26"
draft: false
tags: ["notes", "algorithm"]
column: "学习笔记"
---

## 假设

### Word RAM模型

- 计算机模型，假设每个字（word）包含 $w$ 位
- 基本操作（如加法、乘法、位运算、寻址访存、追踪指针、进入分支等）在 $O(1)$ 时间内完成
- 适用于分析算法的时间复杂度

### 时间与空间用量的定义

- **时间用量**：算法执行所需的基本操作数量，通常以输入规模 $n$ 的函数表示
- **空间用量**：算法执行过程中使用的内存量，通常以输入规模 $n$ 的函数表示

## 记号

### 渐进记号

> - **大O记号**：$f(n) = O(g(n))$ 表示存在常数 $C > 0$ 和 $n_0$ 使得对于所有 $n \geq n_0$，有 $f(n) \leq C \cdot g(n)$
> - **大Ω记号**：$f(n) = \Omega(g(n))$ 表示存在常数 $C > 0$ 和 $n_0$ 使得对于所有 $n \geq n_0$，有 $f(n) \geq C \cdot g(n)$
> - **大Θ记号**：$f(n) = \Theta(g(n))$ 表示 $f(n) = O(g(n))$ 且 $f(n) = \Omega(g(n))$
> - **小o记号**：$f(n) = o(g(n))$ 表示对于所有常数 $C > 0$，存在 $n_0$ 使得对于所有 $n \geq n_0$，有 $f(n) < C \cdot g(n)$
> - **小ω记号**：$f(n) = \omega(g(n))$ 表示对于所有常数 $C > 0$，存在 $n_0$ 使得对于所有 $n \geq n_0$，有 $f(n) > C \cdot g(n)$

### 复杂度类

> - **P类**：多项式时间可解的问题集合
> - **NP类**：非确定性多项式时间可解的问题集合
> - **NP完全**：既在NP类中又是NP难的问题
> - **NP难**：至少和NP完全问题一样难的问题
> - **PSPACE**：多项式空间可解的问题集合
> - **EXPTIME**：指数时间可解的问题集合
> - **EXPSPACE**：指数空间可解的问题集合
> - **L类**：对数空间可解的问题集合
> - **NL类**：非确定性对数空间可解的问题集合
> - **$\Sigma_k$类**：具有 $k$ 层量词交替的谓词判定问题，$$\Sigma_k = \{ L \mid L = \{ x \mid \exists y_1 \forall y_2 \exists y_3 \cdots Q_k y_k : R \} \} $$
> 其中$R$是一个多项式时间可验证的谓词$R(x, y_1, \ldots, y_k)$，$Q_k$是存在量词或全称量词，取决于 $k$ 的奇偶性。
> - **$\Pi_k$类**：$\Sigma_k$的补集
> - **PH类**：多项式层次类，$$PH = \bigcup_{k=0}^{\infty} \Sigma_k$$
> - **NC类**: $NC^k$表示并行计算复杂度类，包含可以在 $O(\log^k n)$ 时间内使用多项式数量的处理器解决的问题。严格来说，NC类是多项式规模电路且深度不大于 $O(\log^k n)$ 的问题集合。
> - **AC类**: $AC^k$表示算术电路，包含可以在 $O(\log^k n)$ 时间内使用多项式数量的处理器解决的问题。与NC类不同的是，AC类允许使用无限扇入的逻辑门（AND和OR），而NC类限制为常数扇入。

## 算法分析

### 分析什么？

#### 输入分布

- **最坏情况**：算法在所有输入中表现最差的情况
- **平均情况**：算法在所有输入上的平均表现，通常假设输入是均匀分布的

#### 数据结构操作复杂度

- **直接计算**：通过算法的步骤直接计算基本操作的数量，结果可能不够准确，因为数据结构的状态会影响操作的复杂度
- **摊还复杂度**：通过分析一系列操作的总成本来计算平均每个操作的成本，适用于某些数据结构（如动态数组、堆等）中偶尔发生的高成本操作

#### 分析指标

- **时间复杂度**：算法执行所需的时间，通常以输入规模 $n$ 的函数表示
- **空间复杂度**：算法执行过程中使用的内存量，通常以输入规模 $n$ 的函数表示
- **并行宽度和深度**：并行算法中，宽度表示同时执行的操作数，深度表示最长路径上的操作数
- **通信复杂度**：分布式算法中，处理器之间交换信息的数量
- **随机算法的正确概率和期望运行时间**：随机算法中，算法输出正确结果的概率和期望运行时间
- **近似算法的近似比**：近似算法输出结果与最优解之间的比值，用于衡量近似算法的性能
- 等等....

### 复杂度分析

#### 线性递归分析

我们通常会分析如下的递归式：
$$
T(n) = a T\left(\frac{n}{b}\right) + f(n)
$$

我们可以使用主定理来分析这个递归式：
> **Master Theorem.**
> - 如果 $f(n) = O(n^{\log_b a - \epsilon})$ 对于某个 $\epsilon > 0$，则 $T(n) = \Theta(n^{\log_b a})$
> - 如果 $f(n) = \Theta(n^{\log_b a} \log^k n)$ 对于某个 $k \geq 0$，则 $T(n) = \Theta(n^{\log_b a} \log^{k+1} n)$
> - 如果 $f(n) = \Omega(n^{\log_b a + \epsilon})$ 对于某个 $\epsilon > 0$，并且 $a f(n/b) \leq c f(n)$ 对于某个 $c < 1$ 和足够大的 $n$，则 $T(n) = \Theta(f(n))$

#### 概率分析

在许多算法中，算法的性能取决于某些事件发生的概率。我们可以使用概率分析来计算算法的期望运行时间或其他性能指标。

##### 指示器变量

对于事件 $A$，定义指示器变量 $I_A$ 如下：
$$
I_A = \begin{cases}
1 & \text{如果事件 } A \text{ 发生} \\
0 & \text{如果事件 } A \text{ 不发生}
\end{cases}
$$

指示器变量的期望值等于事件发生的概率：
$$
E[I_A] = P(A)
$$
因此，我们可以通过定义适当的指示器变量来分析算法中某些事件发生的概率，从而计算算法的期望运行时间或其他性能指标。

##### 分段上界估计

在很多算法中，存在多个阶段，每个阶段的状态不同，我们可以通过分别计算每个阶段的上界来得到整个算法的性能上界。这种方法称为分段上界估计。典型情况是这样的：
$$
\mathbb{E}(T) \leq \sum_{i=1}^{k} \mathbb{E}(T_i)
$$

##### 鞅分析

在某些算法中，算法的性能可以通过分析一个鞅过程来得到。鞅是一种特殊的随机过程，满足以下条件：
- $E[X_{n+1} | X_1, X_2, \ldots, X_n] = X_n$（鞅条件）。用滤子的语言来说，就是对于某个滤子 $\{\mathcal{F}_i\}_{i\geq 0}$ ，并且满足 $E[X_{n+1} | \mathcal{F}_n] = X_n$，其中$\mathcal{F}_n$是一个$\sigma$-代数序列，满足$\mathcal{F}_0 \subseteq \ldots \subseteq \mathcal{F}_n \subseteq \mathcal{F}_{n+1}\subseteq ...$。
- $X_n$ 是一个随机变量序列

通过分析鞅过程的性质，我们可以得到算法的性能指标，例如期望运行时间、概率界等。

#### 摊还分析

#### 决策树

决策树一般可以用于分析比较类算法的时间复杂度。对于一个包含 $n$ 个元素的输入，决策树的深度表示算法在最坏情况下需要进行的比较次数。对于排序算法，决策树的深度至少为 $\log_2(n!)$，因此任何比较类排序算法的时间复杂度至少为 $O(n \log n)$。

> *协议树*： 例如，在通信复杂度中，我们通常将二元通信协议建模为一棵二叉树，树的每个节点表示一个通信步骤，每个边表示一个可能的通信结果。通过分析决策树的深度，我们可以得到算法的通信复杂度下界。

## 分治（Divide and Conquer）

分治（Divide and Conquer）是一种重要的算法设计策略，其核心思想是将一个复杂的问题分解成若干个规模较小但结构相似的子问题，递归地解决这些子问题，然后将子问题的解合并以得到原问题的解。

### 基本步骤

1. **分解（Divide）**：将原问题分解为若干个规模较小、相互独立且与原问题结构相似的子问题
2. **解决（Conquer）**：递归地解决各个子问题。如果子问题足够小，则直接求解
3. **合并（Combine）**：将子问题的解合并为原问题的解

### 二分查找

二分查找是分治思想的典型应用，适用于在有序数组中查找元素。

**思路**：通过比较中间元素，将搜索范围减半。

**复杂度**：
- 时间复杂度：$O(\log n)$
- 空间复杂度：$O(1)$（迭代版本）或 $O(\log n)$（递归版本）

**伪代码（迭代版）**：
```
BinarySearch(A, target, left, right):
    while left <= right:
        mid = left + (right - left) / 2
        if A[mid] == target:
            return mid
        else if A[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

**伪代码（递归版）**：
```
BinarySearchRecursive(A, target, left, right):
    if left > right:
        return -1
    mid = left + (right - left) / 2
    if A[mid] == target:
        return mid
    else if A[mid] < target:
        return BinarySearchRecursive(A, target, mid + 1, right)
    else:
        return BinarySearchRecursive(A, target, left, mid - 1)
```

**扩展应用**：
- 查找第一个/最后一个满足条件的元素
- 旋转有序数组的查找
- 二分答案（将求解问题转化为判定问题）

### 分治技巧

#### 主定理（Master Theorem）

对于递归式 $T(n) = aT(n/b) + f(n)$，其中 $a \geq 1$, $b > 1$：

1. 若 $f(n) = O(n^{\log_b a - \epsilon})$，则 $T(n) = \Theta(n^{\log_b a})$
2. 若 $f(n) = \Theta(n^{\log_b a})$，则 $T(n) = \Theta(n^{\log_b a} \log n)$
3. 若 $f(n) = \Omega(n^{\log_b a + \epsilon})$ 且 $af(n/b) \leq cf(n)$，则 $T(n) = \Theta(f(n))$

#### 经典应用

##### 归并排序（Merge Sort）

**思路**：将数组分成两半，分别排序，然后合并两个有序数组。

**复杂度**：
- 时间复杂度：$O(n \log n)$
- 空间复杂度：$O(n)$

**伪代码**：
```
MergeSort(A, left, right):
    if left < right:
        mid = (left + right) / 2
        MergeSort(A, left, mid)
        MergeSort(A, mid + 1, right)
        Merge(A, left, mid, right)

Merge(A, left, mid, right):
    i = left, j = mid + 1, k = 0
    temp = array of size (right - left + 1)
    while i <= mid and j <= right:
        if A[i] <= A[j]:
            temp[k++] = A[i++]
        else:
            temp[k++] = A[j++]
    while i <= mid:
        temp[k++] = A[i++]
    while j <= right:
        temp[k++] = A[j++]
    copy temp back to A[left..right]
```

##### 快速排序（Quick Sort）

**思路**：选择一个枢轴元素，将数组划分为两部分（小于枢轴和大于枢轴），然后递归排序两部分。

**复杂度**：
- 平均时间复杂度：$O(n \log n)$
- 最坏时间复杂度：$O(n^2)$（当划分极度不平衡时）
- 空间复杂度：$O(\log n)$（递归栈空间）

**伪代码**：
```
QuickSort(A, left, right):
    if left < right:
        pivotIndex = Partition(A, left, right)
        QuickSort(A, left, pivotIndex - 1)
        QuickSort(A, pivotIndex + 1, right)

Partition(A, left, right):
    pivot = A[right]
    i = left - 1
    for j = left to right - 1:
        if A[j] <= pivot:
            i = i + 1
            swap A[i] and A[j]
    swap A[i + 1] and A[right]
    return i + 1
```

##### 逆序对计数

**问题**：统计数组中逆序对的数量（即满足 $i < j$ 且 $A[i] > A[j]$ 的对数）。

**思路**：利用归并排序的过程，在合并时统计跨越中点的逆序对。

**伪代码**：
```
CountInversions(A, left, right):
    if left >= right:
        return 0
    mid = (left + right) / 2
    count = 0
    count += CountInversions(A, left, mid)
    count += CountInversions(A, mid + 1, right)
    count += MergeAndCount(A, left, mid, right)
    return count

MergeAndCount(A, left, mid, right):
    // 合并两个有序数组并统计逆序对
    i = left, j = mid + 1, count = 0
    temp = empty array
    while i <= mid and j <= right:
        if A[i] <= A[j]:
            temp.append(A[i++])
        else:
            temp.append(A[j++])
            count += mid - i + 1  // A[i..mid]都大于A[j]
    // 复制剩余元素
    copy remaining elements to temp
    copy temp back to A[left..right]
    return count
```

**复杂度**：$O(n \log n)$

##### 最近点对问题

**问题**：在二维平面上给定 $n$ 个点，找出距离最近的一对点。

**思路**：
1. 按 $x$ 坐标排序，将点集分成左右两半
2. 递归求解左右两部分的最近距离 $d$
3. 检查跨越中线的点对，只需考虑距离中线不超过 $d$ 的点，且按 $y$ 坐标排序后每个点只需与接下来的最多7个点比较

**复杂度**：$O(n \log n)$

#### 加速技巧

- **预处理**：在分治前对数据进行排序或建立索引
- **剪枝**：在搜索问题中提前终止不可能产生更优解的分支
- **迭代加深**：限制递归深度，逐步放宽限制

## 动态规划（Dynamic Programming）

动态规划（Dynamic Programming，简称DP）是一种通过将复杂问题分解为相互重叠的子问题来求解的算法设计方法。与分治不同，动态规划适用于子问题有重叠的情况，通过记忆化（Memoization）或制表（Tabulation）来避免重复计算。

### 基本要素

1. **最优子结构**：问题的最优解包含其子问题的最优解
2. **重叠子问题**：递归求解过程中会反复遇到相同的子问题
3. **无后效性**：某阶段的状态一旦确定，就不受之后决策的影响

### 设计步骤

1. **定义状态**：确定DP数组的含义，即 $dp[i]$ 或 $dp[i][j]$ 表示什么
2. **状态转移方程**：找出状态之间的递推关系
3. **初始化**：确定边界条件
4. **计算顺序**：确定状态计算的先后顺序
5. **提取答案**：从DP数组中得到最终答案

### 线性DP

线性DP是指状态转移方程呈现线性关系的动态规划问题。

#### 最长递增子序列（LIS）

**问题**：给定序列，求最长的严格递增子序列的长度。

**状态定义**：$dp[i]$ 表示以第 $i$ 个元素结尾的LIS长度

**状态转移**：
$$
dp[i] = \max_{j < i, a[j] < a[i]} \{dp[j] + 1\}
$$

**伪代码（$O(n^2)$）**：
```
LIS(A, n):
    dp = array of size n, initialized to 1
    for i = 1 to n - 1:
        for j = 0 to i - 1:
            if A[j] < A[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
```

**伪代码（$O(n \log n)$ 二分优化）**：
```
LIS_Binary(A, n):
    tail = empty array  // tail[i]表示长度为i+1的LIS的最小结尾元素
    for x in A:
        pos = lower_bound(tail, x)  // 找到第一个>=x的位置
        if pos == tail.size():
            tail.append(x)
        else:
            tail[pos] = x
    return tail.size()
```

**复杂度**：
- 朴素做法：$O(n^2)$
- 二分优化：$O(n \log n)$

#### 最长公共子序列（LCS）

**问题**：给定两个序列，求它们的最长公共子序列长度。

**状态定义**：$dp[i][j]$ 表示 $A[1..i]$ 和 $B[1..j]$ 的LCS长度

**状态转移**：
$$
dp[i][j] = \begin{cases}
dp[i-1][j-1] + 1 & \text{if } A[i] = B[j] \\
\max(dp[i-1][j], dp[i][j-1]) & \text{otherwise}
\end{cases}
$$

**伪代码**：
```
LCS(A, B, m, n):
    dp = 2D array of size (m+1) x (n+1), initialized to 0
    for i = 1 to m:
        for j = 1 to n:
            if A[i-1] == B[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

**复杂度**：$O(nm)$，其中 $n, m$ 分别为两个序列的长度

#### 编辑距离

**问题**：计算将一个字符串转换为另一个字符串所需的最少操作次数（插入、删除、替换）。

**状态定义**：$dp[i][j]$ 表示 $A[1..i]$ 转换为 $B[1..j]$ 的最小代价

**状态转移**：
$$
dp[i][j] = \min \begin{cases}
dp[i-1][j] + 1 & \text{删除} \\
dp[i][j-1] + 1 & \text{插入} \\
dp[i-1][j-1] + (A[i] \neq B[j]) & \text{替换}
\end{cases}
$$

**伪代码**：
```
EditDistance(A, B, m, n):
    dp = 2D array of size (m+1) x (n+1)
    for i = 0 to m:
        dp[i][0] = i
    for j = 0 to n:
        dp[0][j] = j
    for i = 1 to m:
        for j = 1 to n:
            if A[i-1] == B[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
    return dp[m][n]
```

**复杂度**：$O(nm)$

### 背包DP

背包问题是动态规划的经典应用，根据约束条件不同分为多种类型。

#### 0/1背包

**问题**：$n$ 个物品，每个物品有重量 $w_i$ 和价值 $v_i$，背包容量为 $W$，每个物品只能选择一次，求能装下的最大价值。

**状态定义**：$dp[i][j]$ 表示考虑前 $i$ 个物品，容量为 $j$ 时的最大价值

**状态转移**：
$$
dp[i][j] = \max(dp[i-1][j], dp[i-1][j-w_i] + v_i)
$$

**伪代码（二维）**：
```
Knapsack01(weights, values, n, W):
    dp = 2D array of size (n+1) x (W+1), initialized to 0
    for i = 1 to n:
        for j = 0 to W:
            dp[i][j] = dp[i-1][j]
            if j >= weights[i-1]:
                dp[i][j] = max(dp[i][j], dp[i-1][j-weights[i-1]] + values[i-1])
    return dp[n][W]
```

**伪代码（一维空间优化）**：
```
Knapsack01_Optimized(weights, values, n, W):
    dp = array of size (W+1), initialized to 0
    for i = 0 to n-1:
        for j = W down to weights[i]:  // 必须倒序
            dp[j] = max(dp[j], dp[j-weights[i]] + values[i])
    return dp[W]
```

**复杂度**：
- 时间：$O(nW)$
- 空间：$O(W)$（优化后）

#### 完全背包

**问题**：与0/1背包类似，但每个物品可以选择无限次。

**状态转移**：
$$
dp[i][j] = \max(dp[i-1][j], dp[i][j-w_i] + v_i)
$$

**伪代码**：
```
UnboundedKnapsack(weights, values, n, W):
    dp = array of size (W+1), initialized to 0
    for i = 0 to n-1:
        for j = weights[i] to W:  // 正序遍历
            dp[j] = max(dp[j], dp[j-weights[i]] + values[i])
    return dp[W]
```

**注意**：完全背包的空间优化中，内层循环需要正序遍历。

#### 多重背包

**问题**：每个物品有数量限制 $c_i$。

**优化方法**：
- 二进制拆分：将 $c_i$ 拆分为 $1, 2, 4, ..., c_i - 2^k + 1$，转化为0/1背包
- 单调队列优化：时间复杂度 $O(nW)$

**伪代码（二进制拆分）**：
```
MultipleKnapsack(weights, values, counts, n, W):
    dp = array of size (W+1), initialized to 0
    for i = 0 to n-1:
        k = 1
        while counts[i] > 0:
            cnt = min(k, counts[i])
            weight = weights[i] * cnt
            value = values[i] * cnt
            for j = W down to weight:
                dp[j] = max(dp[j], dp[j-weight] + value)
            counts[i] -= cnt
            k *= 2
    return dp[W]
```

### 区间DP

区间DP以区间作为状态，常用于解决与区间相关的问题。

#### 矩阵链乘法

**问题**：给定 $n$ 个矩阵的维度，确定乘法顺序使得标量乘法次数最少。

**状态定义**：$dp[i][j]$ 表示计算矩阵 $A_i$ 到 $A_j$ 乘积的最小代价

**状态转移**：
$$
dp[i][j] = \min_{i \leq k < j} \{dp[i][k] + dp[k+1][j] + p_{i-1}p_kp_j\}
$$

**伪代码**：
```
MatrixChainOrder(p, n):  // p[0..n]存储矩阵维度
    dp = 2D array of size n x n, initialized to 0
    for len = 2 to n:  // 区间长度
        for i = 0 to n - len:
            j = i + len - 1
            dp[i][j] = infinity
            for k = i to j - 1:
                cost = dp[i][k] + dp[k+1][j] + p[i]*p[k+1]*p[j+1]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n-1]
```

**复杂度**：$O(n^3)$

#### 石子合并

**问题**：$n$ 堆石子排成一排，每次合并相邻两堆，代价为两堆石子数之和，求合并成一堆的最小代价。

**状态定义**：$dp[i][j]$ 表示合并区间 $[i,j]$ 的最小代价

**状态转移**：
$$
dp[i][j] = \min_{i \leq k < j} \{dp[i][k] + dp[k+1][j]\} + sum[i][j]
$$

**伪代码**：
```
StoneMerge(stones, n):
    prefix = prefix sum array
    dp = 2D array of size n x n, initialized to infinity
    for i = 0 to n-1:
        dp[i][i] = 0
    for len = 2 to n:
        for i = 0 to n - len:
            j = i + len - 1
            for k = i to j - 1:
                cost = dp[i][k] + dp[k+1][j] + prefix[j+1] - prefix[i]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n-1]
```

**优化**：四边形不等式优化可将复杂度降至 $O(n^2)$

### 状态压缩DP

状态压缩DP适用于处理集合相关的DP问题，使用二进制数表示集合状态。

#### 旅行商问题（TSP）

**问题**：给定 $n$ 个城市和之间的距离，求从起点出发经过所有城市恰好一次并返回起点的最短路径。

**状态定义**：$dp[mask][i]$ 表示已经访问过的城市集合为 $mask$，当前在城市 $i$ 的最短距离

**状态转移**：
$$
dp[mask][i] = \min_{j \notin mask} \{dp[mask \setminus \{i\}][j] + dist[j][i]\}
$$

**伪代码**：
```
TSP(dist, n):
    dp = 2D array of size (1<<n) x n, initialized to infinity
    dp[1][0] = 0  // 从城市0出发，只访问了城市0
    for mask = 1 to (1<<n) - 1:
        for i = 0 to n-1:
            if not (mask & (1<<i)): continue
            if dp[mask][i] == infinity: continue
            for j = 0 to n-1:
                if mask & (1<<j): continue
                newMask = mask | (1<<j)
                dp[newMask][j] = min(dp[newMask][j], dp[mask][i] + dist[i][j])
    ans = infinity
    for i = 1 to n-1:
        ans = min(ans, dp[(1<<n)-1][i] + dist[i][0])
    return ans
```

**复杂度**：$O(n^2 \cdot 2^n)$

### 数位DP

数位DP用于解决与数字各位相关的问题，通常按位进行DP。

#### 统计数字个数

**问题**：统计区间 $[L, R]$ 中满足特定条件的数字个数（如不含某数字、各位和为某值等）。

**状态定义**：$dp[pos][tight][...]$，其中 $pos$ 表示当前处理到的位数，$tight$ 表示是否受上界限制

**技巧**：使用记忆化搜索实现，通常用 `dfs(pos, tight, ...)` 的形式

**伪代码**：
```
DigitDP(num):  // 统计[0, num]中满足条件的数字个数
    digits = digits of num from high to low
    memo = 3D array for memoization, initialized to -1
    
    dfs(pos, tight, sum):
        if pos == len(digits):
            return check(sum) ? 1 : 0
        if not tight and memo[pos][sum] != -1:
            return memo[pos][sum]
        limit = tight ? digits[pos] : 9
        res = 0
        for d = 0 to limit:
            newTight = tight and (d == limit)
            res += dfs(pos + 1, newTight, sum + d)
        if not tight:
            memo[pos][sum] = res
        return res
    
    return dfs(0, true, 0)
```

### 树上DP

树上DP在树结构上进行，通常需要先通过DFS遍历树。

#### 树的最大独立集

**问题**：在树上选择一些节点，使得任意两个被选节点不相邻，求最大权值和。

**状态定义**：
- $dp[u][0]$：不选节点 $u$ 时，以 $u$ 为根的子树的最大权值
- $dp[u][1]$：选节点 $u$ 时，以 $u$ 为根的子树的最大权值

**状态转移**：
$$
\begin{aligned}
dp[u][0] &= \sum_v \max(dp[v][0], dp[v][1]) \\
dp[u][1] &= w_u + \sum_v dp[v][0]
\end{aligned}
$$

**伪代码**：
```
TreeDP(u, parent):
    dp[u][0] = 0
    dp[u][1] = weight[u]
    for v in adjacency[u]:
        if v == parent: continue
        TreeDP(v, u)
        dp[u][0] += max(dp[v][0], dp[v][1])
        dp[u][1] += dp[v][0]
```

### 计数DP

计数DP用于计算满足特定条件的方案数。

#### 整数划分

**问题**：将整数 $n$ 划分为若干个正整数之和的方案数。

**状态定义**：$dp[i][j]$ 表示将 $i$ 划分为最大部分不超过 $j$ 的方案数

**状态转移**：
$$
dp[i][j] = dp[i][j-1] + dp[i-j][j]
$$

**伪代码**：
```
Partition(n):
    dp = 2D array of size (n+1) x (n+1), initialized to 0
    for j = 0 to n:
        dp[0][j] = 1  // 划分0有一种方案（不选任何数）
    for i = 1 to n:
        for j = 1 to n:
            dp[i][j] = dp[i][j-1]
            if i >= j:
                dp[i][j] += dp[i-j][j]
    return dp[n][n]
```

### DP优化手段

#### 滚动数组

当DP转移只依赖于前一阶段的状态时，可以使用滚动数组将空间复杂度减半或更多。

**示例（0/1背包）**：
```
// 原来需要 dp[n+1][W+1]
// 优化后只需要 dp[2][W+1]
for i = 0 to n-1:
    for j = 0 to W:
        dp[(i+1)%2][j] = dp[i%2][j]
        if j >= w[i]:
            dp[(i+1)%2][j] = max(dp[(i+1)%2][j], dp[i%2][j-w[i]] + v[i])
```

#### 前缀和优化

当状态转移涉及区间求和时，可以使用前缀和将 $O(n)$ 的转移优化到 $O(1)$。

**示例**：
```
// 原转移: dp[i] = sum(dp[j] for j in [i-m, i-1])
// 优化: 维护前缀和数组 prefix
prefix[0] = 0
for i = 1 to n:
    prefix[i] = prefix[i-1] + dp[i-1]
    dp[i] = prefix[i] - prefix[max(0, i-m)]
```

#### 单调队列/单调栈优化

用于优化形如 $dp[i] = \min_{j \in [i-m, i-1]} \{dp[j] + f(i, j)\}$ 的转移。

#### 斜率优化（凸包优化）

当状态转移方程可以表示为 $dp[i] = \min_{j < i} \{dp[j] + a[i] \cdot b[j]\}$ 时，可以用斜率优化将复杂度从 $O(n^2)$ 降至 $O(n)$ 或 $O(n \log n)$。

#### 四边形不等式优化

用于优化区间DP，当满足四边形不等式时，可以将复杂度从 $O(n^3)$ 降至 $O(n^2)$。

## 贪心算法（Greedy Algorithm）

贪心算法是一种在每一步选择中都采取在当前状态下最好或最优的选择，从而希望导致结果是全局最好或最优的算法。

### 基本要素

1. **贪心选择性质**：通过局部最优选择能达到全局最优
2. **最优子结构**：问题的最优解包含其子问题的最优解

### 排序法

通过某种排序策略，按特定顺序处理元素。

#### 活动选择问题

**问题**：给定 $n$ 个活动的开始和结束时间，选择最大数量的互不重叠的活动。

**贪心策略**：每次选择结束时间最早且不与已选活动冲突的活动。

**伪代码**：
```
ActivitySelection(activities):  // activities: (start, end) pairs
    sort activities by end time
    count = 1
    lastEnd = activities[0].end
    for i = 1 to n-1:
        if activities[i].start >= lastEnd:
            count += 1
            lastEnd = activities[i].end
    return count
```

**正确性证明**：设贪心解为 $G$，最优解为 $O$。通过归纳法可以证明 $|G| = |O|$。

**复杂度**：$O(n \log n)$（排序）

#### 区间调度问题

**问题**：选择最少数量的点，使得每个区间都至少包含一个点。

**贪心策略**：按右端点排序，每次选择当前区间的右端点，然后跳过所有包含该点的区间。

**伪代码**：
```
IntervalCovering(intervals):  // intervals: (left, right)
    sort intervals by right endpoint
    points = empty list
    i = 0
    while i < n:
        point = intervals[i].right
        points.append(point)
        while i < n and intervals[i].left <= point:
            i += 1
    return points
```

#### 区间划分问题

**问题**：将区间集合划分为最少数量的互不重叠的子集。

**贪心策略**：按开始时间排序，使用最小堆维护当前子集的结束时间，每次将区间放入结束时间最早的子集中。

**伪代码**：
```
IntervalPartitioning(intervals):
    sort intervals by start time
    minHeap = empty min-heap
    for interval in intervals:
        if minHeap is not empty and minHeap.peek() <= interval.start:
            minHeap.pop()
        minHeap.push(interval.end)
    return minHeap.size()
```

### 邻项交换法

通过分析相邻元素的交换对答案的影响来确定排序策略。

#### 调度问题

**问题**：$n$ 个任务，每个任务有处理时间 $t_i$ 和截止期限 $d_i$，求最小化最大延迟。

**贪心策略**：按最早截止时间优先（EDD, Earliest Due Date）排序。

**伪代码**：
```
MinimizeLateness(jobs):  // jobs: (processing_time, deadline)
    sort jobs by deadline
    time = 0
    maxLateness = 0
    for job in jobs:
        time += job.processing_time
        lateness = max(0, time - job.deadline)
        maxLateness = max(maxLateness, lateness)
    return maxLateness
```

#### 字符串拼接

**问题**：将若干字符串拼接成一个字典序最小的字符串。

**贪心策略**：对于两个字符串 $a$ 和 $b$，若 $a+b < b+a$（字典序比较），则 $a$ 应排在 $b$ 前面。

**伪代码**：
```
MinStringConcatenation(strings):
    sort strings with comparator (a, b) -> (a+b) < (b+a)
    return concatenation of sorted strings
```

### 后悔法

先贪心选择，当发现选择错误时进行"后悔"并调整选择。

#### 带截止期限的任务调度

**问题**：每个任务有截止期限和收益，在截止期限前完成任务可获得收益，每个任务需要单位时间，求最大收益。

**算法**：

**伪代码**：
```
JobSequencingWithDeadlines(jobs, n):  // jobs: (deadline, profit)
    sort jobs by profit in descending order
    maxDeadline = max(job.deadline for job in jobs)
    slot = array of size maxDeadline, initialized to -1
    
    for job in jobs:
        for t = job.deadline down to 1:
            if slot[t-1] == -1:
                slot[t-1] = job.id
                break
    return slot
```

**复杂度**：$O(n^2)$ 或使用并查集优化至 $O(n \alpha(n))$

### 最优性论证：通过交换论证证明贪心策略的正确性

证明最优性的方法有很多，比较常见的主要是交换论证。

- 假设存在一个最优解 $O$，与贪心解 $G$ 不同，去掉 $O$ 中的一个元素，加入 $G$ 中的一个元素，证明新的解仍然是最优的。
- 假设存在一个最优解 $O$，与贪心解 $G$ 顺序不同，证明交换逆序对不会降低解的质量。

### Catching Problem 

缓存问题（Caching Problem）研究如何在容量有限的缓存中管理数据，以最小化访问未缓存数据的代价（Cache Miss）。

#### 问题定义

**输入**：
- 缓存容量为 $k$
- 数据项访问序列 $\sigma = (\sigma_1, \sigma_2, \ldots, \sigma_n)$
- 访问未缓存项需要付出代价（如从慢速存储加载）

**目标**：设计替换策略，最小化总的 cache miss 次数或代价。

#### 策略

##### LRU (Least Recently Used)

**策略**：当需要替换时，淘汰最久未被访问的数据项。

**实现**：使用双向链表 + 哈希表
- 每次访问将项移到链表头部
- 淘汰时移除链表尾部

**复杂度**：$O(1)$ 每次操作

**竞争比**：LRU 是 $k$-竞争的，即对于任何访问序列，LRU 的代价不超过最优离线算法的 $k$ 倍。

##### LFU (Least Frequently Used)

**策略**：当需要替换时，淘汰访问频率最低的数据项。

**实现**：
- 维护每个项的访问计数
- 使用多个链表按频率分组

**复杂度**：$O(1)$ 每次操作（使用适当数据结构）

**特点**：对访问模式变化适应性较差（历史权重过大）

##### FIFO (First In First Out)

**策略**：按进入缓存的顺序，淘汰最早进入的数据项。

**实现**：简单队列

**特点**：实现简单，但性能通常不如 LRU

##### 其他策略

| 策略 | 描述 | 特点 |
|------|------|------|
| **Random** | 随机选择淘汰项 | 实现最简单，性能不稳定 |
| **LFU with Aging** | 带衰减的LFU | 解决LFU对历史过度依赖的问题 |
| **Clock** | 近似LRU | 使用引用位，实现更简单 |

#### 离线缓存与Farthest in Future

**离线缓存**：已知完整的访问序列，可以预先计算最优替换策略。

##### Belady's Optimal Algorithm (Farthest in Future)

**策略**：当需要替换时，淘汰在最远的将来才会被访问的数据项（如果都不会被访问，则淘汰任意一个）。

**伪代码**：
```
Belady(k, sigma):
    cache = empty set
    misses = 0
    for i = 1 to n:
        if sigma[i] in cache:
            continue  // cache hit
        misses += 1
        if cache.size() < k:
            cache.add(sigma[i])
        else:
            // 找到最远的将来才被访问的项
            farthest = argmax { next_access(x, i) for x in cache }
            cache.remove(farthest)
            cache.add(sigma[i])
    return misses

next_access(x, i):
    // 返回x在序列i之后第一次出现的位置，如果不出现返回infinity
    for j = i+1 to n:
        if sigma[j] == x:
            return j
    return infinity
```

##### 最优性证明

**定理**：Farthest in Future 是离线缓存的最优策略。

**证明思路（交换论证）**：

1. 设 $G$ 为贪心算法（Farthest in Future）产生的调度
2. 设 $O$ 为任意最优调度
3. 逐步将 $O$ 转换为 $G$ 而不增加代价

**关键引理**：对于任意时刻 $i$，存在最优调度 $O'$ 使得 $O'$ 在前 $i$ 步的缓存状态与 $G$ 相同。

**归纳证明**：
- **基础**：$i=0$ 时显然成立
- **归纳**：假设前 $i-1$ 步相同，考虑第 $i$ 步：
  - 如果 $G$ 和 $O$ 选择替换相同的项，保持 $O$ 不变
  - 如果不同，假设 $G$ 替换 $g$，$O$ 替换 $o$（$g \neq o$）：
    - 构造 $O'$：在 $O$ 中将 $o$ 的替换改为 $g$
    - 证明 $O'$ 不会更差（因为 $g$ 的下一次访问不早于 $o$）

#### 在线算法的竞争比

**竞争比定义**：在线算法 $A$ 的竞争比为 $c$，如果对于所有输入序列 $\sigma$：
$$
\frac{\text{cost}_A(\sigma)}{\text{cost}_{OPT}(\sigma)} \leq c
$$
其中 $OPT$ 为最优离线算法。

**重要结果**：
- **下界**：任何确定性在线缓存算法的竞争比至少为 $k$
- **LRU/FIFO**：竞争比恰好为 $k$
- **随机算法**：使用随机化可以将竞争比改进到 $O(\log k)$

#### 实际应用

| 应用场景 | 常用策略 | 原因 |
|----------|----------|------|
| CPU Cache | LRU | 时间局部性强 |
| 数据库缓冲池 | LRU/LFU混合 | 兼顾时间和频率 |
| Web缓存 | LFU + TTL | 考虑内容时效性 |
| CDN | 专用策略 | 考虑网络拓扑和成本 |

### A*算法

A*（A-Star）算法是一种启发式搜索算法，用于在图中寻找从起点到目标点的最短路径。它结合了 Dijkstra 算法和启发式信息，效率更高。

#### 基本思想

A* 算法维护一个优先队列（Open Set），每次选择 $f(n)$ 值最小的节点进行扩展：

$$
f(n) = g(n) + h(n)
$$

其中：
- $g(n)$：从起点到节点 $n$ 的实际代价
- $h(n)$：从节点 $n$ 到目标的估计代价（启发函数）
- $f(n)$：经过 $n$ 到目标的估计总代价

#### 算法流程

```
AStar(graph, start, goal, h):
    // g[n]: 从start到n的实际代价
    // cameFrom[n]: 到达n的前驱节点
    // openSet: 优先队列，按f值排序
    
    g[start] = 0
    f[start] = h(start)
    openSet = {start}
    closedSet = empty set
    cameFrom = empty map
    
    while openSet not empty:
        current = node in openSet with minimum f value
        
        if current == goal:
            return reconstruct_path(cameFrom, current)
        
        openSet.remove(current)
        closedSet.add(current)
        
        for each neighbor of current:
            if neighbor in closedSet:
                continue
            
            tentative_g = g[current] + cost(current, neighbor)
            
            if neighbor not in openSet:
                openSet.add(neighbor)
            else if tentative_g >= g[neighbor]:
                continue  // 不是更优路径
            
            // 发现更优路径
            cameFrom[neighbor] = current
            g[neighbor] = tentative_g
            f[neighbor] = g[neighbor] + h(neighbor)
    
    return failure  // 无可行路径

reconstruct_path(cameFrom, current):
    path = [current]
    while current in cameFrom:
        current = cameFrom[current]
        path.prepend(current)
    return path
```

#### 启发函数的性质

##### 可采纳性 (Admissibility)

**定义**：启发函数 $h$ 是可采纳的，如果对于所有节点 $n$：
$$
h(n) \leq h^*(n)
$$
其中 $h^*(n)$ 是从 $n$ 到目标的真实最短代价。

**意义**：$h$ 从不高估真实代价，保证 A* 能找到最优解。

##### 一致性 (Consistency / Monotonicity)

**定义**：启发函数 $h$ 是一致的，如果对于所有边 $(u, v)$：
$$
h(u) \leq cost(u, v) + h(v)
$$

**等价形式**：
$$
f(v) \geq f(u) \quad \text{当从u扩展到v时}
$$

**性质**：
- 一致性蕴含可采纳性
- 若 $h$ 一致，则 A* 不需要重复访问节点（closedSet可省略）

#### 常见启发函数

##### 网格路径规划

**欧几里得距离**（允许8方向移动）：
$$
h(n) = \sqrt{(x_n - x_{goal})^2 + (y_n - y_{goal})^2}
$$

**曼哈顿距离**（仅允许4方向移动）：
$$
h(n) = |x_n - x_{goal}| + |y_n - y_{goal}|
$$

**切比雪夫距离**（允许8方向，对角代价为1）：
$$
h(n) = \max(|x_n - x_{goal}|, |y_n - y_{goal}|)
$$

##### 图搜索

**预计算启发**：
- **ALT算法**：使用少量地标节点（Landmarks），利用三角不等式计算下界
$$
h(n) = \max_{l \in L} \{|dist(n, l) - dist(goal, l)|\}
$$

**抽象图启发**：
- 构建原图的抽象（层次化）表示
- 在抽象图上预计算距离作为启发

#### 复杂度分析

**时间复杂度**：取决于启发函数的质量
- 最坏情况：$O(b^d)$，其中 $b$ 是分支因子，$d$ 是解深度
- 好的启发函数可以接近 $O(d)$

**空间复杂度**：$O(b^d)$，需要存储所有已探索节点

#### 优化变体

##### IDA* (Iterative Deepening A*)

**思想**：结合迭代加深和 A*，限制 $f$ 值阈值，逐步放宽。

**优点**：
- 空间复杂度降至 $O(d)$
- 适合内存受限场景

**伪代码**：
```
IDAStar(start, goal, h):
    threshold = h(start)
    while true:
        result = search(start, 0, threshold)
        if result == FOUND:
            return solution
        if result == INF:
            return NOT_FOUND
        threshold = result  // 下一个最小f值

search(node, g, threshold):
    f = g + h(node)
    if f > threshold:
        return f
    if node == goal:
        return FOUND
    min = INF
    for each neighbor of node:
        t = search(neighbor, g + cost(node, neighbor), threshold)
        if t == FOUND:
            return FOUND
        if t < min:
            min = t
    return min
```

##### Weighted A*

**思想**：放宽最优性要求，加速搜索：
$$
f(n) = g(n) + w \cdot h(n), \quad w > 1
$$

**特点**：
- $w$ 越大，搜索越快但解质量越低
- 可证明解的代价不超过最优解的 $w$ 倍

##### Jump Point Search (JPS)

**适用**：均匀代价网格

**思想**：跳过对称路径，只考虑"跳跃点"

**加速**：在开放地图上比 A* 快一个数量级

#### 实际应用

| 应用领域 | 启发函数设计 | 特点 |
|----------|--------------|------|
| 游戏AI路径规划 | 欧几里得/曼哈顿距离 | 实时性强，可接受次优 |
| 地图导航 | 预计算ALT启发 | 大规模路网，需快速响应 |
| 机器人运动规划 | 考虑运动学约束的启发 | 高维状态空间 |
| 拼图问题 | 错位块数 / 曼哈顿距离之和 | 离散状态空间 |

#### A* vs Dijkstra

| 特性 | Dijkstra | A* |
|------|----------|-----|
| 启发函数 | 无（$h=0$） | 有 |
| 搜索方向 | 向外辐射 | 朝向目标 |
| 访问节点数 | 多 | 少（启发好时） |
| 最优性 | 保证 | 保证（可采纳启发） |
| 适用场景 | 单源多目标 | 单源单目标 |

**关系**：Dijkstra 是 A* 在 $h(n) = 0$ 时的特例。

## 网络流（Network Flow）

网络流问题研究在有向图中从源点到汇点的最大流量问题。

### 基本概念

- **流网络**：有向图 $G = (V, E)$，每条边 $(u, v)$ 有容量 $c(u, v) \geq 0$
- **流**：函数 $f: V \times V \to \mathbb{R}$，满足容量约束和流量守恒
- **残量网络**：$c_f(u, v) = c(u, v) - f(u, v) + f(v, u)$
- **增广路**：残量网络中从 $s$ 到 $t$ 的路径
- **最大流**：从源点 $s$ 到汇点 $t$ 的最大可行流



### 最大流

#### Ford-Fulkerson Algorithm

**基本思想**：在残量网络中反复寻找增广路， augment 流量直到不存在增广路。

**伪代码**：
```
FordFulkerson(G, s, t):
    for each edge (u, v) in G.E:
        f[u][v] = 0
        f[v][u] = 0
    while there exists a path p from s to t in residual network Gf:
        cf(p) = min(cf(u, v) for (u, v) in p)
        for each edge (u, v) in p:
            f[u][v] += cf(p)
            f[v][u] -= cf(p)
    return f
```

**复杂度**：$O(E \cdot |f^*|)$，其中 $|f^*|$ 是最大流的值

#### Edmonds-Karp Algorithm

Ford-Fulkerson 的改进版，使用 BFS 寻找最短增广路。

**伪代码**：
```
EdmondsKarp(G, s, t):
    f = zero flow
    while true:
        // BFS to find shortest augmenting path
        parent = BFS(Gf, s, t)
        if no path found:
            break
        cf = minimum residual capacity along the path
        augment flow along the path by cf
    return f
```

**复杂度**：$O(VE^2)$

**性质**： Edmonds-Karp 算法最多进行 $O(VE)$ 次增广。

#### Dinic's Algorithm

**基本思想**：
1. 构建层次图（BFS 分层）
2. 在层次图中使用 DFS 进行多路增广
3. 重复直到不存在增广路

**伪代码**：
```
Dinic(G, s, t):
    maxFlow = 0
    while BFS builds level graph:
        while true:
            flow = DFS(s, infinity)
            if flow == 0:
                break
            maxFlow += flow
    return maxFlow

BFS(s, t):
    level = array initialized to -1
    queue = [s]
    level[s] = 0
    while queue not empty:
        u = queue.pop()
        for each edge (u, v) with residual capacity > 0:
            if level[v] == -1:
                level[v] = level[u] + 1
                queue.push(v)
    return level[t] != -1

DFS(u, flow):
    if u == t:
        return flow
    for each edge (u, v) with residual capacity > 0 and level[v] == level[u] + 1:
        pushed = DFS(v, min(flow, residual[u][v]))
        if pushed > 0:
            residual[u][v] -= pushed
            residual[v][u] += pushed
            return pushed
    return 0
```

**复杂度**：
- 一般图：$O(V^2E)$
- 单位容量：$O(\min(V^{2/3}, E^{1/2})E)$
- 二分图匹配：$O(E\sqrt{V})$

**当前弧优化**：记录每个点当前检查到哪条边，避免重复检查。

#### Push-Relabel Algorithm

**基本思想**：
- 不维护可行流，而是维护预流（preflow），允许节点有超额流
- 通过"推流"（push）操作将超额流向低高度的邻居推送
- 通过"重标号"（relabel）操作提升节点高度以允许更多推流

**复杂度**：
- 基础版：$O(V^2E)$
- 最高标号（HLPP）：$O(V^2\sqrt{E})$

### 最小割

**最大流最小割定理**：最大流的值等于最小割的容量。

**最小割构造**：在最大流后的残量网络中，从源点可达的节点集合为 $S$，其余为 $T$，则 $(S, T)$ 为最小割。

**应用**：
- 图像分割
- 二分图最大匹配
- 最小点覆盖、最大独立集（König 定理）

### 费用流

**问题**：每条边除容量外还有单位费用，求最大流中的最小费用流。

#### 最小费用最大流

**算法**：
1. 在残量网络中找最短路径（按费用）
2. 沿路径增广
3. 重复直到无法增广或达到指定流量

**伪代码**：
```
MinCostMaxFlow(G, s, t, maxf):
    flow = 0, cost = 0
    while flow < maxf:
        // SPFA or Dijkstra with potential to find shortest path
        dist, parent = SPFA(s)
        if dist[t] == infinity:
            break
        augment = min(maxf - flow, residual capacity along path)
        flow += augment
        cost += augment * dist[t]
        update residual network
    return (flow, cost)
```

**复杂度**：
- SPFA 实现：$O(V E \cdot |f|)$
- 势函数 + Dijkstra：$O(F \cdot (E \log V))$，其中 $F$ 为流量

## 稳定匹配（Stable Matching）

稳定匹配问题研究如何在两组参与者之间形成稳定的配对。

### 匹配

#### 二分图判定

**问题**：判断一个无向图是否为二分图。

**方法**：BFS/DFS 染色，若存在奇环则不是二分图。

**伪代码**：
```
IsBipartite(G):
    color = array initialized to -1
    for each vertex u:
        if color[u] == -1:
            if not BFSColor(u, 0):
                return false
    return true

BFSColor(start, c):
    queue = [start]
    color[start] = c
    while queue not empty:
        u = queue.pop()
        for v in adjacency[u]:
            if color[v] == -1:
                color[v] = 1 - color[u]
                queue.push(v)
            else if color[v] == color[u]:
                return false
    return true
```

**复杂度**：$O(V + E)$

#### 二分图匹配与匈牙利算法

**二分图匹配**：在二分图中寻找边集，使得任意两条边不共享端点。

**匈牙利算法（Kuhn's Algorithm）**：

**伪代码**：
```
HungarianAlgorithm(G, U, V):  // U, V are the two partitions
    match = array of size |V|, initialized to -1
    result = 0
    for u in U:
        visited = array of size |V|, initialized to false
        if DFS(u, visited, match):
            result += 1
    return result

DFS(u, visited, match):
    for v in adjacency[u]:
        if not visited[v]:
            visited[v] = true
            if match[v] == -1 or DFS(match[v], visited, match):
                match[v] = u
                return true
    return false
```

**复杂度**：$O(VE)$ 或 $O(E\sqrt{V})$（Hopcroft-Karp 算法）

**Hopcroft-Karp 算法**：每次找一组最短的不相交增广路同时增广，复杂度 $O(E\sqrt{V})$。

### 稳定匹配与Shapley-Gale Algorithm

**问题**：$n$ 个男生和 $n$ 个女生，每人有一个偏好列表，求一个稳定的完美匹配。

**稳定**：不存在一对男女彼此更喜欢对方而不是当前的伴侣。

**Gale-Shapley 算法**：

策略：每一个男生向他偏好列表中最喜欢的女生求婚，如果女生是自由的则接受，否则比较当前伴侣和新求婚者，选择更喜欢的一个。

**正确性证明**：循环不变式：在算法执行过程中，任何一个男生都不会被一个他更喜欢的女生拒绝。

**伪代码**：
```
GaleShapley(menPrefs, womenPrefs, n):
    // menPrefs[i]: 男生i的偏好列表（女生编号）
    // womenPrefs[i]: 女生i的偏好列表（男生编号）
    
    wife = array of size n, initialized to -1    // 女生i的丈夫
    husband = array of size n, initialized to -1 // 男生i的妻子
    nextProposal = array of size n, initialized to 0  // 男生i下一个要求婚的女生索引
    
    freeMen = queue of all men
    
    while freeMen not empty:
        m = freeMen.pop()
        w = menPrefs[m][nextProposal[m]]
        nextProposal[m] += 1
        
        if wife[w] == -1:  // 女生w是自由的
            wife[w] = m
            husband[m] = w
        else if womenPrefs[w].indexOf(m) < womenPrefs[w].indexOf(wife[w]):
            // 女生w更喜欢m而不是当前的丈夫
            freeMen.push(wife[w])
            husband[wife[w]] = -1
            wife[w] = m
            husband[m] = w
        else:
            freeMen.push(m)  // m被拒绝，继续寻找
    
    return husband  // 或wife
```

**性质**：
- **收敛性**：算法最多在 $n^2$ 轮后结束，当男生的列表和女生的Preference列表完全相反的时候。
- **完美性**：最终形成完美匹配
- **稳定性**：匹配是稳定的
- **男生最优**：对男生而言，这是所有稳定匹配中最优的
- **女生最劣**：对女生而言，这是所有稳定匹配中最差的

**复杂度**：$O(n^2)$

**变体问题**：
- 多对一匹配（如医院-实习医生问题）
- 带容量限制的匹配
- 不完全偏好列表

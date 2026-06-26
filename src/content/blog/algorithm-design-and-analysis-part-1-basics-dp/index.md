---
title: "算法设计与分析 (Part 1): 基础、分治与动态规划"
description: "算法设计与分析学习笔记（上）：Word RAM 模型、渐进记号、复杂度类、算法分析、分治策略与动态规划各类题型。"
date: "2026-02-26"
draft: false
tags: ["notes", "algorithm"]
column: "学习笔记"
series: "算法设计与分析"
---

> 这是 **算法设计与分析** 系列的第一期。

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


---
title: "算法设计与分析 (Part 2): 贪心、网络流与稳定匹配"
description: "算法设计与分析学习笔记（下）：贪心算法、网络流（最大流、最小割、费用流）与稳定匹配问题。"
date: "2026-02-27"
draft: false
tags: ["notes", "algorithm"]
column: "学习笔记"
series: "算法设计与分析"
track: "cs-fundamentals"
trackStage: "algorithms"
trackOrder: 16
---

> 这是 **算法设计与分析** 系列的第二期。
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

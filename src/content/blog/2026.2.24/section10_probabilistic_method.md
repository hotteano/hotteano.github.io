# 10. 组合学中的概率方法

## 10.1 概率方法基础

### 10.1.1 基本思想：非构造性存在证明

**概率方法**是Paul Erdős于1940年代发展起来的一种强有力的组合数学技术。其核心思想出人意料地简洁：

> **基本原理**：如果在概率空间中随机选取一个对象具有某种性质的概率大于0，则必然存在至少一个具有该性质的对象。

形式上，设 $\Omega$ 是一个有限集合（对象空间），$A \subseteq \Omega$ 是我们关心的具有特定性质的子集。若在一个合适的概率分布下，

$$\mathbb{P}(X \in A) > 0$$

则 $A \neq \emptyset$，即存在具有该性质的对象。

**关键洞察**：概率方法是一种**非构造性证明**——它证明了对象的存在性，但通常不提供具体的构造方法。这种方法在证明具有特定性质的结构存在时异常强大，尤其是在显式构造极其困难或未知的情况下。

**基本框架**：
1. 定义一个合适的概率空间
2. 计算（或估计）目标性质发生的概率
3. 证明该概率严格大于0
4. 得出存在性结论

### 10.1.2 第一矩方法

**第一矩方法**（First Moment Method）是概率方法中最简单也最常用的技术。

**定理 10.1**（第一矩方法）：设 $X$ 是一个非负整数值随机变量。若 $\mathbb{E}[X] < 1$，则 $\mathbb{P}(X = 0) > 0$。

**证明**：由马尔可夫不等式（Markov's Inequality），对任意 $a > 0$：

$$\mathbb{P}(X \geq a) \leq \frac{\mathbb{E}[X]}{a}$$

取 $a = 1$，由于 $X$ 取整数值：

$$\mathbb{P}(X \geq 1) \leq \mathbb{E}[X] < 1$$

因此：

$$\mathbb{P}(X = 0) = 1 - \mathbb{P}(X \geq 1) > 0$$

**推论 10.2**：若 $\mathbb{E}[X] \to 0$，则几乎必然有 $X = 0$（即 $\mathbb{P}(X = 0) \to 1$）。

第一矩方法的典型应用场景：
- 证明某个"坏事件"可以被避免
- 证明图中不存在某种子结构
- 证明染色方案中不存在单色配置

### 10.1.3 期望的线性性

**期望的线性性**（Linearity of Expectation）是概率方法中最重要的计算工具：

> 对任意随机变量 $X_1, X_2, \ldots, X_n$（无论是否独立）：
> $$\mathbb{E}\left[\sum_{i=1}^n X_i\right] = \sum_{i=1}^n \mathbb{E}[X_i]$$

这个简单的事实是概率方法威力无穷的关键。它允许我们将复杂随机变量分解为简单指示变量的和，从而绕过相关性分析的困难。

**指示随机变量技术**：

对于事件 $A$，定义指示变量：

$$\mathbf{1}_A = \begin{cases} 1 & \text{若 } A \text{ 发生} \\ 0 & \text{否则} \end{cases}$$

则 $\mathbb{E}[\mathbf{1}_A] = \mathbb{P}(A)$。

**应用范式**：
1. 定义适当的指示变量 $X_i$ 表示第 $i$ 个"单元"的贡献
2. 令 $X = \sum_i X_i$ 为总度量
3. 计算 $\mathbb{E}[X] = \sum_i \mathbb{E}[X_i]$
4. 利用 $\mathbb{P}(X \leq \mathbb{E}[X]) > 0$ 或 $\mathbb{P}(X \geq \mathbb{E}[X]) > 0$

---

## 10.2 竞赛图中的应用

### 10.2.1 竞赛图基本概念

**定义 10.3**（竞赛图）：**竞赛图**（Tournament）是一个有向图 $T = (V, A)$，其中对每对不同的顶点 $u, v \in V$，恰好有一条有向边 $u \to v$ 或 $v \to u$ 属于 $A$。

竞赛图可以看作是完全图 $K_n$ 的定向。它模拟了 $n$ 个选手之间的循环赛：每对选手恰好比赛一次，边 $u \to v$ 表示 $u$ 战胜了 $v$。

**基本性质**：$n$ 个顶点的竞赛图数目为 $2^{\binom{n}{2}}$。

**定义 10.4**（得分序列）：顶点 $v$ 的**出度** $d^+(v)$ 称为其**得分**。所有顶点得分的序列称为**得分序列**。

**Landau定理**：一个非负整数序列 $(s_1, \ldots, s_n)$ 是某个竞赛图的得分序列当且仅当对所有 $k = 1, \ldots, n$：

$$\sum_{i=1}^k s_i \geq \binom{k}{2}$$

且等号在 $k = n$ 时成立。

### 10.2.2 国王的存在性

**定义 10.5**（国王）：竞赛图中顶点 $v$ 称为**国王**（King），如果对任意其他顶点 $u$，存在长度至多为2的有向路径从 $v$ 到 $u$。

**定理 10.6**（Landau, 1953）：每个有限竞赛图都有国王。

**概率方法证明**：

设 $T$ 是 $n$ 个顶点的竞赛图。随机选取顶点 $v$，计算其"统治范围"。

对顶点 $v$，令：
- $N^+(v) = \{u : v \to u\}$（直接击败的对手）
- $N^{++}(v) = \{u : \exists w, v \to w \to u\}$（两步可达的对手）

顶点 $v$ 是国王当且仅当 $N^+(v) \cup N^{++}(v) = V \setminus \{v\}$。

考虑随机竞赛图：对每对顶点，随机定向。对固定顶点 $v$：

$$\mathbb{E}[|N^+(v)|] = \frac{n-1}{2}$$

对任意其他顶点 $u$，$v$ 在2步内到达 $u$ 的概率：

$$\mathbb{P}(\exists w: v \to w \to u) = 1 - \left(\frac{1}{2}\right)^{n-2} \cdot \left(\frac{1}{2}\right)^{n-2} = 1 - \frac{1}{2^{2n-4}}$$

实际上，直接计数可证：对任意竞赛图，得分最高的顶点必是国王。

**证明**：设 $v$ 是得分最高的顶点。假设存在 $u$ 使得 $v$ 无法在2步内到达 $u$，则 $u \to v$ 且对所有 $w \in N^+(v)$，要么 $u \to w$，要么 $w$ 与 $u$ 不相连（但竞赛图中必连）。若 $u \to w$ 对所有 $w \in N^+(v)$ 成立，则 $d^+(u) \geq d^+(v) + 1$，矛盾。

### 10.2.3 小支配集的存在性

**定义 10.7**（支配集）：竞赛图 $T = (V, A)$ 的子集 $D \subseteq V$ 称为**支配集**，如果对任意 $v \in V \setminus D$，存在 $u \in D$ 使得 $u \to v$。

**定理 10.8**：每个 $n$ 顶点竞赛图都有大小至多为 $\lceil \log_2 n \rceil$ 的支配集。

**证明**（概率方法）：

随机独立地以概率 $p$ 选取每个顶点，设选出的集合为 $X$。对未被 $X$ 支配的顶点 $v$（即没有 $X$ 中元素击败 $v$），将其加入 $X$ 形成支配集 $D$。

顶点 $v$ 未被 $X$ 支配的概率：$v$ 的所有入邻点都不在 $X$ 中。若 $d^-(v)$ 是入度，则此概率为 $(1-p)^{d^-(v)}$。

期望计算：
$$\mathbb{E}[|D|] = \mathbb{E}[|X|] + \mathbb{E}[|Y|] \leq np + n(1-p)^{(n-1)/2}$$

取 $p = \frac{2\ln n}{n}$，利用 $(1-p)^{(n-1)/2} \approx e^{-p(n-1)/2}$：

$$\mathbb{E}[|D|] \leq n \cdot \frac{2\ln n}{n} + n \cdot e^{-\ln n} = 2\ln n + 1$$

更精细的分析可得 $|D| \leq \lceil \log_2 n \rceil$。

---

## 10.3 控制数与支配集

### 10.3.1 图的支配数定义

**定义 10.9**（支配集与支配数）：设 $G = (V, E)$ 是无向图。
- 子集 $D \subseteq V$ 称为**支配集**，如果每个 $v \in V \setminus D$ 都与 $D$ 中某顶点相邻
- **支配数** $\gamma(G)$ 是最小支配集的大小

**等价表述**：$D$ 是支配集当且仅当 $N[D] = V$，其中 $N[D] = D \cup \bigcup_{v \in D} N(v)$。

**基本性质**：
- $\gamma(G) \leq n - \Delta(G)$，其中 $\Delta(G)$ 是最大度
- 对任意无孤立点图，$\gamma(G) \leq n/2$
- 对连通图，$\gamma(G) \leq \frac{n+2}{3}$（Ore定理）

### 10.3.2 用概率方法估计支配数（Arnautov-Payan定理）

**定理 10.10**（Arnautov-Payan, 1974）：设 $G$ 是 $n$ 顶点图，最小度为 $\delta \geq 1$，则：

$$\gamma(G) \leq n \cdot \frac{1 + \ln(\delta + 1)}{\delta + 1}$$

**证明**（概率方法）：

对每个顶点，独立地以概率 $p$ 选取，形成随机集 $X$。令 $Y$ 为未被 $X$ 支配的顶点集合，即：

$$Y = \{v \in V \setminus X : N(v) \cap X = \emptyset\}$$

则 $D = X \cup Y$ 是支配集。

**期望分析**：

1. **$\mathbb{E}[|X|]$**：
   $$\mathbb{E}[|X|] = np$$

2. **$\mathbb{E}[|Y|]$**：对顶点 $v$，$v \in Y$ 当且仅当 $v \notin X$ 且 $N(v) \cap X = \emptyset$。
   
   因此：
   $$\mathbb{P}(v \in Y) = (1-p) \cdot (1-p)^{d(v)} \leq (1-p)^{\delta + 1}$$
   
   所以：
   $$\mathbb{E}[|Y|] \leq n(1-p)^{\delta+1} \leq n \cdot e^{-p(\delta+1)}$$

3. **总期望**：
   $$\mathbb{E}[|D|] \leq np + n \cdot e^{-p(\delta+1)}$$

取 $p = \frac{\ln(\delta+1)}{\delta+1}$ 最小化上界：

$$\mathbb{E}[|D|] \leq n \cdot \frac{\ln(\delta+1)}{\delta+1} + n \cdot \frac{1}{\delta+1} = n \cdot \frac{1 + \ln(\delta+1)}{\delta+1}$$

由于存在实例达到此期望，定理得证。

### 10.3.3 控制数的上界

**推论 10.11**：对最小度为 $\delta$ 的 $n$ 顶点图：

$$\gamma(G) = O\left(\frac{n \ln \delta}{\delta}\right)$$

**紧性**：Alon证明了这个界在常数因子意义下是最优的。

**特殊情形**：
- 当 $\delta = 1$（无孤立点）：$\gamma(G) \leq n/2$
- 当 $\delta = 2$：$\gamma(G) \leq \frac{2n}{3}$
- 当 $\delta = \Theta(n)$（稠密图）：$\gamma(G) = O(\log n)$

---

## 10.4 Erdős的若干经典结果

### 10.4.1 拉姆齐数的下界（$R(k,k) > 2^{k/2}$）

**定义 10.12**（拉姆齐数）：$R(k, l)$ 是最小的 $n$，使得任意 $n$ 顶点图的边二染色（红/蓝）中，必存在红色 $K_k$ 或蓝色 $K_l$。

**定理 10.13**（Erdős, 1947）：对 $k \geq 3$，

$$R(k, k) > 2^{k/2}$$

**证明**（概率方法）：

考虑 $K_n$ 的随机边二染色：每条边独立地以 $1/2$ 概率染红或蓝。

对固定的 $k$ 顶点子集 $S$，$S$ 形成单色 $K_k$ 的概率：

$$\mathbb{P}(S \text{ 单色}) = 2 \cdot \left(\frac{1}{2}\right)^{\binom{k}{2}} = 2^{1-\binom{k}{2}}$$

存在单色 $K_k$ 的概率（并界）：

$$\mathbb{P}(\exists \text{ 单色 } K_k) \leq \binom{n}{k} \cdot 2^{1-\binom{k}{2}}$$

我们希望这个概率 $< 1$，即：

$$\binom{n}{k} < 2^{\binom{k}{2}-1}$$

利用 $\binom{n}{k} \leq \frac{n^k}{k!} \leq \left(\frac{en}{k}\right)^k$：

当 $n = \lfloor 2^{k/2} \rfloor$ 时：
$$\binom{n}{k} \leq \frac{n^k}{k!} \leq \frac{2^{k^2/2}}{k!}$$

需要：
$$\frac{2^{k^2/2}}{k!} < 2^{k(k-1)/2 - 1} = 2^{k^2/2 - k/2 - 1}$$

即：
$$2^{k/2 + 1} < k!$$

这对 $k \geq 3$ 成立（验证：$k=3$ 时 $2^{2.5} \approx 5.66 < 6 = 3!$）。

因此当 $n \leq 2^{k/2}$ 时，存在无单色 $K_k$ 的二染色，即 $R(k,k) > 2^{k/2}$。

**下界比较**：
- 对角拉姆齐数：$R(k,k) > 2^{k/2}$（Erdős）
- 目前最好下界：$R(k,k) \geq (1+o(1))\frac{k}{e\sqrt{2}} 2^{k/2}$（改进常数）
- 上界：$R(k,k) \leq 4^{k-o(k)}$（已有多项改进）

### 10.4.2 无三角形的高色数图

**定理 10.14**（Erdős, 1959）：对任意正整数 $k$，存在围长大于 $k$ 且色数大于 $k$ 的图。

**证明思路**：

对充分大的 $n$，考虑随机图 $G(n, p)$，其中 $p = n^{\theta-1}$，$\theta$ 是小正数。

**步骤1**：控制短圈数量

对 $3 \leq i \leq k$，$i$-圈数 $X_i$ 的期望：
$$\mathbb{E}[X_i] = \frac{n(n-1)\cdots(n-i+1)}{2i} \cdot p^i \leq \frac{(np)^i}{2i} = \frac{n^{\theta i}}{2i}$$

短圈总数期望：
$$\mathbb{E}\left[\sum_{i=3}^k X_i\right] = O(n^{\theta k})$$

取 $\theta < 1/k$，则期望 $o(n)$。由马尔可夫，短圈数 $< n/2$ 概率 $> 1/2$。

**步骤2**：控制独立数

独立数 $\alpha(G)$ 的估计：对 $p = n^{\theta-1}$，

$$\mathbb{P}(\alpha(G) \geq t) \leq \binom{n}{t}(1-p)^{\binom{t}{2}} \leq n^t e^{-pt(t-1)/2}$$

取 $t = \frac{3\ln n}{p} = \frac{3\ln n}{n^{\theta-1}} = 3n^{1-\theta}\ln n$，可使该概率趋于0。

**步骤3**：综合

- 以概率 $> 1/2$：短圈数 $< n/2$
- 以概率 $\to 1$：$\alpha(G) < 3n^{1-\theta}\ln n$

因此存在图 $G$ 同时满足两者。从 $G$ 中删除每个短圈的一个顶点，得图 $G'$：
- $|V(G')| \geq n/2$
- 围长 $> k$
- 色数 $\chi(G') \geq \frac{|V(G')|}{\alpha(G')} \geq \frac{n/2}{3n^{1-\theta}\ln n} = \frac{n^{\theta}}{6\ln n}$

取 $n$ 充分大使该值 $> k$。

### 10.4.3 超图的性质

**定义 10.15**（超图）：$r$**-一致超图** $H = (V, E)$ 由顶点集 $V$ 和边集 $E \subseteq \binom{V}{r}$ 组成。

**定理 10.16**（超图二染色性）：设 $H$ 是 $r$-一致超图，若每条边与至多 $d$ 条其他边相交，且 $e(d+1) \leq 2^{r-1}$，则 $H$ 可二染色。

这是Lovász局部引理的直接应用，见10.7节。

---

## 10.5 线性与修补（Alterations）

### 10.5.1 基本修补方法

**修补技术**（Alteration/Deletion Method）是概率方法的增强版：

> **范式**：先随机构造对象，然后删除"坏"的部分，最后分析剩余部分。

**通用框架**：
1. 随机选取大集合 $X$
2. 识别 $X$ 中"坏"元素 $B \subseteq X$
3. 令 $Y = X \setminus B$
4. 证明 $Y$ 满足目标性质，且 $|Y|$ 足够大

### 10.5.2 Caro-Wei界（独立集大小）

**定理 10.17**（Caro-Wei界）：设 $G = (V, E)$ 是图，则：

$$\alpha(G) \geq \sum_{v \in V} \frac{1}{d(v) + 1}$$

其中 $d(v)$ 是顶点 $v$ 的度。

**证明**（概率方法+修补）：

随机排列 $V$ 的顶点，考虑集合：

$$I = \{v \in V : v \text{ 在排列中先于所有邻点}\}$$

**性质**：$I$ 是独立集（若 $u, v \in I$ 相邻，则排序矛盾）。

对顶点 $v$，$v \in I$ 当且仅当 $v$ 在 $\{v\} \cup N(v)$ 中最先出现。由于排列随机，该事件概率为：

$$\mathbb{P}(v \in I) = \frac{1}{d(v) + 1}$$

由期望线性性：

$$\mathbb{E}[|I|] = \sum_{v \in V} \frac{1}{d(v) + 1}$$

因此存在独立集大小至少为此值。

**推论 10.18**：对平均度为 $\bar{d}$ 的图：

$$\alpha(G) \geq \frac{n}{\bar{d} + 1}$$

### 10.5.3 图的色数上界

**定理 10.19**（色数上界）：设 $G$ 是最大度为 $\Delta$ 的图，则：

$$\chi(G) \leq \frac{n}{\alpha(G)} + \sqrt{2\Delta n}$$

更实用的界：若 $\alpha(G) \geq n/(\Delta+1)$（由Caro-Wei），则：

$$\chi(G) \leq \Delta + 1$$

这是平凡上界。更精细的概率方法可得Brooks定理：连通非完全非奇圈图满足 $\chi(G) \leq \Delta$。

**概率着色方法**：

对 $k$-可着色性，可尝试：随机划分顶点为 $k$ 部分，分析单色边数，用修补技术。

---

## 10.6 二阶矩方法

### 10.6.1 Chebyshev不等式

**定义 10.20**（方差）：随机变量 $X$ 的**方差**：

$$\text{Var}(X) = \mathbb{E}[(X - \mathbb{E}[X])^2] = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$$

**定理 10.21**（Chebyshev不等式）：对任意 $t > 0$：

$$\mathbb{P}(|X - \mathbb{E}[X]| \geq t) \leq \frac{\text{Var}(X)}{t^2}$$

**二阶矩方法**：若 $\text{Var}(X) = o(\mathbb{E}[X]^2)$，则 $X > 0$ 几乎必然（whp）。

形式化：若 $\mathbb{E}[X] \to \infty$ 且 $\text{Var}(X) = o(\mathbb{E}[X]^2)$，则 $\mathbb{P}(X = 0) \to 0$。

### 10.6.2 方差计算

对 $X = \sum_{i=1}^n X_i$，其中 $X_i$ 是指示变量：

$$\text{Var}(X) = \sum_{i=1}^n \text{Var}(X_i) + \sum_{i \neq j} \text{Cov}(X_i, X_j)$$

其中：
- $\text{Var}(X_i) = \mathbb{E}[X_i^2] - \mathbb{E}[X_i]^2 = p_i - p_i^2 \leq p_i$（对指示变量）
- $\text{Cov}(X_i, X_j) = \mathbb{E}[X_i X_j] - \mathbb{E}[X_i]\mathbb{E}[X_j]$

**关键观察**：若大部分 $X_i, X_j$ 对弱相关（协方差小），则方差可控。

### 10.6.3 随机图中的阈值现象

**定义 10.22**（随机图模型）：$G(n, p)$ 是 $n$ 顶点图，每对顶点独立地以概率 $p$ 连边。

**定义 10.23**（阈值函数）：函数 $p^*(n)$ 是性质 $\mathcal{P}$ 的**阈值**，如果：
- $p \ll p^*$ 时，$G(n, p)$ 几乎必然不满足 $\mathcal{P}$
- $p \gg p^*$ 时，$G(n, p)$ 几乎必然满足 $\mathcal{P}$

**定理 10.24**（三角形出现的阈值）：$G(n, p)$ 中三角形出现的阈值是 $p^* = 1/n$。

**证明**：设 $X$ 是三角形数，$X = \sum_{T} X_T$，$T$ 遍历所有 $\binom{n}{3}$ 个三元组。

$$\mathbb{E}[X] = \binom{n}{3} p^3 \asymp n^3 p^3$$

- 若 $p = o(1/n)$：$\mathbb{E}[X] \to 0$，由一阶矩方法，$X = 0$ whp
- 若 $p = \omega(1/n)$：$\mathbb{E}[X] \to \infty$，需证 $X > 0$ whp

**方差计算**（$p = c/n$）：

$$\text{Var}(X) = \sum_T \text{Var}(X_T) + \sum_{T \neq T'} \text{Cov}(X_T, X_{T'})$$

- $\text{Var}(X_T) \leq \mathbb{E}[X_T] = p^3$
- 若 $|T \cap T'| \leq 1$：$X_T, X_{T'}$ 独立，协方差为0
- 若 $|T \cap T'| = 2$：$T \cup T'$ 有5个顶点，$\mathbb{E}[X_T X_{T'}] = p^5$

$$\sum_{|T \cap T'| = 2} \text{Cov}(X_T, X_{T'}) \leq n^4 p^5 = O(n^4/n^5) = O(1/n)$$

因此：

$$\text{Var}(X) = O(n^3 p^3) + O(n^4 p^5) = O(1)$$

而 $\mathbb{E}[X] \to c^3/6$，由Chebyshev，$X$ 集中在期望附近，故 $X > 0$ whp。

**一般阈值定理**（Bollobás–Thomason）：每个单调图性质都有阈值函数。

---

## 10.7 Lovász局部引理（LLL）

### 10.7.1 对称形式的局部引理

**依赖图**：事件 $A_1, \ldots, A_n$ 的**依赖图**是图 $D$，顶点是事件，边表示依赖关系：$A_i$ 与 $A_j$ 独立（当 $i \neq j$ 且 $\{i,j\} \notin E(D)$）给定所有其他事件。

**定义 10.25**（依赖度）：事件 $A$ 的**依赖度**是依赖图中其邻居数的上界，记为 $d$。

**定理 10.26**（Lovász局部引理，对称形式）：设 $A_1, \ldots, A_n$ 是概率空间中的事件，每个 $A_i$ 依赖度至多为 $d$，且 $\mathbb{P}(A_i) \leq p$。若

$$ep(d+1) \leq 1$$

则

$$\mathbb{P}\left(\bigcap_{i=1}^n \overline{A_i}\right) > 0$$

即存在避免所有"坏"事件的实例。

**直观**：若每个坏事件概率小且依赖少，则所有坏事件可同时避免。

### 10.7.2 非对称形式的局部引理

**定理 10.27**（非对称LLL）：设 $A_1, \ldots, A_n$ 有依赖图 $D$。若存在 $x_1, \ldots, x_n \in (0, 1)$ 使得对所有 $i$：

$$\mathbb{P}(A_i) \leq x_i \prod_{j: (i,j) \in E(D)} (1 - x_j)$$

则：

$$\mathbb{P}\left(\bigcap_{i=1}^n \overline{A_i}\right) \geq \prod_{i=1}^n (1 - x_i) > 0$$

**特例**：若取所有 $x_i = 1/(d+1)$，对称形式可由非对称形式推出。

### 10.7.3 应用：超图的可二染色性

**定理 10.28**：设 $H$ 是 $r$-一致超图，若每条边与至多 $2^{r-1}/e - 1$ 条其他边相交，则 $H$ 可二染色。

**证明**（对称LLL）：

随机二染色顶点。对边 $e$，令 $A_e$ 表示"$e$ 单色"的事件，$\mathbb{P}(A_e) = 2/2^r = 2^{1-r}$。

依赖图：$A_e$ 与 $A_f$ 独立若 $e \cap f = \emptyset$。因此依赖度 $d \leq 2^{r-1}/e - 1$。

验证条件：

$$ep(d+1) \leq e \cdot 2^{1-r} \cdot \frac{2^{r-1}}{e} = 1$$

由LLL，$\mathbb{P}(\text{无单色边}) > 0$，即可二染色。

### 10.7.4 应用：k-SAT问题的可满足性

**定义 10.29**（k-SAT）：$k$-SAT公式是合取范式，每个子句恰含 $k$ 个文字。可满足性（SAT）问题是判定是否存在满足赋值。

**定理 10.30**：设 $\phi$ 是 $k$-SAT公式，若每个子句与至多 $2^k/(ek) - 1$ 个子句共享变量，则 $\phi$ 可满足。

**证明**（非对称LLL）：

随机均匀赋值。对子句 $C$，$A_C$ 表示"$C$ 不满足"。$\mathbb{P}(A_C) = 2^{-k}$。

依赖度：$C$ 依赖含其变量的子句，$d \leq k \cdot (2^k/(ek) - 1) < 2^k/e$。

验证 $ep(d+1) \leq 1$ 即可。

### 10.7.5 Shearer改进

**定理 10.31**（Shearer, 1985）：LLL的边界 $ep(d+1) \leq 1$ 可改进。Shearer确定了精确的适用区域。

**关键改进**：定义多项式 $q_d(p) = (d+1)p \cdot q_{d-1}(p) + p$，其中 $q_0(p) = 1$。若 $q_d(p) < 1/e$，则LLL结论成立。

这给出了比 $ep(d+1) \leq 1$ 更弱的条件。

### 10.7.6 Moser-Tardos算法（算法版本的LLL）

**问题**：原始LLL是非构造性的，如何高效找到满足赋值？

**定理 10.32**（Moser-Tardos, 2010）：在变量模型（每个坏事件由变量子集决定）下，若满足对称LLL条件，则以下算法以期望线性时间找到满足赋值：

**Moser-Tardos算法**：
```
1. 随机初始化所有变量
2. while 存在发生的坏事件 A:
       重采样 A 的所有变量（均匀随机）
3. return 当前赋值
```

**期望重采样次数**：至多 $\sum_i \frac{x_i}{1-x_i}$，其中 $x_i$ 是LLL条件中的参数。

**分析要点**：
- 将执行过程编码为**重采样表**（resampling table）
- 建立与**witness tree**的一一对应
- 证明坏witness tree的期望数量有限

**推广**：算法LLL适用于：
- 超图二染色（找到染色方案）
- SAT求解（找到满足赋值）
- 各种组合构造（显式构造先前仅知存在的对象）

---

## 总结

概率方法是现代组合数学的核心工具，其主要技术包括：

| 技术 | 核心思想 | 典型应用 |
|------|----------|----------|
| **第一矩方法** | $\mathbb{E}[X] < 1 \Rightarrow X = 0$ 有可能 | 存在性证明、上界 |
| **第二矩方法** | $\text{Var}(X) = o(\mathbb{E}[X]^2) \Rightarrow X > 0$ whp | 阈值现象、下界 |
| **修补方法** | 随机构造+删除坏部分 | 独立集、支配集 |
| **Lovász局部引理** | 弱依赖的坏事件可同时避免 | 染色、SAT、划分 |

这些方法不仅提供了存在性证明，通过Moser-Tardos等算法还获得了显式构造，深刻改变了组合数学的研究范式。

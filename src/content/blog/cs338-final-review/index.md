---
title: "CS338 计算理论导论期末复习"
description: "SUSTech CS338 Introduction to Theory of Computation 期末复习：DFA/NFA/正则表达式、CFG/PDA、图灵机、可判定性、复杂度与答题模板。"
date: "2026-06-20"
draft: false
tags:
  - "SUSTech"
  - "CS338"
  - "计算理论"
  - "期末复习"
column: "期末复习"
---

更系统的笔记见 [计算理论导论系统笔记](/blog/itc)。

这份复习覆盖 `ppts/` 全部课件、`Week1` 至 `Week13` 的作业题面与 LaTeX/PDF 答案，以及 `answers/` 中 Assignment 1–13 的官方答案。建议先看第 0 节答题规范，再按 DFA/NFA/RE → CFL/PDA → TM/可判定性 → 复杂度的顺序复习。

---

## 0. 考试答题规范：不要只写结论

如果题目要求 "use the construction proof"，必须给出新机器/新文法的完整形式，不能只画直觉图或说"显然封闭"。

### DFA 乘积构造模板（交、并、差、对称差）

给定
$$
M_1=(Q_1,\Sigma,\delta_1,q_1,F_1),\quad
M_2=(Q_2,\Sigma,\delta_2,q_2,F_2).
$$

构造
$$
M=(Q_1\times Q_2,\Sigma,\delta,(q_1,q_2),F)
$$

其中
$$
\delta((r,s),a)=(\delta_1(r,a),\delta_2(s,a)).
$$

按目标语言设置接受态：

- 交集：$F=F_1\times F_2$
- 并集：$F=(F_1\times Q_2)\cup(Q_1\times F_2)$
- 差集：$F=F_1\times(Q_2-F_2)$
- 对称差：$F=(F_1\times(Q_2-F_2))\cup((Q_1-F_1)\times F_2)$

正确性：读入同一前缀后，第一分量正是 $M_1$ 的状态，第二分量正是 $M_2$ 的状态，因此接受条件等价于目标布尔组合。

### NFA 并/连接/星号构造模板

- **并**：新起始态 $q_0$，从 $q_0$ 用 $\epsilon$-transition 到两个旧起始态；接受态为两个 NFA 接受态的并集。
- **连接**：从第一个 NFA 的每个接受态用 $\epsilon$-transition 到第二个 NFA 的起始态；接受态为第二个 NFA 的接受态。
- **Star**：新起始态也是接受态；从新起始态 $\epsilon$ 到旧起始态；从每个旧接受态 $\epsilon$ 回旧起始态。
- **单接受态**：新增唯一接受态 $q_a$，从所有旧接受态 $\epsilon$ 到 $q_a$，原接受态取消接受。

### 子集构造模板

给 NFA $N=(Q,\Sigma,\delta,q_0,F)$，构造 DFA $D=(2^Q,\Sigma,\delta',E(q_0),F')$。

若有 $\epsilon$-transition，则
$$
\delta'(S,a)=E\left(\bigcup_{q\in S}\delta(q,a)\right).
$$

接受态：
$$
F'=\{S\subseteq Q\mid S\cap F\neq\emptyset\}.
$$

作业里需要列出可达子集和转移表，不要只写"用 subset construction"。

### CFG → PDA 模板

构造 PDA 用栈模拟最左推导：

1. 初始先压入底符号 `$`，再压入起始变量 $S$。
2. 对每条产生式 $A\to u$，加 $\epsilon,A\to u^R$ 的替换路径（多符号压栈要拆成多个中间状态）。
3. 对每个终结符 $a$，加读入并匹配的转移 $a,a\to\epsilon$。
4. 栈底 `$` 被弹出且输入读完时接受。

### PDA → CFG 模板

先保证 PDA 只有一个接受态且接受前清空栈。变量 $A_{pq}$ 表示从状态 $p$ 到 $q$ 并清空所压栈内容的所有字符串：

- 基础规则：$A_{pp}\to\epsilon$
- 连接规则：$A_{pq}\to A_{pr}A_{rq}$
- 匹配规则：若 $p\xrightarrow{a,\epsilon\to t}r$ push $t$，且 $s\xrightarrow{b,t\to\epsilon}q$ pop $t$，则
  $$
  A_{pq}\to aA_{rs}b.
  $$

### 归约证明模板

要证明目标 $B$ 难，必须从已知难问题 $A$ 归约到 $B$：$A\le_m B$ 或 $A\le_p B$。

1. 说明已知 $A$ 的性质，例如 $A_{TM}$ undecidable，或 3SAT NP-complete。
2. 给出输入 $x$ 到实例 $f(x)$ 的构造，且构造可计算/多项式时间。
3. 证明双向：$x\in A \iff f(x)\in B$。
4. 结论：若 $B$ 可解，则 $A$ 可解，矛盾；或 $B$ NP-hard。若还要 NP-complete，必须再证明 $B\in NP$。

### Pumping Lemma 答题模板

**证明非正则：**

1. 假设 $L$ 正则，令 $p$ 为 pumping length。
2. 选 $w\in L$ 且 $|w|\ge p$。
3. 任取分解 $w=xyz$，满足 $|xy|\le p, |y|>0$。
4. 由 $|xy|\le p$ 定位 $y$ 在某一块内。
5. 选 $i=0$ 或 $i=2$，证明 $xy^iz\notin L$，矛盾。

**证明非 CFL：**

1. 假设 $L$ 是 CFL，令 $p$ 为 CFL pumping length。
2. 选 $s\in L$，分解 $s=uvxyz$，满足 $|vxy|\le p, |vy|\ge 1$。
3. 由于 $|vxy|\le p$，它最多跨越有限相邻块。
4. 分情况或统一说明 pumping 改变局部块，破坏全局相等/比例关系。
5. 选 $i=0$ 或 $i=2$，得到 $uv^ixy^iz\notin L$。

---

## 1. DFA 与正则语言

### DFA 定义与接受

DFA 是五元组
$$
M=(Q,\Sigma,\delta,q_0,F)
$$

其中 $Q$ 是有限状态集，$\Sigma$ 是字母表，$\delta:Q\times\Sigma\to Q$，$q_0$ 是初始态，$F\subseteq Q$ 是接受态。

DFA 接受 $w=w_1\cdots w_n$，当且仅当存在状态序列
$$
r_0=q_0,\quad r_{i+1}=\delta(r_i,w_{i+1}),\quad r_n\in F.
$$

语言 $L(M)=\{w\mid M\text{ accepts }w\}$。若某语言被某 DFA 识别，则它是 regular language。

### 设计 DFA 的常用状态含义

复习时不要背图，背"状态记录什么信息"：

- 以某串结尾：状态记录最长后缀匹配了目标串多少位。例如 contains `0101`，状态记录已匹配 ``、`0`、`01`、`010`、`0101`。
- 至少/至多出现次数：状态记录计数并在阈值处吸收，例如至少四个 `1` 用 $0,1,2,3,\ge4$ 五类。
- 奇偶性：两个状态来回切换。
- "以 0 开头且以 1 结尾"：先记住开头是否合法，再记录最后一个字符。
- "不含某 substring"：先构造"含该 substring" 的 DFA，再取补集；或直接设置陷阱态。
- 交集语言：先构造两个简单 DFA，再做乘积构造。

### 正则运算与闭包

正则语言对并、交、补、差、连接、Kleene star 封闭。

- 并/交/差/补：DFA 层面最直接，使用乘积或翻转接受态。
- 连接/星号：NFA 层面最自然，使用 $\epsilon$-transition。
- 反转 $A^R$：正则表达式结构归纳最直接：
  $$
  (R_1\cup R_2)^R=R_1^R\cup R_2^R,\quad
  (R_1R_2)^R=R_2^RR_1^R,\quad
  (R^*)^R=(R^R)^*.
  $$

### Assignment 1 要点

官方答案要求把图转为形式化描述。写 DFA 形式化描述时必须列：$Q$、$\Sigma$、$\delta$ 表格、$q_0$、$F$。

典型语言：begins with `0` and ends with `1`、contains at least four `1`s、contains substring `0101`、length at least 4 and fourth symbol is `1`、starts with `1` and has odd length or starts with `0` and has even length、contains at least two `0`s and at most one `1`、空语言、all strings except $\epsilon$。

补集构造：

- 不含 `ba`：先构造含 `ba` 的 DFA，再翻转接受态。
- 既不含 `ab` 也不含 `ba`：等价于 $a^*\cup b^*$。
- 不在 $b^*a^*$ 中：等价于含 substring `ab`。

交集构造：

- 至少两个 `a` 且至少三个 `b`：状态 $(i,j)$，其中 $i\in\{0,1,\ge2\}$，$j\in\{0,1,2,\ge3\}$。
- 偶数个 `a` 且一个或两个 `b`：记录 `a` parity 和 `b` count $0,1,2,\ge3$。
- 以 `a` 开头且至多两个 `b`：先判断首字符，再计数 `b`。

---

## 2. NFA、正则表达式、GNFA

### NFA 定义

NFA 仍是五元组，但转移函数为
$$
\delta:Q\times(\Sigma\cup\{\epsilon\})\to\mathcal P(Q).
$$

NFA 接受一个串，只要存在一条路径，路径标签（去掉 $\epsilon$）等于该串且终点在接受态。

### NFA 与 DFA 等价

核心定理：若 NFA 识别 $A$，则 $A$ 正则。证明用 subset construction。有 $\epsilon$-transition 时必须使用 $\epsilon$-closure。

### NFA 转 DFA：subset construction 完整写法

给定 $N=(Q,\Sigma,\delta,q_0,F)$。若 $N$ 有 $\epsilon$-transition，先定义
$$
E(R)=\{q\in Q\mid q\text{ 可由 }R\text{ 中某状态只通过 }\epsilon\text{-move 到达}\}.
$$

构造 DFA $D=(Q_D,\Sigma,\delta_D,q_D,F_D)$：

1. 起始态：$q_D=E(\{q_0\})$。
2. 对每个已发现的子集状态 $S\subseteq Q$ 和每个输入符号 $a\in\Sigma$，计算
   $$
   \operatorname{Move}(S,a)=\bigcup_{q\in S}\delta(q,a),
   $$
   再令 $\delta_D(S,a)=E(\operatorname{Move}(S,a))$。
3. 若新集合还没出现，把它加入待处理队列。只列可达子集即可；若题目要求 complete DFA，则 $\emptyset$ 也要作为死状态列出。
4. 接受态：$F_D=\{S\in Q_D\mid S\cap F\neq\emptyset\}$。

正确性：对任意输入串 $w$，DFA 读完 $w$ 后所在的子集，恰好等于 NFA 从 $q_0$ 读完 $w$ 后可能处在的所有状态的 $\epsilon$-closure。因此该子集与 $F$ 相交，当且仅当 NFA 有某条接受路径。

### NFA 转 DFA 示例：以 `01` 结尾

NFA：$Q=\{q_0,q_1,q_2\}$，$\Sigma=\{0,1\}$，$q_0$ start，$F=\{q_2\}$。
转移：$\delta(q_0,0)=\{q_0,q_1\}$，$\delta(q_0,1)=\{q_0\}$，$\delta(q_1,1)=\{q_2\}$。

令 $A=\{q_0\}$，$B=\{q_0,q_1\}$，$C=\{q_0,q_2\}$。转移表：

| DFA state | on `0` | on `1` | accepting? |
|---|---|---|---|
| $A=\{q_0\}$ | $B$ | $A$ | no |
| $B=\{q_0,q_1\}$ | $B$ | $C$ | no |
| $C=\{q_0,q_2\}$ | $B$ | $A$ | yes |

$C$ 接受是因为 $C\cap\{q_2\}\neq\emptyset$，不是因为集合中所有 NFA 状态都接受。

### 正则表达式

正则表达式递归定义：$\emptyset,\epsilon,a$ 是正则表达式；若 $R_1,R_2$ 是，则 $R_1\cup R_2$、$R_1R_2$、$R_1^*$ 也是。

Kleene theorem：
$$
\text{regular language}\iff \text{DFA/NFA}\iff \text{regular expression}.
$$

### Thompson 构造与状态消除

- **RE → NFA**：对基础表达式建小 NFA，再递归处理 union/concat/star。
- **DFA/NFA → RE**：转 GNFA 后消状态。消去状态 $q$ 时，对任意 $i,j$ 更新边标签：
  $$
  R_{ij}\leftarrow R_{ij}\cup R_{iq}(R_{qq})^*R_{qj}.
  $$

作业中必须写添加新 start、新 accept、逐步消状态，不能只给最终正则式。

### Assignment 2 要点

NFA 构造要点：

- ends with `00`：三态；起点可在任意处猜测倒数两个 `0` 的开始。
- contains `0101`：五态；匹配进度 0 到 4。
- even number of `0`s or exactly two `1`s：用新起点 $\epsilon$ 分支到两个子 NFA。
- $\{0\}$：两态，读一个 `0` 接受。
- $0^*1^*0^+$：三态，注意最后的 $0^+$ 至少一个 `0`。
- $1^*(001^+)^*$：起点接受，读 `00` 后必须至少一个 `1` 回到起点。
- $\{\epsilon\}$：单个起始接受态。
- $0^*$：单个起始接受态，`0` 自环。

Closure construction 必须按证明构造：并、连接、star、single accept state。

### Assignment 3 要点

正则表达式速记：

- starts with `1`, ends with `0`：$1\Sigma^*0$
- at least three `1`s：$\Sigma^*1\Sigma^*1\Sigma^*1\Sigma^*$
- contains `0101`：$\Sigma^*0101\Sigma^*$
- third symbol is `0`：$\Sigma^2 0\Sigma^*$
- length at most 5：$(\Sigma\cup\epsilon)^5$
- strings of positive length：$\Sigma^+$
- empty language：$\emptyset$

注释语言 $C$：以 `/#` 开始，以 `#/` 结束，中间不能提前出现 `#/`。可简记为
$$
/\#(\#^*(a\cup b)\cup /)^*\#^+/
$$

关键状态含义：在 body 中看到 `#` 后，若下一个是 `/` 就结束；若是 `a,b,#` 则继续。

---

## 3. 非正则语言与 Pumping Lemma

### 正则 Pumping Lemma

若 $L$ 正则，则存在 $p$，任意 $w\in L, |w|\ge p$，可写为 $w=xyz$，满足：
$$
|xy|\le p,\quad |y|>0,\quad \forall i\ge0,\ xy^iz\in L.
$$

它只能证明"非正则"，不能证明"正则"。

### 标准证明

- $\{1^n2^n3^n\mid n\ge0\}$ 非正则：取 $w=1^p2^p3^p$。由 $|xy|\le p$，$y=1^\ell,\ell>0$。泵 $i=2$ 后得到 $1^{p+\ell}2^p3^p$，三段数量不相等，矛盾。
- $\{www\mid w\in\{a,b\}^*\}$：取 $w=(a^pb^p)^3$。由于 $|xy|\le p$，$y$ 位于第一段 $a$ 中，泵后第一段变长，不能再分成三个完全相同的块。
- $\{a^{2^n}\mid n\ge0\}$ 非正则：取 $w=a^{2^p}$，$y=a^\ell$，且 $1\le\ell\le p$。泵 $i=2$ 后长度为 $2^p+\ell$，满足 $2^p<2^p+\ell\le2^p+p<2^{p+1}$，夹在连续两个 2 的幂之间，矛盾。
- 为什么不能用 $0^p1^p$ 证明 $0^*1^*$ 非正则：泵 $0^p1^p$ 的前段 0 后仍是 $0^*1^*$。你证明的是不在 $\{0^k1^k\}$，不是不在 $0^*1^*$。
- $\{0^m1^m0^m\mid m\ge0\}$ 非正则：取 $w=0^p1^p0^p$，$y$ 在第一段 0 内，泵 $i=2$ 后前后 0 数量不同。
- $\{0^m1^n\mid m\ne n\}$ 非正则：用闭包。若 $L$ 正则，则 $\overline L\cap 0^*1^*$ 正则。但 $\overline L\cap 0^*1^*=\{0^n1^n\mid n\ge0\}$ 非正则，矛盾。
- 出现 `01` 次数等于 `10` 次数的语言是正则：次数相等 iff $w\in\{\epsilon,0,1\}$ 或首尾字符相同。正则式：$\{\epsilon,0,1\}\cup0\Sigma^*0\cup1\Sigma^*1$。
- $C=\{1^k y\mid y\text{ 中 1 的个数}\le k\}$ 非正则：取 $w=1^p01^p$，前缀 $1^p$ 作 $k=p$。泵掉前面的 $y=1^\ell$ 后，开头最多 $p-\ell$ 个 1，但后缀仍有 $p$ 个 1，违反条件。

---

## 4. CFG、CFL、PDA

### CFG 定义

CFG 为
$$
G=(V,\Sigma,R,S)
$$

其中 $V$ 是变量，$\Sigma$ 是终结符，$R$ 是产生式，$S$ 是起始变量。若一个字符串有两棵不同 parse tree，则文法 ambiguous。

### 常用 CFG

- 至少三个 `1`：
  $$
  S\to R1R1R1R,\quad R\to0R\mid1R\mid\epsilon.
  $$
- 以相同符号开始和结尾：
  $$
  S\to1R1\mid0R0\mid0\mid1,\quad R\to0R\mid1R\mid\epsilon.
  $$
- 奇数长度：
  $$
  S\to0S0\mid0S1\mid1S0\mid1S1\mid0\mid1.
  $$
- 奇数长度且中间符号为 0：
  $$
  S\to0S0\mid0S1\mid1S0\mid1S1\mid0.
  $$
- 回文：
  $$
  S\to0S0\mid1S1\mid0\mid1\mid\epsilon.
  $$
- 空语言：可用 $S\to S$ 或无接受路径的 PDA。

### CNF

Chomsky Normal Form 只允许：
$$
A\to BC,\quad A\to a
$$

如果语言含 $\epsilon$，允许新起始符号 $S_0\to\epsilon$。

转换步骤：

1. 加新起始变量 $S_0\to S$。
2. 消除 $\epsilon$-productions。
3. 消除 unit productions。
4. 长右部拆成二元变量，终结符替换成单独变量。

若 CFG 在 CNF 中，推导长度为 $|w|$ 的非空串时恰好需要 $2|w|-1$ 步：$|w|-1$ 次 $A\to BC$ 让变量叶子数从 1 增到 $|w|$，再 $|w|$ 次 $A\to a$ 生成终结符。

### PDA

PDA 转移记为 $a,X\to\gamma$，表示读入 $a$（可为 $\epsilon$），弹出 $X$（可为空），压入 $\gamma$。

核心等价：
$$
\text{CFL}\iff\text{某 PDA 识别}.
$$

### CFG 转 PDA：完整构造

给定 $G=(V,\Sigma,R,S)$，构造 PDA $P$，栈里保存"还需要匹配或展开的 sentential form"。PDA 的状态可取 $Q=\{q_{\mathrm{start}},q,q_{\mathrm{acc}}\}$，栈字母表 $\Gamma=V\cup\Sigma\cup\{\$\}$。

核心转移：

1. 初始化：$q_{\mathrm{start}}\xrightarrow{\epsilon,\$\to S\$}q$。
2. 展开变量：对每条产生式 $A\to X_1X_2\cdots X_k$，加转移 $q\xrightarrow{\epsilon,A\to X_1X_2\cdots X_k}q$。若只能逐个压栈，按 $X_k,X_{k-1},\ldots,X_1$ 顺序压，使最后 $X_1$ 在栈顶。若 $A\to\epsilon$，则加 $q\xrightarrow{\epsilon,A\to\epsilon}q$。
3. 匹配终结符：对每个 $a\in\Sigma$，加 $q\xrightarrow{a,a\to\epsilon}q$。
4. 接受：$q\xrightarrow{\epsilon,\$\to\epsilon}q_{\mathrm{acc}}$。

正确性：PDA 每次用 $A\to u$ 替换栈顶变量，正好对应 CFG 最左推导中的一步；每次读入终结符 $a$ 并弹出 $a$，正好确认当前推导出的最左终结符与输入一致。

### PDA 转 CFG：完整构造

先把 PDA 改成等价的规范形式：只有一个接受态 $q_{\mathrm{acc}}$；接受前栈必须为空；每个转移只做 push 或 pop 一个栈符号。

为每一对状态 $p,q\in Q$ 建变量 $A_{pq}$，含义：从 $p$ 空栈到 $q$ 空栈的所有字符串。起始变量是 $A_{q_0q_{\mathrm{acc}}}$。

产生式分三类：

1. 空计算：$A_{pp}\to\epsilon$，对每个 $p\in Q$。
2. 串接计算：$A_{pq}\to A_{pr}A_{rq}$，对所有 $p,r,q\in Q$。
3. push-pop 配对：若有 $p\xrightarrow{a,\epsilon\to t}r$ 和 $s\xrightarrow{b,t\to\epsilon}q$，则加 $A_{pq}\to aA_{rs}b$。

### CFL 闭包与非闭包

CFL 对并、连接、Kleene star 封闭。证明可用 CFG：

- 并：新起始变量 $S\to S_1\mid S_2$。
- 连接：$S\to S_1S_2$。
- Star：$S\to S_1S\mid\epsilon$。

每个正则语言都是 CFL：对正则表达式结构归纳。

CFL 不对交和补封闭：

- 取 $A=\{a^mb^nc^n\mid m,n\ge0\}$，$B=\{a^nb^nc^m\mid m,n\ge0\}$。二者都是 CFL，但 $A\cap B=\{a^nb^nc^n\mid n\ge0\}$ 不是 CFL。
- 若 CFL 对补封闭，则由 De Morgan 与并封闭可推出对交封闭，矛盾。

CFL 与正则语言的交封闭：给 PDA $P$ 和 DFA $D$，构造乘积 PDA，状态为 $(q_P,q_D)$，栈行为照 PDA，读入符号时同时更新 DFA；接受态为 $F_P\times F_D$。

### CFL Pumping Lemma

若 $L$ 是 CFL，则存在 $p$，任意足够长 $s\in L$ 可写为 $s=uvxyz$，满足
$$
|vxy|\le p,\quad |vy|\ge1,\quad \forall i\ge0,\ uv^ixy^iz\in L.
$$

标准证明：

- $\{0^n1^n0^n1^n\}$ 非 CFL：取 $0^p1^p0^p1^p$。因 $|vxy|\le p$，只影响至多两个相邻块。泵后至少一个块长度变，另有块保持 $p$，四段无法同为 $n$。
- $\{0^n\#0^{2n}\#0^{3n}\}$ 非 CFL：取 $0^p\#0^{2p}\#0^{3p}$。$vxy$ 不可能跨两个 `#`，只改变局部一段或相邻两段，泵后比例 $1:2:3$ 被破坏。

---

## 5. Turing Machines 与 Church-Turing

### TM 定义

标准 TM：
$$
M=(Q,\Sigma,\Gamma,\delta,q_0,q_{accept},q_{reject})
$$

其中 $\Gamma$ 是 tape alphabet，$\sqcup\in\Gamma$，$\Sigma\subseteq\Gamma-\{\sqcup\}$，
$$
\delta:Q\times\Gamma\to Q\times\Gamma\times\{L,R\}.
$$

配置写作 $uqv$：带内容为 $uv$，当前状态 $q$，读写头在 $v$ 的第一个字符上。

### Decider vs Recognizer

- Decider：所有输入都 halt，接受 $L$ 中输入，拒绝非 $L$ 输入。
- Recognizer：$L$ 中输入会 accept；非 $L$ 输入可以 reject 或 loop。
- Decidable $\Rightarrow$ Turing-recognizable。
- $A$ decidable iff $A$ 和 $\overline A$ 都 Turing-recognizable。

### TM 变体

PPT 覆盖的等价模型：

- 多带 TM 等价于单带 TM。
- NTM 等价于 DTM（可模拟所有计算分支）。
- Enumerator 与 TM 识别器等价。
- Church-Turing thesis：直观可算法计算的函数可由 TM 计算。

作业中重要变体：

- **2-PDA 识别 $\{a^nb^nc^n\}$**：读 `a` 时压 stack1；读 `b` 时压 stack2；读 `c` 时同时弹两个栈；输入结束且两栈空则接受。这说明 2-PDA 比 1-PDA 强。
- **Left-reset TM 模拟普通左移**：用标记法，reset 到最左端，逐步找当前格前一格，用额外标记推进候选前驱。
- **只能右移/停留或输入只读的 TM**：识别能力退化为正则语言。证明思路：构造等价有限自动机，状态编码 TM 从当前位置向右移动后的有限控制状态。

### TM 设计算法题

- 识别 $\{a^nb^nc^n\}$：循环扫描，找未标记 `a` 改为 `X`，向右找未标记 `b` 改为 `Y`，再找未标记 `c` 改为 `Z`，回到左端；最后确认没有未标记 `a,b,c` 且顺序合法。
- $\#0=\#1$：反复找一个未标记 0 和一个未标记 1 配对标记。
- $\#0=2\#1$：每找一个 `1`，匹配两个 `0`。
- 补语言：若已有 decider，可翻转 accept/reject；若只是 recognizer，不能直接补。
- 二进制减一：移到最右，从右向左把连续 0 改成 1，遇到第一个 1 改成 0 后停。
- 二进制减法 $x-y$：重复对 $x$ 和 $y$ 执行减一，直到 $y=0$。
- 整数除法 $\lfloor x/y\rfloor$：多带 TM 上重复减 $y$，计数 quotient。

---

## 6. Decidability 与 Undecidability

### 可判定语言

经典可判定问题：

- $A_{DFA}=\{\langle M,w\rangle\mid M\text{ is a DFA and accepts }w\}$
- $A_{NFA}$, $A_{REX}$
- $E_{DFA}=\{\langle M\rangle\mid L(M)=\emptyset\}$
- $EQ_{DFA}$
- $A_{CFG}$, $E_{CFG}$

典型算法：

- $A_{DFA}$：直接模拟 DFA。
- $A_{NFA}$：转 DFA 或图搜索所有 NFA 分支。
- $A_{REX}$：RE → NFA → DFA，再判定。
- $E_{DFA}$：从 start 做 BFS，看是否能到接受态。
- $EQ_{DFA}$：构造对称差 DFA，判空。
- $A_{CFG}$：转 CNF 后 CYK/dynamic programming。
- $E_{CFG}$：标记能生成终结串的变量，看 start 是否被标记。

### 重要结论

- **$ALL_{DFA}$ 可判定**：构造识别 $\overline{L(A)}$ 的 DFA $M$，运行 $E_{DFA}$。若补语言为空，则 $L(A)=\Sigma^*$。
- **$A_{\epsilon CFG}$ 可判定**：运行 $A_{CFG}$ 于 $\langle G,\epsilon\rangle$，或转 CNF 后检查是否有 $S\to\epsilon$。
- **$\overline{E_{TM}}$ Turing-recognizable**：枚举所有字符串，dovetail 模拟，一旦某个输入被接受就接受。
- **$EQ_{DFA}$ 有限测试上界**：若 $A,B$ 有 $n_1,n_2$ 个状态，对称差 DFA 有 $n_1n_2$ 个状态。若存在区分串，则存在长度小于 $n_1n_2$ 的区分串。

### Diagonalization 与 $A_{TM}$

$$
A_{TM}=\{\langle M,w\rangle\mid M\text{ accepts }w\}
$$

是 Turing-recognizable 但 undecidable。

Recognizer：通用 TM 模拟 $M(w)$，若 $M$ accept 则 accept，若 reject 则 reject，若 loop 则 loop。

不可判定证明：

1. 假设 $H$ decides $A_{TM}$。
2. 构造 $D$：输入 $\langle M\rangle$，运行 $H(\langle M,\langle M\rangle\rangle)$。若 $H$ accept，则 $D$ reject；若 $H$ reject，则 $D$ accept。
3. 运行 $D(\langle D\rangle)$ 得矛盾。

$\overline{A_{TM}}$ 不是 Turing-recognizable。否则 $A_{TM}$ 和其补都 recognizable，可并行运行得到 decider，矛盾。

### Reducibility

映射归约 $A\le_m B$：存在可计算函数 $f$，使得 $w\in A\iff f(w)\in B$。

性质：

- 若 $A\le_m B$ 且 $B$ decidable，则 $A$ decidable。
- 若 $A\le_m B$ 且 $A$ undecidable，则 $B$ undecidable。
- 若 $A\le_m B$ 且 $B$ T-recognizable，则 $A$ T-recognizable。
- 若 $A\le_m B$ 且 $A$ T-unrecognizable，则 $B$ T-unrecognizable。

### Rice Theorem

任何关于 $L(M)$ 的非平凡性质都是 undecidable。非平凡：有些 TM 的语言满足该性质，有些不满足。

注意：Rice 只适用于"语言性质"，不适用于"TM 语法性质"如状态数是否大于 481。

应用：$L(M)$ infinite、$1011\in L(M)$、$L(M)=\Sigma^*$ 都是 undecidable。

### Assignment 9-10 要点

- **$\{0,1,2\}^{\mathbb N}$ 不可数**：对角线构造新序列，第 $i$ 位取不同于 $f(i)$ 第 $i$ 位的符号。
- **三元组集合可数**：按 $i+j+k=n$ 分层，每层有限，先列和小的。
- **"TM 是否会在空白带上写非空符号"可判定**：模拟 $|Q|+1$ 步，若没写且状态重复则之后永远重复。
- **"TM 是否至少 481 个状态"可判定**：语法性质，直接解析编码计数。
- **DFA 是否不接受任何偶数个 1 的串**：构造 DFA $A$ 接受偶数个 1 的串，构造 $M\cap A$，运行 $E_{DFA}$ 判空。
- **$\overline{EQ_{CFG}}$ Turing-recognizable**：枚举所有字符串 $w$，运行 $A_{CFG}$ 判断 $w$ 是否由 $G_1,G_2$ 生成；若结果不同则接受。
- **若 $A$ T-recognizable 且 $A\le_m\overline A$，则 $A$ decidable**：由归约 $w\in\overline A \iff f(w)\in A$，可 recognize $\overline A$，故 $A$ 与 $\overline A$ 都 recognizable。
- **判定 halts on empty input 不可判定**：从 $HALT_{TM}$ 归约。给 $\langle M,w\rangle$，构造 $M'$：在空输入上模拟 $M(w)$，若 halt 则 halt，否则 loop。

---

## 7. Time Complexity 与 P

### 时间复杂度

TM 在时间 $t(n)$ 内运行：对所有长度 $n$ 输入，最多 $t(n)$ 步内 halt。

$$
TIME(t(n))=\{B\mid B\text{ 可由确定性单带 TM 在 }O(t(n))\text{ 时间判定}\}.
$$

$$
P=\bigcup_k TIME(n^k)
$$

即多项式时间可判定语言。

课件强调：

- 最坏情况复杂度是对长度 $n$ 的所有输入取上界。
- reasonable encoding 很重要；图的 adjacency matrix/list 是合理编码，数字用 unary 通常不合理。
- 多带 TM 与单带 TM 在多项式意义下等价：多带 $t(n)$ 可由单带 $O(t(n)^2)$ 模拟。

### P 中的典型问题

- **PATH $\in P$**：给有向图 $G,s,t$，从 $s$ 做 BFS/marking，若标记到 $t$ 则接受。
- **RELPRIME $\in P$**：Euclidean algorithm：重复 $x\leftarrow x\bmod y$，交换 $x,y$，直到 $y=0$。若 gcd 为 1 则接受。
- **CFL $\in P$**：用 CYK/dynamic programming。转 CNF 后，对每个 substring 存能生成它的变量集合，总复杂度多项式。
- **HAMPATH 与 PATH 的区别**：PATH 只问是否有任意路径，BFS 可解；HAMPATH 要经过每个节点恰好一次，暴力路径数可达 $m!$，是否在 P 是开放问题。

### P 闭包

P 对并、连接、补封闭。

- Union：顺序运行两个多项式 decider，任一接受则接受。
- Concatenation：枚举 $n+1$ 个 split $w=uv$，运行两个 decider，某个 split 都接受则接受。
- Complement：运行 decider 并翻转结果。

**CONNECTED $\in P$**：无向图从任意顶点 BFS，若所有顶点都被标记则接受。

**$ALL\_DFA\in P$**：构造补 DFA，对补 DFA 从起点 BFS。若能到接受态，则原 DFA 不是 all。

**$EQ\_DFA\in P$**：构造对称差 DFA，再用 $E_{DFA}$ 的 BFS 判空。

---

## 8. NP、coNP、Polynomial Reducibility

### NP 定义

$$
NP=\bigcup_k NTIME(n^k)
$$

等价定义：存在多项式时间 verifier $V$ 和多项式长度 certificate $c$，使得
$$
w\in L\iff \exists c,\ |c|\le |w|^k,\ V(w,c)\text{ accepts}.
$$

重要定理：语言在 NP 中 iff 有 polynomial-time verifier。

- NTM → verifier：certificate 描述接受分支。
- verifier → NTM：非确定性猜 certificate，再运行 verifier。

### 常见 NP 证明

标准写法是给 certificate 和 verifier：

- 3SAT：certificate 是 truth assignment；检查每个 clause 是否有 true literal。
- VERTEX-COVER：certificate 是 $k$ 个顶点；检查每条边至少一个端点在集合中。
- TSP：certificate 是 tour；检查每个城市恰好一次且总权重 $\le k$。
- MAX-CUT：certificate 是顶点划分 $S,V-S$；数 crossing edges 是否 $\ge k$。
- 3-COLORING：certificate 是每个顶点颜色；检查相邻顶点颜色不同。
- CLIQUE：certificate 是 $k$ 个顶点；检查任意两点之间有边。
- SUBSET-SUM：certificate 是子集；检查和是否为目标 $t$。
- COMPOSITES：certificate 是非平凡因子 $y$；检查 $1<y<x$ 且 $y\mid x$。

### NP 闭包

NP 对 union、concatenation、star 封闭。

- Union：certificate 额外包含选择 bit，说明用 $V_1$ 还是 $V_2$。
- Concatenation：certificate 包含 split 位置 $i$ 以及两个子证书 $c_1,c_2$。
- Star：certificate 包含分割位置列表和每段证书；段数至多 $|w|$，总长度仍多项式。

### P、NP、coNP 判断题

- $P\subseteq NP$：True，忽略 certificate，直接运行 P decider。
- $P$ 对补封闭：True。
- $P\subseteq NP\cap coNP$：True。
- 若 $P=NP$，则 $NP=coNP$：True。
- $\overline{SAT}\in P$：严格说是开放问题；若它在 P，则 $P=NP$。

### 2-COLOR 与 2-SAT

**2-COLOR $\in P\cap NP$**

- NP：certificate 是 2-coloring。
- P：BFS/DFS 检查二分图。未染色点染 0，邻居染 1，若遇到同色边则 reject。

**2-SAT $\in P\cap NP$**

- NP：certificate 是 assignment。
- P：构造 implication graph：
  $$
  (x\vee y)\equiv(\neg x\to y)\wedge(\neg y\to x).
  $$
  若某变量 $x$ 与 $\neg x$ 在同一个 SCC，则不可满足；否则可满足。

---

## 9. NP-Completeness

### 定义与证明套路

语言 $B$ 是 NP-complete iff：

1. $B\in NP$
2. 对所有 $A\in NP$，$A\le_p B$

实际证明 $C$ NP-complete：

1. 证明 $C\in NP$。
2. 从一个已知 NP-complete 问题 $B$ 归约到 $C$，如 $3SAT\le_p C$。
3. 证明构造多项式时间。
4. 证明 iff。

### 3SAT → CLIQUE

给 3CNF $\phi=C_1\wedge\cdots\wedge C_m$。构造图 $G$：

1. 对每个 clause 中每个 literal occurrence 建一个顶点。
2. 不同 clause 的两个顶点之间连边，当且仅当两个 literal 不矛盾。
3. 设置 $k=m$。

正确性：

- 若 $\phi$ satisfiable，从每个 clause 选一个 true literal。这些 literal 互不矛盾，对应顶点两两相连，形成 $m$-clique。
- 若 $G$ 有 $m$-clique，因为同 clause 内没有边，clique 必定每个 clause 选一个顶点；两两相连说明 literal 互不矛盾，可扩展为满足赋值。

### 2SAT → CLIQUE

同样构造，每个 2-clause 建两个顶点，连接不同 clause 且不矛盾的 literal，令 $k=m$。能说明 2SAT 实例可多项式变成 CLIQUE 实例；但由于 2SAT 在 P，这个归约不能证明 CLIQUE NP-hard。要证明 CLIQUE NP-hard 必须从 NP-complete 问题如 3SAT 归约。

### Double-SAT NP-complete

Double-SAT：$\{\phi\mid \phi\text{ has at least two satisfying assignments}\}$。

- 在 NP：certificate 是两个不同 assignment，验证二者不同且都满足 $\phi$。
- 从 3SAT 归约：给 $\phi$，引入新变量 $w$，构造 $\phi'=\phi\wedge(w\vee\overline w)$。若 $\phi$ satisfiable，则任意满足赋值可扩展为 $w=true$ 和 $w=false$ 两个满足赋值。若 $\phi'$ 有至少两个满足赋值，则 $\phi$ satisfiable。

### 3SAT → HAMPATH

课件与作业采用 Sipser diamond variable gadget：

- 每个变量一个 gadget。
- 从左到右遍历表示 true，从右到左遍历表示 false。
- 每个 clause 一个 clause vertex，通过 wire 连到对应 literal 在 gadget 中的位置。
- 若某 literal 使 clause satisfied，Hamiltonian path 可绕入该 clause vertex 并返回。

### Directed HAMPATH → Undirected HAMPATH

给 directed $G=(V,E)$，构造 undirected $G'$。对每个顶点 $u$ 建 $u^{in},u^{mid},u^{out}$，并加内部边 $\{u^{in},u^{mid}\},\{u^{mid},u^{out}\}$。对每条有向边 $(u,v)$，加无向边 $\{u^{out},v^{in}\}$。起点终点：$s'=s^{in}, t'=t^{out}$。

关键：$u^{mid}$ 度只连 $u^{in},u^{out}$，所以 Hamiltonian path 必须连续穿过一个 gadget。路径从 $s^{in}$ 开始会强制所有 gadget 都以 $in\to mid\to out$ 方向穿过；跨 gadget 的边只能对应原图有向边。

### 3SAT → VERTEX-COVER

给 3CNF $\phi$，变量数 $v$，clause 数 $c$。

1. 每个变量 $x_i$：建两个顶点 $x_i,\overline{x_i}$，加边 $\{x_i,\overline{x_i}\}$。
2. 每个 clause $C_j=(\ell_{j,1}\vee\ell_{j,2}\vee\ell_{j,3})$：建三角形三个 clause 顶点。
3. 每个 clause literal 顶点连到变量 gadget 中同名 literal 顶点。
4. 设置 $k=v+2c$。

正确性：

- 满足赋值 → 每个变量 gadget 选 true literal 顶点；每个 clause 三角形中留下一个 true literal 顶点不选，选另两个。大小 $v+2c$。
- Vertex cover 大小 $\le v+2c$ → 每个变量边至少选一个，共至少 $v$；每个三角形至少选两个，共至少 $2c$。因此必须恰好选这些数量。每个 clause 三角形有一个未选顶点，其连接边必须由变量 gadget 中同名顶点覆盖，令该 literal 为 true。

### 3COLOR NP-complete

在 NP：certificate 是 coloring，逐边检查端点颜色不同。

从 3SAT 归约：

1. 建 palette 三角形 $T,F,N$，强制三种颜色。
2. 每个变量建 $x_i,\overline{x_i}$，二者互连，且都连到 $N$。因此它们不能取 Neutral，且必须一真一假。
3. 每个 clause $(a\vee b\vee c)$ 用两个 OR gadget：先算 $u=a\vee b$，再算 $o=u\vee c$。
4. gadget 的中间输出和最终输出连到 $N$，使其只能 True/False。
5. 最终输出 $o$ 还连到 $F$，强制 $o$ 为 True。

正确性：clause 三个 literal 全 false 时 OR output 被迫 false，与连到 $F$ 冲突；至少一个 true 时 gadget 可合法 3-color。

---

## 10. Cook-Levin 与 3SAT

### Cook-Levin Theorem

$$
SAT\text{ is NP-complete}.
$$

证明结构：

1. $SAT\in NP$：certificate 是 truth assignment。
2. 对任意 $A\in NP$，取多项式时间 NTM $M$ 决定 $A$。给输入 $w$，构造公式 $\phi_{M,w}$，使 $w\in A\iff \phi_{M,w}\text{ satisfiable}$。

### Tableau

若 $M$ 在 $n^k$ 时间内运行，构造 $n^k\times n^k$ tableau，每行是一条 configuration。变量 $x_{i,j,s}$ 表示 tableau 的第 $i$ 行第 $j$ 格内容是符号/状态 $s$。

公式：
$$
\phi_{M,w}=\phi_{cell}\wedge\phi_{start}\wedge\phi_{move}\wedge\phi_{accept}.
$$

- $\phi_{cell}$：每个 cell 恰好一个符号。
- $\phi_{start}$：第一行是 $q_0w\sqcup\cdots$。
- $\phi_{accept}$：某处出现 $q_{accept}$。
- $\phi_{move}$：每个 $2\times3$ window 合法，保证相邻配置符合转移函数。

### 为什么用 $2\times3$ window

设 $\delta(q,0)=(r,0,L)$，$\delta(q,1)=(s,1,L)$，$r\ne s$。考虑 window：
$$
\begin{array}{ccc}
0 & q & 1\\
r & 0 & 1
\end{array}
$$

它非法，因为上方状态 $q$ 实际扫描的是右侧 `1`，应产生 $s$ 而不是 $r$。但它的两个 $2\times2$ 子窗口都可分别出现在某个合法 $2\times3$ window 中。因此只查 $2\times2$ 不够。

### SAT → 3SAT

3SAT 是 NP-complete。长 clause 转 3CNF：

- 1 literal：$x$ 可写成 $(x\vee x\vee x)$。
- 2 literals：$(x\vee y)$ 可写成 $(x\vee y\vee x)$ 或用 padding。
- 3 literals：保持。
- $l>3$ literals：$(x_1\vee\cdots\vee x_l)$ 替换为
  $$
  (x_1\vee x_2\vee z_1)\wedge(\overline z_1\vee x_3\vee z_2)\wedge\cdots\wedge(\overline z_{l-3}\vee x_{l-1}\vee x_l).
  $$

注意原公式与新公式不必逻辑等价，只需 satisfiability 等价。

---

## 11. Space, PSPACE, NP-hardness, 近似

### Space complexity

TM 在 space $f(n)$ 内运行：对长度 $n$ 输入，最多使用 $f(n)$ 个 tape cells。

$$
SPACE(f(n))=\{B\mid B\text{ 被某 deterministic TM 用 }O(f(n))\text{ space 判定}\}
$$

$$
NSPACE(f(n))=\{B\mid B\text{ 被某 nondeterministic TM 用 }O(f(n))\text{ space 判定}\}.
$$

$$
PSPACE=\bigcup_k SPACE(n^k),\quad NPSPACE=\bigcup_k NSPACE(n^k).
$$

Savitch theorem：
$$
NSPACE(f(n))\subseteq SPACE(f(n)^2),\quad f(n)\ge\log n.
$$

推论：$PSPACE=NPSPACE$。

课件关系：
$$
P\subseteq NP\subseteq PSPACE\subseteq EXPTIME
$$

且 $P\ne EXPTIME$，所以这些包含中至少有一个是真包含，但不知道是哪一个。

### NP-hardness

NP-hard 不要求问题在 NP 中，也可用于 search/optimization 问题。定义：对所有 $A\in NP$，$A\le_p B$。若某 NP-hard 问题有多项式算法，则 $P=NP$。

NP-complete = NP-hard + in NP。

### 近似与随机算法

**Vertex Cover 2-approximation**

算法：当图中还有边时，任选一条边 $(u,v)$，把 $u,v$ 都加入 cover，并删除所有 incident edges。

证明：

1. 输出 $X$ 是 vertex cover，因为每条边在被处理或删除时都被选中端点覆盖。
2. 选中的边彼此不共享端点，任意最优 cover 至少要为每条这样的边选一个端点。
3. 算法每条选中边选两个端点，所以 $|X|\le2OPT$。

**Randomized MAX-3SAT $7/8$ expectation**

每个变量独立以 $1/2$ 取 true。一个 3-literal clause 不满足概率为 $(1/2)^3=1/8$，满足概率 $7/8$。令 $X_i$ 是第 $i$ 个 clause 是否满足的 indicator，则
$$
\mathbb E[X_i]=7/8,\quad \mathbb E[X]=\sum_i\mathbb E[X_i]=7m/8.
$$

---

## 12. 快速总表

### 模型能力

| 模型 | 等价描述 | 语言类 |
|---|---|---|
| DFA | NFA, regex | Regular |
| PDA | CFG | CFL |
| TM decider | 总停机算法 | Decidable |
| TM recognizer | 接受时停机 | Turing-recognizable |
| Poly-time DTM | efficient decider | P |
| Poly-time NTM / verifier | short certificate | NP |

### 可判定/不可判定/可识别

| 问题 | 结论 |
|---|---|
| $A_{DFA},A_{NFA},A_{REX}$ | decidable |
| $E_{DFA},EQ_{DFA}$ | decidable |
| $A_{CFG},E_{CFG}$ | decidable |
| $A_{TM}$ | recognizable, undecidable |
| $\overline{A_{TM}}$ | not recognizable |
| $HALT_{TM}$ | undecidable |
| $E_{TM}$ | undecidable, not recognizable |
| $\overline{E_{TM}}$ | recognizable |
| $EQ_{TM}$ | undecidable, not recognizable |
| $\overline{EQ_{CFG}}$ | recognizable |

### 常见 NP-complete 链

$$
SAT \le_p 3SAT \le_p CLIQUE
$$

$$
3SAT \le_p HAMPATH \le_p UHAMPATH
$$

$$
3SAT \le_p VERTEX\text{-}COVER,\quad 3SAT \le_p 3COLOR
$$

### 作业对应复习索引

| 作业 | 必会内容 |
|---|---|
| Assignment 1 | DFA 形式化、补集、乘积构造 |
| Assignment 2 | NFA 图、union/concat/star construction、single accept、subset construction |
| Assignment 3 | regex、Thompson、GNFA state elimination、reverse 正则性 |
| Assignment 4 | 正则 pumping lemma、闭包反证 |
| Assignment 5 | CFG、parse tree、PDA、CNF |
| Assignment 6 | CFG-PDA 等价、CFL closure、CFL pumping、CFL 非闭包、CFL $\cap$ regular |
| Assignment 7 | 2-PDA、TM 配置、TM 设计、left-reset、read-only/right-only 正则性 |
| Assignment 8 | DFA/RE/CFG 判定问题、$\overline{E_{TM}}$ recognizer、$EQ_{DFA}$ 长度上界 |
| Assignment 9 | 对角线、可数性、TM 语法/行为判定、DFA 与偶数个 1 |
| Assignment 10 | $EQ_{CFG}$ co-recognizable、mapping reduction、Rice、CYK、P 闭包 |
| Assignment 11 | NP verifier、NP closure、2COLOR、2SAT、P/NP/coNP 判断 |
| Assignment 12 | 3SAT→CLIQUE、Double-SAT、3SAT→HAMPATH、3COLOR |
| Assignment 13 | Cook-Levin tableau、legal window、UHAMPATH、VERTEX-COVER |

---

## 13. 易错点 checklist

- [ ] 自动机题：先写"状态记录什么"，再写状态/转移/接受态。
- [ ] 构造证明题：必须给完整 tuple 或完整规则，不要只说"按闭包性"。
- [ ] Pumping 题：选择的串必须在语言中，且分解必须任意。
- [ ] 归约题：方向绝对不能反。从已知难问题归约到目标问题。
- [ ] NP-complete 题：先 in NP，再 NP-hard。
- [ ] Rice 题：先确认是 $L(M)$ 的非平凡语义性质，不是机器编码的语法性质。
- [ ] P/NP 题：注意"可验证"与"可求解"不同；HAMPATH 在 NP，但不知道是否在 P。
- [ ] DFA 乘积构造中接受态按目标布尔组合设置，不要混淆交集与并集。
- [ ] Subset construction 的 DFA 接受态是"包含旧接受态"，不是"全是旧接受态"。
- [ ] NFA 的 $\epsilon$-closure 在子集构造中必须算入起始态和每次转移后的闭包。
- [ ] CFG 转 PDA 时，多符号右部压栈要倒序，保证最左推导顺序正确。
- [ ] PDA 转 CFG 前必须先规范化：单接受态、接受前栈空、每步只 push/pop 一个符号。
- [ ] CNF 推导长度为 $|w|$ 的串需要 $2|w|-1$ 步。
- [ ] 证明非正则/非 CFL 只能用 Pumping Lemma 的否定，不能用它证明正则/CFL。
- [ ] $A\le_m B$ 的方向：$A$ 难则 $B$ 难；$B$ 易则 $A$ 易。
- [ ] 复杂度分析时注意 reasonable encoding，unary 编码下的多项式时间不一定是真正多项式。
- [ ] 多带 TM 与单带 TM 在多项式意义下等价，但具体复杂度差一个平方。

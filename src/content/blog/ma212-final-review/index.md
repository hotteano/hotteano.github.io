---
title: "MA212 概率论与数理统计期末复习"
description: "SUSTech MA212 概率论与数理统计期末复习：概率基础、随机变量、联合分布、期望方差、大数定律、点估计、置信区间与假设检验。"
date: "2026-06-22"
draft: false
tags:
  - "SUSTech"
  - "MA212"
  - "概率论"
  - "数理统计"
  - "期末复习"
column: "期末复习"
---

> 更系统的笔记见 [概率论与数理统计系统笔记 Part 1](/blog/probability-and-statistics-part-1-basics)。

## 考试范围与使用方法

考试覆盖第 1–8 章，题型为选择题 20 分、填空题 20 分、大题 60 分。复习时优先掌握本文的公式、典型题型和套路。

**期末复习课件明确不作为重点：** 几何分布、负二项分布、超几何分布、Gamma/Beta 分布、$n$ 维联合分布、Copula、正态分布联合密度公式、$X/Y$ 的雅可比公式、微分思路、条件期望、双总体区间估计、双总体假设检验。

> **做题技巧：** 最后一天的顺序建议：先背第 6–8 章的三大分布、置信区间和检验表；再刷第 1–4 章的条件概率、二维分布、期望方差；最后用模拟卷限时 120 分钟。

---

## 一、概率基础：事件、条件概率、贝叶斯

### 必须记住的公式

- 概率公理：$0\le P(A)\le 1$，$P(\Omega)=1$，互斥可加。
- 加法公式：
  $$P(A\cup B)=P(A)+P(B)-P(AB).$$
- 三事件容斥：
  $$P(A\cup B\cup C)=P(A)+P(B)+P(C)-P(AB)-P(AC)-P(BC)+P(ABC).$$
- 条件概率：
  $$P(A\mid B)=\frac{P(AB)}{P(B)},\quad P(B)>0.$$
- 乘法公式：
  $$P(AB)=P(A)P(B\mid A)=P(B)P(A\mid B).$$
- 全概率公式：若 $A_1,\dots,A_n$ 构成完备事件组，
  $$P(B)=\sum_{i=1}^n P(A_i)P(B\mid A_i).$$
- 贝叶斯公式：
  $$P(A_k\mid B)=\frac{P(A_k)P(B\mid A_k)}{\sum_{i=1}^n P(A_i)P(B\mid A_i)}.$$
- 独立性：$A,B$ 独立 $\Longleftrightarrow P(AB)=P(A)P(B)$。若 $P(B)>0$，也等价于 $P(A\mid B)=P(A)$。

### 容易混淆的点

- 互斥不是独立。若 $A,B$ 互斥且 $P(A),P(B)>0$，则 $P(AB)=0\ne P(A)P(B)$，所以不独立。
- 条件概率里的“样本空间”已经变成 $B$。例如 $P(A_1\cup A_2\mid B)=P(A_1\mid B)+P(A_2\mid B)$ 表示 $A_1B$ 与 $A_2B$ 在条件样本空间下互斥。
- 贝叶斯题先设事件，再代数字。常见设法：$A=$ 努力学习，$B=$ 考试及格。

### 典型题型

1. 已知 $P(A)$、$P(B\mid A)$、$P(A\mid B)$ 求 $P(B)$ 与 $P(A\cup B)$：
   $$P(B)=\frac{P(A)P(B\mid A)}{P(A\mid B)},\quad P(A\cup B)=P(A)+P(B)-P(A)P(B\mid A).$$
2. 贝叶斯反推原因概率。若 $P(A)=0.8$，$P(B\mid A)=0.9$，$P(B\mid A^c)=0.1$，则
   $$P(A^c\mid B)=\frac{0.2\cdot 0.1}{0.8\cdot 0.9+0.2\cdot 0.1}.$$
3. 判断条件下的可加性或独立性。把条件概率转成 $P(A_iB)$ 最稳。

> **做题技巧：** 条件概率题统一三步：设事件；写出目标概率；用乘法公式和全概率公式拆分分母。不要把 $P(A\mid B)$ 和 $P(B\mid A)$ 看反。

---

## 二、随机变量与常见分布

### 必须记住的公式

- 分布函数：$F(x)=P(X\le x)$，$F(-\infty)=0$，$F(+\infty)=1$。
- 离散型：$p_k=P(X=x_k)$，$\sum_k p_k=1$。
- 连续型：$f(x)\ge 0$，$\int_{-\infty}^{\infty}f(x)\,\mathrm{d}x=1$，
  $$F(x)=\int_{-\infty}^{x}f(t)\,\mathrm{d}t,\quad P(a<X\le b)=F(b)-F(a).$$

### 常见分布表

| 分布 | 记号 | 概率质量/密度 | 期望 | 方差 |
|---|---|---|---|---|
| Bernoulli | $B(1,p)$ | $P(X=1)=p$ | $p$ | $p(1-p)$ |
| 二项 | $b(n,p)$ | $\binom nk p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Poisson | $P(\lambda)$ | $e^{-\lambda}\frac{\lambda^k}{k!}$ | $\lambda$ | $\lambda$ |
| 均匀 | $U(a,b)$ | $\frac1{b-a}$ | $\frac{a+b}{2}$ | $\frac{(b-a)^2}{12}$ |
| 指数（速率） | $\mathrm{Exp}(\lambda)$ | $\lambda e^{-\lambda x},x\ge0$ | $\frac1\lambda$ | $\frac1{\lambda^2}$ |
| 指数（均值） | — | $\frac1\theta e^{-x/\theta},x\ge0$ | $\theta$ | $\theta^2$ |
| 正态 | $N(\mu,\sigma^2)$ | — | $\mu$ | $\sigma^2$ |

- 正态标准化：若 $X\sim N(\mu,\sigma^2)$，则 $Z=\frac{X-\mu}{\sigma}\sim N(0,1)$。
- 一维随机变量函数：若 $Y=g(X)$，总可用 $F_Y(y)=P(g(X)\le y)$ 先求分布函数。若 $g$ 单调且可导，
  $$f_Y(y)=f_X(g^{-1}(y))\left|\frac{\mathrm{d}}{\mathrm{d}y}g^{-1}(y)\right|.$$

### 容易混淆的点

- 指数分布参数可能写成 $\lambda$（速率）或 $\theta$（均值）。看到 $f(x)=\theta e^{-\theta x}$ 是速率参数；看到 $f(x)=\frac1\theta e^{-x/\theta}$ 是均值参数。
- 连续型随机变量 $P(X=a)=0$，所以 $<$ 与 $\le$ 通常无差别；离散型不能随便换。
- $X\sim B(1,p)$ 的样本均值 $\bar X$ 满足 $n\bar X\sim b(n,p)$。

### 典型题型

1. 归一化常数：若 $f(x)=Ae^{-|x|}$，则 $1=A\int_{-\infty}^{\infty}e^{-|x|}\,\mathrm{d}x=2A$，故 $A=\frac12$。
2. 指数分布分位数：$P(X>c)=1/2\Rightarrow e^{-c/\theta}=\frac12\Rightarrow c=\theta\ln2$。
3. 正态标准化：求 $P(a<X<b)$ 转成 $\Phi\!\left(\frac{b-\mu}{\sigma}\right)-\Phi\!\left(\frac{a-\mu}{\sigma}\right)$。
4. 方程有实根：$y^2+y+X=0$ 有实根等价于 $1-4X\ge0$，即 $X\le1/4$。

> **做题技巧：** 密度题先做两件事：用积分等于 1 求常数；再写 $F(x)$ 的分段表达。正态题第一反应是标准化，指数题第一反应是生存函数 $P(X>c)$。

---

## 三、联合分布、独立性、函数分布与极值

### 必须记住的公式

- 联合分布函数：$F(x,y)=P(X\le x,Y\le y)$。
- 离散型边缘分布：$p_X(x_i)=\sum_j p_{ij}$，$p_Y(y_j)=\sum_i p_{ij}$。
- 连续型边缘密度：
  $$f_X(x)=\int_{-\infty}^{\infty}f(x,y)\,\mathrm{d}y,\quad f_Y(y)=\int_{-\infty}^{\infty}f(x,y)\,\mathrm{d}x.$$
- 独立性：$F(x,y)=F_X(x)F_Y(y)$，或 $f(x,y)=f_X(x)f_Y(y)$。
- 条件密度：
  $$f_{Y\mid X}(y\mid x)=\frac{f(x,y)}{f_X(x)},\quad f_X(x)>0.$$
- 二维函数的分布函数法：
  $$F_Z(z)=P(g(X,Y)\le z)=\iint_{g(x,y)\le z} f(x,y)\,\mathrm{d}x\,\mathrm{d}y.$$
- 独立和的卷积（连续）：
  $$f_{X+Y}(z)=\int_{-\infty}^{\infty}f_X(t)f_Y(z-t)\,\mathrm{d}t.$$
- 独立极值：若 $X,Y$ 独立，
  $$F_{\max(X,Y)}(z)=F_X(z)F_Y(z),\quad F_{\min(X,Y)}(z)=1-[1-F_X(z)][1-F_Y(z)].$$
  若 $X_1,\dots,X_n$ i.i.d.，则
  $$F_{X_{(n)}}(z)=F^n(z),\quad F_{X_{(1)}}(z)=1-[1-F(z)]^n,$$
  $$f_{X_{(n)}}(z)=nf(z)F^{n-1}(z),\quad f_{X_{(1)}}(z)=nf(z)[1-F(z)]^{n-1}.$$
- 第 $k$ 个顺序统计量：
  $$f_{X_{(k)}}(z)=\frac{n!}{(k-1)!(n-k)!}[F(z)]^{k-1}[1-F(z)]^{n-k}f(z).$$

### 重要性质

- 独立正态线性组合仍服从正态：
  $$\sum_{i=1}^n a_iX_i\sim N\left(\sum_{i=1}^na_i\mu_i,\sum_{i=1}^na_i^2\sigma_i^2\right).$$
- 独立 Poisson 可加：$X\sim P(\lambda_1),Y\sim P(\lambda_2),X\perp Y\Rightarrow X+Y\sim P(\lambda_1+\lambda_2)$。
- 串联系统寿命：若 $X\sim\mathrm{Exp}(\lambda_1)$，$Y\sim\mathrm{Exp}(\lambda_2)$ 独立，则 $T=\min(X,Y)\sim\mathrm{Exp}(\lambda_1+\lambda_2)$。

### 容易混淆的点

- 二维连续题一定先画积分区域。边界写错，后面全错。
- 不相关不等于独立。正态情形下若是**联合正态**才可用不相关推出独立。
- 极大值用“全部不超过 $z$”；极小值用反面“全部大于 $z$”。

### 典型题型

1. 已知 $f(x,y)=\frac{x+y}{8},0<x<2,0<y<2$，求边缘密度：
   $$f_X(x)=\int_0^2\frac{x+y}{8}\,\mathrm{d}y=\frac{x+1}{4}.$$
2. 判断独立：算出 $f_X(x),f_Y(y)$ 后比较 $f(x,y)$ 与 $f_X(x)f_Y(y)$。
3. 求 $\mathrm{Cov}(X,Y)=\mathbb{E}(XY)-\mathbb{E}X\,\mathbb{E}Y$。
4. 极值分布：$X,Y$ i.i.d.，求 $\max(X,Y)$ 的密度，直接写 $2f(z)F(z)$。

> **做题技巧：** 联合密度题按“边缘、独立、矩”的顺序做：先求边缘，再判断独立，最后计算各阶矩。极值题尽量先写分布函数，再求导。

---

## 四、数字特征：期望、方差、协方差、相关系数

### 必须记住的公式

- 离散型期望：$\mathbb{E}X=\sum_k x_kp_k$，$\mathbb{E}g(X)=\sum_k g(x_k)p_k$。
- 连续型期望：$\mathbb{E}X=\int_{-\infty}^{\infty}xf(x)\,\mathrm{d}x$，$\mathbb{E}g(X)=\int_{-\infty}^{\infty}g(x)f(x)\,\mathrm{d}x$。
- 线性性质：$\mathbb{E}(aX+bY+c)=a\mathbb{E}X+b\mathbb{E}Y+c$。
- 方差：$\mathrm{D}X=\mathbb{E}[X-\mathbb{E}X]^2=\mathbb{E}X^2-(\mathbb{E}X)^2$。
- 线性组合方差：
  $$\mathrm{D}(aX+bY)=a^2\mathrm{D}X+b^2\mathrm{D}Y+2ab\,\mathrm{Cov}(X,Y).$$
- 协方差：$\mathrm{Cov}(X,Y)=\mathbb{E}(XY)-\mathbb{E}X\,\mathbb{E}Y$。
- 相关系数：$\rho_{XY}=\frac{\mathrm{Cov}(X,Y)}{\sqrt{\mathrm{D}X\,\mathrm{D}Y}}$，$-1\le\rho_{XY}\le1$。
- 切比雪夫不等式：
  $$P(|X-\mu|\ge \varepsilon)\le \frac{\sigma^2}{\varepsilon^2},\quad P(|X-\mu|<\varepsilon)\ge 1-\frac{\sigma^2}{\varepsilon^2}.$$

### 容易混淆的点

- $\mathrm{D}(X-Y)=\mathrm{D}X+\mathrm{D}Y-2\mathrm{Cov}(X,Y)$，独立时才是 $\mathrm{D}X+\mathrm{D}Y$，不是 $\mathrm{D}X-\mathrm{D}Y$。
- 常数不影响方差：$\mathrm{D}(X+c)=\mathrm{D}X$；系数平方进入方差：$\mathrm{D}(cX)=c^2\mathrm{D}X$。
- $\mathbb{E}(XY)=\mathbb{E}X\,\mathbb{E}Y$ 只说明不相关，不足以推出独立。

### 典型题型

1. 若 $X\sim b(10,0.1),Y\sim P(3)$ 独立，则
   $$\mathbb{E}(X-2Y+3)=1-6+3=-2,\quad \mathrm{D}(X-2Y+3)=\mathrm{D}X+4\mathrm{D}Y=12.9.$$
2. 若 $\rho=0.5$，$\mathbb{E}X=\mathbb{E}Y=0$，$\mathbb{E}X^2=\mathbb{E}Y^2=2$，则
   $$\mathbb{E}(X+Y)^2=\mathrm{D}X+\mathrm{D}Y+2\mathrm{Cov}(X,Y)=6.$$
3. 若 $\mathrm{D}X=4,\mathrm{D}Y=2$ 且独立，则 $\mathrm{D}(3X-2Y)=9\cdot4+4\cdot2=44$。

> **做题技巧：** 线性组合先算期望再算方差。方差题最容易丢系数平方；相关系数题先由 $\rho$ 反推 $\mathrm{Cov}$。

---

## 五、大数定律与中心极限定理

### 必须记住的公式

- 样本均值：$\bar X=\frac1n\sum_{i=1}^nX_i$，$\mathbb{E}\bar X=\mu$，$\mathrm{D}\bar X=\frac{\sigma^2}{n}$。
- 切比雪夫型弱大数定律：若 $X_1,\dots,X_n$ 两两不相关且方差有共同上界，则 $\bar X\xrightarrow{P}\mu$。
- 中心极限定理：若 $X_i$ i.i.d.，$\mathbb{E}X_i=\mu,\mathrm{D}X_i=\sigma^2$，
  $$\frac{\sum_{i=1}^nX_i-n\mu}{\sigma\sqrt n}\Rightarrow N(0,1),\quad \frac{\bar X-\mu}{\sigma/\sqrt n}\Rightarrow N(0,1).$$
- 二项分布正态近似：
  $$X\sim b(n,p),\quad \frac{X-np}{\sqrt{np(1-p)}}\approx N(0,1).$$

### 容易混淆的点

- 大数定律回答“平均值趋近于什么”；中心极限定理回答“和或平均值的近似分布”。
- 正态近似中标准差是 $\sqrt{n}\sigma$ 给总和用，$\sigma/\sqrt n$ 给样本均值用。
- 二项近似若有 $P(S>200)$，标准化时要看是否需要连续性修正；课程作业里通常直接标准化。

### 典型题型

1. 骰子平均点数：$\mathbb{E}X=3.5$，所以 $\bar X\xrightarrow{P}3.5$。
2. 指数寿命总和近似：若 $X_i$ 均值 $100$、方差 $100^2$，$n=16$，
   $$P\left(\sum X_i>1920\right)\approx 1-\Phi\left(\frac{1920-1600}{400}\right).$$
3. 二项死亡人数近似：$S\sim b(10000,0.017)$，$\mathbb{E}S=170$，$\mathrm{D}S=10000(0.017)(0.983)$。

> **做题技巧：** CLT 题固定模板：确认总和还是均值；写均值与方差；标准化；查 $\Phi$ 表。若题目问“至少概率为 0.95 的样本量”，通常令半宽对应 $1.96$。

---

## 六、抽样分布：三大分布与正态样本定理

### 必须记住的公式

- 卡方分布：若 $Z_1,\dots,Z_n\overset{\mathrm{i.i.d.}}{\sim} N(0,1)$，
  $$\sum_{i=1}^nZ_i^2\sim\chi^2(n),\quad \mathbb{E}Y=n,\quad \mathrm{D}Y=2n.$$
  卡方可加性：$Y_1\sim\chi^2(n_1),Y_2\sim\chi^2(n_2),Y_1\perp Y_2\Rightarrow Y_1+Y_2\sim\chi^2(n_1+n_2)$。
- $t$ 分布：若 $Z\sim N(0,1)$，$Y\sim\chi^2(n)$ 且独立，
  $$T=\frac{Z}{\sqrt{Y/n}}\sim t(n).$$
- $F$ 分布：若 $U\sim\chi^2(n_1)$，$V\sim\chi^2(n_2)$ 且独立，
  $$F=\frac{U/n_1}{V/n_2}\sim F(n_1,n_2),\quad \frac1F\sim F(n_2,n_1).$$
- 正态总体样本：若 $X_1,\dots,X_n$ 来自 $N(\mu,\sigma^2)$，
  $$\bar X\sim N\left(\mu,\frac{\sigma^2}{n}\right),\quad \frac{(n-1)S^2}{\sigma^2}\sim\chi^2(n-1),\quad \bar X\perp S^2,$$
  $$\frac{\bar X-\mu}{S/\sqrt n}\sim t(n-1),\quad S^2=\frac1{n-1}\sum_{i=1}^n(X_i-\bar X)^2.$$

### 容易混淆的点

- $S^2$ 使用分母 $n-1$，不是 $n$。
- 卡方自由度来自独立标准正态平方和的个数；估计均值后少 1 个自由度。
- $F$ 的分子、分母自由度顺序不能反。
- 分位数记号统一理解为左侧概率 $P(X\le x_\alpha)=\alpha$。所以 $u_{0.975}=1.96$，$u_{0.05}=-u_{0.95}$；$F$ 分位数常用倒数公式 $F_\alpha(n_1,n_2)=\frac1{F_{1-\alpha}(n_2,n_1)}$。

### 典型题型

1. 若 $T\sim t(n)$，则 $T^2=\frac{Z^2/1}{Y/n}\sim F(1,n)$。
2. 若 $X,Y$ 独立且 $X,Y\sim \mathrm{Exp}(1)$，则 $2X,2Y\sim\chi^2(2)$，故 $\frac{X}{Y}=\frac{(2X)/2}{(2Y)/2}\sim F(2,2)$。
3. 若 $X_i\sim N(0,9)$，则 $\frac{(X_1^2+\cdots+X_{10}^2)/10}{(X_{11}^2+\cdots+X_{15}^2)/5}\sim F(10,5)$。
4. 线性组合配卡方：若 $X_i\sim N(0,1)$ 独立，要使 $C_1(X_1+X_2)^2+C_2(X_3+\cdots+X_6)^2\sim\chi^2(2)$，因 $X_1+X_2\sim N(0,2)$，$X_3+\cdots+X_6\sim N(0,4)$，取 $C_1=\frac12$，$C_2=\frac14$。
5. 指数到卡方：若 $X_i\sim\mathrm{Exp}(\lambda)$ 为速率参数，则 $2\lambda X_i\sim\chi^2(2)$，$2\lambda\sum_{i=1}^nX_i\sim\chi^2(2n)$。

> **做题技巧：** 三大分布题的核心是“标准化成独立卡方”。看到平方和，先除以对应方差；看到比值，整理成 $(U/\nu_1)/(V/\nu_2)$。

---

## 七、参数估计：矩估计、最大似然、优良性、区间估计

### 必须记住的公式

- 矩估计：令理论矩等于样本矩。最常用 $\mathbb{E}X=\bar X$。一般均值方差的矩估计为
  $$\hat\mu=\bar X,\quad \hat\sigma^2_{\mathrm{MM}}=\frac1n\sum_{i=1}^n(X_i-\bar X)^2.$$
  注意这不是修正样本方差 $S^2$。
- 最大似然估计：
  $$L(\theta)=\prod_{i=1}^n f(x_i;\theta),\quad \ell(\theta)=\ln L(\theta),$$
  解 $\ell'(\theta)=0$，同时检查参数取值范围和端点。
- 无偏性：若 $\mathbb{E}\hat\theta=\theta$，则 $\hat\theta$ 是无偏估计。
- 有效性：两个无偏估计量中，方差更小者更有效。
- 相合性：若 $P(|\hat\theta_n-\theta|\ge\varepsilon)\to0$，则 $\hat\theta_n$ 是相合估计。
- 均方误差：$\mathrm{MSE}(\hat\theta)=\mathrm{D}(\hat\theta)+[\mathbb{E}(\hat\theta)-\theta]^2$。

### 单正态总体置信区间

| 情形 | 置信度 $1-\alpha$ 的置信区间 |
|---|---|
| $\sigma^2$ 已知，估计 $\mu$ | $\left(\bar X-u_{1-\alpha/2}\frac{\sigma}{\sqrt n},\;\bar X+u_{1-\alpha/2}\frac{\sigma}{\sqrt n}\right)$ |
| $\sigma^2$ 未知，估计 $\mu$ | $\left(\bar X-t_{1-\alpha/2}(n-1)\frac{S}{\sqrt n},\;\bar X+t_{1-\alpha/2}(n-1)\frac{S}{\sqrt n}\right)$ |
| $\mu$ 未知，估计 $\sigma^2$ | $\left(\frac{(n-1)S^2}{\chi^2_{1-\alpha/2}(n-1)},\;\frac{(n-1)S^2}{\chi^2_{\alpha/2}(n-1)}\right)$ |

- 单侧区间：把 $\alpha/2$ 换成 $\alpha$ 即可得到相应下限或上限。
- 样本量题：若 $\sigma^2$ 已知，$\mu$ 的双侧置信区间长度要求不超过 $L$，则
  $$n\ge\left(\frac{2u_{1-\alpha/2}\sigma}{L}\right)^2.$$

### 容易混淆的点

- MLE 遇到支持集含参数，例如 $U(\theta,1)$ 或 $0<x<\theta$，不能只求导，要看样本最大/最小值对参数的限制。
- 正态总体 $\sigma^2$ 的 MLE 是 $\frac1n\sum(X_i-\bar X)^2$，无偏估计是 $S^2=\frac1{n-1}\sum(X_i-\bar X)^2$。
- 无偏不等于最优。若两个估计量都无偏，才直接比较方差；若有偏，需要看 MSE 或题目指定标准。
- 置信区间中 $\chi^2$ 的左右端容易反。因为 $\chi^2_{1-\alpha/2}$ 较大，所以对应左端较小。
- 估计标准差 $\sigma$ 的区间时，先写 $\sigma^2$ 区间，再整体开平方。

### 典型题型

1. 离散分布 $P(X=1)=\theta,P(X=2)=1-\theta$，样本 $1,2,2$：
   $$\mathbb{E}X=2-\theta=\bar X=\frac53\Rightarrow \hat\theta_{\mathrm{MM}}=\frac13,\quad L(\theta)=\theta(1-\theta)^2\Rightarrow \hat\theta_{\mathrm{MLE}}=\frac13.$$
2. Poisson MLE：$L(\theta)=\frac{\theta^{\sum x_i}}{\prod x_i!}e^{-n\theta}\Rightarrow \hat\theta=\bar X$。
3. 密度 $f(x;\theta)=\frac2{\theta^2}(\theta-x),0<x<\theta$：$\mathbb{E}X=\frac{\theta}{3}\Rightarrow \hat\theta=3\bar X$。
4. $X\sim U(\theta,1)$：$\hat\theta_{\mathrm{MM}}=2\bar X-1$；似然 $L(\theta)=(1-\theta)^{-n}$ 且 $\theta\le x_{(1)}$，故 $\hat\theta_{\mathrm{MLE}}=x_{(1)}$。
5. $X\sim U(a,b)$：$\hat a_{\mathrm{MLE}}=X_{(1)}$，$\hat b_{\mathrm{MLE}}=X_{(n)}$。

> **做题技巧：** 估计题固定流程：先判断是矩估计还是 MLE；矩估计只需要理论矩；MLE 必须写支持集限制。区间估计题先问自己：$\sigma$ 已知吗？估计 $\mu$ 还是 $\sigma^2$？然后选 $u/t/\chi^2$。

---

## 八、假设检验：单正态总体

### 基本概念

- 原假设 $H_0$ 和备择假设 $H_1$ 不对称。一般把“无差异/无提升/无效果”的命题放入 $H_0$。
- 第一类错误：$H_0$ 为真却拒绝 $H_0$，概率控制为显著性水平 $\alpha=P(\text{reject }H_0\mid H_0\text{ true})$。
- 第二类错误：$H_0$ 为假却未拒绝 $H_0$，概率常记为 $\beta$。样本量固定时，降低 $\alpha$ 往往会提高 $\beta$。
- 结论语言：拒绝 $H_0$ 表示有显著证据支持 $H_1$；未拒绝 $H_0$ 只表示证据不足，不能说 $H_0$ 被证明为真。
- 显著性水平越大，拒绝域越大。若在 $\alpha=0.01$ 下拒绝 $H_0$，则在 $\alpha=0.05$ 下也一定拒绝。

### $U$ 检验：$\sigma^2$ 已知，检验 $\mu$

统计量：
$$U=\frac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1)\quad(H_0\text{ 为真时}).$$

| $H_0$ | $H_1$ | 拒绝域 |
|---|---|---|
| $\mu=\mu_0$ | $\mu\ne\mu_0$ | $|U|\ge u_{1-\alpha/2}$ |
| $\mu\ge\mu_0$ | $\mu<\mu_0$ | $U\le u_\alpha=-u_{1-\alpha}$ |
| $\mu\le\mu_0$ | $\mu>\mu_0$ | $U\ge u_{1-\alpha}$ |

### $t$ 检验：$\sigma^2$ 未知，检验 $\mu$

统计量：
$$T=\frac{\bar X-\mu_0}{S/\sqrt n}\sim t(n-1)\quad(H_0\text{ 为真时}).$$

| $H_0$ | $H_1$ | 拒绝域 |
|---|---|---|
| $\mu=\mu_0$ | $\mu\ne\mu_0$ | $|T|\ge t_{1-\alpha/2}(n-1)$ |
| $\mu\ge\mu_0$ | $\mu<\mu_0$ | $T\le t_{\alpha}(n-1)$ |
| $\mu\le\mu_0$ | $\mu>\mu_0$ | $T\ge t_{1-\alpha}(n-1)$ |

### $\chi^2$ 检验：$\mu$ 未知，检验 $\sigma^2$

统计量：
$$\chi^2=\frac{(n-1)S^2}{\sigma_0^2}\sim\chi^2(n-1)\quad(H_0\text{ 为真时}).$$

| $H_0$ | $H_1$ | 拒绝域 |
|---|---|---|
| $\sigma^2=\sigma_0^2$ | $\sigma^2\ne\sigma_0^2$ | $\chi^2\le \chi^2_{\alpha/2}(n-1)$ 或 $\chi^2\ge \chi^2_{1-\alpha/2}(n-1)$ |
| $\sigma^2\ge\sigma_0^2$ | $\sigma^2<\sigma_0^2$ | $\chi^2\le \chi^2_{\alpha}(n-1)$ |
| $\sigma^2\le\sigma_0^2$ | $\sigma^2>\sigma_0^2$ | $\chi^2\ge \chi^2_{1-\alpha}(n-1)$ |

### 容易混淆的点

- 题目写“是否有显著差异”通常是双侧；写“是否提高/是否低于”通常是单侧。
- 方差已知用 $U$，方差未知用 $t$。不要因为总体正态就总用 $u$。
- 单侧检验拒绝域方向跟 $H_1$ 方向一致。

> **做题技巧：** 假设检验题按五步写：提出 $H_0,H_1$；选统计量；代入算观测值；写拒绝域；作结论。结论必须回到题意，比如“没有充分证据认为均值升高”。

---

## 考前总速查

- 条件概率：$P(A\mid B)=P(AB)/P(B)$。
- 贝叶斯：后验 $=$ 先验 $\times$ 似然 / 全概率。
- $b(n,p)$：$\mathbb{E}=np,\mathrm{D}=np(1-p)$。
- $P(\lambda)$：$\mathbb{E}=\mathrm{D}=\lambda$。
- $U(a,b)$：$\mathbb{E}=(a+b)/2,\mathrm{D}=(b-a)^2/12$。
- $\mathrm{Exp}(\lambda)$：$\mathbb{E}=1/\lambda,\mathrm{D}=1/\lambda^2$。
- $\mathrm{D}(aX+bY)=a^2\mathrm{D}X+b^2\mathrm{D}Y+2ab\,\mathrm{Cov}(X,Y)$。
- $\mathrm{Cov}(X,Y)=\mathbb{E}(XY)-\mathbb{E}X\,\mathbb{E}Y$。
- $\rho=\mathrm{Cov}/\sqrt{\mathrm{D}X\mathrm{D}Y}$。
- 切比雪夫：$P(|X-\mu|<\varepsilon)\ge1-\sigma^2/\varepsilon^2$。
- 极大值：$F_{\max}=F^n$；极小值：$F_{\min}=1-(1-F)^n$。
- $\sum Z_i^2\sim\chi^2(n)$；$Z/\sqrt{Y/n}\sim t(n)$；$(U/n_1)/(V/n_2)\sim F(n_1,n_2)$。
- $\bar X\sim N(\mu,\sigma^2/n)$；$(n-1)S^2/\sigma^2\sim\chi^2(n-1)$；$(\bar X-\mu)/(S/\sqrt n)\sim t(n-1)$。
- $\sigma$ 已知估计 $\mu$ 用 $u$；$\sigma$ 未知估计 $\mu$ 用 $t$；估计 $\sigma^2$ 用 $\chi^2$。
- 假设检验方向看 $H_1$。

---

## 易错点清单

- [ ] 把 $P(A\mid B)$ 与 $P(B\mid A)$ 看反。
- [ ] 互斥与独立混为一谈。
- [ ] 连续型密度中 $<$ 与 $\le$ 随意互换，离散型却不敢区分。
- [ ] 指数分布参数分不清速率 $\lambda$ 与均值 $\theta$。
- [ ] 二维连续题不画积分区域，导致上下限错误。
- [ ] 把“不相关”当成“独立”。
- [ ] 极值分布把极大值与极小值公式写反。
- [ ] 方差线性组合丢掉交叉项或系数平方。
- [ ] 把 $\mathrm{D}(X-Y)$ 误写成 $\mathrm{D}X-\mathrm{D}Y$。
- [ ] 样本方差 $S^2$ 的分母用 $n$ 而不是 $n-1$。
- [ ] 卡方、$t$、$F$ 的自由度配错，尤其是 $t^2\sim F(1,n)$。
- [ ] MLE 忽略支持集含参数的情况，例如 $U(\theta,1)$。
- [ ] 矩估计的方差与修正样本方差 $S^2$ 混用。
- [ ] 置信区间估计 $\sigma^2$ 时把 $\chi^2$ 的左右端写反。
- [ ] 假设检验方差已知用 $t$、方差未知用 $U$。
- [ ] 单侧检验拒绝域方向与 $H_0$ 一致（应与 $H_1$ 一致）。
- [ ] 未拒绝 $H_0$ 时说“$H_0$ 正确”。

---

> 更系统的笔记见 [概率论与数理统计系统笔记 Part 1](/blog/probability-and-statistics-part-1-basics)。

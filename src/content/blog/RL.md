---
title: 'Abstract Algebra'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Aug 4 2025'
heroImage: '../../assets/129955802_p0.jpg'
tags: 'AI'
---

# Dive into Reinforcement Learning with least time

## 强化学习核心概念：把握独特之处

强化学习是策略导向的学习优化手段，通过设置特定的奖励函数以及策略实现智能体（Agent）与环境（Environment）的最优交互。因此，我们的介绍不可避免地要从强化学习最核心的概念出发：状态（State）、动作（Action）、策略（Policy）、奖励（Reward）、价值（Value）。

### 出发：定义一个智能体

**定义**（智能体）  
智能体（Agent）被定义为具有如下属性的个体：
- 状态空间$S=\{s_i|i\in [n]\}$
- 动作空间$\mathcal A(S)$，其中从状态到动作的映射定义为$f:S\to \mathcal{A}$
- 策略分布$\Pi$，其中概率为$\pi(s_i|s_{i-1},a_i)$
- 价值函数$f:R\to \mathbb R$，其中$R=\{r_i|r\in [n]\}$
- 更新策略$O(R)$，其中$R$是每次尝试总的奖励

**定义**（环境）  
若一个分布具有如下性质，则可以称之为环境：  
奖励分布$P$，随机变量r的数值表示奖励或者惩罚的大小，$r\sim P$，其中概率为$p(r=k|s_{i-1},a_i)$

**定义**（折扣率）  
定义折扣率（Discount Rate）$\gamma\in [0,1]$，折扣价值$R=\sum \gamma^i r_i$

**定义**（贝尔曼公式-确定型）  
$$ v =  r + \gamma  P  v$$

**定义**（随机化的价值）  
$$v_\pi (s) = \mathbb{E}(G_t|S_t = s)$$  
其中$G_t = \sum_{i=t}^n \gamma^i R_i$

**贝尔曼公式（一般型）**  
$$v_\pi(s) = \sum_{a} \pi(a|s)\big[\sum_{r} p(r|s,a)r + \gamma\sum_{s'}v_\pi(s')p(s'|s,a)\big]$$

**动作价值定义**  
$$q_\pi(s,a) = \mathbb{E} (G_t|S_t = s, A_t = a)$$

### 最优化贝尔曼方程

**定义**（最优策略）  
若$\forall \pi(s), v_{\pi^*}(s)\geq v_{\pi}(s)$，则$\pi^*$是状态$s$下的最优策略

**贝尔曼最优公式**  
$$v(s) = \max_{\pi} \sum_{a} \pi(a|s)q(s,a),\forall s\in S$$

**最优解性质**  
$$v(s) = \max_{a\in\mathcal{A}(s)} q(s,a)$$
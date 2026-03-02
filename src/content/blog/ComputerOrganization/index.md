---
title: "计算机组成原理Notes"
description: "本篇笔记主要记录了在学习计算机组成原理过程中所做的笔记，内容涵盖了计算机系统的基本组成、指令系统、数据通路设计等方面的知识。"
date: "2026-02-28"
draft: false
tags: ["notes", "computer", "cpu"]
column: "学习笔记"
---

## 本门课程的主要内容

- CPU架构
- 汇编语言（主要是RISC-V，包含少量MIPS）

## CPU架构

### Core of CPU

#### ALU

#### CU

#### 寄存器

- 通用寄存器
- 程序计数器（PC）: 存储下一条指令的地址, 执行以后自动加4
- 指令寄存器（IR）： 存储当前正在执行的指令
- 状态寄存器（SR）： 存储CPU的状态信息，如条件码、控制位等
- 浮点寄存器（FPU）： 用于浮点运算的寄存器
- 特殊寄存器（如堆栈指针SP、全局指针GP等）： 用于特定功能的寄存器

#### Hazard Unit

### 数据通路设计

### Pipline

### Branch Prediction

### Cache

### Hazard Unit

### BUS

## RISC-V指令集

### RISC-V算术指令

```asm
add x1, x2, x3  # x1 = x2 + x3
sub x1, x2, x3  # x1 = x2 - x3
addi x1, x2, 10 # x1 = x2 + 10
sll x1, x2, 5   # x1 = x2 << 5
srl x1, x2, 5   # x1 = x2 >> 5
xor x1, x2, x3  # x1 = x2 ^ x3 
```

- add: 加法
- sub: 减法
- addi: 加法立即数
- sll: shift left logical
- srl: shift right logical
- xor: 按位异或

### RISC-V内存访问指令

```asm
lw x1, 0(x2)   # 从地址x2 + 0处加载一个字到x1
sw x1, 0(x2)   # 将x1中的字存储到地址x2 + 0处
```

- lw: Load Word, 从第二个操作数指定的内存地址加载一个字（4字节）到第一个操作数指定的寄存器中。注意，不是将内存地址加载到寄存器，而是将内存地址处的内容加载到寄存器。
- sw: Store Word

### RISC-V控制流指令

```asm
beq x1, x2, label  # 如果x1 == x2，则跳转到label
bne x1, x2, label  # 如果x1 != x2，则跳转到label
jal x1, label      # 将返回地址存储到x1，并跳转到label
jalr x1, 0(x2)    # 将返回地址存储到x1，并跳转到x2 + 0
``` 

- beq: Branch if Equal
- bne: Branch if Not Equal
- jal: Jump and Link
- jalr: Jump and Link Register

### RISC-V系统调用

```asm
li a7, 1        # 系统调用号1：打印整数
li a0, 42       # 要打印的整数
ecall           # 触发系统调用
```

- li: Load Immediate
- ecall: Environment Call (系统调用指令)

### RISC-V伪指令

```asm
li x1, 1000     # 伪指令，加载立即数1000到x1
mv x1, x2       # 伪指令，x1 = x2
```

伪指令是汇编器提供的便利指令，实际会被翻译成一系列基本指令。

### RISC-V的指令结构

RISC-V中，每一个Byte拥有一个地址，每条指令占用四个Byte，因此指令地址必须是4的倍数。指令格式分为R、I、S、B、U、J等类型，每种类型有不同的字段布局。例如：

- R型指令：包含opcode、rd、funct3、rs1、rs2、funct7等字段，适用于寄存器操作指令。
- I型指令：包含opcode、rd、funct3、rs1、imm等字段，适用于立即数操作指令。
- S型指令：包含opcode、funct3、rs1、rs2、imm等字段，适用于存储指令。
- B型指令：包含opcode、funct3、rs1、rs2、imm等字段，适用于分支指令。
- U型指令：包含opcode、rd、imm等字段，适用于上半立即数指令。
- J型指令：包含opcode、rd、imm等字段，适用于跳转指令。

在x86架构中，指令长度不固定，可能是1到15字节不等，这使得指令解码更复杂，但也提供了更大的灵活性和更多的指令选择。

```
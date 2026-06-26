---
title: "TeaOS / TeaSystem"
description: "An education-oriented x86_64 operating system with multicore support, virtual memory, and preemptive scheduling."
date: "2026-03-22"
repoURL: "https://github.com/hotteano/TeaOS"
---

TeaOS is a teaching-oriented operating system designed for learning modern OS principles. It targets x86_64 architecture and includes multicore support, virtual memory management, and preemptive scheduling.

The kernel is organized into clear subsystems: process scheduling, memory management, a virtual file system, device drivers, and a network stack. A hardware abstraction layer (HAL) isolates architecture-specific code such as interrupt handling, context switching, CPU initialization, and page-table management. A custom bootloader brings the system up before handing control to the kernel.

Key features:

- **Modern x86_64 support**: 64-bit long mode with SMP/multicore
- **Virtual memory**: page tables and memory mapping
- **Preemptive scheduling**: process management and scheduler
- **VFS and drivers**: extensible file-system and device-driver interfaces
- **Educational documentation**: architecture, kernel, memory, scheduler, and driver docs

The project is built with a standard x86_64 cross-compilation toolchain, NASM, QEMU, and Make. It is intended for classroom use and self-study of operating-system internals.

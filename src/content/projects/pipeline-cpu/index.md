---
title: "Five-Stage Pipeline CPU"
description: "SUSTech Computer Organization course design: a five-stage pipeline RISC CPU with caches, bus, DMA, and peripherals implemented in SystemVerilog on FPGA."
date: "2026-05-31"
category: "工程类"
subcategory: "硬件"
---

This is the course design project for SUSTech's Computer Organization course, completed in collaboration with Jiang Yihao and Hou Dongsheng. We implemented a complete five-stage pipeline RISC CPU in SystemVerilog and ran it on an FPGA board using Vivado.

The processor includes the classic IF/ID/EX/MEM/WB pipeline stages with hazard detection and forwarding. Around the core we built a small SoC with separate instruction and data caches, an AXI-like bus with arbiter and decoder, a DMA controller, on-chip BRAM, and basic peripherals (LED, UART debug, etc.). A dedicated divider unit and a simple clock divider are also integrated.

Key modules:

- **Core**: `cpu.sv`, `CU.sv`, `ALU.sv`, `HC` (hazard control), divider unit, and register file
- **Caches**: separate `I_Cache` and `D_Cache` with cache-control definitions
- **Bus**: arbiter, decoder, mux, and DMA for on-chip communication
- **Memory**: instruction/data BRAM interfaces
- **Peripherals**: LED, debug controller, and UART byte adapter

The project was synthesized and simulated in Vivado, with timing and functional verification performed before FPGA deployment.

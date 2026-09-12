# STM32-Based Structural Health Monitoring System

A **simulation-based Structural Health Monitoring (SHM) system for bridges** developed as a Microcontrollers mini project.

The project demonstrates how **STM32 microcontrollers and sensors can be strategically placed on different bridge structures** to monitor parameters such as vibration, strain, tilt, and temperature.

### Technologies

* STM32CubeIDE
* STM32G474RE
* I²C, UART, ADC & GPIO
* Sensor simulation
* Web-based bridge visualization

### Monitoring Logic

The system compares simulated sensor values against a configurable threshold:

* 🟢 **Green — Normal:** Sensor value ≤ threshold
* 🟡 **Yellow — Warning:** Minor/medium deviation + notification
* 🔴 **Red — Critical:** Large deviation + buzzer

### Supported Bridges

The overall design considers:

* Beam
* Arch
* Truss
* Cantilever
* Suspension
* Cable-stayed bridges

The website visualizes **sensor locations, STM32 nodes, their connections, and recommended components** for each bridge type.

Since physical STM32 boards and bridge sensors are unavailable, the current implementation uses **software-based sensor simulation**. The firmware architecture is designed so that simulated inputs can later be replaced with real sensor data.

> **Note:** This is an academic prototype and its thresholds are for demonstration purposes only; they are not real-world bridge safety limits.

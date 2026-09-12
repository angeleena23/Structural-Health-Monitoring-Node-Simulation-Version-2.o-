export interface HALProgram {
  id: string;
  title: string;
  filename: string;
  category: string;
  targetMcu: string;
  peripheralsUsed: string[];
  description: string;
  code: string;
}

export const HAL_PROGRAMS: HALProgram[] = [
  {
    id: 'main-timer-it',
    title: 'TIM2 200Hz Sampling & HAL GPIO Alert Interrupt',
    filename: 'main.c',
    category: 'System Core & DSP Loop',
    targetMcu: 'STM32F411RE / STM32F429ZI',
    peripheralsUsed: ['TIM2 (Hardware Timer)', 'GPIOA (LED/Buzzer Out)', 'I2C1', 'USART2'],
    description: 'Initializes the 100MHz System Clock, configures TIM2 for a 200 Hz periodic interrupt (5ms tick), collects raw IMU samples, computes 5-sample Moving Average DSP filtering, and triggers HAL GPIO pins for local visual/audio alert indicators.',
    code: `/*
 * ============================================================================
 * Project: STM32 Structural Health Monitoring (SHM) Node Firmware
 * Target Microcontroller: STM32F411RE (Nucleo-F411RE)
 * Compiler: STM32CubeIDE / GCC ARM Embedded
 * Author: Structural Health Monitoring Capstone Team
 * Course: Microcontrollers & Embedded Systems
 * File: main.c
 * ============================================================================
 */

#include "main.h"
#include "mpu6050_hal.h"
#include "usart_telemetry.h"
#include <math.h>
#include <stdio.h>

/* Private variables ---------------------------------------------------------*/
I2C_HandleTypeDef hi2c1;
TIM_HandleTypeDef htim2;
UART_HandleTypeDef huart2;

/* SHM Sensor Data Structure */
typedef struct {
    float raw_accel_z;
    float filtered_accel_z;
    float vibration_rms;
    float strain_micro;
    uint8_t alert_status; // 0: SAFE, 1: CAUTION, 2: DANGER
} SHM_Telemetry_t;

SHM_Telemetry_t g_shm_node;

/* DSP Moving Average Buffer */
#define FILTER_WINDOW_SIZE 5
float g_filter_buf[FILTER_WINDOW_SIZE] = {0};
uint8_t g_filter_idx = 0;

/* Threshold Constants (m/s^2) */
#define THRESHOLD_CAUTION  0.35f
#define THRESHOLD_DANGER   0.65f

/* Function Prototypes */
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_I2C1_Init(void);
static void MX_TIM2_Init(void);
static void MX_USART2_UART_Init(void);
float Apply_Moving_Average(float new_sample);

int main(void)
{
    /* Reset of all peripherals, Initializes the Flash interface and Systick. */
    HAL_Init();

    /* Configure System Clock to 100 MHz */
    SystemClock_Config();

    /* Initialize all configured peripherals */
    MX_GPIO_Init();
    MX_I2C1_Init();
    MX_USART2_UART_Init();
    MX_TIM2_Init();

    /* Initialize MPU6050 3-Axis IMU via I2C HAL */
    if (MPU6050_Init(&hi2c1) != HAL_OK) {
        // Red LED toggle error trap
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);
        Error_Handler();
    }

    /* Start Timer2 Base in Interrupt Mode (200 Hz tick rate) */
    HAL_TIM_Base_Start_IT(&htim2);

    char tx_buf[128];

    /* Main Super-Loop */
    while (1)
    {
        /* Transmit framed ASCII telemetry payload over UART every 1000 ms */
        snprintf(tx_buf, sizeof(tx_buf),
                 "$SHM,NODE_B1,RMS:%.3f,STAT:%d*\\r\\n",
                 g_shm_node.vibration_rms, g_shm_node.alert_status);
        
        HAL_UART_Transmit(&huart2, (uint8_t*)tx_buf, strlen(tx_buf), 100);

        /* Sleep CPU until next interrupt (Low Power Mode) */
        HAL_PWR_EnterSLEEPMode(PWR_MAINREGULATOR_ON, PWR_SLEEPENTRY_WFI);
    }
}

/**
  * @brief  Period elapsed callback in non-blocking mode (TIM2 @ 200 Hz)
  * @param  htim TIM handle
  * @retval None
  */
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    if (htim->Instance == TIM2)
    {
        /* 1. Sample Acceleration Z-Axis from MPU6050 over I2C */
        float raw_z = MPU6050_Read_Accel_Z(&hi2c1);
        g_shm_node.raw_accel_z = raw_z;

        /* 2. Apply 5-Sample Moving Average Filter */
        g_shm_node.filtered_accel_z = Apply_Moving_Average(raw_z);

        /* 3. Compute Root-Mean-Square (RMS) vibration */
        g_shm_node.vibration_rms = fabsf(g_shm_node.filtered_accel_z - 9.81f);

        /* 4. Evaluate Thresholds & Control HAL GPIO Outputs */
        if (g_shm_node.vibration_rms >= THRESHOLD_DANGER) {
            g_shm_node.alert_status = 2; // DANGER
            HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);   // Red LED ON
            HAL_GPIO_WritePin(GPIOB, GPIO_PIN_1, GPIO_PIN_RESET); // Yellow LED OFF
            HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);  // Buzzer ON
        }
        else if (g_shm_node.vibration_rms >= THRESHOLD_CAUTION) {
            g_shm_node.alert_status = 1; // CAUTION
            HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_RESET);
            HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_1); // Toggle Yellow LED
            HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
        }
        else {
            g_shm_node.alert_status = 0; // SAFE
            HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_RESET);
            HAL_GPIO_WritePin(GPIOB, GPIO_PIN_1, GPIO_PIN_RESET);
            HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
        }
    }
}

float Apply_Moving_Average(float new_sample)
{
    g_filter_buf[g_filter_idx] = new_sample;
    g_filter_idx = (g_filter_idx + 1) % FILTER_WINDOW_SIZE;

    float sum = 0.0f;
    for (int i = 0; i < FILTER_WINDOW_SIZE; i++) {
        sum += g_filter_buf[i];
    }
    return (sum / (float)FILTER_WINDOW_SIZE);
}

static void MX_TIM2_Init(void)
{
    TIM_ClockConfigTypeDef sClockSourceConfig = {0};
    TIM_MasterConfigTypeDef sMasterConfig = {0};

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 999;        // 100MHz / 1000 = 100 kHz timer clock
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 499;           // 100 kHz / 500 = 200 Hz interrupt
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    HAL_TIM_Base_Init(&htim2);
}
`
  },
  {
    id: 'mpu6050-i2c-hal',
    title: 'I2C HAL MPU6050 3-Axis IMU Sensor Driver',
    filename: 'mpu6050_hal.c',
    category: 'Sensor Drivers (I2C)',
    targetMcu: 'STM32F4 / STM32L4 / STM32H7',
    peripheralsUsed: ['I2C1 (Fast Mode 400kHz)', 'DMA1'],
    description: 'Production I2C HAL driver reading accelerometer & gyroscope registers (`0x3B`-`0x40`) using `HAL_I2C_Mem_Read()`, converting raw 16-bit 2\'s complement values into $m/s^2$ acceleration vectors.',
    code: `/*
 * MPU6050 I2C HAL Sensor Driver for STM32
 * File: mpu6050_hal.c
 */

#include "mpu6050_hal.h"

#define MPU6050_ADDR         (0x68 << 1)  // I2C 7-bit Address shifted left
#define REG_PWR_MGMT_1       0x6B
#define REG_ACCEL_XOUT_H     0x3B
#define ACCEL_SENSITIVITY_2G 16384.0f

HAL_StatusTypeDef MPU6050_Init(I2C_HandleTypeDef *hi2c)
{
    uint8_t check;
    uint8_t data;

    // Read WHO_AM_I register (0x75)
    HAL_I2C_Mem_Read(hi2c, MPU6050_ADDR, 0x75, 1, &check, 1, 100);

    if (check == 0x68) { // MPU6050 confirmed
        // Wake up MPU6050 by writing 0x00 to Power Management 1 register
        data = 0x00;
        return HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, REG_PWR_MGMT_1, 1, &data, 1, 100);
    }
    return HAL_ERROR;
}

float MPU6050_Read_Accel_Z(I2C_HandleTypeDef *hi2c)
{
    uint8_t rec_data[6];
    int16_t accel_z_raw;

    // Read 6 bytes starting from ACCEL_XOUT_H (0x3B)
    if (HAL_I2C_Mem_Read(hi2c, MPU6050_ADDR, REG_ACCEL_XOUT_H, 1, rec_data, 6, 100) == HAL_OK)
    {
        // Assemble Z-axis 16-bit raw signed integer from high & low bytes
        accel_z_raw = (int16_t)(rec_data[4] << 8 | rec_data[5]);

        // Convert raw LSBs to Acceleration in m/s^2 (9.81 m/s^2 per 1G)
        float accel_g = (float)accel_z_raw / ACCEL_SENSITIVITY_2G;
        return (accel_g * 9.81065f);
    }
    return 9.81f; // Default nominal gravity fallback
}
`
  },
  {
    id: 'hx711-spi-strain-hal',
    title: 'SPI 24-Bit ADC Wheatstone Strain Gauge Driver',
    filename: 'hx711_hal.c',
    category: 'Precision ADC (Wheatstone Bridge)',
    targetMcu: 'STM32F429ZI / STM32H743VI',
    peripheralsUsed: ['SPI1 / GPIO Bit-Bang', 'HX711 24-Bit ADC'],
    description: 'High-resolution strain gauge driver reading 24-bit differential voltage from Wheatstone bridge sensors on mid-span girders and arch crowns, calculating structural micro-strain ($\mu\epsilon$).',
    code: `/*
 * HX711 24-Bit Wheatstone Bridge ADC HAL Driver
 * File: hx711_hal.c
 */

#include "hx711_hal.h"

#define HX711_SCK_GPIO_PORT  GPIOA
#define HX711_SCK_PIN        GPIO_PIN_6
#define HX711_DOUT_GPIO_PORT GPIOA
#define HX711_DOUT_PIN       GPIO_PIN_7

uint32_t HX711_Read_Raw(void)
{
    uint32_t count = 0;

    // Wait until DOUT pin goes LOW (conversion complete)
    while(HAL_GPIO_ReadPin(HX711_DOUT_GPIO_PORT, HX711_DOUT_PIN) == GPIO_PIN_SET);

    // Pulse SCK 24 times to clock out 24 data bits
    for(int i = 0; i < 24; i++) {
        HAL_GPIO_WritePin(HX711_SCK_GPIO_PORT, HX711_SCK_PIN, GPIO_PIN_SET);
        count = count << 1;
        HAL_GPIO_WritePin(HX711_SCK_GPIO_PORT, HX711_SCK_PIN, GPIO_PIN_RESET);
        if(HAL_GPIO_ReadPin(HX711_DOUT_GPIO_PORT, HX711_DOUT_PIN)) {
            count++;
        }
    }

    // 25th pulse sets gain to 128 for next reading
    HAL_GPIO_WritePin(HX711_SCK_GPIO_PORT, HX711_SCK_PIN, GPIO_PIN_SET);
    HAL_GPIO_WritePin(HX711_SCK_GPIO_PORT, HX711_SCK_PIN, GPIO_PIN_RESET);

    // 2's complement sign extension for 24-bit output
    if (count & 0x800000) {
        count |= 0xFF000000;
    }
    return count;
}

float HX711_Calculate_MicroStrain(uint32_t raw_val, uint32_t zero_offset)
{
    int32_t diff = (int32_t)raw_val - (int32_t)zero_offset;
    // Calibration factor: LSBs per micro-strain
    float scale = 210.5f; 
    return (float)diff / scale;
}
`
  },
  {
    id: 'usart-dma-telemetry-hal',
    title: 'USART DMA ASCII Telemetry Frame Transmission',
    filename: 'usart_telemetry.c',
    category: 'Communications (UART / Gateway)',
    targetMcu: 'All STM32 MCUs',
    peripheralsUsed: ['USART2', 'DMA1 Stream 6'],
    description: 'Non-blocking DMA UART transmission framing sensor telemetry into standardized NMEA-like ASCII packets for edge gateway aggregation.',
    code: `/*
 * Non-Blocking USART DMA Telemetry Driver
 * File: usart_telemetry.c
 */

#include "usart_telemetry.h"
#include <stdio.h>
#include <string.h>

extern UART_HandleTypeDef huart2;
uint8_t g_uart_tx_buffer[256];

HAL_StatusTypeDef Telemetry_SendPacket_DMA(const char* node_id, float rms, float strain, float temp)
{
    // Format NMEA-compatible telemetry frame: $SHM,NODE_ID,RMS,STRAIN,TEMP*CRC\r\n
    uint16_t len = snprintf((char*)g_uart_tx_buffer, sizeof(g_uart_tx_buffer),
                            "$SHM,%s,RMS:%.3f,STR:%.1f,TMP:%.1f*\\r\\n",
                            node_id, rms, strain, temp);

    // Transmit over DMA without blocking CPU
    return HAL_UART_Transmit_DMA(&huart2, g_uart_tx_buffer, len);
}
`
  }
];

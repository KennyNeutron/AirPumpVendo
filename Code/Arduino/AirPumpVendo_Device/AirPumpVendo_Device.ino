/*
 * Project: AirPumpVendo
 * File: AirPumpVendo_Device.ino
 * Description: Main firmware for the Air Pump Vending Machine.
 *              Handles communication with the desktop app, controls the air pump,
 *              and reads sensors (pressure, coin selector, etc.).
 * 
 * Author: 
 * Date: 2025-12-05
 * 
 * Board: Arduino Uno / Nano / ESP32 (Check configuration)
 */

const byte COIN_PIN = 2;                    // Must be interrupt-capable on Uno/Nano
const unsigned long COIN_TIMEOUT_MS = 200;  // Gap to consider "end of coin" (tweak if needed)

volatile unsigned int pulseCount = 0;  // Updated inside ISR
volatile unsigned long lastPulseTime = 0;

long totalCredit = 0;  // e.g. in pesos or credits

const String PREFIX_PAYMENT = "PAYMENT:";
const String PREFIX_INFLATE = "INFLATE:";
String inputBuffer = "";

int Payable = 0;         // This will hold the parsed amount
int TargetPressure = 0;  // Target pressure in PSI
#define LEDpin 13
bool Vending = false;


#define SolenoidPin 3
const int PRESSURE_PIN = A0;  // Analog pin where sensor signal is connected

// ADC / voltage configuration
const float VREF = 5.0;        // ADC reference voltage (5 V for typical Arduino)
const float ADC_MAX = 1023.0;  // 10-bit ADC max value

// Sensor characteristics (typical for 0.5–4.5 V transducer)
const float SENSOR_MIN_V = 0.5;    // Voltage at 0 MPa
const float SENSOR_MAX_V = 4.5;    // Voltage at full scale (1.2 MPa)
const float SENSOR_MAX_MPA = 1.2;  // Full-scale pressure in MPa

// Reading configuration
const unsigned long READ_INTERVAL_MS = 500;  // how often to print
const int NUM_SAMPLES = 10;                  // samples to average per reading

unsigned long lastReadTime = 0;
bool Inflating = false;
float pressureBar = 0.0;
float pressurePSI = 0.0;
int pressurePSI_Int = 0;

void coinPulseISR() {
  pulseCount++;
  lastPulseTime = millis();
}

void setup() {
  Serial.begin(115200);

  pinMode(LEDpin, OUTPUT);
  digitalWrite(LEDpin, 0);

  pinMode(SolenoidPin, OUTPUT);
  digitalWrite(SolenoidPin, 0);

  pinMode(COIN_PIN, INPUT_PULLUP);  // Expect active-LOW pulses
  pinMode(PRESSURE_PIN, INPUT);

  attachInterrupt(digitalPinToInterrupt(COIN_PIN), coinPulseISR, FALLING);

  Serial.println("AirPumpVendo Started...");
}

void loop() {
  static unsigned long lastCheck = 0;
  unsigned long now = millis();

  if (pulseCount > 0) {
    // Copy volatile values atomically
    noInterrupts();
    unsigned int pulses = pulseCount;
    unsigned long lastPulse = lastPulseTime;
    interrupts();

    if (now - lastPulse > COIN_TIMEOUT_MS) {
      // No more pulses for a while -> treat as a finished coin
      noInterrupts();
      pulseCount = 0;  // reset for next coin
      interrupts();

      int coinValue = pulses;

      //   Serial.print("Detected ");
      //   Serial.print(pulses);
      //   Serial.print(" pulse(s) -> ");

      if (coinValue > 0) {
        totalCredit += coinValue;
        // Serial.print("Coin value: ");
        // Serial.print(coinValue);
        // Serial.print(" | Total credit: ");
        // Serial.println(totalCredit);
      } else {
        // Serial.println("Unknown coin / invalid pulse count");
      }

      //   Serial.println();
    }
  }

  SerialCOM();

  if (Vending) {
    digitalWrite(LEDpin, 1);
    delay(100);
    digitalWrite(LEDpin, 0);
    delay(100);
    Serial.println("INSERTED:" + String(totalCredit));
    if (Payable > 0) {
      if (totalCredit >= Payable) {
        Serial.println("PAYMENT COMPLETE");
        Vending = false;
        totalCredit=0;
      }
    }
  }

  if (Inflating) {
    InflateTire();
  }
}

void InflateTire() {
  while (1) {
    digitalWrite(SolenoidPin, 1);
    delay(1500);
    digitalWrite(SolenoidPin, 0);
    delay(600);
    ReadPressureInflate();
    pressurePSI_Int = (int)(pressurePSI);
    Serial.println("PRESSURE:" + String(pressurePSI_Int));
    if (pressurePSI_Int >= TargetPressure) {
      Inflating = false;
      digitalWrite(SolenoidPin, 0);
      break;
    }
  }
}
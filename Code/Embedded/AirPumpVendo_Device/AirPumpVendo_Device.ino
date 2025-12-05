/*
 * Project: AirPumpVendo
 * File: AirPumpVendo_Device.ino
 * Description: Main firmware for the Air Pump Vending Machine.
 *              Handles communication with the desktop app, controls the air pump,
 *              and reads sensors (pressure, coin selector, etc.).
 * 
 * Author: NDMC 2025 Team
 * Date: 2025-12-05
 * 
 * Board: Arduino Uno / Nano / ESP32 (Check configuration)
 */

const byte COIN_PIN = 2;                    // Must be interrupt-capable on Uno/Nano
const unsigned long COIN_TIMEOUT_MS = 200;  // Gap to consider "end of coin" (tweak if needed)

volatile unsigned int pulseCount = 0;  // Updated inside ISR
volatile unsigned long lastPulseTime = 0;

long totalCredit = 0;  // e.g. in pesos or credits

const String PREFIX = "PAYMENT:";
String inputBuffer = "";

int Payable = 0;  // This will hold the parsed amount
#define LEDpin 13
bool Vending = false;

void coinPulseISR() {
  pulseCount++;
  lastPulseTime = millis();
}

void setup() {
  Serial.begin(115200);

  pinMode(LEDpin, OUTPUT);
  digitalWrite(LEDpin, 0);
  pinMode(COIN_PIN, INPUT_PULLUP);  // Expect active-LOW pulses

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
      }
    }
  }
}

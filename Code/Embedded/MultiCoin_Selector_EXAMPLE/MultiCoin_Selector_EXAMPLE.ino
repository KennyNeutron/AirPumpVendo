/*
  Allan 1239A Multi Coin Selector + Arduino
  ----------------------------------------
  - Coin selector powered at 12 V (GND tied to Arduino GND)
  - Pulse output connected to Arduino digital pin 2

  Behaviour:
  - Each coin generates N pulses (N depends on the coin channel/programming)
  - This sketch counts the pulses within a short time window and converts
    them into a coin value, then prints to Serial and updates total credit.

  Adjust the "getCoinValueFromPulses()" function for your own pulse mapping.
*/

const byte COIN_PIN = 2;                    // Must be interrupt-capable on Uno/Nano
const unsigned long COIN_TIMEOUT_MS = 200;  // Gap to consider "end of coin" (tweak if needed)

volatile unsigned int pulseCount = 0;  // Updated inside ISR
volatile unsigned long lastPulseTime = 0;

long totalCredit = 0;  // e.g. in pesos or credits

void coinPulseISR() {
  // Called on each pulse (falling edge)
  pulseCount++;
  lastPulseTime = millis();
}

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ;  // wait for Serial on some boards
  }

  pinMode(COIN_PIN, INPUT_PULLUP);  // Expect active-LOW pulses

  attachInterrupt(digitalPinToInterrupt(COIN_PIN), coinPulseISR, FALLING);

  Serial.println("Allan 1239A Coin Selector Test");
  Serial.println("Waiting for coins...");
  Serial.println();
}

void loop() {
  static unsigned long lastCheck = 0;
  unsigned long now = millis();

  // Check if a coin sequence has finished (no pulses for COIN_TIMEOUT_MS)
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

      int coinValue = getCoinValueFromPulses(pulses);

      Serial.print("Detected ");
      Serial.print(pulses);
      Serial.print(" pulse(s) -> ");

      if (coinValue > 0) {
        totalCredit += coinValue;
        Serial.print("Coin value: ");
        Serial.print(coinValue);
        Serial.print(" | Total credit: ");
        Serial.println(totalCredit);
      } else {
        Serial.println("Unknown coin / invalid pulse count");
      }

      Serial.println();
    }
  }

  // Optional: do other tasks here
}

/*
  Map pulse counts to coin values.

  Example mapping (adjust to match your programming):

    1 pulse  = 1 peso
    2 pulses = 5 pesos
    3 pulses = 10 pesos
    4 pulses = 20 pesos
    5 pulses = 50 pesos

  Change this table to match what you configured in the coin selector.
*/
int getCoinValueFromPulses(unsigned int pulses) {
  return pulses;
}

/*
  Pressure Transducer 0–1.2 MPa (0.5–4.5 V) Example
  Board: Arduino Uno / Nano / any 5 V Arduino
  Signal: connect sensor output to A0
  Power : sensor V+ to 5V, GND to GND

  Output: prints pressure in MPa, bar, and psi to Serial Monitor
*/

const int PRESSURE_PIN = A0;     // Analog pin where sensor signal is connected

// ADC / voltage configuration
const float VREF = 5.0;          // ADC reference voltage (5 V for typical Arduino)
const float ADC_MAX = 1023.0;    // 10-bit ADC max value

// Sensor characteristics (typical for 0.5–4.5 V transducer)
const float SENSOR_MIN_V = 0.5;  // Voltage at 0 MPa
const float SENSOR_MAX_V = 4.5;  // Voltage at full scale (1.2 MPa)
const float SENSOR_MAX_MPA = 1.2; // Full-scale pressure in MPa

// Reading configuration
const unsigned long READ_INTERVAL_MS = 500; // how often to print
const int NUM_SAMPLES = 10;                 // samples to average per reading

unsigned long lastReadTime = 0;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for Serial on some boards
  }

  Serial.println("Pressure Transducer Test (0–1.2 MPa, 0.5–4.5 V)");
  Serial.println("Make sure sensor is wired: V+->5V, GND->GND, OUT->A0");
  Serial.println();
}

void loop() {
  unsigned long now = millis();
  if (now - lastReadTime >= READ_INTERVAL_MS) {
    lastReadTime = now;

    // Take multiple samples and average to reduce noise
    long sum = 0;
    for (int i = 0; i < NUM_SAMPLES; i++) {
      sum += analogRead(PRESSURE_PIN);
      delay(5); // small delay between samples
    }
    float raw = sum / (float)NUM_SAMPLES;

    // Convert ADC value to voltage
    float voltage = (raw / ADC_MAX) * VREF;

    // Map voltage to pressure in MPa
    float pressureMPa = 0.0;

    if (voltage <= SENSOR_MIN_V) {
      // Below sensor minimum -> treat as 0 MPa
      pressureMPa = 0.0;
    } else if (voltage >= SENSOR_MAX_V) {
      // Above sensor max -> clamp to full scale
      pressureMPa = SENSOR_MAX_MPA;
    } else {
      // Linear mapping between SENSOR_MIN_V and SENSOR_MAX_V
      float spanV = SENSOR_MAX_V - SENSOR_MIN_V;
      float normalized = (voltage - SENSOR_MIN_V) / spanV; // 0.0 to 1.0
      pressureMPa = normalized * SENSOR_MAX_MPA;
    }

    // Convert to other units
    float pressureBar = pressureMPa * 10.0;       // 1 MPa ≈ 10 bar
    float pressurePSI = pressureMPa * 145.038;    // 1 MPa ≈ 145.038 psi

    // Print results
    Serial.print("Raw ADC: ");
    Serial.print(raw, 1);
    Serial.print("  |  Voltage: ");
    Serial.print(voltage, 3);
    Serial.print(" V");

    Serial.print("  |  Pressure: ");
    Serial.print(pressureMPa, 3);
    Serial.print(" MPa  (");
    Serial.print(pressureBar, 2);
    Serial.print(" bar, ");
    Serial.print(pressurePSI, 1);
    Serial.println(" psi)");
  }
}




void PressureInflate() {
  unsigned long now = millis();
  if (now - lastReadTime >= READ_INTERVAL_MS) {
    lastReadTime = now;

    // Take multiple samples and average to reduce noise
    long sum = 0;
    for (int i = 0; i < NUM_SAMPLES; i++) {
      sum += analogRead(PRESSURE_PIN);
      delay(5);  // small delay between samples
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
      float normalized = (voltage - SENSOR_MIN_V) / spanV;  // 0.0 to 1.0
      pressureMPa = normalized * SENSOR_MAX_MPA;
    }

    // Convert to other units
    pressureBar = pressureMPa * 10.0;     // 1 MPa ≈ 10 bar
    pressurePSI = pressureMPa * 145.038;  // 1 MPa ≈ 145.038 psi
  }
}
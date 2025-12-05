// Board: Arduino Uno / Nano (default Serial)
// Function: Wait for the exact string "PAYMENT" at 9600 baud.

const String TARGET = "PAYMENT";
String inputBuffer = "";

#define LEDpin 13

void setup() {
  pinMode(LEDpin, OUTPUT);
  digitalWrite(LEDpin, 0);
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for Serial to be ready (useful on some boards like Leonardo)
  }

  Serial.println("Waiting for 'PAYMENT' over Serial at 9600...");
}

void loop() {
  // Read incoming characters if available
  while (Serial.available() > 0) {
    char c = Serial.read();

    // Handle line endings: assume sender may send '\n', '\r', or both
    if (c == '\n' || c == '\r') {
      // Only process if we actually have something in the buffer
      if (inputBuffer.length() > 0) {
        // Check if the received string matches "PAYMENT"
        if (inputBuffer == TARGET) {
          Serial.println("PAYMENT detected!");
          // Place your code here (e.g., trigger relay, unlock, etc.)
          while(1){
            digitalWrite(LEDpin, 1);
            delay(100);
            digitalWrite(LEDpin, 0);
            delay(100);
          }
        } else {
          Serial.print("Received: ");
          Serial.println(inputBuffer);
        }
        // Clear buffer for the next message
        inputBuffer = "";
      }
    } else {
      // Add character to buffer
      inputBuffer += c;

      // Optional: safety guard against overly long input
      if (inputBuffer.length() > 32) {
        inputBuffer = "";
      }
    }
  }
}

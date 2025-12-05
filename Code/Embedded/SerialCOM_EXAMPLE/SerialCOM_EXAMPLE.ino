// Board: Arduino Uno / Nano (default Serial)
// Function: Wait for strings like "PAYMENT:30" at 9600 baud
//           and save the amount (e.g., 30) to Payable.

const String PREFIX = "PAYMENT:";
String inputBuffer = "";

int Payable = 0;  // This will hold the parsed amount
#define LEDpin 13

void setup() {
  pinMode(LEDpin, OUTPUT);
  digitalWrite(LEDpin, 0);
  Serial.begin(115200);
  while (!Serial) {
    ; // Wait for Serial to be ready on boards like Leonardo
  }

  Serial.println("Waiting for 'PAYMENT:<amount>' over Serial at 9600...");
}

void loop() {
  // Read incoming characters if available
  while (Serial.available() > 0) {
    char c = Serial.read();

    // Handle line endings: assume sender may send '\n', '\r', or both
    if (c == '\n' || c == '\r') {
      // Only process if we actually have something in the buffer
      if (inputBuffer.length() > 0) {
        processMessage(inputBuffer);
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

void processMessage(const String &msg) {
  // Check if message starts with "PAYMENT:"
  if (msg.startsWith(PREFIX)) {
    // Extract the part after "PAYMENT:"
    String amountStr = msg.substring(PREFIX.length());
    amountStr.trim();  // Remove any spaces or stray characters

    // Convert to integer
    int value = amountStr.toInt();

    // Basic sanity check: toInt() returns 0 if it can't parse,
    // so we only accept if the string is "0" or parses to > 0
    if (value > 0 || amountStr == "0") {
      Payable = value;
      Serial.print("PAYMENT received. Payable set to: ");
      Serial.println(Payable);
      // Put your action here, e.g.:
      // triggerRelay();
      if(Payable == 30){
        while(1){
          digitalWrite(LEDpin, 1);
          delay(100);
          digitalWrite(LEDpin, 0);
          delay(100);
        }
      }
    } else {
      Serial.print("Invalid PAYMENT amount: ");
      Serial.println(amountStr);
    }
  } else {
    // Not a PAYMENT message, just echo
    Serial.print("Received (ignored): ");
    Serial.println(msg);
  }
}

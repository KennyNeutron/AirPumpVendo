void SerialCOM() {
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
      delay(3000);
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

# Coin-Operated Smart Tire Air Pump Vending Machine

## Description

The Coin-Operated Smart Tire Air Pump Vending Machine is a microcontroller-driven, self-service system that provides a fast, safe, and user-friendly way to inflate vehicle tires. Perfect for public locations like vulcanizing shops, parking lots, terminals, and gas stations, it offers tire code lookup, a free DOT safety check, and auto-stop inflation at a target PSI.

## Services

1. **Tire Code Info & Inflation**
   - **Lookup by Code**: Input tire code (e.g., 225/60R16) to get recommended PSI from the internal database.
   - **Manual Input**: Manually set a custom target PSI if the recommended pressure is already known.
   - **Inflation**: Automatic stop at the target PSI with live pressure monitoring.
2. **DOT Code Safety Check (Free Service)**
   - Input DOT code (e.g., 1021) to determine tire age.
   - Displays whether the tire is Safe, requires Caution, or needs Immediate Replacement.

## System Architecture

![Block Diagram](Docs/AirPumpVendo_BlockDiagram.jpg)

## Hardware Requirements

- Microcontroller (e.g., Arduino Uno or similar)
- TFT display module (7" 800×480 optimized)
- Pressure sensor for live PSI monitoring
- Coin acceptor mechanism (Pulse-based)
- Solid State Relay (SSR) for compressor control
- Power supply and industrial-grade enclosure

## Software Requirements

- **Electron & Next.js**: Modern touch-optimized UI for the operator interface.
- **Arduino Firmware**: C++ logic for sensors, relays, and serial communication.
- **Serial Communication**: Robust protocol between the UI and the controller.

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-tire-air-pump.git
   cd smart-tire-air-pump
   ```
2. **Desktop UI Setup** (Inside `Code/Desktop/AirPumpVendo`)
   ```bash
   npm install
   npm run dev
   ```
3. **Firmware Setup** (Inside `Code/Arduino/AirPumpVendo_Device`)
   - Open `AirPumpVendo_Device.ino` in Arduino IDE.
   - Configure pin definitions and upload to your microcontroller.

## Usage

1. **Select Service**: Choose from the main menu (Tire Service or DOT Check).
2. **Setup Inflation**:
   - For Tire Service: Enter your tire code for a recommendation OR enter PSI manually.
   - For DOT Check: This service is free; follow prompts to check tire safety.
3. **Payment**: Insert coins as required for paid services. The single total cost is displayed on screen.
4. **Inflation**:
   - Connect the hose to the tire valve.
   - Press “Start Inflation.”
   - The machine auto-stops once the target PSI is reached.
5. **Completion**: Remove the hose and return to the home screen.

## Admin Control Panel

- Secure access via password-protected login.
- **Manage Tire Codes**: Add/remove recommended PSI mappings.
- **DOT Database**: Update the list of known DOT codes and safety thresholds.
- **Pricing Management**: Set standard rates for info and inflation services.
- **Analytics**: View weekly revenue reports and service usage statistics.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add YourFeature"`).
4. Push to branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

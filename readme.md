# Arduino Serial Communication

A Node.js application built with TypeScript that communicates with ESP8266 devices via serial connection to collect sensor data, control LEDs, and scan WiFi networks.

## Features

- Serial communication with ESP8266 devices
- Environmental sensor data collection (DHT sensors for temperature/humidity)
- Air quality monitoring (CCS811 CO2 and TVOC sensors)
- WiFi network scanning capabilities
- LED control (Green and Red LEDs)
- Buffer management for high-throughput data
- TypeScript for type safety
- Comprehensive testing with Vitest
- Hot reload development with tsx

## Prerequisites

- Node.js (v16 or higher)
- ESP8266 device with connected sensors (DHT, CCS811)
- LEDs (Green and Red)
- USB cable for serial connection

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nodejs_ts_vitest
```

2. Install dependencies:
```bash
npm install
```

3. Connect your ESP8266 device via USB

## Usage

### Development Mode
Run the application in development mode with hot reload:
```bash
npm run dev
```

### Production Build
Build the TypeScript project:
```bash
npm run build
```

Run the compiled application:
```bash
npm start
```

### Testing
Run the test suite:
```bash
npm test
```

## Project Structure

```
├── src/
│   ├── index.ts          # Main application entry point
│   └── ...               # Additional source files
├── build/                # Compiled JavaScript output
├── tests/                # Test files
├── package.json
├── tsconfig.json
└── README.md
```

## ESP8266 Setup

### Required Components
- ESP8266 microcontroller
- DHT sensor (temperature and humidity)
- CCS811 sensor (CO2 and TVOC)
- Green and Red LEDs
- WiFi capability enabled

### Serial Communication Protocol
The application communicates with the ESP8266 at 115200 baud rate. The ESP8266 should be programmed to:

1. Initialize serial communication (`Serial.begin(115200)`)
2. Set up WiFi scanning capabilities
3. Configure DHT and CCS811 sensors
4. Control LED states
5. Respond to specific commands with formatted data

### Example ESP8266 Response Formats
```
// WiFi Scan Responses
SCANNING_WIFI...
WIFI:NetworkName,-67,WPA2

// Sensor Responses
DHT_ERROR                    // When DHT sensor fails
CO2:1330,TVOC:141           // CCS811 sensor data

// LED Control Responses
GREEN_LED:ON
RED_LED:ON
GREEN_LED:OFF
RED_LED:OFF
```

## Configuration

### Serial Port Settings
Update the serial port configuration in your application to match your ESP8266 connection:
- **Baud Rate**: 115200
- **Port**: `/dev/ttyUSB0` (Linux), `COM3` (Windows), or as detected by your system

## API Reference

### Serial Commands
The application supports the following commands:

#### Sensor Data Commands
- `SCAN_WIFI` - Scan for available WiFi networks
- `GET_DHT` - Retrieve DHT sensor data (temperature and humidity)
- `GET_CCS` - Retrieve CCS811 sensor data (CO2 and TVOC levels)

#### LED Control Commands
- `LED_GREEN_ON` - Turn on the green LED
- `LED_GREEN_OFF` - Turn off the green LED
- `LED_RED_ON` - Turn on the red LED
- `LED_RED_OFF` - Turn off the red LED

### Response Formats
Expected response formats from ESP8266:

#### WiFi Scan Responses
```
SCANNING_WIFI...
WIFI:NetworkName,SignalStrength,SecurityType
```

#### Sensor Data Responses
```
CO2:1330,TVOC:141    # CCS811 sensor data
DHT_ERROR            # DHT sensor error state
```

#### LED Control Responses
```
GREEN_LED:ON
GREEN_LED:OFF
RED_LED:ON
RED_LED:OFF
```

## Troubleshooting

### Common Issues

**Port Access Denied**
- On Linux/macOS: Add your user to the dialout group
  ```bash
  sudo usermod -a -G dialout $USER
  ```
- On Windows: Check Device Manager for correct COM port

**Connection Timeouts**
- Verify the correct baud rate (9600)
- Check ESP8266 serial monitor for output
- Ensure ESP8266 is properly connected and powered

**DHT Sensor Errors**
- Check DHT sensor wiring and power supply
- Verify sensor compatibility (DHT11/DHT22)
- Allow time for sensor stabilization after power-on

**CCS811 Sensor Issues**
- Ensure proper warm-up time for CCS811 sensor
- Check I2C connections if using I2C interface
- Verify sensor calibration

**Permission Errors**
- Run with appropriate permissions
- Check port accessibility

## Development

### Adding New Sensors
1. Update ESP8266 sketch to include new sensor readings
2. Add new command handlers in the ESP8266 code
3. Modify TypeScript interfaces for new data types
4. Add corresponding command functions in Node.js
5. Write tests for new functionality

### Testing Strategy
- Unit tests for data parsing functions
- Integration tests for serial communication
- Mock ESP8266 responses for consistent testing
- Buffer management stress testing
- LED control verification
- WiFi scanning functionality tests

## Dependencies

### Production
- `serialport`: Serial communication with ESP8266 devices

### Development
- `@types/node`: TypeScript definitions for Node.js
- `tsx`: TypeScript execution and hot reload
- `typescript`: TypeScript compiler
- `vitest`: Fast testing framework

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

ISC License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Arduino serial output
3. Open an issue with detailed error information and system details
// src/index.ts
import { ESP8266TestRunner } from './testRunner';
import { scanPorts } from './utils/portScanner';

async function main() {
  console.log('ESP8266 SerialPort Testing Suite');
  console.log('================================');

  // First, scan for available ports
  // await scanPorts();

  // Update this with your ESP8266's actual port
  const ESP_PORT = '/dev/ttyUSB0'; // Linux

  const testRunner = new ESP8266TestRunner(ESP_PORT);

  try {
    // Run tests
    const connected = await testRunner.runBasicConnectivityTest();
    
    if (connected) {
      await testRunner.runSensorDataTest(2000);
      await testRunner.runLEDControlTest();
      await testRunner.runBufferStressTest();
      
      console.log('\nTest Results:', JSON.stringify(testRunner.getTestResults(), null, 2));
    }
  } catch (error) {
    console.error('Test suite error:', error);
  } finally {
    await testRunner.cleanup();
  }
}

if (require.main === module) {
  main().catch(console.error);
}
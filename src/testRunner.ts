// src/testRunner.ts
import { ESP8266SerialManager, SensorData, DeviceStatus } from './serialManager';

export class ESP8266TestRunner {
  private serialManager: ESP8266SerialManager;
  private testResults: any[] = [];

  constructor(portPath: string) {
    this.serialManager = new ESP8266SerialManager(portPath);
  }

  async runBasicConnectivityTest(): Promise<boolean> {
    console.log('Testing basic connectivity...');
    try {
      await this.serialManager.connect();
      console.log('✓ Connection successful');
      return true;
    } catch (error) {
      console.error('✗ Connection failed:', error);
      return false;
    }
  }

  async runSensorDataTest(duration: number = 10000): Promise<void> {
    console.log(`Testing sensor data collection for ${duration/1000} seconds...`);
    
    const receivedData: SensorData[] = [];
    
    this.serialManager.onSensorData((data) => {
      receivedData.push(data);
      console.log(`Sensor reading: ${data}`);
    });

    const commands = ['SCAN_WIFI', 'GET_DHT', 'GET_CCS'];
    
    for (const cmd of commands) {
      console.log(`Sending command: ${cmd}`);
      await this.serialManager.sendCommand(cmd);
      await new Promise(resolve => setTimeout(resolve, duration));
    };

    console.log(`✓ Received ${receivedData.length} sensor readings`);
    this.testResults.push({
      test: 'sensor_data',
      readings: receivedData.length,
      avgTemp: receivedData.reduce((sum, d) => sum + d.temperature, 0) / receivedData.length,
      avgHum: receivedData.reduce((sum, d) => sum + d.humidity, 0) / receivedData.length
    });
  }

  async runLEDControlTest(): Promise<void> {
    console.log('Testing LED control...');
    
    const commands = ['LED_GREEN_ON', 'LED_RED_ON', 'LED_GREEN_OFF', 'LED_RED_OFF'];
    
    for (const cmd of commands) {
      console.log(`Sending command: ${cmd}`);
      await this.serialManager.sendCommand(cmd);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('✓ LED control test completed');
  }

  async runBufferStressTest(): Promise<void> {
    console.log('Testing buffer management under load...');
    
    // Send rapid commands to test buffer handling
    for (let i = 0; i < 100; i++) {
      await this.serialManager.sendCommand(`TEST_${i}`);
      if (i % 10 === 0) {
        const stats = this.serialManager.getBufferStats();
        console.log(`Buffer stats: ${stats.totalBytes} bytes, ${stats.chunks} chunks`);
      }
    }
    
    console.log('✓ Buffer stress test completed');
  }

  getTestResults(): any[] {
    return this.testResults;
  }

  async cleanup(): Promise<void> {
    await this.serialManager.disconnect();
  }
}
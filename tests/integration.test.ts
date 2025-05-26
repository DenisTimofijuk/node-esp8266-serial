// tests/integration.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ESP8266TestRunner } from '../src/testRunner';

// Integration tests that would work with actual hardware
describe('ESP8266TestRunner Integration', () => {
  let testRunner: ESP8266TestRunner;

  beforeEach(() => {
    testRunner = new ESP8266TestRunner('/dev/ttyUSB0');
  });

  afterEach(async () => {
    await testRunner.cleanup();
  });

  it('should initialize test runner', () => {
    expect(testRunner).toBeInstanceOf(ESP8266TestRunner);
  });

  // Note: These tests would need actual hardware to run
  it('should run basic connectivity test with real hardware', async () => {
    const result = await testRunner.runBasicConnectivityTest();
    expect(typeof result).toBe('boolean');
  });

  it('should collect sensor data from real hardware', async () => {
    await testRunner.runBasicConnectivityTest();
    await testRunner.runSensorDataTest(2000);

    const results = testRunner.getTestResults();
    expect(results).toHaveLength(1);
    expect(results[0].test).toBe('sensor_data');
  }, 30000); // Allow longer time for real hardware tests
});
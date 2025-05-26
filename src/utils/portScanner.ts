
// src/utils/portScanner.ts
import { SerialPort } from 'serialport';

export async function scanPorts(): Promise<void> {
  try {
    const ports = await SerialPort.list();
    console.log('Available serial ports:');
    ports.forEach((port, index) => {
      console.log(`${index + 1}. ${port.path}`);
      if (port.manufacturer) console.log(`   Manufacturer: ${port.manufacturer}`);
      if (port.serialNumber) console.log(`   Serial: ${port.serialNumber}`);
      if (port.vendorId) console.log(`   Vendor ID: ${port.vendorId}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error scanning ports:', error);
  }
}

if (require.main === module) {
  scanPorts();
}
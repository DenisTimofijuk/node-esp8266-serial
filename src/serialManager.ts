// src/serialManager.ts
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export interface SensorData {
  temperature: number;
  humidity: number;
  co2: number;
  tvoc: number;
  timestamp: Date;
}

export interface DeviceStatus {
  wifiConnected: boolean;
  ledStatus: string;
  uptime: number;
}

export class ESP8266SerialManager {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private isConnected = false;
  private dataBuffer: Buffer[] = [];

  constructor(private portPath: string, private baudRate: number = 115200) {}

  async connect(): Promise<void> {
    try {
      this.port = new SerialPort({
        path: this.portPath,
        baudRate: this.baudRate,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\n" }));

      this.port.on("open", () => {
        console.log(`Connected to ESP8266 on ${this.portPath}`);
        this.isConnected = true;
      });

      this.port.on("error", (err) => {
        console.error("Serial port error:", err);
        this.isConnected = false;
      });

      this.port.on("close", () => {
        console.log("Serial port closed");
        this.isConnected = false;
      });

      // Handle raw data for buffer management examples
      this.port.on("data", (data: Buffer) => {
        this.handleRawData(data);
      });

      await this.waitForConnection();
    } catch (error) {
      throw new Error(`Failed to connect: ${error}`);
    }
  }

  private handleRawData(data: Buffer): void {
    // Example of buffer management - store chunks
    this.dataBuffer.push(data);

    // Keep only last 10 chunks to prevent memory issues
    if (this.dataBuffer.length > 10) {
      this.dataBuffer = this.dataBuffer.slice(-10);
    }
  }

  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout"));
      }, 5000);

      const checkConnection = () => {
        if (this.isConnected) {
          clearTimeout(timeout);
          resolve();
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  // Send commands to ESP8266
  async sendCommand(command: string): Promise<void> {
    if (!this.port || !this.isConnected) {
      throw new Error("Not connected to device");
    }

    return new Promise((resolve, reject) => {
      this.port!.write(command + "\n", (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  onSensorData(callback: (data: any) => void): void {
    if (!this.parser) return;

    this.parser.on("data", (line: string) => {
      line = line.trim();
      callback(line);

      // if (line.startsWith("TEMP:")) {
      //   const parts = line.replace("TEMP:", "").split(",HUM:");
      //   const temperature = parseFloat(parts[0]);
      //   const humidity = parseFloat(parts[1]);
      //   if (!isNaN(temperature) && !isNaN(humidity)) {
      //     callback({ temperature, humidity });
      //   }
      // } else if (line.startsWith("CO2:")) {
      //   const parts = line.replace("CO2:", "").split(",TVOC:");
      //   const co2 = parseInt(parts[0]);
      //   const tvoc = parseInt(parts[1]);
      //   if (!isNaN(co2) && !isNaN(tvoc)) {
      //     callback({ co2, tvoc });
      //   }
      // }
    });
  }

  // Listen for status updates
  onStatusUpdate(callback: (status: DeviceStatus) => void): void {
    if (!this.parser) return;

    this.parser.on("data", (line: string) => {
      try {
        const trimmed = line.trim();
        if (trimmed.startsWith("STATUS:")) {
          const jsonStr = trimmed.substring(7);
          const data = JSON.parse(jsonStr);

          const status: DeviceStatus = {
            wifiConnected: data.wifi === "connected",
            ledStatus: data.led,
            uptime: parseInt(data.uptime),
          };

          callback(status);
        }
      } catch (error) {
        console.error("Error parsing status data:", error);
      }
    });
  }

  // Buffer management utilities
  getBufferStats(): { totalBytes: number; chunks: number } {
    const totalBytes = this.dataBuffer.reduce(
      (sum, buf) => sum + buf.length,
      0
    );
    return {
      totalBytes,
      chunks: this.dataBuffer.length,
    };
  }

  clearBuffer(): void {
    this.dataBuffer = [];
  }

  // Get recent raw data as combined buffer
  getRawDataBuffer(): Buffer {
    return Buffer.concat(this.dataBuffer);
  }

  async disconnect(): Promise<void> {
    if (this.port) {
      await new Promise<void>((resolve) => {
        this.port!.close(() => resolve());
      });
    }
  }
}

import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  STEP = 'STEP',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export class Logger {
  private static logFilePath: string = path.join(process.cwd(), 'reports', 'execution.log');

  private static ensureLogDirectory() {
    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private static formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    let formatted = `[${timestamp}] [${level}] ${message}`;
    if (context !== undefined) {
      if (typeof context === 'object') {
        try {
          formatted += ` | Context: ${JSON.stringify(context)}`;
        } catch {
          formatted += ` | Context: [Circular/Unserializable]`;
        }
      } else {
        formatted += ` | Context: ${context}`;
      }
    }
    return formatted;
  }

  private static write(level: LogLevel, message: string, context?: any) {
    const formatted = this.formatMessage(level, message, context);

    // Console output with standard coloring prefixes
    switch (level) {
      case LogLevel.STEP:
        console.log(`\x1b[36m${formatted}\x1b[0m`);
        break;
      case LogLevel.WARN:
        console.warn(`\x1b[33m${formatted}\x1b[0m`);
        break;
      case LogLevel.ERROR:
        console.error(`\x1b[31m${formatted}\x1b[0m`);
        break;
      default:
        console.log(formatted);
        break;
    }

    // Append to execution log file
    try {
      this.ensureLogDirectory();
      fs.appendFileSync(this.logFilePath, formatted + '\n', 'utf8');
    } catch {
      // Avoid failing test execution on log write issues
    }
  }

  static info(message: string, context?: any) {
    this.write(LogLevel.INFO, message, context);
  }

  static step(stepName: string, context?: any) {
    this.write(LogLevel.STEP, `👉 STEP: ${stepName}`, context);
  }

  static warn(message: string, context?: any) {
    this.write(LogLevel.WARN, message, context);
  }

  static error(message: string, error?: any) {
    this.write(LogLevel.ERROR, message, error);
  }
}

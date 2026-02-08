// src/lib/headerMonitor.ts
/**
 * Header Size Monitor - Detects cookie/header bloat that can cause 431 errors
 * This helps prevent the blank screen issue caused by header overflow
 */

interface CookieInfo {
  name: string;
  size: number; // in bytes
  value: string;
}

interface HeaderMonitorReport {
  totalSize: number;
  cookieCount: number;
  cookies: CookieInfo[];
  isHealthy: boolean;
  warnings: string[];
  estimatedHeaderSize: number;
}

const WARNING_THRESHOLD = 4096; // 4KB - start warning
const CRITICAL_THRESHOLD = 8192; // 8KB - critical

export const headerMonitor = {
  /**
   * Get all cookies and their sizes
   */
  getCookies(): CookieInfo[] {
    const cookies: CookieInfo[] = [];
    document.cookie.split(';').forEach(cookie => {
      const trimmed = cookie.trim();
      if (trimmed) {
        const eqPos = trimmed.indexOf('=');
        const name = eqPos > -1 ? trimmed.substr(0, eqPos) : trimmed;
        const value = eqPos > -1 ? trimmed.substr(eqPos + 1) : '';
        const size = new Blob([cookie]).size;
        cookies.push({ name, value, size });
      }
    });
    return cookies;
  },

  /**
   * Get localStorage size estimate
   */
  getLocalStorageSize(): number {
    let size = 0;
    try {
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          size += new Blob([localStorage[key]]).size;
        }
      }
    } catch (e) {
      console.warn('[HeaderMonitor] Could not access localStorage:', e);
    }
    return size;
  },

  /**
   * Generate a health report
   */
  generateReport(): HeaderMonitorReport {
    const cookies = this.getCookies();
    const totalSize = cookies.reduce((sum, c) => sum + c.size, 0);
    const storageSize = this.getLocalStorageSize();
    
    const warnings: string[] = [];
    const isHealthy = totalSize < WARNING_THRESHOLD;

    if (totalSize > CRITICAL_THRESHOLD) {
      warnings.push(`🚨 CRITICAL: Total cookies size is ${totalSize} bytes (over 8KB limit). This will cause 431 Request Header Fields Too Large errors!`);
    } else if (totalSize > WARNING_THRESHOLD) {
      warnings.push(`⚠️ WARNING: Total cookies size is ${totalSize} bytes (approaching 4KB limit). Header bloat detected!`);
    }

    // Check for large individual cookies
    cookies.forEach(cookie => {
      if (cookie.size > 1024) {
        warnings.push(`⚠️ Large cookie: "${cookie.name}" is ${cookie.size} bytes. Consider moving to localStorage.`);
      }
    });

    if (storageSize > 1048576) { // 1MB
      warnings.push(`⚠️ localStorage is ${storageSize} bytes. Consider cleaning up old data.`);
    }

    return {
      totalSize,
      cookieCount: cookies.length,
      cookies,
      isHealthy,
      warnings,
      estimatedHeaderSize: totalSize + (cookies.length * 50), // Rough estimate including headers
    };
  },

  /**
   * Log the report in a user-friendly format
   */
  logReport(): void {
    const report = this.generateReport();
    
    console.group('[HeaderMonitor] Cookie & Header Health Report');
    console.log(`Total Cookies: ${report.cookieCount}`);
    console.log(`Total Size: ${report.totalSize} bytes`);
    console.log(`Estimated Header Size: ${report.estimatedHeaderSize} bytes`);
    console.log(`Status: ${report.isHealthy ? '✅ HEALTHY' : '❌ BLOATED'}`);
    
    if (report.warnings.length > 0) {
      console.group('Warnings');
      report.warnings.forEach(w => console.warn(w));
      console.groupEnd();
    }

    console.table(report.cookies);
    console.groupEnd();
  },

  /**
   * Auto-monitor and log warnings periodically
   */
  startMonitoring(intervalMs: number = 30000): NodeJS.Timer {
    return setInterval(() => {
      const report = this.generateReport();
      if (!report.isHealthy) {
        console.warn('[HeaderMonitor] Health check:', report.warnings);
      }
    }, intervalMs);
  },

  /**
   * Get token size
   */
  getTokenSize(): number {
    const token = localStorage.getItem('token');
    return token ? new Blob([token]).size : 0;
  },

  /**
   * Safe cookie clearing with verification
   */
  clearCookiesSafely(): void {
    console.log('[HeaderMonitor] Clearing all cookies...');
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      document.cookie = `${name}=;expires=${new Date().toUTCString()};path=/`;
    });
    
    const afterReport = this.generateReport();
    console.log('[HeaderMonitor] Cookies cleared. Remaining:', afterReport.cookies.length);
  }
};

// Auto-log warnings in development
if (import.meta.env.DEV) {
  console.log('[HeaderMonitor] Initialized. Run "headerMonitor.logReport()" to check cookie health.');
  // Expose globally for debugging (dev-only, safe to use any here)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).headerMonitor = headerMonitor;
}

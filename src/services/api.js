/**
 * NetFlow Async API Simulation Service
 * Provides asynchronous Promise-based API endpoints simulating network latency,
 * HTTP status codes, error states, and telemetry data.
 */

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Fetch campus hardware equipment catalog asynchronously
  fetchCatalog: async ({ shouldFail = false } = {}) => {
    await delay(450);
    if (shouldFail) {
      throw new Error("503 Service Unavailable: Campus hardware catalog service is temporarily unreachable.");
    }
    const raw = localStorage.getItem("netflow_custom_catalog");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return [
      {
        id: "EQ-NET-01",
        name: "Fluke Networks CableIQ Gigabit Analyzer",
        category: "Diagnostics",
        specs: "Gigabit copper qualification, wiremap verification & live fault isolation",
        stock: 5,
        status: "Available",
        badge: "Diagnostic Tool",
        model: "CIQ-100",
      },
      {
        id: "EQ-NET-02",
        name: "Cisco Catalyst 3850 PoE+ 24-Port Switch Kit",
        category: "Networking",
        specs: "Layer 3 Stackable enterprise switch with SFP+ uplinks for lab exercises",
        stock: 3,
        status: "Available",
        badge: "Hardware Kit",
        model: "WS-C3850-24P",
      },
      {
        id: "EQ-NET-03",
        name: "Aruba AP-515 Wi-Fi 6 Campus AP Test Unit",
        category: "Wireless",
        specs: "802.11ax dual-radio, OFDMA, BLE beaconing for RF mapping trials",
        stock: 8,
        status: "Available",
        badge: "Wi-Fi 6",
        model: "Q9H62A",
      },
      {
        id: "EQ-NET-04",
        name: "10G SFP+ Optical Transceiver & Fiber Patch Bundle",
        category: "Fiber Optics",
        specs: "850nm Multi-mode OM4 LC duplex cables with 10GBase-SR modules (5x pack)",
        stock: 12,
        status: "Available",
        badge: "Accessories",
        model: "SFP-10G-SR-BNDL",
      },
      {
        id: "EQ-NET-05",
        name: "Raspberry Pi 5 Network Telemetry Probe (8GB)",
        category: "IoT / Probe",
        specs: "Preloaded with NetFlow Agent, Prometheus node-exporter & Wireshark CLI",
        stock: 15,
        status: "Available",
        badge: "Telemetry Probe",
        model: "RPI5-NET-8G",
      },
      {
        id: "EQ-NET-06",
        name: "High-Performance Workstation (RTX 4080 / 64GB RAM)",
        category: "Compute",
        specs: "Dedicated simulation node for Mininet SDN and large-scale packet capture",
        stock: 4,
        status: "Available",
        badge: "Compute Node",
        model: "WS-NET-SDN4",
      },
    ];
  },

  // Fetch operational reports with asynchronous generation
  generateReport: async (reportType, { shouldFail = false } = {}) => {
    await delay(700);
    if (shouldFail) {
      throw new Error(`Failed to generate ${reportType}: Server encountered an export pipeline timeout.`);
    }
    return {
      reportId: `REP-${Date.now().toString().slice(-6)}`,
      title: reportType,
      generatedAt: new Date().toLocaleString(),
      size: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
      downloadUrl: "#download",
      checksum: `sha256-${Math.random().toString(36).substring(2, 10)}`,
      status: "Ready",
    };
  },

  // Asynchronously submit equipment reservation / checkout
  submitRequisition: async (orderPayload, { shouldFail = false } = {}) => {
    await delay(600);
    if (shouldFail) {
      throw new Error("Requisition submission rejected: Invalid authorization token or quota exceeded.");
    }
    return {
      success: true,
      orderId: `REQ-${Date.now().toString().slice(-6)}`,
      receivedAt: new Date().toISOString(),
      status: "Approved",
      applicant: orderPayload.applicant,
    };
  },

  // Asynchronous diagnostic health check for any device
  runDeviceDiagnostics: async (deviceIp, { shouldFail = false } = {}) => {
    await delay(800);
    if (shouldFail) {
      throw new Error(`Diagnostic query failed: Host ${deviceIp} unreachable on port 161 (SNMP timeout).`);
    }
    return {
      ip: deviceIp,
      snmpStatus: "Responding v2c",
      mtu: 1500,
      jitterMs: (Math.random() * 4 + 1.2).toFixed(2),
      crcErrors: 0,
      fanSpeedRpm: 4200,
      temperatureC: 38.5,
      timestamp: new Date().toLocaleTimeString(),
    };
  },
};

import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateKurAssessment,
  loginMantri,
  logoutMantri,
  getCurrentMantri,
  generateWhatsAppUrl,
  DEMO_MANTRI_ACCOUNTS,
} from "./mantriService";

// Mock localStorage for Node test environment
const mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
};

// Assign to global if not present
if (typeof global.localStorage === "undefined") {
  // @ts-expect-error mock assignment for test
  global.localStorage = localStorageMock;
}
if (typeof global.window === "undefined") {
  // @ts-expect-error mock assignment for test
  global.window = { localStorage: localStorageMock };
}

describe("Mantri BRI Service & KUR Assessment Engine", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("Kalkulator Angsuran KUR Mikro & DSCR", () => {
    it("menghitung angsuran KUR Mikro 10 juta tenor 12 bulan dengan bunga 6% secara akurat", () => {
      const assessment = calculateKurAssessment(10000000, 12, 5000000);
      // Pokok = 10jt / 12 = 833,333.33
      // Bunga = (10jt * 0.06) / 12 = 50,000
      // Total = 883,333
      expect(assessment.monthlyInstallment).toBe(883333);
      expect(assessment.dscrRatio).toBeCloseTo(5.66, 1);
      expect(assessment.eligibilityGrade).toBe("SANGAT_LAYAK");
    });

    it("mengklasifikasikan BERISIKO jika laba bersih lebih kecil dari angsuran bulanan", () => {
      const assessment = calculateKurAssessment(50000000, 12, 2000000);
      expect(assessment.eligibilityGrade).toBe("BERISIKO");
      expect(assessment.dscrRatio).toBeLessThan(1.25);
    });

    it("mengklasifikasikan LAYAK jika rasio DSCR antara 1.25 dan 2.0", () => {
      // 10jt tenor 12 bln angsuran 883,333. Jika laba 1,500,000 -> ratio = 1.70
      const assessment = calculateKurAssessment(10000000, 12, 1500000);
      expect(assessment.dscrRatio).toBeGreaterThanOrEqual(1.25);
      expect(assessment.dscrRatio).toBeLessThan(2.0);
      expect(assessment.eligibilityGrade).toBe("LAYAK");
    });
  });

  describe("Autentikasi & Sesi Mantri", () => {
    it("berhasil login dengan kredensial demo Mantri valid", () => {
      const demo = DEMO_MANTRI_ACCOUNTS[0];
      const result = loginMantri(demo.personalNumber, demo.pin);
      expect(result.success).toBe(true);
      expect(result.user?.name).toBe(demo.name);

      const active = getCurrentMantri();
      expect(active?.personalNumber).toBe(demo.personalNumber);
    });

    it("menolak login jika NIP atau PIN salah", () => {
      const result = loginMantri("BRI-999999", "wrongpin");
      expect(result.success).toBe(false);
      expect(getCurrentMantri()).toBeNull();
    });

    it("berhasil logout dan menghapus sesi tersimpan", () => {
      const demo = DEMO_MANTRI_ACCOUNTS[0];
      loginMantri(demo.personalNumber, demo.pin);
      expect(getCurrentMantri()).not.toBeNull();

      logoutMantri();
      expect(getCurrentMantri()).toBeNull();
    });
  });

  describe("WhatsApp Direct Link Generator", () => {
    it("menghasilkan URL WhatsApp dengan nomor telepon yang diformat internasional (62)", () => {
      const url = generateWhatsAppUrl(
        "0812-3456-7890",
        "Ahmad Fauzi",
        "Booth Kopi Susu",
        "Budi Santoso",
        "BRI Unit Dinoyo"
      );
      expect(url).toContain("https://wa.me/6281234567890");
      expect(url).toContain("Ahmad%20Fauzi");
      expect(url).toContain("Booth%20Kopi%20Susu");
    });
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateKurAssessment,
  loginMantriAsync,
  logoutMantri,
  getCurrentMantri,
  generateWhatsAppUrl,
  generateUserToMantriWhatsAppUrl,
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
    it("berhasil memvalidasi login async dan menyimpan sesi jika kredensial terverifikasi oleh server", async () => {
      const originalFetch = global.fetch;
      
      global.fetch = async () =>
        ({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            mantri: {
              id: "mantri-01",
              name: "Budi Santoso, S.E.",
              personalNumber: "BRI-882041",
              unitName: "BRI Unit Dinoyo",
              branchOffice: "KC Malang Soekarno Hatta",
              role: "MANTRI",
              assignedAreas: ["Dinoyo"],
            },
          }),
        } as unknown as Response);

      const result = await loginMantriAsync("BRI-882041", "dummy-pin");
      expect(result.success).toBe(true);
      expect(result.user?.personalNumber).toBe("BRI-882041");

      const active = getCurrentMantri();
      expect(active?.name).toBe("Budi Santoso, S.E.");

      global.fetch = originalFetch;
    });

    it("menolak login jika server merespons kredensial tidak valid", async () => {
      const originalFetch = global.fetch;
      
      global.fetch = async () =>
        ({
          ok: false,
          status: 401,
          json: async () => ({
            success: false,
            error: "Personal Number (NIP) atau PIN salah.",
          }),
        } as unknown as Response);

      const result = await loginMantriAsync("BRI-999999", "wrongpin");
      expect(result.success).toBe(false);
      expect(result.error).toContain("salah");

      global.fetch = originalFetch;
    });

    it("berhasil logout dan menghapus sesi tersimpan", () => {
      localStorageMock.setItem(
        "usahaqita_mantri_session",
        JSON.stringify({
          id: "mantri-01",
          name: "Budi Santoso",
          personalNumber: "BRI-882041",
          unitName: "BRI Unit Dinoyo",
          branchOffice: "KC Malang",
          role: "MANTRI",
          assignedAreas: [],
        })
      );
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
    it("menghasilkan URL WhatsApp dari pemohon ke Mantri dengan nomor internasional (62) dan parameter lengkap", () => {
      const url = generateUserToMantriWhatsAppUrl({
        mantriPhone: "0812-3456-7891",
        mantriName: "Winny Ardhian Septiko",
        unitName: "BRI Unit Dinoyo",
        applicantName: "Ahmad Fauzi",
        businessTitle: "Booth Kopi Susu",
        city: "Malang",
        leadId: "UQ-2026-001",
        availableCapital: 5000000,
        capitalDeficit: 3500000,
      });
      expect(url).toContain("https://wa.me/6281234567891");
      expect(url).toContain("Winny%20Ardhian%20Septiko");
      expect(url).toContain("UQ-2026-001");
      expect(url).toContain("Booth%20Kopi%20Susu");
    });
  });
});
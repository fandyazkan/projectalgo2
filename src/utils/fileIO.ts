/**
 * File I/O Simulation - Menggunakan localStorage sebagai penyimpanan
 * Dalam aplikasi web, kita mensimulasikan File I/O dengan localStorage
 * 
 * Di environment Node.js, ini bisa diganti dengan fs module
 */

import { IStudent } from "@/models/Student";

const STORAGE_KEY = "student_data";
const BACKUP_KEY = "student_data_backup";

export interface FileIOResult {
  success: boolean;
  message: string;
  data?: IStudent[];
  timestamp?: string;
}

/**
 * Simpan data ke "file" (localStorage)
 * Time Complexity: O(n) untuk serialisasi
 */
export function saveToFile(students: IStudent[]): FileIOResult {
  try {
    const timestamp = new Date().toISOString();
    const dataToSave = {
      version: "1.0",
      timestamp,
      count: students.length,
      data: students,
    };
    
    // Backup data sebelumnya
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (existingData) {
      localStorage.setItem(BACKUP_KEY, existingData);
    }
    
    // Simpan data baru
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    
    return {
      success: true,
      message: `Data berhasil disimpan. ${students.length} mahasiswa tersimpan.`,
      timestamp,
    };
  } catch (error) {
    // Exception handling
    if (error instanceof Error) {
      if (error.name === "QuotaExceededError") {
        return {
          success: false,
          message: "Penyimpanan penuh. Hapus beberapa data dan coba lagi.",
        };
      }
      return {
        success: false,
        message: `Gagal menyimpan: ${error.message}`,
      };
    }
    return {
      success: false,
      message: "Terjadi kesalahan yang tidak diketahui saat menyimpan.",
    };
  }
}

/**
 * Baca data dari "file" (localStorage)
 * Time Complexity: O(n) untuk deserialisasi
 */
export function readFromFile(): FileIOResult {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    
    if (!rawData) {
      return {
        success: true,
        message: "Tidak ada data tersimpan.",
        data: [],
      };
    }
    
    const parsedData = JSON.parse(rawData);
    
    // Validasi struktur data
    if (!parsedData.data || !Array.isArray(parsedData.data)) {
      throw new Error("Format data tidak valid");
    }
    
    return {
      success: true,
      message: `${parsedData.count} data mahasiswa berhasil dimuat.`,
      data: parsedData.data,
      timestamp: parsedData.timestamp,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        message: "Data rusak. Format JSON tidak valid.",
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        message: `Gagal membaca data: ${error.message}`,
      };
    }
    return {
      success: false,
      message: "Terjadi kesalahan yang tidak diketahui saat membaca.",
    };
  }
}

/**
 * Restore dari backup
 */
export function restoreFromBackup(): FileIOResult {
  try {
    const backupData = localStorage.getItem(BACKUP_KEY);
    
    if (!backupData) {
      return {
        success: false,
        message: "Tidak ada backup yang tersedia.",
      };
    }
    
    localStorage.setItem(STORAGE_KEY, backupData);
    
    const parsedData = JSON.parse(backupData);
    
    return {
      success: true,
      message: "Data berhasil dipulihkan dari backup.",
      data: parsedData.data,
      timestamp: parsedData.timestamp,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal memulihkan data dari backup.",
    };
  }
}

/**
 * Hapus semua data
 */
export function clearAllData(): FileIOResult {
  try {
    // Backup sebelum hapus
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (existingData) {
      localStorage.setItem(BACKUP_KEY, existingData);
    }
    
    localStorage.removeItem(STORAGE_KEY);
    
    return {
      success: true,
      message: "Semua data berhasil dihapus. Backup tersedia untuk pemulihan.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal menghapus data.",
    };
  }
}

/**
 * Export data sebagai JSON file (download)
 */
export function exportToJSON(students: IStudent[]): void {
  const dataToExport = {
    exportedAt: new Date().toISOString(),
    exportedBy: "Student Management System",
    count: students.length,
    data: students,
  };
  
  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
    type: "application/json",
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `student_data_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data dari JSON file
 */
export function importFromJSON(file: File): Promise<FileIOResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = JSON.parse(content);
        
        if (!parsedData.data || !Array.isArray(parsedData.data)) {
          throw new Error("Format file tidak valid");
        }
        
        resolve({
          success: true,
          message: `${parsedData.data.length} data mahasiswa berhasil diimpor.`,
          data: parsedData.data,
        });
      } catch (error) {
        resolve({
          success: false,
          message: "Gagal mengimpor file. Pastikan format JSON valid.",
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        message: "Gagal membaca file.",
      });
    };
    
    reader.readAsText(file);
  });
}

/**
 * Export data sebagai CSV
 */
export function exportToCSV(students: IStudent[]): void {
  const headers = ["NIM", "Nama", "Email", "Jurusan", "Semester", "IPK", "Tanggal Masuk"];
  const rows = students.map((s) => [
    s.nim,
    s.nama,
    s.email,
    s.jurusan,
    s.semester.toString(),
    s.ipk.toFixed(2),
    s.tanggalMasuk,
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `student_data_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

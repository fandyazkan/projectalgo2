/**
 * Validation Utilities - Menggunakan Regular Expression (Regex)
 * Untuk validasi input data mahasiswa
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Regex Patterns
export const REGEX_PATTERNS = {
  // NIM: Format bebas, minimal 1 karakter
  NIM: /^.{1,50}$/,
  
  // Nama: minimal 2 karakter, hanya huruf dan spasi
  NAMA: /^[a-zA-Z\s]{2,100}$/,
  
  // Email: format email standar
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // IPK: format 0.00 - 4.00
  IPK: /^([0-3]\.\d{2}|4\.00)$/,
  
  // Semester: angka 1-14
  SEMESTER: /^(1[0-4]|[1-9])$/,
  
  // Jurusan: minimal 2 karakter
  JURUSAN: /^[a-zA-Z\s]{2,50}$/,
};

/**
 * Validasi NIM
 * Time Complexity: O(n) dimana n adalah panjang string
 */
export function validateNIM(nim: string): ValidationResult {
  try {
    if (!nim || nim.trim() === "") {
      return { isValid: false, message: "NIM tidak boleh kosong" };
    }
    
    if (nim.length > 50) {
      return { isValid: false, message: "NIM maksimal 50 karakter" };
    }
    
    return { isValid: true, message: "NIM valid" };
  } catch (error) {
    return { isValid: false, message: "Terjadi kesalahan saat validasi NIM" };
  }
}

/**
 * Validasi Nama
 * Time Complexity: O(n)
 */
export function validateNama(nama: string): ValidationResult {
  try {
    if (!nama || nama.trim() === "") {
      return { isValid: false, message: "Nama tidak boleh kosong" };
    }
    
    if (nama.length < 2) {
      return { isValid: false, message: "Nama minimal 2 karakter" };
    }
    
    if (nama.length > 100) {
      return { isValid: false, message: "Nama maksimal 100 karakter" };
    }
    
    const isValid = REGEX_PATTERNS.NAMA.test(nama);
    
    return {
      isValid,
      message: isValid 
        ? "Nama valid" 
        : "Nama hanya boleh mengandung huruf dan spasi",
    };
  } catch (error) {
    return { isValid: false, message: "Terjadi kesalahan saat validasi nama" };
  }
}

/**
 * Validasi Email
 * Time Complexity: O(n)
 */
export function validateEmail(email: string): ValidationResult {
  try {
    if (!email || email.trim() === "") {
      return { isValid: false, message: "Email tidak boleh kosong" };
    }
    
    const isValid = REGEX_PATTERNS.EMAIL.test(email);
    
    return {
      isValid,
      message: isValid 
        ? "Email valid" 
        : "Format email tidak valid. Contoh: nama@domain.com",
    };
  } catch (error) {
    return { isValid: false, message: "Terjadi kesalahan saat validasi email" };
  }
}

/**
 * Validasi IPK
 * Time Complexity: O(1)
 */
export function validateIPK(ipk: number): ValidationResult {
  try {
    if (isNaN(ipk)) {
      return { isValid: false, message: "IPK harus berupa angka" };
    }
    
    if (ipk < 0 || ipk > 4) {
      return { isValid: false, message: "IPK harus antara 0.00 - 4.00" };
    }
    
    return { isValid: true, message: "IPK valid" };
  } catch (error) {
    return { isValid: false, message: "Terjadi kesalahan saat validasi IPK" };
  }
}

/**
 * Validasi Semester
 * Time Complexity: O(1)
 */
export function validateSemester(semester: number): ValidationResult {
  try {
    if (!Number.isInteger(semester)) {
      return { isValid: false, message: "Semester harus berupa bilangan bulat" };
    }
    
    if (semester < 1 || semester > 14) {
      return { isValid: false, message: "Semester harus antara 1-14" };
    }
    
    return { isValid: true, message: "Semester valid" };
  } catch (error) {
    return { isValid: false, message: "Terjadi kesalahan saat validasi semester" };
  }
}

/**
 * Validasi Jurusan
 * Time Complexity: O(n)
 */
export function validateJurusan(jurusan: string): ValidationResult {
  try {
    if (!jurusan || jurusan.trim() === "") {
      return { isValid: false, message: "Jurusan tidak boleh kosong" };
    }
    
    if (jurusan.length < 2) {
      return { isValid: false, message: "Jurusan minimal 2 karakter" };
    }
    
    const isValid = REGEX_PATTERNS.JURUSAN.test(jurusan);
    
    return {
      isValid,
      message: isValid 
        ? "Jurusan valid" 
        : "Jurusan hanya boleh mengandung huruf dan spasi",
    };
  } catch (error) {
    return { isValid: false, message: "Terjadi kesalahan saat validasi jurusan" };
  }
}

/**
 * Validasi semua field mahasiswa
 * Time Complexity: O(n) untuk setiap field
 */
export function validateAllFields(data: {
  nim: string;
  nama: string;
  email: string;
  jurusan: string;
  semester: number;
  ipk: number;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  const nimResult = validateNIM(data.nim);
  if (!nimResult.isValid) errors.nim = nimResult.message;
  
  const namaResult = validateNama(data.nama);
  if (!namaResult.isValid) errors.nama = namaResult.message;
  
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) errors.email = emailResult.message;
  
  const jurusanResult = validateJurusan(data.jurusan);
  if (!jurusanResult.isValid) errors.jurusan = jurusanResult.message;
  
  const semesterResult = validateSemester(data.semester);
  if (!semesterResult.isValid) errors.semester = semesterResult.message;
  
  const ipkResult = validateIPK(data.ipk);
  if (!ipkResult.isValid) errors.ipk = ipkResult.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

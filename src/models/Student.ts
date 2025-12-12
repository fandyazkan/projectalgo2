/**
 * Student Model - Implementasi OOP dengan TypeScript
 * Menerapkan konsep: Class, Object, Encapsulation, Inheritance, Polymorphism
 */

// Interface untuk data mahasiswa
export interface IStudent {
  id: string;
  nim: string;
  nama: string;
  email: string;
  jurusan: string;
  semester: number;
  ipk: number;
  tanggalMasuk: string;
}

// Base class dengan enkapsulasi
export abstract class Person {
  protected _nama: string;
  protected _email: string;

  constructor(nama: string, email: string) {
    this._nama = nama;
    this._email = email;
  }

  // Getter - Enkapsulasi
  get nama(): string {
    return this._nama;
  }

  get email(): string {
    return this._email;
  }

  // Setter - Enkapsulasi dengan validasi
  set nama(value: string) {
    if (value.length < 2) {
      throw new Error("Nama harus minimal 2 karakter");
    }
    this._nama = value;
  }

  set email(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Format email tidak valid");
    }
    this._email = value;
  }

  // Abstract method - Polimorfisme
  abstract getInfo(): string;
}

// Inheritance - Student extends Person
export class Student extends Person implements IStudent {
  private _id: string;
  private _nim: string;
  private _jurusan: string;
  private _semester: number;
  private _ipk: number;
  private _tanggalMasuk: string;

  constructor(data: IStudent) {
    super(data.nama, data.email);
    this._id = data.id;
    this._nim = data.nim;
    this._jurusan = data.jurusan;
    this._semester = data.semester;
    this._ipk = data.ipk;
    this._tanggalMasuk = data.tanggalMasuk;
  }

  // Getters
  get id(): string { return this._id; }
  get nim(): string { return this._nim; }
  get jurusan(): string { return this._jurusan; }
  get semester(): number { return this._semester; }
  get ipk(): number { return this._ipk; }
  get tanggalMasuk(): string { return this._tanggalMasuk; }

  // Setters dengan validasi
  set nim(value: string) {
    const nimRegex = /^[A-Z]{1,3}\d{6,10}$/;
    if (!nimRegex.test(value)) {
      throw new Error("Format NIM tidak valid (contoh: IF123456)");
    }
    this._nim = value;
  }

  set jurusan(value: string) {
    if (value.length < 2) {
      throw new Error("Jurusan harus minimal 2 karakter");
    }
    this._jurusan = value;
  }

  set semester(value: number) {
    if (value < 1 || value > 14) {
      throw new Error("Semester harus antara 1-14");
    }
    this._semester = value;
  }

  set ipk(value: number) {
    if (value < 0 || value > 4) {
      throw new Error("IPK harus antara 0.00 - 4.00");
    }
    this._ipk = value;
  }

  // Polimorfisme - implementasi abstract method
  getInfo(): string {
    return `${this._nama} (${this._nim}) - ${this._jurusan}`;
  }

  // Method untuk konversi ke plain object
  toJSON(): IStudent {
    return {
      id: this._id,
      nim: this._nim,
      nama: this._nama,
      email: this._email,
      jurusan: this._jurusan,
      semester: this._semester,
      ipk: this._ipk,
      tanggalMasuk: this._tanggalMasuk,
    };
  }

  // Static factory method
  static fromJSON(data: IStudent): Student {
    return new Student(data);
  }
}

// Kelas turunan untuk demonstrasi polimorfisme
export class GraduateStudent extends Student {
  private _thesis: string;

  constructor(data: IStudent, thesis: string) {
    super(data);
    this._thesis = thesis;
  }

  get thesis(): string { return this._thesis; }

  // Override - Polimorfisme
  getInfo(): string {
    return `${super.getInfo()} - Thesis: ${this._thesis}`;
  }
}

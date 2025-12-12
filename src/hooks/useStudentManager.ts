/**
 * Custom Hook - Student Manager
 * Mengelola state dan operasi CRUD untuk data mahasiswa
 */

import { useState, useEffect, useCallback } from "react";
import { IStudent, Student } from "@/models/Student";
import { validateAllFields } from "@/utils/validation";
import { saveToFile, readFromFile } from "@/utils/fileIO";
import { toast } from "@/hooks/use-toast";

export function useStudentManager() {
  // State untuk menyimpan array mahasiswa
  const [students, setStudents] = useState<IStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load data dari localStorage saat pertama kali
  useEffect(() => {
    try {
      const result = readFromFile();
      if (result.success && result.data) {
        setStudents(result.data);
        setLastSaved(result.timestamp || null);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data mahasiswa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-save saat data berubah
  useEffect(() => {
    if (!isLoading && students.length >= 0) {
      const result = saveToFile(students);
      if (result.success && result.timestamp) {
        setLastSaved(result.timestamp);
      }
    }
  }, [students, isLoading]);

  /**
   * Tambah mahasiswa baru
   * Time Complexity: O(1) untuk push, O(n) untuk validasi NIM unik
   */
  const addStudent = useCallback((data: Omit<IStudent, "id">): boolean => {
    try {
      // Validasi input
      const validation = validateAllFields({
        nim: data.nim,
        nama: data.nama,
        email: data.email,
        jurusan: data.jurusan,
        semester: data.semester,
        ipk: data.ipk,
      });

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        throw new Error(firstError);
      }

      // Cek NIM unik - O(n)
      const nimExists = students.some(
        (s) => s.nim.toLowerCase() === data.nim.toLowerCase()
      );
      if (nimExists) {
        throw new Error("NIM sudah terdaftar");
      }

      // Buat objek Student baru
      const newStudent = new Student({
        ...data,
        id: crypto.randomUUID(),
        nim: data.nim.toUpperCase(),
      });

      // Tambah ke array - O(1)
      setStudents((prev) => [...prev, newStudent.toJSON()]);

      toast({
        title: "Berhasil",
        description: `Mahasiswa ${data.nama} berhasil ditambahkan`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menambah data",
        variant: "destructive",
      });
      return false;
    }
  }, [students]);

  /**
   * Edit data mahasiswa
   * Time Complexity: O(n) untuk mencari dan update
   */
  const updateStudent = useCallback((id: string, data: Partial<IStudent>): boolean => {
    try {
      // Validasi jika ada perubahan
      if (data.nim || data.nama || data.email || data.jurusan || data.semester !== undefined || data.ipk !== undefined) {
        const currentStudent = students.find((s) => s.id === id);
        if (!currentStudent) throw new Error("Mahasiswa tidak ditemukan");

        const updatedData = { ...currentStudent, ...data };
        const validation = validateAllFields({
          nim: updatedData.nim,
          nama: updatedData.nama,
          email: updatedData.email,
          jurusan: updatedData.jurusan,
          semester: updatedData.semester,
          ipk: updatedData.ipk,
        });

        if (!validation.isValid) {
          const firstError = Object.values(validation.errors)[0];
          throw new Error(firstError);
        }

        // Cek NIM unik jika berubah
        if (data.nim && data.nim !== currentStudent.nim) {
          const nimExists = students.some(
            (s) => s.id !== id && s.nim.toLowerCase() === data.nim!.toLowerCase()
          );
          if (nimExists) {
            throw new Error("NIM sudah terdaftar");
          }
        }
      }

      // Update data - O(n)
      setStudents((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, ...data, nim: data.nim ? data.nim.toUpperCase() : s.nim }
            : s
        )
      );

      toast({
        title: "Berhasil",
        description: "Data mahasiswa berhasil diperbarui",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memperbarui data",
        variant: "destructive",
      });
      return false;
    }
  }, [students]);

  /**
   * Hapus mahasiswa
   * Time Complexity: O(n) untuk filter
   */
  const deleteStudent = useCallback((id: string): boolean => {
    try {
      const studentToDelete = students.find((s) => s.id === id);
      if (!studentToDelete) {
        throw new Error("Mahasiswa tidak ditemukan");
      }

      // Filter out - O(n)
      setStudents((prev) => prev.filter((s) => s.id !== id));

      toast({
        title: "Berhasil",
        description: `Mahasiswa ${studentToDelete.nama} berhasil dihapus`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menghapus data",
        variant: "destructive",
      });
      return false;
    }
  }, [students]);

  /**
   * Hapus banyak mahasiswa
   * Time Complexity: O(n)
   */
  const deleteMultiple = useCallback((ids: string[]): boolean => {
    try {
      const idsSet = new Set(ids);
      setStudents((prev) => prev.filter((s) => !idsSet.has(s.id)));

      toast({
        title: "Berhasil",
        description: `${ids.length} mahasiswa berhasil dihapus`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus data",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  /**
   * Set data dari import
   */
  const importStudents = useCallback((data: IStudent[]): void => {
    setStudents(data);
    toast({
      title: "Berhasil",
      description: `${data.length} data mahasiswa berhasil diimpor`,
    });
  }, []);

  return {
    students,
    isLoading,
    lastSaved,
    addStudent,
    updateStudent,
    deleteStudent,
    deleteMultiple,
    importStudents,
    setStudents,
  };
}

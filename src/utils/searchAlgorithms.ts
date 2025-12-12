/**
 * Search Algorithms - Implementasi berbagai algoritma pencarian
 * Dengan estimasi Time Complexity
 */

import { IStudent } from "@/models/Student";

export type SearchField = "nim" | "nama" | "jurusan" | "email";

export interface SearchResult {
  found: boolean;
  index: number;
  student: IStudent | null;
  comparisons: number;
  timeComplexity: string;
  algorithm: string;
}

/**
 * Linear Search / Sequential Search
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * Algoritma sederhana yang memeriksa setiap elemen satu per satu
 * Cocok untuk data yang tidak terurut
 */
export function linearSearch(
  students: IStudent[],
  searchValue: string,
  field: SearchField
): SearchResult {
  let comparisons = 0;
  
  // Iterasi melalui setiap elemen - O(n)
  for (let i = 0; i < students.length; i++) {
    comparisons++;
    const fieldValue = students[i][field].toString().toLowerCase();
    
    if (fieldValue.includes(searchValue.toLowerCase())) {
      return {
        found: true,
        index: i,
        student: students[i],
        comparisons,
        timeComplexity: "O(n)",
        algorithm: "Linear Search",
      };
    }
  }
  
  return {
    found: false,
    index: -1,
    student: null,
    comparisons,
    timeComplexity: "O(n)",
    algorithm: "Linear Search",
  };
}

/**
 * Linear Search untuk multiple results
 * Time Complexity: O(n)
 * Mengembalikan semua hasil yang cocok
 */
export function linearSearchAll(
  students: IStudent[],
  searchValue: string,
  field: SearchField
): { results: IStudent[]; comparisons: number; timeComplexity: string } {
  const results: IStudent[] = [];
  let comparisons = 0;
  
  for (let i = 0; i < students.length; i++) {
    comparisons++;
    const fieldValue = students[i][field].toString().toLowerCase();
    
    if (fieldValue.includes(searchValue.toLowerCase())) {
      results.push(students[i]);
    }
  }
  
  return {
    results,
    comparisons,
    timeComplexity: "O(n)",
  };
}

/**
 * Binary Search
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 * 
 * PENTING: Data harus sudah TERURUT berdasarkan field yang dicari
 * Algoritma divide-and-conquer yang membagi array menjadi dua bagian
 */
export function binarySearch(
  students: IStudent[],
  searchValue: string,
  field: SearchField
): SearchResult {
  let comparisons = 0;
  let left = 0;
  let right = students.length - 1;
  
  // Lakukan binary search - O(log n)
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;
    
    const fieldValue = students[mid][field].toString().toLowerCase();
    const search = searchValue.toLowerCase();
    
    if (fieldValue === search) {
      return {
        found: true,
        index: mid,
        student: students[mid],
        comparisons,
        timeComplexity: "O(log n)",
        algorithm: "Binary Search",
      };
    }
    
    if (fieldValue < search) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return {
    found: false,
    index: -1,
    student: null,
    comparisons,
    timeComplexity: "O(log n)",
    algorithm: "Binary Search",
  };
}

/**
 * Sequential Search dengan Pattern Matching
 * Time Complexity: O(n * m) dimana m adalah panjang pattern
 * 
 * Mencari substring dalam field yang ditentukan
 */
export function sequentialSearchWithPattern(
  students: IStudent[],
  pattern: string,
  field: SearchField
): { results: IStudent[]; comparisons: number; timeComplexity: string } {
  const results: IStudent[] = [];
  let comparisons = 0;
  const lowerPattern = pattern.toLowerCase();
  
  // Sequential search dengan pattern matching
  for (let i = 0; i < students.length; i++) {
    const fieldValue = students[i][field].toString().toLowerCase();
    comparisons++;
    
    // Simple pattern matching
    let found = false;
    for (let j = 0; j <= fieldValue.length - lowerPattern.length; j++) {
      comparisons++;
      if (fieldValue.substring(j, j + lowerPattern.length) === lowerPattern) {
        found = true;
        break;
      }
    }
    
    if (found) {
      results.push(students[i]);
    }
  }
  
  return {
    results,
    comparisons,
    timeComplexity: "O(n * m)",
  };
}

/**
 * Search dengan berbagai algoritma
 * Mengembalikan hasil perbandingan antara algoritma
 */
export function compareSearchAlgorithms(
  students: IStudent[],
  searchValue: string,
  field: SearchField
): {
  linear: SearchResult;
  binary: SearchResult;
  dataSize: number;
} {
  // Sort data untuk binary search
  const sortedStudents = [...students].sort((a, b) =>
    a[field].toString().localeCompare(b[field].toString())
  );
  
  return {
    linear: linearSearch(students, searchValue, field),
    binary: binarySearch(sortedStudents, searchValue, field),
    dataSize: students.length,
  };
}

/**
 * Sorting Algorithms - Implementasi berbagai algoritma pengurutan
 * Dengan estimasi Time Complexity
 */

import { IStudent } from "@/models/Student";

export type SortField = "nim" | "nama" | "jurusan" | "semester" | "ipk";
export type SortOrder = "asc" | "desc";

export interface SortResult {
  sortedData: IStudent[];
  comparisons: number;
  swaps: number;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  algorithm: string;
}

/**
 * Bubble Sort
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * 
 * Algoritma sederhana yang membandingkan elemen berdekatan
 * dan menukarnya jika tidak dalam urutan yang benar
 */
export function bubbleSort(
  students: IStudent[],
  field: SortField,
  order: SortOrder = "asc"
): SortResult {
  const data = [...students];
  let comparisons = 0;
  let swaps = 0;
  const n = data.length;
  
  // Outer loop - O(n)
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    // Inner loop - O(n)
    // Total: O(n²)
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      
      const a = getFieldValue(data[j], field);
      const b = getFieldValue(data[j + 1], field);
      
      const shouldSwap = order === "asc" ? a > b : a < b;
      
      if (shouldSwap) {
        // Swap menggunakan destructuring
        [data[j], data[j + 1]] = [data[j + 1], data[j]];
        swaps++;
        swapped = true;
      }
    }
    
    // Optimisasi: jika tidak ada swap, array sudah terurut
    if (!swapped) break;
  }
  
  return {
    sortedData: data,
    comparisons,
    swaps,
    timeComplexity: {
      best: "O(n)",      // Sudah terurut
      average: "O(n²)",
      worst: "O(n²)",    // Terurut terbalik
    },
    spaceComplexity: "O(1)",
    algorithm: "Bubble Sort",
  };
}

/**
 * Selection Sort
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * 
 * Mencari elemen minimum/maksimum dan menempatkannya di posisi yang benar
 */
export function selectionSort(
  students: IStudent[],
  field: SortField,
  order: SortOrder = "asc"
): SortResult {
  const data = [...students];
  let comparisons = 0;
  let swaps = 0;
  const n = data.length;
  
  // Outer loop - O(n)
  for (let i = 0; i < n - 1; i++) {
    let selectedIdx = i;
    
    // Inner loop - O(n)
    // Total: O(n²)
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      
      const selected = getFieldValue(data[selectedIdx], field);
      const current = getFieldValue(data[j], field);
      
      const shouldSelect = order === "asc" ? current < selected : current > selected;
      
      if (shouldSelect) {
        selectedIdx = j;
      }
    }
    
    // Swap hanya jika diperlukan
    if (selectedIdx !== i) {
      [data[i], data[selectedIdx]] = [data[selectedIdx], data[i]];
      swaps++;
    }
  }
  
  return {
    sortedData: data,
    comparisons,
    swaps,
    timeComplexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    algorithm: "Selection Sort",
  };
}

/**
 * Insertion Sort
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * 
 * Membangun array terurut satu elemen pada satu waktu
 */
export function insertionSort(
  students: IStudent[],
  field: SortField,
  order: SortOrder = "asc"
): SortResult {
  const data = [...students];
  let comparisons = 0;
  let swaps = 0;
  const n = data.length;
  
  for (let i = 1; i < n; i++) {
    const key = data[i];
    const keyValue = getFieldValue(key, field);
    let j = i - 1;
    
    // Geser elemen yang lebih besar dari key
    while (j >= 0) {
      comparisons++;
      const currentValue = getFieldValue(data[j], field);
      
      const shouldShift = order === "asc" ? currentValue > keyValue : currentValue < keyValue;
      
      if (shouldShift) {
        data[j + 1] = data[j];
        swaps++;
        j--;
      } else {
        break;
      }
    }
    
    data[j + 1] = key;
  }
  
  return {
    sortedData: data,
    comparisons,
    swaps,
    timeComplexity: {
      best: "O(n)",      // Sudah terurut
      average: "O(n²)",
      worst: "O(n²)",    // Terurut terbalik
    },
    spaceComplexity: "O(1)",
    algorithm: "Insertion Sort",
  };
}

/**
 * Shell Sort
 * Time Complexity: O(n log²n) hingga O(n²) tergantung gap sequence
 * Space Complexity: O(1)
 * 
 * Versi yang dioptimalkan dari Insertion Sort menggunakan gap
 */
export function shellSort(
  students: IStudent[],
  field: SortField,
  order: SortOrder = "asc"
): SortResult {
  const data = [...students];
  let comparisons = 0;
  let swaps = 0;
  const n = data.length;
  
  // Mulai dengan gap besar, kemudian kurangi
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = data[i];
      const tempValue = getFieldValue(temp, field);
      let j = i;
      
      while (j >= gap) {
        comparisons++;
        const compareValue = getFieldValue(data[j - gap], field);
        
        const shouldShift = order === "asc" ? compareValue > tempValue : compareValue < tempValue;
        
        if (shouldShift) {
          data[j] = data[j - gap];
          swaps++;
          j -= gap;
        } else {
          break;
        }
      }
      
      data[j] = temp;
    }
  }
  
  return {
    sortedData: data,
    comparisons,
    swaps,
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log²n)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    algorithm: "Shell Sort",
  };
}

/**
 * Merge Sort
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 * 
 * Algoritma divide-and-conquer yang stabil
 */
export function mergeSort(
  students: IStudent[],
  field: SortField,
  order: SortOrder = "asc"
): SortResult {
  let comparisons = 0;
  let swaps = 0;
  
  function merge(left: IStudent[], right: IStudent[]): IStudent[] {
    const result: IStudent[] = [];
    let leftIdx = 0;
    let rightIdx = 0;
    
    while (leftIdx < left.length && rightIdx < right.length) {
      comparisons++;
      const leftValue = getFieldValue(left[leftIdx], field);
      const rightValue = getFieldValue(right[rightIdx], field);
      
      const leftFirst = order === "asc" ? leftValue <= rightValue : leftValue >= rightValue;
      
      if (leftFirst) {
        result.push(left[leftIdx]);
        leftIdx++;
      } else {
        result.push(right[rightIdx]);
        rightIdx++;
      }
      swaps++;
    }
    
    return result.concat(left.slice(leftIdx)).concat(right.slice(rightIdx));
  }
  
  function sort(arr: IStudent[]): IStudent[] {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = sort(arr.slice(0, mid));
    const right = sort(arr.slice(mid));
    
    return merge(left, right);
  }
  
  const sortedData = sort([...students]);
  
  return {
    sortedData,
    comparisons,
    swaps,
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    spaceComplexity: "O(n)",
    algorithm: "Merge Sort",
  };
}

// Helper function untuk mendapatkan nilai field
function getFieldValue(student: IStudent, field: SortField): string | number {
  const value = student[field];
  if (typeof value === "number") return value;
  return value.toString().toLowerCase();
}

/**
 * Compare sorting algorithms performance
 */
export function compareSortAlgorithms(
  students: IStudent[],
  field: SortField,
  order: SortOrder = "asc"
): Record<string, SortResult> {
  return {
    bubble: bubbleSort(students, field, order),
    selection: selectionSort(students, field, order),
    insertion: insertionSort(students, field, order),
    shell: shellSort(students, field, order),
    merge: mergeSort(students, field, order),
  };
}

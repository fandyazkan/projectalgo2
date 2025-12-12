/**
 * Student Table Component
 * Menampilkan data mahasiswa dalam tabel dengan fitur sorting dan search
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IStudent } from "@/models/Student";
import { linearSearchAll } from "@/utils/searchAlgorithms";
import {
  bubbleSort,
  selectionSort,
  SortField,
  SortOrder,
  SortResult,
} from "@/utils/sortAlgorithms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentTableProps {
  students: IStudent[];
  onEdit: (student: IStudent) => void;
  onDelete: (id: string) => void;
}

type SearchField = "nim" | "nama" | "jurusan" | "email";

const ITEMS_PER_PAGE = 10;

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("nama");
  const [sortField, setSortField] = useState<SortField>("nama");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortAlgorithm, setSortAlgorithm] = useState<"bubble" | "selection">("bubble");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortInfo, setSortInfo] = useState<SortResult | null>(null);
  const [searchInfo, setSearchInfo] = useState<{ comparisons: number; timeComplexity: string } | null>(null);

  // Filter dan sort data - O(n log n) atau O(n²) tergantung algoritma
  const processedData = useMemo(() => {
    let result = [...students];
    let searchComparisons = 0;

    // Search - O(n)
    if (searchQuery.trim()) {
      const searchResult = linearSearchAll(result, searchQuery, searchField);
      result = searchResult.results;
      searchComparisons = searchResult.comparisons;
      setSearchInfo({
        comparisons: searchComparisons,
        timeComplexity: searchResult.timeComplexity,
      });
    } else {
      setSearchInfo(null);
    }

    // Sort
    if (result.length > 0) {
      const sortFunction = sortAlgorithm === "bubble" ? bubbleSort : selectionSort;
      const sortResult = sortFunction(result, sortField, sortOrder);
      setSortInfo(sortResult);
      result = sortResult.sortedData;
    } else {
      setSortInfo(null);
    }

    return result;
  }, [students, searchQuery, searchField, sortField, sortOrder, sortAlgorithm]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedData.slice(start, start + ITEMS_PER_PAGE);
  }, [processedData, currentPage]);

  // Reset page saat search berubah
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 text-primary" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Cari berdasarkan ${searchField}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Field Select */}
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as SearchField)}
            className="h-10 rounded-lg border border-border bg-secondary/50 px-3 text-sm"
          >
            <option value="nama">Nama</option>
            <option value="nim">NIM</option>
            <option value="jurusan">Jurusan</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Sort Algorithm Select */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Algoritma:</span>
          <select
            value={sortAlgorithm}
            onChange={(e) => setSortAlgorithm(e.target.value as "bubble" | "selection")}
            className="h-10 rounded-lg border border-border bg-secondary/50 px-3 text-sm"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
          </select>
        </div>
      </div>

      {/* Algorithm Info */}
      <AnimatePresence>
        {(searchInfo || sortInfo) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-4 p-3 rounded-lg bg-secondary/50 border border-border"
          >
            {searchInfo && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Search:</span>
                <code className="px-2 py-0.5 rounded bg-accent/20 text-accent font-mono text-xs">
                  {searchInfo.timeComplexity}
                </code>
                <span className="text-muted-foreground">
                  ({searchInfo.comparisons} perbandingan)
                </span>
              </div>
            )}
            {sortInfo && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{sortInfo.algorithm}:</span>
                <code className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-xs">
                  {sortInfo.timeComplexity.average}
                </code>
                <span className="text-muted-foreground">
                  ({sortInfo.comparisons} perbandingan, {sortInfo.swaps} swap)
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <TableHeader label="NIM" field="nim" sortField={sortField} onSort={handleSort} getSortIcon={getSortIcon} />
                <TableHeader label="Nama" field="nama" sortField={sortField} onSort={handleSort} getSortIcon={getSortIcon} />
                <TableHeader label="Email" field="nim" sortField={sortField} onSort={() => {}} getSortIcon={() => null} sortable={false} />
                <TableHeader label="Jurusan" field="jurusan" sortField={sortField} onSort={handleSort} getSortIcon={getSortIcon} />
                <TableHeader label="Semester" field="semester" sortField={sortField} onSort={handleSort} getSortIcon={getSortIcon} />
                <TableHeader label="IPK" field="ipk" sortField={sortField} onSort={handleSort} getSortIcon={getSortIcon} />
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedData.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      {searchQuery ? "Tidak ada data yang cocok" : "Belum ada data mahasiswa"}
                    </td>
                  </motion.tr>
                ) : (
                  paginatedData.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="px-2 py-1 rounded bg-primary/10 text-primary font-mono text-xs">
                          {student.nim}
                        </code>
                      </td>
                      <td className="px-4 py-3 font-medium">{student.nama}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{student.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs">
                          {student.jurusan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{student.semester}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono font-medium ${
                            student.ipk >= 3.5
                              ? "text-success"
                              : student.ipk >= 3.0
                              ? "text-accent"
                              : student.ipk >= 2.5
                              ? "text-warning"
                              : "text-destructive"
                          }`}
                        >
                          {student.ipk.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(student)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEdit(student)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDelete(student.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, processedData.length)} dari{" "}
            {processedData.length} data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TableHeaderProps {
  label: string;
  field: SortField;
  sortField: SortField;
  onSort: (field: SortField) => void;
  getSortIcon: (field: SortField) => React.ReactNode;
  sortable?: boolean;
}

function TableHeader({ label, field, onSort, getSortIcon, sortable = true }: TableHeaderProps) {
  return (
    <th className="px-4 py-3 text-left">
      {sortable ? (
        <button
          onClick={() => onSort(field)}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {label}
          {getSortIcon(field)}
        </button>
      ) : (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
    </th>
  );
}

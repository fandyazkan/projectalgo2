/**
 * Toolbar Component
 * Berisi tombol-tombol aksi utama
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  RefreshCw,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IStudent } from "@/models/Student";
import { exportToJSON, exportToCSV, importFromJSON } from "@/utils/fileIO";
import { toast } from "@/hooks/use-toast";

interface ToolbarProps {
  onAddClick: () => void;
  students: IStudent[];
  onImport: (data: IStudent[]) => void;
  lastSaved: string | null;
}

export function Toolbar({ onAddClick, students, onImport, lastSaved }: ToolbarProps) {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    if (students.length === 0) {
      toast({
        title: "Tidak ada data",
        description: "Tidak ada data mahasiswa untuk diekspor",
        variant: "destructive",
      });
      return;
    }
    exportToJSON(students);
    toast({
      title: "Berhasil",
      description: "Data berhasil diekspor ke JSON",
    });
  };

  const handleExportCSV = () => {
    if (students.length === 0) {
      toast({
        title: "Tidak ada data",
        description: "Tidak ada data mahasiswa untuk diekspor",
        variant: "destructive",
      });
      return;
    }
    exportToCSV(students);
    toast({
      title: "Berhasil",
      description: "Data berhasil diekspor ke CSV",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await importFromJSON(file);
      if (result.success && result.data) {
        onImport(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengimpor file",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatLastSaved = (timestamp: string | null) => {
    if (!timestamp) return "Belum tersimpan";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("id-ID", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "Belum tersimpan";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <Button variant="gradient" onClick={onAddClick} className="gap-2">
          <Plus className="w-4 h-4" />
          Tambah Mahasiswa
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportJSON}>
              <FileJson className="w-4 h-4 mr-2" />
              Export sebagai JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCSV}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export sebagai CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          onClick={handleImportClick}
          disabled={isImporting}
          className="gap-2"
        >
          {isImporting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Import
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Database className="w-4 h-4" />
        <span>Terakhir disimpan: {formatLastSaved(lastSaved)}</span>
      </div>
    </motion.div>
  );
}

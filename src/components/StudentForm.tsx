/**
 * Student Form Component
 * Form untuk menambah dan mengedit data mahasiswa
 * Dengan validasi menggunakan Regex
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IStudent } from "@/models/Student";
import {
  validateNIM,
  validateNama,
  validateEmail,
  validateJurusan,
  validateSemester,
  validateIPK,
} from "@/utils/validation";

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IStudent, "id">) => boolean;
  editData?: IStudent | null;
}

interface FormErrors {
  nim?: string;
  nama?: string;
  email?: string;
  jurusan?: string;
  semester?: string;
  ipk?: string;
}

// Daftar jurusan untuk autocomplete
const JURUSAN_LIST = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Teknik Elektro",
  "Teknik Mesin",
  "Teknik Sipil",
  "Manajemen",
  "Akuntansi",
  "Psikologi",
  "Hukum",
  "Kedokteran",
];

export function StudentForm({ isOpen, onClose, onSubmit, editData }: StudentFormProps) {
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    email: "",
    jurusan: "",
    semester: "",
    ipk: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form saat modal dibuka/ditutup atau editData berubah
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          nim: editData.nim,
          nama: editData.nama,
          email: editData.email,
          jurusan: editData.jurusan,
          semester: editData.semester.toString(),
          ipk: editData.ipk.toString(),
        });
      } else {
        setFormData({
          nim: "",
          nama: "",
          email: "",
          jurusan: "",
          semester: "",
          ipk: "",
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, editData]);

  // Validasi real-time
  const validateField = (name: string, value: string): string | undefined => {
    try {
      switch (name) {
        case "nim":
          const nimResult = validateNIM(value);
          return nimResult.isValid ? undefined : nimResult.message;
        case "nama":
          const namaResult = validateNama(value);
          return namaResult.isValid ? undefined : namaResult.message;
        case "email":
          const emailResult = validateEmail(value);
          return emailResult.isValid ? undefined : emailResult.message;
        case "jurusan":
          const jurusanResult = validateJurusan(value);
          return jurusanResult.isValid ? undefined : jurusanResult.message;
        case "semester":
          const semesterResult = validateSemester(parseInt(value) || 0);
          return semesterResult.isValid ? undefined : semesterResult.message;
        case "ipk":
          const ipkResult = validateIPK(parseFloat(value) || 0);
          return ipkResult.isValid ? undefined : ipkResult.message;
        default:
          return undefined;
      }
    } catch (error) {
      return "Terjadi kesalahan validasi";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    setTouched({
      nim: true,
      nama: true,
      email: true,
      jurusan: true,
      semester: true,
      ipk: true,
    });

    if (Object.keys(newErrors).length > 0) return;

    try {
      const success = onSubmit({
        nim: formData.nim.toUpperCase(),
        nama: formData.nama,
        email: formData.email,
        jurusan: formData.jurusan,
        semester: parseInt(formData.semester),
        ipk: parseFloat(formData.ipk),
        tanggalMasuk: editData?.tanggalMasuk || new Date().toISOString().split("T")[0],
      });

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg glass-card p-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {editData ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editData ? "Perbarui data mahasiswa" : "Masukkan data mahasiswa baru"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NIM */}
              <FormField
                label="NIM"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.nim ? errors.nim : undefined}
                placeholder="Masukkan NIM"
                disabled={false}
              />

              {/* Nama */}
              <FormField
                label="Nama Lengkap"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.nama ? errors.nama : undefined}
                placeholder="Masukkan nama lengkap"
              />

              {/* Email */}
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                placeholder="contoh@email.com"
              />

              {/* Jurusan */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Jurusan</label>
                <select
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="flex h-10 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <option value="">Pilih Jurusan</option>
                  {JURUSAN_LIST.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
                {touched.jurusan && errors.jurusan && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.jurusan}
                  </p>
                )}
              </div>

              {/* Semester & IPK */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Semester"
                  name="semester"
                  type="number"
                  value={formData.semester}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.semester ? errors.semester : undefined}
                  placeholder="1-14"
                  min="1"
                  max="14"
                />
                <FormField
                  label="IPK"
                  name="ipk"
                  type="number"
                  step="0.01"
                  value={formData.ipk}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.ipk ? errors.ipk : undefined}
                  placeholder="0.00 - 4.00"
                  min="0"
                  max="4"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" variant="gradient" className="flex-1">
                  <Save className="w-4 h-4" />
                  {editData ? "Simpan Perubahan" : "Tambah Mahasiswa"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  step?: string;
}

function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = "text",
  disabled,
  min,
  max,
  step,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={error ? "border-destructive focus-visible:ring-destructive/50" : ""}
      />
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

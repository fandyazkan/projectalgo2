/**
 * Index Page - Halaman Utama Aplikasi Manajemen Data Mahasiswa
 * 
 * Fitur yang diimplementasikan:
 * 1. CRUD Data Mahasiswa (Create, Read, Update, Delete)
 * 2. Penyimpanan dengan localStorage (File I/O simulation)
 * 3. OOP dengan TypeScript (Class, Object, Encapsulation, Inheritance, Polymorphism)
 * 4. Pencarian (Linear Search, Binary Search)
 * 5. Pengurutan (Bubble Sort, Selection Sort)
 * 6. Validasi Input dengan Regex
 * 7. Error Handling dengan Try-Catch
 * 8. Time Complexity untuk setiap algoritma
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { StudentTable } from "@/components/StudentTable";
import { StudentForm } from "@/components/StudentForm";
import { DeleteDialog } from "@/components/DeleteDialog";
import { AlgorithmInfo } from "@/components/AlgorithmInfo";
import { useStudentManager } from "@/hooks/useStudentManager";
import { useAuth } from "@/hooks/useAuth";
import { IStudent } from "@/models/Student";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // State management menggunakan custom hook
  const {
    students,
    isLoading,
    lastSaved,
    addStudent,
    updateStudent,
    deleteStudent,
    importStudents,
  } = useStudentManager();

  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<IStudent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IStudent | null>(null);

  // Hitung statistik
  const stats = useMemo(() => {
    if (students.length === 0) {
      return { avgIPK: 0 };
    }
    const totalIPK = students.reduce((sum, s) => sum + s.ipk, 0);
    return {
      avgIPK: totalIPK / students.length,
    };
  }, [students]);

  // Handlers
  const handleAddClick = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (student: IStudent) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (student) {
      setDeleteTarget(student);
    }
  };

  const handleFormSubmit = (data: Omit<IStudent, "id">) => {
    if (editingStudent) {
      return updateStudent(editingStudent.id, data);
    }
    return addStudent(data);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteStudent(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  if (isLoading || authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header dengan statistik */}
      <Header totalStudents={students.length} avgIPK={stats.avgIPK} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Panel - Table */}
          <div className="xl:col-span-3 space-y-6">
            {/* Toolbar */}
            <Toolbar
              onAddClick={handleAddClick}
              students={students}
              onImport={importStudents}
              lastSaved={lastSaved}
            />

            {/* Student Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <StudentTable
                students={students}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          </div>

          {/* Side Panel - Algorithm Info */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AlgorithmInfo />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Student Form Modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editData={editingStudent}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        studentName={deleteTarget?.nama || ""}
      />
    </div>
  );
};

export default Index;

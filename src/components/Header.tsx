/**
 * Header Component
 * Menampilkan header aplikasi dengan branding dan statistik
 */

import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, TrendingUp, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  totalStudents: number;
  avgIPK: number;
}

export function Header({ totalStudents, avgIPK }: HeaderProps) {
  const { signOut, user } = useAuth();

  return (
    <header className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-xl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
      
      {/* Theme toggle and logout */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <ThemeToggle />
        {user && (
          <Button variant="ghost" size="icon" onClick={signOut} title="Logout">
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      <div className="container relative mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-effect">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary-foreground">✓</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                <span className="gradient-text">Student</span>
                <span className="text-foreground"> Manager</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistem Manajemen Data Mahasiswa
              </p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Total Mahasiswa"
              value={totalStudents.toString()}
              color="primary"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Rata-rata IPK"
              value={avgIPK.toFixed(2)}
              color="accent"
            />
            <StatCard
              icon={<BookOpen className="w-5 h-5" />}
              label="Algoritma"
              value="5+"
              color="success"
            />
          </motion.div>
        </div>
      </div>
    </header>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "primary" | "accent" | "success";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    success: "bg-success/10 text-success border-success/20",
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${colorClasses[color]} backdrop-blur-sm`}>
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

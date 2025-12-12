/**
 * Algorithm Info Card Component
 * Menampilkan informasi tentang algoritma yang digunakan
 */

import { motion } from "framer-motion";
import { Clock, Cpu, Zap, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AlgorithmInfoProps {
  className?: string;
}

const algorithms = [
  {
    name: "Linear Search",
    timeComplexity: "O(n)",
    description: "Mencari elemen satu per satu secara berurutan",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    name: "Binary Search",
    timeComplexity: "O(log n)",
    description: "Membagi array menjadi dua bagian (data harus terurut)",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    description: "Menukar elemen berdekatan yang tidak terurut",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    name: "Selection Sort",
    timeComplexity: "O(n²)",
    description: "Mencari minimum dan menempatkan di posisi yang benar",
    color: "text-error",
    bg: "bg-error/10",
  },
];

export function AlgorithmInfo({ className }: AlgorithmInfoProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cpu className="w-5 h-5 text-primary" />
          Algoritma & Time Complexity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {algorithms.map((algo, index) => (
            <motion.div
              key={algo.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg ${algo.bg} border border-border/50`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{algo.name}</span>
                <code className={`px-2 py-0.5 rounded font-mono text-xs ${algo.color} bg-background/50`}>
                  {algo.timeComplexity}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">{algo.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Keterangan Notasi Big O</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" />
              <span>O(1) - Konstan, tercepat</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-success" />
              <span>O(log n) - Logaritmik</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-accent" />
              <span>O(n) - Linear</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-warning" />
              <span>O(n²) - Kuadratik, lambat</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

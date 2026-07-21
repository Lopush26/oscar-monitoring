// components/forms/VerifyForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Check, ShieldAlert, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const verifySchema = z.object({
  notes: z.string().optional(),
});

type VerifyFormData = z.infer<typeof verifySchema>;

interface VerifyFormProps {
  measurement: {
    id: number;
    tracking_id: string;
    mirna31: number | string;
    lactate_uM: number | string;
    il8_pg_mg: number | string;
    status: 'raw' | 'verified' | 'rejected';
    ai_pred_class: 'OSCC' | 'Normal' | null;
    ai_probability: number | string | null;
    patient_id: string | null;
    created_at: string;
  };
}

export function VerifyForm({ measurement }: VerifyFormProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { notes: "" },
  });

  const onSubmitStatus = async (status: 'verified' | 'rejected', data: VerifyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/measurements/${measurement.tracking_id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: measurement.patient_id || measurement.tracking_id,
          status: status,
          notes: data.notes || "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Aksi gagal");
      }

      router.push("/verifikasi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const mirna = Number(measurement.mirna31) || 0;
  const lactate = Number(measurement.lactate_uM) || 0;
  const il8 = Number(measurement.il8_pg_mg) || 0;
  const prob = Number(measurement.ai_probability) || 0;

  const isMirnaHigh = mirna > 2.0;
  const isLactateHigh = lactate > 200;
  const isIl8High = il8 > 50;

  const biomarkers = [
    { name: "IL-8", val: il8, unit: "pg/mg", status: isIl8High ? "High" : "Normal", isHigh: isIl8High },
    { name: "miRNA-31", val: mirna, unit: "RQ", status: isMirnaHigh ? "High" : "Normal", isHigh: isMirnaHigh },
    { name: "Asam Laktat", val: lactate / 1000, unit: "mM", status: isLactateHigh ? "High" : "Normal", isHigh: isLactateHigh },
  ];

  const chartData = [
    { month: "Jan", "miRNA-31": 0.8, "IL-8": 1.2, "Lactate": 1.1 },
    { month: "Feb", "miRNA-31": 1.1, "IL-8": 1.5, "Lactate": 1.8 },
    { month: "Mar", "miRNA-31": 1.5, "IL-8": 2.1, "Lactate": 1.4 },
    { month: "Apr", "miRNA-31": 1.9, "IL-8": 1.7, "Lactate": 1.6 },
    { month: "May", "miRNA-31": 2.5, "IL-8": 2.8, "Lactate": 1.3 },
    { month: "Jun", "miRNA-31": mirna, "IL-8": il8 / 20, "Lactate": lactate / 1500 },
  ];

  const isPositive = measurement.ai_pred_class === "OSCC";
  const formattedDate = new Date(measurement.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tickColor = isDark ? '#64748b' : '#94a3b8';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/verifikasi"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground transition-colors duration-200"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Patient ID: {measurement.patient_id || measurement.tracking_id}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Status: <span className="text-amber-600 dark:text-amber-400 font-semibold uppercase">Require Verification</span>
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs border border-red-200 dark:border-red-500/20 transition-colors duration-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <Card className="glass-card p-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Patient Demographics
            </h3>
            <div className="grid grid-cols-1 gap-y-3 text-sm text-foreground">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Age</span>
                <span className="font-semibold">54</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-semibold">Male</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">Last Visit</span>
                <span className="font-semibold">{formattedDate}</span>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-red-200 dark:border-red-500/30 p-6 relative overflow-hidden">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              AI Diagnostic Summary
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-extrabold tracking-tight text-red-600 dark:text-red-500 tabular-nums">
                  {prob.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold tracking-wider">
                  Risk Probability
                </p>
                <p className={`text-sm font-bold mt-2 ${isPositive ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {isPositive ? 'OSCC Positive' : 'Normal / Low Risk'}
                </p>
              </div>
              <div className="opacity-80 shrink-0">
                <svg className="w-32 h-16 text-emerald-500 dark:text-emerald-400" viewBox="0 0 100 40">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,35 Q20,33 40,28 T70,22 T90,5 L100,5 L100,40 L0,40 Z" fill="url(#grad)" />
                  <path d="M0,35 Q20,33 40,28 T70,22 T90,5 L100,5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Verification Notes
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <textarea
                id="notes"
                rows={4}
                className="w-full rounded-lg border border-border bg-slate-50 dark:bg-slate-900/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-700 transition-colors duration-300"
                placeholder="Input comments here..."
                {...register("notes")}
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleSubmit((data) => onSubmitStatus('rejected', data))}
                  disabled={isLoading}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-foreground border border-slate-200 dark:border-slate-700 rounded-lg h-11 text-sm font-semibold transition-all hover:scale-[1.02]"
                >
                  <ShieldAlert size={16} />
                  Reject Data
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmit((data) => onSubmitStatus('verified', data))}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg h-11 text-sm font-semibold transition-all hover:scale-[1.02] border-0 shadow-sm"
                >
                  <Check size={16} />
                  Approve & Finalize
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <Card className="glass-card p-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Comprehensive Biomarker Data
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: tickColor }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: tickColor }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '11px', color: isDark ? '#e2e8f0' : '#0f172a' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                  <Line type="monotone" dataKey="miRNA-31" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="miRNA-31" />
                  <Line type="monotone" dataKey="IL-8" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="IL-8" />
                  <Line type="monotone" dataKey="Lactate" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3 }} name="Lactate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end text-[10px] text-muted-foreground mt-2 font-medium">
              Last 6 month, 6 months
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Biomarker Table Review
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3">Biomarker</th>
                    <th className="pb-3">Value</th>
                    <th className="pb-3 text-center">Action</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-foreground">
                  {biomarkers.map((b) => (
                    <tr key={b.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="py-3.5 font-medium">{b.name}</td>
                      <td className="py-3.5 font-mono">{b.val.toFixed(2)} {b.unit}</td>
                      <td className="py-3.5 text-center">
                        <div className="relative inline-flex items-center">
                          <select className="appearance-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-foreground text-xs font-medium py-1.5 pl-3 pr-8 rounded border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-none transition-colors duration-200">
                            <option>Override Value</option>
                            <option>Normal Limit</option>
                            <option>Set Abnormal</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 text-muted-foreground pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${b.isHigh ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          - {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <div className="text-center text-[10px] text-muted-foreground pt-6">
        OSCAR Clinical Review v1.0 | © 2026 PKM KC Unhas
      </div>
    </div>
  );
}
// components/forms/VerifyForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

  // 🔥 Parsing semua nilai ke number
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

  return (
    <div className="space-y-6">
      {/* Back button & Title bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/verifikasi"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Patient ID: {measurement.patient_id || measurement.tracking_id}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Status: <span className="text-amber-400 font-semibold uppercase">Require Verification</span>
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-xs border border-red-500/20">
          {error}
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-5">
          {/* Patient Demographics */}
          <Card className="glass border-slate-800 bg-[#0a0f1d]/50 p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Patient Demographics
            </h3>
            <div className="grid grid-cols-1 gap-y-3 text-sm text-slate-200">
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Age</span>
                <span className="font-semibold">54</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Gender</span>
                <span className="font-semibold">Male</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Last Visit</span>
                <span className="font-semibold">{formattedDate}</span>
              </div>
            </div>
          </Card>

          {/* AI Diagnostic Summary */}
          <Card className="glass border-red-500/30 bg-slate-900/30 p-6 shadow-[0_0_15px_rgba(239,68,68,0.06)] relative overflow-hidden">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              AI Diagnostic Summary
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-extrabold tracking-tight text-red-500 tabular-nums">
                  {prob.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                  Risk Probability
                </p>
                <p className={`text-sm font-bold mt-2 ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isPositive ? 'OSCC Positive' : 'Normal / Low Risk'}
                </p>
              </div>
              <div className="opacity-80 shrink-0">
                <svg className="w-32 h-16 text-emerald-400" viewBox="0 0 100 40">
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

          {/* Verification Notes & Form Actions */}
          <Card className="glass border-slate-800 bg-[#0a0f1d]/50 p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Verification Notes
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <textarea
                id="notes"
                rows={4}
                className="w-full rounded-lg border border-slate-800 bg-[#0a0f1d]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-700 transition-colors"
                placeholder="Input o input comments tho input input comments"
                {...register("notes")}
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleSubmit((data) => onSubmitStatus('rejected', data))}
                  disabled={isLoading}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 rounded-lg h-11 text-sm font-semibold transition-all hover:scale-[1.02]"
                >
                  <ShieldAlert size={16} />
                  Reject Data
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmit((data) => onSubmitStatus('verified', data))}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg h-11 text-sm font-semibold transition-all hover:scale-[1.02] border-0 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                >
                  <Check size={16} />
                  Approve & Finalize
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* Comprehensive Biomarker Data */}
          <Card className="glass border-slate-800 bg-[#0a0f1d]/50 p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Comprehensive Biomarker Data
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0f1d', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                  <Line type="monotone" dataKey="miRNA-31" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="miRNA-31" />
                  <Line type="monotone" dataKey="IL-8" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="IL-8" />
                  <Line type="monotone" dataKey="Lactate" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3 }} name="Lactate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end text-[10px] text-slate-500 mt-2 font-medium">
              Last 6 month, 6 months
            </div>
          </Card>

          {/* Biomarker Table Review */}
          <Card className="glass border-slate-800 bg-[#0a0f1d]/50 p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Biomarker Table Review
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Biomarker</th>
                    <th className="pb-3">Value</th>
                    <th className="pb-3 text-center">Action</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-200">
                  {biomarkers.map((b) => (
                    <tr key={b.name} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-3.5 font-medium">{b.name}</td>
                      <td className="py-3.5 font-mono">{b.val.toFixed(2)} {b.unit}</td>
                      <td className="py-3.5 text-center">
                        <div className="relative inline-flex items-center">
                          <select className="appearance-none bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium py-1.5 pl-3 pr-8 rounded border border-slate-700 cursor-pointer focus:outline-none">
                            <option>Override Value</option>
                            <option>Normal Limit</option>
                            <option>Set Abnormal</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 text-slate-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${b.isHigh ? 'text-red-400' : 'text-emerald-400'}`}>
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

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-500 pt-6">
        OSCAR Clinical Review v1.0 | © 2026 PKM KC Unhas
      </div>
    </div>
  );
}
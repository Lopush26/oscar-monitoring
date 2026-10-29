// components/forms/VerifyForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
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
    age: number | null;
    gender: string | null;
    notes?: string | null;
    lat_obfuscated?: number | string | null;
    lng_obfuscated?: number | string | null;
  };
  role?: string;
}

export function VerifyForm({ measurement, role }: VerifyFormProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [age, setAge] = useState<string>(measurement.age?.toString() || "");
  const [gender, setGender] = useState<string>(measurement.gender || "");
  const [locationName, setLocationName] = useState<string>((measurement as any).location_name || "");
  const [isSavingDemographics, setIsSavingDemographics] = useState(false);
  const [demographicsSaved, setDemographicsSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const saveDemographics = async () => {
    setIsSavingDemographics(true);
    setDemographicsSaved(false);
    try {
      const res = await fetch(`/api/measurements/${measurement.tracking_id}/demographics`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          age: age ? Number(age) : null,
          gender: gender || null,
          location_name: locationName || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menyimpan data");
      }
      setDemographicsSaved(true);
      setTimeout(() => setDemographicsSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingDemographics(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this data?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/measurements/${measurement.tracking_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      router.push("/verifikasi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
      setIsDeleting(false);
    }
  };

  const { register, handleSubmit } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { notes: measurement.notes || "" },
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
    { name: "IL-8", val: il8, unit: "pg/mL", status: isIl8High ? "High" : "Normal", isHigh: isIl8High, accent: 'emerald' as const },
    { name: "miRNA-31", val: mirna, unit: "RQ", status: isMirnaHigh ? "High" : "Normal", isHigh: isMirnaHigh, accent: 'blue' as const },
    { name: "Asam Laktat", val: lactate / 1000, unit: "mM", status: isLactateHigh ? "High" : "Normal", isHigh: isLactateHigh, accent: 'amber' as const },
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

  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const tickColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF';
  const tooltipBorder = isDark ? '#334155' : '#E2E8F0';

  return (
    <div className="section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/verifikasi"
            className="btn-ghost w-10 h-10 rounded-xl p-0"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Patient ID: {measurement.patient_id || measurement.tracking_id}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">Status:</span>
              {measurement.status === 'verified' ? (
                <span className="badge badge-success"><Check size={12} className="mr-1" />Terverifikasi</span>
              ) : measurement.status === 'rejected' ? (
                <span className="badge badge-danger"><ShieldAlert size={12} className="mr-1" />Ditolak</span>
              ) : (
                <span className="badge badge-warning">Perlu Verifikasi</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <Card className="card-hover" variant="hover" accent="blue">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Data Demografis Pasien</CardTitle>
                {demographicsSaved && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
                    ✓ Tersimpan
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Input
                    label="Usia (tahun)"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="(tahun)"
                    tabular
                  />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select
                    className="input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Pilih...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Input
                    label="Lokasi"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Nama lokasi/wilayah"
                  />
                </div>
                <div>
                  <label className="label">Last Visit</label>
                  <div className="input bg-muted/50 cursor-default">{formattedDate}</div>
                </div>
              </div>
              <Button
                type="button"
                onClick={saveDemographics}
                disabled={isSavingDemographics}
                className="w-full"
              >
                {isSavingDemographics ? 'Menyimpan...' : 'Simpan Data Pasien'}
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover" variant="hover" accent="red">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Ringkasan Diagnostik AI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold tracking-tight text-red-600 dark:text-red-400 tabular-nums">
                    {prob.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold tracking-wider">
                    Probabilitas Risiko
                  </p>
                  <p className={`text-sm font-bold mt-2 ${isPositive ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isPositive ? 'OSCC Positif' : 'Normal / Risiko Rendah'}
                  </p>
                </div>
                <div className="opacity-80 shrink-0">
                  <svg className="w-32 h-16 text-emerald-500" viewBox="0 0 100 40">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,35 Q20,33 40,28 T70,22 T90,5 L100,5 L100,40 L0,40 Z" fill="url(#grad)" />
                    <path d="M0,35 Q20,33 40,28 T70,22 T90,5 L100,5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover" variant="hover" accent="violet">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Catatan Verifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <textarea
                  id="notes"
                  rows={4}
                  className="input resize-none"
                  placeholder="Masukkan catatan verifikasi..."
                  {...register("notes")}
                />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={handleSubmit((data) => onSubmitStatus('rejected', data))}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <ShieldAlert size={16} className="mr-1" />
                    Tolak Data
                  </Button>

                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit((data) => onSubmitStatus('verified', data))}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Check size={16} className="mr-1" />
                    Setujui & Finalisasi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <Card className="card-hover" variant="hover" accent="blue">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Data Biomarker Komprehensif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.35} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: tickColor }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: tickColor }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: isDark ? '#E2E8F0' : '#0F172A'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                    <Line type="monotone" dataKey="miRNA-31" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} name="miRNA-31" />
                    <Line type="monotone" dataKey="IL-8" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} name="IL-8" />
                    <Line type="monotone" dataKey="Lactate" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} name="Lactate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-end text-[10px] text-muted-foreground mt-2 font-medium">
                Last 6 month, 6 months
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover" variant="hover" accent="violet">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Tabel Review Biomarker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="pl-6 pr-4">Biomarker</th>
                      <th className="px-4">Value</th>
                      <th className="px-4 text-center">Action</th>
                      <th className="pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-foreground">
                    {biomarkers.map((b) => (
                      <tr key={b.name}>
                        <td className="pl-6 pr-4 font-medium">{b.name}</td>
                        <td className="px-4 font-mono tabular-nums">{b.val.toFixed(2)} {b.unit}</td>
                        <td className="px-4 text-center">
                          <div className="relative inline-flex items-center">
                            <select className="appearance-none input bg-muted/50 pr-8 text-center text-xs font-medium w-36">
                              <option>Override Value</option>
                              <option>Normal Limit</option>
                              <option>Set Abnormal</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 text-muted-foreground pointer-events-none" />
                          </div>
                        </td>
                        <td className="pr-6 text-right">
                          <span className={`inline-flex items-center gap-1 font-semibold text-xs ${b.isHigh ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            - {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center text-[10px] text-muted-foreground pt-6 border-t border-border">
        OSCAR Clinical Review v1.0 | © 2026 PKM KC Unhas
      </div>

      {role === 'admin' && (measurement.status === 'verified' || measurement.status === 'rejected') && (
        <div className="pt-4 border-t border-border flex justify-center">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Hapus Data
          </Button>
        </div>
      )}
    </div>
  );
}
// components/forms/VerifyForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

// Schema validasi dengan Zod
const verifySchema = z.object({
  patientId: z.string().min(1, "Patient ID wajib diisi"),
  notes: z.string().optional(),
});

type VerifyFormData = z.infer<typeof verifySchema>;

interface VerifyFormProps {
  measurementId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VerifyForm({ measurementId, onSuccess, onCancel }: VerifyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: VerifyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/measurements/${measurementId}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: data.patientId,
          status: "verified",
          notes: data.notes || "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Verifikasi gagal");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verifikasi Pasien</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="patientId" className="block text-sm font-medium mb-1">
              Patient ID
            </label>
            <Input
              id="patientId"
              placeholder="Masukkan ID pasien"
              {...register("patientId")}
            />
            {errors.patientId && (
              <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              Catatan Klinis (Opsional)
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tambahkan catatan jika diperlukan..."
              {...register("notes")}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} type="button">
              Batal
            </Button>
          )}
          <Button type="submit" isLoading={isLoading}>
            Verifikasi
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
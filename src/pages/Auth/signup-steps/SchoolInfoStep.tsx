import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type SchoolInfoData = {
  studentId: string;
  yearLevel: string;
  department: string;
  section: string;
};

type Props = {
  data: SchoolInfoData;
  onNext: (data: SchoolInfoData) => void;
  onBack: () => void;
};

export function SchoolInfoStep({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<SchoolInfoData>(data);

  const set =
    (field: keyof SchoolInfoData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <FieldGroup>
      <div className="flex flex-col gap-1 text-center mb-4">
        <h1 className="text-2xl font-bold">School information</h1>
        <p className="text-sm text-muted-foreground">
          Used to verify your enrollment status.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="studentId">Student ID</FieldLabel>
        <Input
          id="studentId"
          value={form.studentId}
          onChange={set("studentId")}
          placeholder="2023-0444"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="yearLevel">Year level</FieldLabel>
          <Select
            value={form.yearLevel}
            onValueChange={(v) => setForm((p) => ({ ...p, yearLevel: v }))}>
            <SelectTrigger id="yearLevel">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <Select
            value={form.department}
            onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}>
            <SelectTrigger id="department">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {["BSIT", "BSCS", "BSIS", "BSED"].map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="section">Section</FieldLabel>
        <Input
          id="section"
          value={form.section}
          onChange={set("section")}
          placeholder="e.g. A, B, C"
          required
        />
      </Field>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}>
          <ArrowLeft className="size-4 ml-1" />
          Back
        </Button>
        <Button type="button" className="flex-1" onClick={() => onNext(form)}>
          NEXT <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>
    </FieldGroup>
  );
}

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-1.5"
      />
    </div>
  );
}

export function FormTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: FormFieldProps & { rows?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-1.5"
      />
    </div>
  );
}

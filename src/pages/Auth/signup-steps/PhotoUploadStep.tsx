import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type PhotoData = { file: File | null; previewUrl: string };

type Props = {
  data: PhotoData;
  onNext: (data: PhotoData) => void;
  onBack: () => void;
};

export function PhotoUploadStep({ data, onNext, onBack }: Props) {
  const [photo, setPhoto] = useState<PhotoData>(data);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPhoto({ file, previewUrl });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <FieldGroup>
      <div className="flex flex-col gap-1 text-center mb-4">
        <h1 className="text-2xl font-bold">Profile photo</h1>
        <p className="text-sm text-muted-foreground">
          Upload a clear photo of your face. Helps admin verify your identity.
        </p>
      </div>

      <Field>
        <FieldLabel>Photo</FieldLabel>
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition-colors">
          {photo.previewUrl ? (
            <img
              src={photo.previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <>
              <div className="text-4xl text-muted-foreground">📷</div>
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
            </>
          )}
          <FieldDescription>
            JPG or PNG · Max 5 MB · Square crop recommended
          </FieldDescription>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
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
        <Button
          type="button"
          className="flex-1"
          disabled={!photo.file}
          onClick={() => onNext(photo)}>
          NEXT
          <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>
    </FieldGroup>
  );
}

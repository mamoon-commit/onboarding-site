import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api"; // ← This is the key one!
import {
  Upload,
  File,
  FileText,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";


interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress: number;
  category: string;
}

interface DocumentUploadProps {
  userId: string;
  category: string;
  onUploadSuccess: () => void;
}

const DocumentUpload = ({ userId, category, onUploadSuccess }: DocumentUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(true);
};

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);

  const droppedFiles = Array.from(e.dataTransfer.files);
  processFiles(droppedFiles);
};

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = async (fileList: File[]) => {
    for (const file of fileList) {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 50,
        category: category,
      };

      setFiles((prev) => [...prev, newFile]);

      try {
        // Send the actual file object (not just metadata)
        await apiService.uploadDocument(file, userId, category);

        // Mark as completed
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id
              ? { ...f, status: "completed", progress: 100 }
              : f
          )
        );

        toast({
          title: "Upload completed",
          description: `${file.name} has been uploaded successfully.`,
        });

        onUploadSuccess(); // Refresh the documents list
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id ? { ...f, status: "error", progress: 0 } : f
          )
        );

        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }
  };
  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <Image className="w-5 h-5" />;
    } else if (type === "application/pdf" || type.includes("document")) {
      return <FileText className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "status-success";
      case "uploading":
        return "status-warning";
      case "error":
        return "status-error";
      default:
        return "bg-muted text-muted-foreground border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "uploading":
        return <Upload className="w-4 h-4 text-warning animate-pulse" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Upload your required documents for onboarding verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  Drop files here or click to browse
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports PDF, JPG, PNG files up to 10MB each
                </p>
              </div>
              <Button variant="outline">Select Files</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="card-professional">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              {files.filter((f) => f.status === "completed").length} of{" "}
              {files.length} files uploaded
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                  {getFileIcon(file.type)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{file.name}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <Badge className={getStatusColor(file.status)}>
                        {file.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {file.category}
                  </p>
                  {file.status === "uploading" && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{file.progress}%</span>
                      </div>
                      <Progress value={file.progress} className="h-1" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {file.status === "completed" && (
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Required Documents Checklist */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            Please ensure you upload all required documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Government-issued ID", required: true, uploaded: true },
            { name: "Proof of Address", required: true, uploaded: false },
            {
              name: "Educational Certificates",
              required: true,
              uploaded: false,
            },
            {
              name: "Previous Employment Records",
              required: false,
              uploaded: false,
            },
            {
              name: "Professional Certifications",
              required: false,
              uploaded: false,
            },
          ].map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  ${
                    doc.uploaded
                      ? "bg-success text-success-foreground"
                      : "bg-muted"
                  }
                `}
                >
                  {doc.uploaded ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {doc.required ? "Required" : "Optional"}
                  </p>
                </div>
              </div>
              <Badge
                className={
                  doc.uploaded
                    ? "status-success"
                    : "bg-muted text-muted-foreground border"
                }
              >
                {doc.uploaded ? "Uploaded" : "Pending"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;

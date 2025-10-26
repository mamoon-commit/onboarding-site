import { useState, useEffect } from "react";
import { apiService, User, DocumentCategory, Document } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DocumentUpload from "./DocumentUpload";

export default function Documents() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const blob = await apiService.downloadDocument(documentId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download document");
    }
  };
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUsersForDocument();
      setUsers(response.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setSelectedCategory(null);
    setLoading(true);
    try {
      const response = await apiService.getUserDocumentCategories(user._id);
      setCategories(response.categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category: string) => {
    if (!selectedUser) return;
    setSelectedCategory(category);
    setShowUpload(false); // Reset upload view
    setLoading(true);
    try {
      const response = await apiService.getDocumentsbyCategories(
        selectedUser._id,
        category
      );
      setDocuments(response.documents);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setCategories([]);
    setSelectedCategory(null);
    setDocuments([]);
    setShowUpload(false);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setDocuments([]);
    setShowUpload(false);
  };

  const refreshDocuments = async () => {
    if (!selectedUser || !selectedCategory) return;
    try {
      const response = await apiService.getDocumentsbyCategories(
        selectedUser._id,
        selectedCategory
      );
      setDocuments(response.documents);
    } catch (error) {
      console.error("Failed to refresh documents:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // View 3: Show upload form or documents list
  if (selectedCategory && selectedUser) {
    return (
      <div className="p-6">
        <Button
          onClick={handleBackToCategories}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
        </Button>

        <h2 className="text-2xl font-bold mb-4">
          {selectedUser.name} -{" "}
          {selectedCategory.replace("_", " ").toUpperCase()} Documents
        </h2>

        <div className="mb-4 space-x-2">
          <Button onClick={() => setShowUpload(!showUpload)}>
            {showUpload ? "View Documents" : "Add Document"}
          </Button>
        </div>

        {showUpload ? (
          <DocumentUpload
            userId={selectedUser._id}
            category={selectedCategory}
            onUploadSuccess={refreshDocuments}
          />
        ) : (
          <>
            {documents.length === 0 ? (
              <p>No documents found in this category.</p>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <Card key={doc._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p>
                            <strong>File:</strong> {doc.file_name}
                          </p>
                          <p>
                            <strong>Size:</strong>{" "}
                            {(doc.file_size / 1024).toFixed(2)} KB
                          </p>
                          <p>
                            <strong>Uploaded:</strong>{" "}
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDownload(doc._id, doc.file_name)}
                          variant="outline"
                        >
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  //Show document categories for selected user
  if (selectedUser) {
    return (
      <div className="p-6">
        <Button onClick={handleBackToUsers} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>

        <h2 className="text-2xl font-bold mb-4">
          Document Categories for {selectedUser.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.category}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleCategorySelect(category.category)}
            >
              <CardHeader>
                <CardTitle>{category.display_name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show all users (default view)
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Document Management - Select an Employee
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card
            key={user._id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleUserSelect(user)}
          >
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">
                {user.position || "No position"}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  Mail,
  Phone,
  Trash2,
  Eye,
  CheckCircle,
  MessageSquare,
  Calendar,
  User,
  Filter,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
  status: "new" | "read" | "replied";
  adminNotes?: string;
  submittedAt: string;
  readAt?: string;
  ipAddress?: string;
}

export default function AdminContactPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/admin/login";
    },
  });
  const { success, error } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">(
    "all"
  );
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const url =
        filter === "all" ? "/api/contact" : `/api/contact?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setAdminNotes(submission.adminNotes || "");
    setIsModalOpen(true);

    // Mark as read if it's new
    if (submission.status === "new") {
      updateStatus(submission._id, "read");
    }
  };

  const updateStatus = async (
    id: string,
    status: "new" | "read" | "replied",
    notes?: string
  ) => {
    try {
      setUpdating(true);
      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          adminNotes: notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub._id === id
              ? { ...sub, status, adminNotes: notes || sub.adminNotes }
              : sub
          )
        );
        if (selectedSubmission?._id === id) {
          setSelectedSubmission({
            ...selectedSubmission,
            status,
            adminNotes: notes,
          });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      error("Failed to update status", "Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setSubmissions((prev) => prev.filter((sub) => sub._id !== id));
        if (selectedSubmission?._id === id) {
          setIsModalOpen(false);
          setSelectedSubmission(null);
        }
        success("Submission deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete submission:", error);
      error("Failed to delete submission", "Please try again.");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;

    await updateStatus(
      selectedSubmission._id,
      selectedSubmission.status,
      adminNotes
    );
    success("Notes saved successfully");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "warning"> = {
      new: "warning",
      read: "default",
      replied: "success",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredSubmissions = submissions;

  const stats = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === "new").length,
    read: submissions.filter((s) => s.status === "read").length,
    replied: submissions.filter((s) => s.status === "replied").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              Contact Submissions
            </h1>
            <p className="text-muted-foreground">
              Manage customer inquiries and messages
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Read</p>
                <p className="text-2xl font-bold">{stats.read}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Replied</p>
                <p className="text-2xl font-bold">{stats.replied}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("new")}
          >
            New ({stats.new})
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("read")}
          >
            Read ({stats.read})
          </Button>
          <Button
            variant={filter === "replied" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("replied")}
          >
            Replied ({stats.replied})
          </Button>
        </div>

        {/* Submissions Table */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Mail className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {submission.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${submission.email}`}
                          className="text-primary hover:underline"
                        >
                          {submission.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`tel:${submission.phone}`}
                          className="text-primary hover:underline"
                        >
                          {submission.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {submission.inquiryType}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(
                            submission.submittedAt
                          ).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewSubmission(submission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(submission._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Submission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contact Submission Details"
        size="lg"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={
                    selectedSubmission.status === "new" ? "default" : "outline"
                  }
                  onClick={() => updateStatus(selectedSubmission._id, "new")}
                  disabled={updating}
                >
                  New
                </Button>
                <Button
                  size="sm"
                  variant={
                    selectedSubmission.status === "read" ? "default" : "outline"
                  }
                  onClick={() => updateStatus(selectedSubmission._id, "read")}
                  disabled={updating}
                >
                  Read
                </Button>
                <Button
                  size="sm"
                  variant={
                    selectedSubmission.status === "replied"
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    updateStatus(selectedSubmission._id, "replied")
                  }
                  disabled={updating}
                >
                  Replied
                </Button>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Name
                </label>
                <p className="font-medium">{selectedSubmission.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Inquiry Type
                </label>
                <p className="font-medium">{selectedSubmission.inquiryType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Email
                </label>
                <a
                  href={`mailto:${selectedSubmission.email}`}
                  className="text-primary hover:underline"
                >
                  {selectedSubmission.email}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Phone
                </label>
                <a
                  href={`tel:${selectedSubmission.phone}`}
                  className="text-primary hover:underline"
                >
                  {selectedSubmission.phone}
                </a>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Message
              </label>
              <div className="bg-muted/30 p-4 rounded-lg whitespace-pre-wrap">
                {selectedSubmission.message}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Add internal notes about this inquiry..."
              />
              <Button
                size="sm"
                onClick={handleSaveNotes}
                disabled={updating}
                className="mt-2"
              >
                {updating ? "Saving..." : "Save Notes"}
              </Button>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
              <div>
                <label className="block font-medium mb-1">Submitted</label>
                <p>
                  {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
              {selectedSubmission.readAt && (
                <div>
                  <label className="block font-medium mb-1">Read At</label>
                  <p>{new Date(selectedSubmission.readAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  window.open(`mailto:${selectedSubmission.email}`)
                }
              >
                <Mail className="w-4 h-4 mr-2" />
                Reply via Email
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(`tel:${selectedSubmission.phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedSubmission._id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

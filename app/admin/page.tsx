"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_REPORTED_LISTINGS = [
  {
    id: 1,
    title: "iPhone 13 Pro - Fake listing",
    reporter: "Priya Patel",
    reporterDept: "HR",
    reason: "Misleading",
    date: "2 hours ago",
    status: "pending"
  },
  {
    id: 2,
    title: "Prohibited item for sale",
    reporter: "Amit Kumar",
    reporterDept: "Sales",
    reason: "Prohibited Item",
    date: "5 hours ago",
    status: "pending"
  }
];

const MOCK_REPORTED_USERS = [
  {
    id: 1,
    name: "John Doe",
    department: "Marketing",
    reportedBy: "Vidhya",
    reason: "Harassment",
    date: "1 day ago",
    status: "under_review"
  }
];

const MOCK_FLAGGED_CHATS = [
  {
    id: 1,
    participants: ["Rahul Sharma", "Vikram Singh"],
    reason: "Inappropriate Content",
    reportedBy: "System AI",
    date: "3 hours ago",
    status: "pending"
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"listings" | "users" | "chats">("listings");
  const [reportedListings, setReportedListings] = useState(MOCK_REPORTED_LISTINGS);
  const [reportedUsers, setReportedUsers] = useState(MOCK_REPORTED_USERS);
  const [flaggedChats, setFlaggedChats] = useState(MOCK_FLAGGED_CHATS);
  const [showActionModal, setShowActionModal] = useState<{ type: string; id: number } | null>(null);

  const handleRemoveListing = (id: number) => {
    setReportedListings((prev) => prev.filter((item) => item.id !== id));
    setShowActionModal(null);
    alert("Listing removed successfully!");
  };

  const handleSuspendUser = (id: number) => {
    setReportedUsers((prev) => prev.map((user) => user.id === id ? { ...user, status: "suspended" as const } : user));
    setShowActionModal(null);
    alert("User suspended successfully!");
  };

  const handleDismissReport = (type: "listing" | "user" | "chat", id: number) => {
    if (type === "listing") {
      setReportedListings((prev) => prev.filter((item) => item.id !== id));
    } else if (type === "user") {
      setReportedUsers((prev) => prev.filter((user) => user.id !== id));
    } else {
      setFlaggedChats((prev) => prev.filter((chat) => chat.id !== id));
    }
    setShowActionModal(null);
    alert("Report dismissed!");
  };

  const stats = {
    totalReports: reportedListings.length + reportedUsers.length + flaggedChats.length,
    pendingReviews: reportedListings.filter(r => r.status === "pending").length + 
                    reportedUsers.filter(u => u.status === "under_review").length,
    resolvedToday: 8
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/profile" className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <p className="text-xs text-yellow-100">Content Moderation</p>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{stats.totalReports}</p>
              <p className="text-xs">Total Reports</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{stats.pendingReviews}</p>
              <p className="text-xs">Pending</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{stats.resolvedToday}</p>
              <p className="text-xs">Resolved Today</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-32 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("listings")}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === "listings"
                  ? "text-yellow-600"
                  : "text-gray-600 hover:text-yellow-600"
              }`}
            >
              Reported Listings
              {reportedListings.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center">
                  {reportedListings.length}
                </span>
              )}
              {activeTab === "listings" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === "users"
                  ? "text-yellow-600"
                  : "text-gray-600 hover:text-yellow-600"
              }`}
            >
              Reported Users
              {reportedUsers.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center">
                  {reportedUsers.length}
                </span>
              )}
              {activeTab === "users" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === "chats"
                  ? "text-yellow-600"
                  : "text-gray-600 hover:text-yellow-600"
              }`}
            >
              Flagged Chats
              {flaggedChats.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center">
                  {flaggedChats.length}
                </span>
              )}
              {activeTab === "chats" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Reported Listings */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {reportedListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">All Clear!</h3>
                <p className="text-gray-500">No reported listings to review</p>
              </div>
            ) : (
              reportedListings.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{report.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          {report.reason}
                        </span>
                        <span>•</span>
                        <span>{report.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Reported by: <span className="font-medium">{report.reporter}</span> ({report.reporterDept})
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert("Viewing full details...")}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setShowActionModal({ type: "remove-listing", id: report.id })}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Remove Listing
                    </button>
                    <button
                      onClick={() => handleDismissReport("listing", report.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reported Users */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {reportedUsers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">All Clear!</h3>
                <p className="text-gray-500">No reported users to review</p>
              </div>
            ) : (
              reportedUsers.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                          {report.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-600">{report.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                          {report.reason}
                        </span>
                        <span>•</span>
                        <span>{report.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Reported by: <span className="font-medium">{report.reportedBy}</span>
                      </p>
                    </div>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === "under_review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {report.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert("Viewing user history...")}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View History
                    </button>
                    <button
                      onClick={() => setShowActionModal({ type: "suspend-user", id: report.id })}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Suspend User
                    </button>
                    <button
                      onClick={() => handleDismissReport("user", report.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Flagged Chats */}
        {activeTab === "chats" && (
          <div className="space-y-4">
            {flaggedChats.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">All Clear!</h3>
                <p className="text-gray-500">No flagged chats to review</p>
              </div>
            ) : (
              flaggedChats.map((chat) => (
                <div key={chat.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        Chat between {chat.participants.join(" & ")}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {chat.reason}
                        </span>
                        <span>•</span>
                        <span>{chat.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Flagged by: <span className="font-medium">{chat.reportedBy}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert("Opening chat transcript...")}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Chat
                    </button>
                    <button
                      onClick={() => alert("Warning sent to users!")}
                      className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                    >
                      Send Warning
                    </button>
                    <button
                      onClick={() => handleDismissReport("chat", chat.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Action Confirmation Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Action</h3>
                <p className="text-sm text-gray-600">This action is irreversible</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              {showActionModal.type === "remove-listing"
                ? "Are you sure you want to remove this listing? The user will be notified."
                : "Are you sure you want to suspend this user? They will lose access to the platform."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowActionModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  showActionModal.type === "remove-listing"
                    ? handleRemoveListing(showActionModal.id)
                    : handleSuspendUser(showActionModal.id)
                }
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

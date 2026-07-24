"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/problems")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProblems(data);
        } else {
          console.error("Failed to load problems:", data);
          setProblems([]);
          alert("Failed to load problems: " + (data?.error || "Unknown error"));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Network error:", error);
        setProblems([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto text-black dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Problems</h1>
        <Link
          href="/admin/problems/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Problem
        </Link>
      </div>

      {loading ? (
        <p>Loading problems...</p>
      ) : (
        <div className="overflow-x-auto rounded border dark:border-gray-700">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-700">
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Slug</th>
                <th className="py-2 px-4 text-left">Difficulty</th>
                <th className="py-2 px-4 text-left">Published</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem: any) => (
                <tr key={problem._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="py-2 px-4 font-medium">{problem.title}</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{problem.slug}</td>
                  <td className="py-2 px-4">{problem.difficulty}</td>
                  <td className="py-2 px-4">
                    {problem.published ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">Yes</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold">No</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-right">
                    <Link
                      href={`/admin/problems/${problem._id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (confirm("Are you sure?")) {
                          await fetch(`/api/admin/problems/${problem._id}`, { method: "DELETE" });
                          setProblems(problems.filter((p: any) => p._id !== problem._id));
                        }
                      }}
                      className="text-red-600 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {problems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

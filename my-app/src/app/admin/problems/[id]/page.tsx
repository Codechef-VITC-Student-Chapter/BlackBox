"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function EditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";
  const router = useRouter();

  const [problem, setProblem] = useState({
    title: "",
    slug: "",
    description: "",
    difficulty: "Medium",
    cpu_time_limit: 2,
    wall_time_limit: 5,
    memory_limit: 262144,
    published: false,
    supported_languages: [{ language_id: 54, starter_code: "" }],
  });

  const [testcases, setTestcases] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/problems/${resolvedParams.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProblem(data.problem);
          setTestcases(data.testcases || []);
          setLoading(false);
        });
    }
  }, [isNew, resolvedParams.id]);

  const handleSave = async () => {
    try {
      if (isNew) {
        const res = await fetch(`/api/admin/problems`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(problem),
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to create problem");
        }
        
        if (data._id) {
          // Now save testcases
          const tcRes = await fetch(`/api/admin/problems/${data._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ problem: data, testcases }),
          });
          
          if (!tcRes.ok) {
            const tcData = await tcRes.json();
            throw new Error(tcData.error || "Failed to save testcases");
          }
          router.push("/admin/problems");
        }
      } else {
        const res = await fetch(`/api/admin/problems/${resolvedParams.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem, testcases }),
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to update problem");
        }
        router.push("/admin/problems");
      }
    } catch (err: any) {
      alert("Error saving problem: " + err.message);
    }
  };

  const addTestcase = () => {
    setTestcases([...testcases, { input: "", expected_output: "", hidden: false, weight: 1 }]);
  };

  if (loading) return <div className="p-8 dark:text-white text-black">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-black dark:text-white">
      <h1 className="text-3xl font-bold">{isNew ? "Create Problem" : "Edit Problem"}</h1>

      <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded border dark:border-gray-700">
        <h2 className="text-xl font-semibold">General</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
              value={problem.title}
              onChange={(e) => setProblem({ ...problem, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Slug</label>
            <input
              type="text"
              className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
              value={problem.slug}
              onChange={(e) => setProblem({ ...problem, slug: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded h-32"
            value={problem.description}
            onChange={(e) => setProblem({ ...problem, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Difficulty</label>
            <select
              className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
              value={problem.difficulty}
              onChange={(e) => setProblem({ ...problem, difficulty: e.target.value })}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4"
              checked={problem.published}
              onChange={(e) => setProblem({ ...problem, published: e.target.checked })}
            />
            <label className="text-sm font-medium">Published</label>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded border dark:border-gray-700">
        <h2 className="text-xl font-semibold">Limits</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">CPU Time (s)</label>
            <input
              type="number"
              className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
              value={problem.cpu_time_limit}
              onChange={(e) => setProblem({ ...problem, cpu_time_limit: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Wall Time (s)</label>
            <input
              type="number"
              className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
              value={problem.wall_time_limit}
              onChange={(e) => setProblem({ ...problem, wall_time_limit: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Memory (KB)</label>
            <input
              type="number"
              className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
              value={problem.memory_limit}
              onChange={(e) => setProblem({ ...problem, memory_limit: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded border dark:border-gray-700">
        <h2 className="text-xl font-semibold">Starter Code (C++)</h2>
        <div>
          <label className="block text-sm font-medium mb-2">Initial code provided to the user in the editor</label>
          <textarea
            className="w-full border dark:border-gray-600 dark:bg-gray-900 dark:text-white p-4 rounded h-48 font-mono text-sm"
            value={problem.supported_languages[0]?.starter_code || ""}
            onChange={(e) => {
              const newLangs = [...problem.supported_languages];
              if (newLangs.length === 0) newLangs.push({ language_id: 54, starter_code: "" });
              newLangs[0].starter_code = e.target.value;
              setProblem({ ...problem, supported_languages: newLangs });
            }}
            placeholder="// Write C++ starter code here"
          />
        </div>
      </div>

      <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded border dark:border-gray-700">
        <h2 className="text-xl font-semibold flex justify-between">
          <span>Testcases</span>
          <button onClick={addTestcase} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
            + Add Testcase
          </button>
        </h2>
        
        {testcases.map((tc, index) => (
          <div key={index} className="border dark:border-gray-600 p-4 rounded bg-white dark:bg-gray-900 relative">
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              onClick={() => {
                const newTc = [...testcases];
                newTc.splice(index, 1);
                setTestcases(newTc);
              }}
            >
              Remove
            </button>
            <h3 className="font-medium mb-2">Testcase #{index + 1}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium">Input (stdin)</label>
                <textarea
                  className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded h-24 font-mono text-sm"
                  value={tc.input}
                  onChange={(e) => {
                    const newTc = [...testcases];
                    newTc[index].input = e.target.value;
                    setTestcases(newTc);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Expected Output</label>
                <textarea
                  className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded h-24 font-mono text-sm"
                  value={tc.expected_output || tc.output || ""}
                  onChange={(e) => {
                    const newTc = [...testcases];
                    newTc[index].expected_output = e.target.value;
                    setTestcases(newTc);
                  }}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4"
                  checked={tc.hidden}
                  onChange={(e) => {
                    const newTc = [...testcases];
                    newTc[index].hidden = e.target.checked;
                    setTestcases(newTc);
                  }}
                />
                Hidden Testcase
              </label>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Weight:</label>
                <input
                  type="number"
                  className="border dark:border-gray-600 dark:bg-gray-800 dark:text-white p-1 rounded w-16"
                  value={tc.weight || 1}
                  onChange={(e) => {
                    const newTc = [...testcases];
                    newTc[index].weight = parseFloat(e.target.value);
                    setTestcases(newTc);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pb-12">
        <button onClick={() => router.push("/admin/problems")} className="px-6 py-2 border dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          Cancel
        </button>
        <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Save Problem
        </button>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import Editor from "@monaco-editor/react";

interface EditorSectionProps {
  language: string;
  code: string;
  setCode: (code: string) => void;
  changeLanguage: (lang: string) => void;
}

export default function EditorSection({ language, code, setCode, changeLanguage }: EditorSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden"
    >
      {/* Header */}

      <div className="border-b border-border bg-surface/40 p-4 flex justify-between items-center">

        <div className="flex items-center gap-3">

          <Code2
            size={18}
            className="text-secondary-text"
          />

          <span className="font-mono text-sm tracking-widest text-secondary-text">
            ENGINEER_EDITOR
          </span>

        </div>

        {/* Language */}

        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-black border border-border px-3 py-2 rounded font-mono text-sm outline-none"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="go">Go</option>
        </select>

      </div>

      {/* Monaco */}

      <Editor
        height="520px"
        language={language === "cpp" ? "cpp" : language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={{
          fontSize: 15,
          fontFamily: "JetBrains Mono",
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: {
            top: 20,
          },
        }}
      />
    </motion.div>
  );
}
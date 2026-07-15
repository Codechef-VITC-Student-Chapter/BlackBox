"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function EditorSection() {
  const [language, setLanguage] = useState("cpp");

  const starterCode = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}`,

    java: `public class Main {

    public static void main(String[] args) {

    }

}`,

    python: `def solve():
    pass

if __name__ == "__main__":
    solve()
`,

    go: `package main

import "fmt"

func main() {

}
`,
  };

  const [code, setCode] = useState(starterCode.cpp);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setCode(starterCode[lang as keyof typeof starterCode]);
  };

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
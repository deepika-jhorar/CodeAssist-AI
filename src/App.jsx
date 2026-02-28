// App.jsx
import React, { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";

const App = () => {
  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "typescript", label: "TypeScript" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "rust", label: "Rust" },
    { value: "dart", label: "Dart" },
    { value: "sql", label: "SQL" },
  ];

  const [selectedOption, setSelectedOption] = useState(languageOptions[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyDhb2vNf4Jj26w4Ke75QsvL8sulBDuqG-I",
  });

  const customStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "#18181b",
      borderColor: "#3f3f46",
      color: "#fff",
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "#27272a",
      color: "#fff",
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: "#fff",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? "#3f3f46" : "#27272a",
      color: "#fff",
      cursor: "pointer",
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: "#a1a1aa",
    }),
  };

  const handleLanguageChange = (option) => {
    setSelectedOption(option);
  };

  // ------------------------------------
  // ⭐ NEW FUNCTION ADDED — FIX CODE
  // ------------------------------------
  async function fixCode() {
    try {
      setLoading(true);
      setResponse("");

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are an expert senior developer.
Fix the following ${selectedOption.value} code.
Return ONLY the corrected code. No explanation.

Code:
${code}
`,
      });

      const fixed = res.text || "No fixed code received.";

      setResponse("```" + selectedOption.value + "\n" + fixed + "\n```");
    } catch (error) {
      console.error(error);
      setResponse("Something went wrong while fixing the code.");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------
  // EXISTING — REVIEW CODE FUNCTION
  // ------------------------------------
  async function reviewCode() {
    setResponse("");
    try {
      setLoading(true);
      setResponse("");

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert-level software developer...

Code:
${code}`,
      });

      setResponse(res.text || "No response text received.");
    } catch (error) {
      console.error(error);
      setResponse(
        "Something went wrong while reviewing the code. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div
        className="main flex justify-between"
        style={{ height: "calc(100vh - 90px)" }}
      >
        {/* LEFT SIDE */}
        <div className="left h-[88%] w-[50%] flex flex-col gap-4">
          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-4">
            <div className="w-1/2">
              <Select
                value={selectedOption}
                onChange={handleLanguageChange}
                options={languageOptions}
                styles={customStyles}
              />
            </div>

            {/* ⭐ FIX CODE BUTTON ADDED  */}
            <button
              onClick={() => {
                if (code.trim() === "") {
                  alert("Please enter code");
                } else {
                  fixCode();
                }
              }}
              className="btnNormal bg-zinc-900 min-w-[120px] px-4 py-2 rounded-md transition-all hover:bg-zinc-800"
            >
              Fix Code
            </button>

            <button
              onClick={() => {
                if (code.trim() === "") {
                  alert("Please enter code");
                } else {
                  reviewCode();
                }
              }}
              className="btnNormal bg-zinc-900 min-w-[120px] px-4 py-2 rounded-md transition-all hover:bg-zinc-800"
            >
              Review
            </button>
          </div>

          <div className="editor h-full w-full">
            <Editor
              height="500px"
              theme="vs-dark"
              language={selectedOption.value}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right !p-[10px] bg-zinc-900 w-[50%] h-[100%]">
          <div className="topTab border-t-[1px] border-b-[1px] border-[#27272a] flex items-center justify-between h-[60px]">
            <p className="font-700 text-[17px]">Response</p>
          </div>

          {loading && (
            <div className="w-full flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          )}

          {!loading && response && (
            <div className="mt-4 prose prose-invert max-w-none">
              <Markdown>{response}</Markdown>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;

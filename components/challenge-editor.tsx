"use client";

import * as monaco_editor from "monaco-editor";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Play,
  HelpCircle,
  Code,
  Terminal,
  Layout,
  CheckCircleIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/code-editor";
import OutputTerminal from "@/components/output-terminal";
import WebPreview from "@/components/web-preview";
import AIHelpModal from "@/components/ai-help-modal";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { configureMonacoLanguages } from "@/utils/monaco-languages";
import type { Monaco } from "@monaco-editor/react";
import { Challenge } from "@/TYPES";

interface ChallengeEditorProps {
  challenge: Challenge;
}

export default function ChallengeEditor({ challenge }: ChallengeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    Object.keys(challenge.defaultCode || {})[0] || "javascript"
  );

  const storageKey = `code-${challenge.slug}-${selectedLanguage}`;
  const [code, setCode] = useLocalStorage<string>(
    storageKey,
    challenge.defaultCode?.[selectedLanguage] || ""
  );

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [isAIHelpOpen, setIsAIHelpOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "output">(
    "split"
  );
  const { toast } = useToast();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  useEffect(() => {
    if (challenge.defaultCode?.[selectedLanguage]) {
      const savedCode = localStorage.getItem(
        `code-${challenge.slug}-${selectedLanguage}`
      );
      if (savedCode) {
        setCode(JSON.parse(savedCode));
      } else {
        setCode(challenge.defaultCode[selectedLanguage]);
      }
    }
  }, [selectedLanguage, challenge.defaultCode, challenge.slug, setCode]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...");

    try {
      // In a real app, this would call an API to execute the code
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOutput(`Output for ${challenge.title} in ${selectedLanguage}:

Execution completed successfully.`);
      toast({
        title: "Code executed successfully",
        description: "Your code has been run without errors.",
      });
    } catch (error) {
      setOutput("Error executing code. Please try again.");
      toast({
        title: "Execution failed",
        description: "There was an error running your code.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleAIHelp = () => {
    setIsAIHelpOpen(true);
  };

  const isWebLanguage =
    selectedLanguage === "html" ||
    selectedLanguage === "css" ||
    selectedLanguage === "javascript";

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure language services
    configureMonacoLanguages(monaco);
  };

  // Initialize Monaco with language services
  useEffect(() => {
    handleEditorDidMount(editorRef, monaco_editor);
  }, []);

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm w-full h-full p-0">
      <div className="px-4 py-2 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Tabs
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            className="w-full"
          >
            <TabsList>
              {Object.keys(challenge.defaultCode || {}).map((lang) => (
                <TabsTrigger key={lang} value={lang} className="capitalize">
                  {lang}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("editor")}
            className={cn(viewMode === "editor" ? "bg-muted" : "")}
            aria-label="Editor view"
          >
            <Code className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Editor</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("output")}
            className={cn(viewMode === "output" ? "bg-muted" : "")}
            aria-label="Output view"
          >
            {isWebLanguage ? (
              <Layout className="h-4 w-4 mr-1" />
            ) : (
              <Terminal className="h-4 w-4 mr-1" />
            )}
            <span className="hidden sm:inline">Output</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("split")}
            className={cn(viewMode === "split" ? "bg-muted" : "")}
            aria-label="Split view"
          >
            <span className="hidden sm:inline">Split</span>
            <span className="sm:hidden">⚌</span>
          </Button>
          <Button onClick={runCode} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col h-[500px]">
        <div
          className={`w-full ${cn(
            viewMode === "output"
              ? "hidden md:hidden"
              : viewMode === "split"
              ? "h-[70%]"
              : "h-full",
            "border-r"
          )}`}
        >
          <CodeEditor
            language={selectedLanguage}
            value={code}
            onChange={setCode}
            editorRef={editorRef}
            className="resize-x"
          />
        </div>

        <div
          className={`w-full border-t border-t-foreground ${cn(
            viewMode === "editor"
              ? "hidden md:hidden"
              : viewMode === "split"
              ? "h-[30%] resize-y"
              : "h-full"
          )}`}
        >
          {isWebLanguage ? (
            <WebPreview code={code} language={selectedLanguage} />
          ) : (
            <OutputTerminal output={output} />
          )}
        </div>
      </div>

      <div className="px-4 py-2 flex border-t border-t-foreground justify-between items-center">
        <Button variant="outline" onClick={handleAIHelp}>
          <HelpCircle className="h-4 w-4 mr-2" />
          Ask AI for Help
        </Button>

        <Button disabled={isRunning}>
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Submit
        </Button>
      </div>

      <AIHelpModal
        isOpen={isAIHelpOpen}
        onClose={() => setIsAIHelpOpen(false)}
        challenge={challenge}
        code={code}
        language={selectedLanguage}
      />
    </div>
  );
}

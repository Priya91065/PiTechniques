"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import { Box, Button, Divider, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import NotesIcon from "@mui/icons-material/Notes";

/**
 * Minimal dependency-free rich-text editor with a raw-HTML source toggle.
 * Visual mode covers the common formatting (headings, bold/italic, lists,
 * links); HTML mode preserves arbitrary markup exactly (tables, custom blocks)
 * so bespoke pages stay pixel-perfect.
 */
export default function RichHtmlEditor({ value, onChange }: { value: string; onChange: (html: string) => void }): JSX.Element {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync external value into the contentEditable when it changes and we're not editing it.
  useEffect(() => {
    const el = editorRef.current;
    if (mode === "visual" && el && document.activeElement !== el && el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value, mode]);

  // When switching back to visual, ensure the DOM reflects the current value.
  useEffect(() => {
    if (mode === "visual" && editorRef.current) editorRef.current.innerHTML = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function exec(command: string, arg?: string): void {
    document.execCommand(command, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function addLink(): void {
    const url = window.prompt("Link URL:", "https://");
    if (url) exec("createLink", url);
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}>
        {mode === "visual" && (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
            <Tooltip title="Bold">
              <Button size="small" variant="outlined" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")} sx={{ minWidth: 36 }}>
                <FormatBoldIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Italic">
              <Button size="small" variant="outlined" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")} sx={{ minWidth: 36 }}>
                <FormatItalicIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Heading (H2)">
              <Button size="small" variant="outlined" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "H2")} sx={{ minWidth: 36 }}>
                <TitleIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Paragraph">
              <Button size="small" variant="outlined" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "P")} sx={{ minWidth: 36 }}>
                <NotesIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Bullet list">
              <Button size="small" variant="outlined" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertUnorderedList")} sx={{ minWidth: 36 }}>
                <FormatListBulletedIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Numbered list">
              <Button size="small" variant="outlined" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertOrderedList")} sx={{ minWidth: 36 }}>
                <FormatListNumberedIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Insert link">
              <Button size="small" variant="outlined" onMouseDown={(e) => e.preventDefault()} onClick={addLink} sx={{ minWidth: 36 }}>
                <LinkIcon fontSize="small" />
              </Button>
            </Tooltip>
          </Stack>
        )}
        <Box sx={{ flex: 1 }} />
        <ToggleButtonGroup size="small" exclusive value={mode} onChange={(_, m) => m && setMode(m)}>
          <ToggleButton value="visual">Visual</ToggleButton>
          <ToggleButton value="html">HTML</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Divider sx={{ mb: 1 }} />

      {mode === "visual" ? (
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
          sx={{
            minHeight: 320,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            overflowY: "auto",
            "&:focus": { outline: "2px solid", outlineColor: "primary.main" },
            "& h2": { fontSize: 18, fontWeight: 700, mt: 2 },
            "& ul, & ol": { pl: 3 },
            "& table": { borderCollapse: "collapse", width: "100%" },
            "& td, & th": { border: "1px solid #ccc", padding: "4px 8px" },
          }}
        />
      ) : (
        <Box
          component="textarea"
          value={value}
          onChange={(e) => onChange((e.target as HTMLTextAreaElement).value)}
          spellCheck={false}
          sx={{
            width: "100%",
            minHeight: 320,
            fontFamily: "monospace",
            fontSize: 13,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            resize: "vertical",
          }}
        />
      )}
    </Box>
  );
}

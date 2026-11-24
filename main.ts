// famous-last-words-01: a phone's last words as its battery hits 1 percent.
// Gate: UTF-8 text, 1-199 characters, one line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Good news: I finally deleted all those apps you never used. Bad news: it cost me my last percent.";

function checkLine(text: string): void {
  if (text.length < 1 || text.length > 199) {
    throw new Error(`entry must be 1-199 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must have no leading or trailing whitespace");
  }
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code < 0x20 && ch !== "\t") {
      throw new Error("entry must not contain control characters");
    }
    if (code === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

checkLine(ENTRY);
writeFileSync(outPath, ENTRY, "utf8");

// Read the file back and make sure it matches byte-for-byte.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("entry.txt read-back mismatch");
}
checkLine(back);
console.log(`wrote ${outPath} (${ENTRY.length} chars)`);

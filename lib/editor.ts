/**
 * Convert plain text (with simple formatting) to HTML.
 * Admin doesn't need to write HTML tags — just type naturally.
 *
 * Supported:
 * - Empty lines      → new paragraph
 * - ## Heading        → <h2>
 * - ### Heading       → <h3>
 * - - list item       → <ul><li>
 * - 1. list item      → <ol><li>
 * - **bold**          → <strong>
 * - *italic*          → <em>
 * - Single line break → <br>
 */
export function textToHtml(text: string): string {
  if (!text) return "";

  // If it already contains HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(text)) return text;

  const lines = text.split("\n");
  const blocks: string[] = [];
  let currentBlock: string[] = [];
  let inList = false;
  let listType = "";

  function flushBlock() {
    if (currentBlock.length > 0) {
      blocks.push(`<p>${currentBlock.join("<br>")}</p>`);
      currentBlock = [];
    }
  }

  function flushList() {
    if (inList) {
      blocks.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line = paragraph break
    if (trimmed === "") {
      flushBlock();
      flushList();
      continue;
    }

    // H2
    if (trimmed.startsWith("## ")) {
      flushBlock();
      flushList();
      blocks.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`);
      continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      flushBlock();
      flushList();
      blocks.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`);
      continue;
    }

    // Unordered list
    if (/^[-•]\s/.test(trimmed)) {
      flushBlock();
      if (!inList || listType !== "ul") {
        flushList();
        blocks.push("<ul>");
        inList = true;
        listType = "ul";
      }
      blocks.push(`<li>${formatInline(trimmed.slice(2))}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+[.)]\s/.test(trimmed)) {
      flushBlock();
      if (!inList || listType !== "ol") {
        flushList();
        blocks.push("<ol>");
        inList = true;
        listType = "ol";
      }
      blocks.push(`<li>${formatInline(trimmed.replace(/^\d+[.)]\s/, ""))}</li>`);
      continue;
    }

    // Regular text line
    flushList();
    currentBlock.push(formatInline(trimmed));
  }

  flushBlock();
  flushList();

  return blocks.join("\n");
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

/**
 * Convert HTML back to plain text (for editing).
 */
export function htmlToText(html: string): string {
  if (!html) return "";

  // If it doesn't contain HTML tags, return as-is
  if (!/<[a-z][\s\S]*>/i.test(html)) return html;

  return html
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<\/li>\s*<li>/gi, "\n- ")
    .replace(/<ul[^>]*>\s*<li>/gi, "- ")
    .replace(/<\/li>\s*<\/ul>/gi, "\n")
    .replace(/<ol[^>]*>\s*<li>/gi, "1. ")
    .replace(/<\/li>\s*<\/ol>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n")
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export interface GlobalFlags {
  json: boolean;
  quiet: boolean;
}

export function outputJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function outputPage(
  page: { title: string; revid: number; timestamp?: string; content: string },
  opts?: { raw?: boolean; quiet?: boolean; offset?: number; limit?: number },
): void {
  if (opts?.raw) {
    process.stdout.write(page.content);
    return;
  }

  const lines = page.content.split('\n');
  const totalLines = lines.length;

  if (!opts?.quiet) {
    console.log(page.title);
    console.log(`rev ${page.revid} | ${page.timestamp || 'unknown'} | ${totalLines} lines`);
    console.log();
  }

  const start = opts?.offset ?? 0;
  const end = opts?.limit ? start + opts.limit : totalLines;
  const display = lines.slice(start, end);
  const padWidth = String(end).length;

  for (let i = 0; i < display.length; i++) {
    const lineNum = String(start + i + 1).padStart(padWidth);
    console.log(`  ${lineNum}  ${display[i]}`);
  }
}

export function outputTable(headers: string[], rows: string[][]): void {
  if (rows.length === 0) return;

  const widths = headers.map((h, col) =>
    Math.max(h.length, ...rows.map((r) => (r[col] || '').length)),
  );

  console.log(headers.map((h, i) => h.padEnd(widths[i])).join('  '));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  for (const row of rows) {
    console.log(row.map((cell, i) => (cell || '').padEnd(widths[i])).join('  '));
  }
}

export function outputResult(
  action: string,
  title: string,
  details: Record<string, string | number | undefined>,
): void {
  console.log(`${action} "${title}"`);
  for (const [key, value] of Object.entries(details)) {
    if (value !== undefined) {
      console.log(`  ${key}: ${value}`);
    }
  }
}

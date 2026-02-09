import { parseArgs } from 'node:util';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { UsageError, WaiError } from '../errors.js';
import { type GlobalFlags, outputJson } from '../output.js';

interface FileEntry {
  path: string;
  size: number;
  modified: string;
  type: string;
}

export async function snapshotCommand(args: string[], globals: GlobalFlags): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: {
      limit: { type: 'string', short: 'n' },
    },
    allowPositionals: true,
    strict: false,
  });

  const dir = positionals[0];
  if (!dir) throw new UsageError('Usage: wai snapshot <dir>');

  const files = walkDir(dir);
  const limit = values.limit ? parseInt(values.limit as string, 10) : undefined;
  const display = limit ? files.slice(0, limit) : files;

  const summary = {
    directory: dir,
    totalFiles: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    types: countByType(files),
    files: display,
  };

  if (globals.json) {
    outputJson(summary);
  } else {
    console.log(`Snapshot of ${dir}`);
    console.log(`  ${files.length} files, ${formatSize(summary.totalSize)}`);
    console.log();

    // Type breakdown
    const types = Object.entries(summary.types).sort((a, b) => b[1] - a[1]);
    console.log('Types:');
    for (const [ext, count] of types) {
      console.log(`  ${ext.padEnd(8)} ${count}`);
    }
    console.log();

    // File listing
    console.log('Files:');
    for (const f of display) {
      console.log(`  ${f.path}  ${formatSize(f.size)}  ${f.modified}`);
    }
    if (limit && files.length > limit) {
      console.log(`  ... and ${files.length - limit} more`);
    }
  }
}

function walkDir(dir: string, base?: string): FileEntry[] {
  const root = base || dir;
  const entries: FileEntry[] = [];

  let items: string[];
  try {
    items = readdirSync(dir);
  } catch (e: any) {
    throw new WaiError(`Cannot read directory: ${dir} (${e.message})`, 1);
  }

  for (const name of items) {
    if (name.startsWith('.')) continue;
    const full = join(dir, name);
    try {
      const stat = statSync(full);
      if (stat.isDirectory()) {
        entries.push(...walkDir(full, root));
      } else if (stat.isFile()) {
        entries.push({
          path: relative(root, full),
          size: stat.size,
          modified: stat.mtime.toISOString().slice(0, 10),
          type: extname(name).toLowerCase() || '(none)',
        });
      }
    } catch {
      // Skip unreadable files
    }
  }

  return entries;
}

function countByType(files: FileEntry[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of files) {
    counts[f.type] = (counts[f.type] || 0) + 1;
  }
  return counts;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`;
}

import { readFileSync } from 'node:fs';
import { UsageError } from './errors.js';

/**
 * Resolve content from -c flag, -f flag, or stdin.
 * Precedence: -c → -f → stdin (if not a TTY) → error
 */
export function resolveContent(options: { content?: string; file?: string }): string {
  if (options.content !== undefined) return options.content;
  if (options.file) return readFileSync(options.file, 'utf-8');
  if (!process.stdin.isTTY) {
    return readFileSync(0, 'utf-8');
  }
  throw new UsageError('No content provided. Use -c, -f, or pipe to stdin.');
}

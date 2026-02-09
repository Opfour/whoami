import { parseArgs } from 'node:util';
import { type WikiClient } from '../wiki-client.js';
import { UsageError } from '../errors.js';
import { type GlobalFlags, outputJson } from '../output.js';

export async function searchCommand(
  args: string[],
  globals: GlobalFlags,
  client: WikiClient,
): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: {
      limit: { type: 'string', short: 'n' },
    },
    allowPositionals: true,
    strict: false,
  });

  const query = positionals.join(' ');
  if (!query) throw new UsageError('Usage: wai search <query> [--limit N]');

  const limit = values.limit ? parseInt(values.limit as string, 10) : 10;
  const results = await client.searchPages(query, limit);

  if (globals.json) {
    outputJson(results);
  } else {
    console.log(`${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`);
    if (results.length === 0) return;
    console.log();

    const maxTitle = Math.max(...results.map((r) => r.title.length));
    for (const r of results) {
      const words = `${r.wordcount} words`.padStart(10);
      console.log(`  ${r.title.padEnd(maxTitle)}  ${words}  ${r.snippet}`);
    }
  }
}

import { parseArgs } from 'node:util';
import { type WikiClient } from '../wiki-client.js';
import { UsageError } from '../errors.js';
import { type GlobalFlags, outputJson } from '../output.js';

export async function linkCommand(
  args: string[],
  globals: GlobalFlags,
  client: WikiClient,
): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: {
      direction: { type: 'string' },
    },
    allowPositionals: true,
    strict: false,
  });

  const title = positionals[0];
  if (!title) throw new UsageError('Usage: wai link <title> [--direction in|out|both]');

  const dir = (values.direction as string) || 'both';
  if (dir !== 'in' && dir !== 'out' && dir !== 'both') {
    throw new UsageError('--direction must be "in", "out", or "both"');
  }

  const links = await client.getLinks(title, dir);

  if (globals.json) {
    outputJson(links);
  } else {
    if (dir === 'both' || dir === 'out') {
      console.log(`Outgoing links from "${title}" (${links.outgoing.length}):`);
      for (const l of links.outgoing) console.log(`  → ${l}`);
      if (dir === 'both') console.log();
    }
    if (dir === 'both' || dir === 'in') {
      console.log(`Incoming links to "${title}" (${links.incoming.length}):`);
      for (const l of links.incoming) console.log(`  ← ${l}`);
    }
  }
}

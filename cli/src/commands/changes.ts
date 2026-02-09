import { parseArgs } from 'node:util';
import { type WikiClient } from '../wiki-client.js';
import { type GlobalFlags, outputJson, outputTable } from '../output.js';

export async function changesCommand(
  args: string[],
  globals: GlobalFlags,
  client: WikiClient,
): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      limit: { type: 'string', short: 'n' },
    },
    allowPositionals: true,
    strict: false,
  });

  const limit = values.limit ? parseInt(values.limit as string, 10) : 10;
  const changes = await client.recentChanges(limit);

  if (globals.json) {
    outputJson(changes);
  } else {
    if (changes.length === 0) {
      console.log('No recent changes.');
      return;
    }
    outputTable(
      ['Timestamp', 'Title', 'User', 'Δ', 'Comment'],
      changes.map((c) => {
        const delta = c.newlen - c.oldlen;
        const deltaStr = delta >= 0 ? `+${delta}` : String(delta);
        return [c.timestamp, c.title, c.user, deltaStr, c.comment];
      }),
    );
  }
}

import { parseArgs } from 'node:util';
import { type WikiClient } from '../wiki-client.js';
import { UsageError } from '../errors.js';
import { type GlobalFlags, outputJson, outputResult } from '../output.js';

export async function editCommand(
  args: string[],
  globals: GlobalFlags,
  client: WikiClient,
): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: {
      old: { type: 'string' },
      new: { type: 'string' },
      'replace-all': { type: 'boolean', default: false },
      summary: { type: 'string', short: 'm' },
      'dry-run': { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });

  const title = positionals[0];
  const oldText = values.old as string | undefined;
  const newText = values.new as string | undefined;

  if (!title || !oldText || newText === undefined) {
    throw new UsageError('Usage: wai edit <title> --old <text> --new <text> [--replace-all] [--dry-run] [-m summary]');
  }

  if (values['dry-run']) {
    const page = await client.readPage(title);
    const content = page.content;
    const count = content.split(oldText).length - 1;
    if (count === 0) {
      console.log('No matches found.');
      return;
    }
    console.log(`Found ${count} occurrence${count > 1 ? 's' : ''} in "${title}"`);
    console.log();

    // Show context around each match
    const lines = content.split('\n');
    let pos = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(oldText)) {
        const replaced = lines[i].replaceAll(oldText, newText);
        console.log(`  L${i + 1}:`);
        console.log(`  - ${lines[i]}`);
        console.log(`  + ${replaced}`);
        console.log();
      }
      pos += lines[i].length + 1;
    }
    return;
  }

  const result = await client.editPage(title, oldText, newText, {
    replaceAll: values['replace-all'] as boolean,
    summary: values.summary as string | undefined,
  });

  if (globals.json) {
    outputJson(result);
  } else {
    outputResult('Edited', result.title, {
      rev: `${result.oldRevid} → ${result.newRevid}`,
      summary: values.summary as string | undefined,
    });
  }
}

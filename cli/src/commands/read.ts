import { parseArgs } from 'node:util';
import { type WikiClient } from '../wiki-client.js';
import { UsageError } from '../errors.js';
import { type GlobalFlags, outputJson, outputPage } from '../output.js';

export async function readCommand(
  args: string[],
  globals: GlobalFlags,
  client: WikiClient,
): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: {
      section: { type: 'string', short: 's' },
      offset: { type: 'string' },
      limit: { type: 'string', short: 'n' },
      raw: { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });

  const title = positionals[0];
  if (!title) throw new UsageError('Usage: wai read <title> [--section N] [--offset N] [--limit N] [--raw]');

  const section = values.section !== undefined ? parseInt(values.section as string, 10) : undefined;
  const offset = values.offset ? parseInt(values.offset as string, 10) : undefined;
  const limit = values.limit ? parseInt(values.limit as string, 10) : undefined;

  const page = await client.readPage(title, { section });

  if (globals.json) {
    outputJson({
      title: page.title,
      revid: page.revid,
      timestamp: page.timestamp,
      content: page.content,
      lines: page.content.split('\n').length,
    });
  } else {
    outputPage(page, {
      raw: values.raw as boolean,
      quiet: globals.quiet,
      offset,
      limit,
    });
  }
}

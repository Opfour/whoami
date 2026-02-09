import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { type WikiClient } from '../wiki-client.js';
import { UsageError, WaiError } from '../errors.js';
import { type GlobalFlags, outputJson, outputResult } from '../output.js';

export async function uploadCommand(
  args: string[],
  globals: GlobalFlags,
  client: WikiClient,
): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: {
      name: { type: 'string' },
      description: { type: 'string', short: 'd' },
      comment: { type: 'string', short: 'm' },
    },
    allowPositionals: true,
    strict: false,
  });

  const filePath = positionals[0];
  if (!filePath) throw new UsageError('Usage: wai upload <file> [--name <wiki-name>] [-d description] [-m comment]');
  if (!existsSync(filePath)) throw new WaiError(`File not found: ${filePath}`, 1);

  const result = await client.uploadFile(filePath, {
    filename: values.name as string | undefined,
    description: values.description as string | undefined,
    comment: values.comment as string | undefined,
  });

  if (globals.json) {
    outputJson(result);
  } else {
    outputResult('Uploaded', result.filename, {
      result: result.result,
    });
  }
}

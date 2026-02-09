import { type WikiClient } from '../wiki-client.js';
import { type GlobalFlags, outputJson } from '../output.js';

export async function categoryCommand(
  args: string[],
  globals: GlobalFlags,
  client: WikiClient,
): Promise<void> {
  const category = args[0];
  const items = await client.listCategories(category);

  if (globals.json) {
    outputJson(category ? { category, pages: items } : { categories: items });
  } else if (category) {
    console.log(`Pages in "${category}" (${items.length}):`);
    for (const p of items) console.log(`  ${p}`);
  } else {
    console.log(`Categories (${items.length}):`);
    for (const c of items) console.log(`  ${c}`);
  }
}

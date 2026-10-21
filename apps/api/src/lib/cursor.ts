/** Cursors are opaque to clients; internally they carry the offset into the sorted, filtered result. */
export function encodeCursor(offset: number): string {
  return Buffer.from(JSON.stringify({ o: offset })).toString('base64url');
}

export function decodeCursor(cursor: string): number | null {
  try {
    const { o } = JSON.parse(Buffer.from(cursor, 'base64url').toString()) as { o: unknown };
    return Number.isInteger(o) && (o as number) >= 0 ? (o as number) : null;
  } catch {
    return null;
  }
}

// Ask the browser to keep our IndexedDB data exempt from eviction.
// Best-effort: unsupported or denied just resolves false.
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

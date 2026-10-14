const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const strings = (value: Record<string, unknown>, keys: string[]) => keys.every((key) => value[key] == null || typeof value[key] === 'string');

// Model output and persisted draft metadata are data, never a trusted action contract.
export const isSpashtActionData = (value: unknown): boolean => {
  if (!record(value)) return false;
  for (const key of ['projectDraft', 'folderDraft', 'memoryDraft', 'projectUpdate', 'folderUpdate', 'memoryUpdate']) {
    const item = value[key];
    if (item == null) continue;
    if (!record(item)) return false;
    if (!strings(item, ['id', 'title', 'context', 'projectInstruction', 'audience', 'blocker', 'outcome', 'summary', 'folderId', 'name', 'content'])) return false;
    if (key.endsWith('Update') && (typeof item.id !== 'string' || !item.id)) return false;
    if (key === 'projectDraft' && (typeof item.title !== 'string' || typeof item.context !== 'string' || !['founder', 'builder'].includes(String(item.track)))) return false;
    if (key === 'folderDraft' && typeof item.name !== 'string') return false;
    if (key === 'memoryDraft' && (typeof item.title !== 'string' || typeof item.content !== 'string')) return false;
    if (item.track != null && !['founder', 'builder'].includes(String(item.track))) return false;
    if (item.memory_type != null && !['insight', 'preference', 'project_signal', 'boundary'].includes(String(item.memory_type))) return false;
    if (item.status != null && !['active', 'archived'].includes(String(item.status))) return false;
    if (item.sortOrder != null && (typeof item.sortOrder !== 'number' || !Number.isFinite(item.sortOrder))) return false;
  }
  for (const key of ['taskDrafts', 'taskUpdates']) {
    const tasks = value[key];
    if (tasks == null) continue;
    if (!Array.isArray(tasks) || tasks.length > 8) return false;
    if (!tasks.every((task) => record(task) && strings(task, ['id', 'title', 'detail']) &&
      (key === 'taskDrafts' ? typeof task.title === 'string' : typeof task.id === 'string') &&
      (task.status == null || ['open', 'done', 'archived'].includes(String(task.status))) &&
      (task.sortOrder == null || (typeof task.sortOrder === 'number' && Number.isFinite(task.sortOrder))))) return false;
  }
  return true;
};

import type { FileSystemItem } from './types';

export const cloneDeep = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  if (Array.isArray(obj)) {
    const clonedArr: any[] = [];
    for (let i = 0; i < obj.length; i++) {
      clonedArr[i] = cloneDeep(obj[i]);
    }
    return clonedArr as any;
  }
  const clonedObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = cloneDeep((obj as any)[key]);
    }
  }
  return clonedObj as T;
};

// The path here is the full path from root, e.g. ['This PC', 'Documents']
export const findNodeByPath = (fs: FileSystemItem, path: string[]): FileSystemItem | null => {
    if (path.length === 0) return null;
    if (path[0] !== fs.name) return null;

    let current: FileSystemItem | null = fs;
    for (let i = 1; i < path.length; i++) {
        const part = path[i];
        if (!current || current.type !== 'folder' || !current.children) return null;
        const next = current.children.find(c => c.name === part);
        if (next) {
            current = next;
        } else {
            return null;
        }
    }
    return current;
};

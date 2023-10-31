import { validateSync } from 'class-validator';

export function validateSyncOrFail(item: object): void {
  const errors = validateSync(item);
  if (errors.length > 0) {
    const reason = errors[0].toString().replace(/\s+/g, ' ');
    throw new Error(reason);
  }
}

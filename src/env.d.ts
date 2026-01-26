/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
interface Window {
  openConfirmDialog: (onConfirm: () => void | Promise<void>) => void;
}
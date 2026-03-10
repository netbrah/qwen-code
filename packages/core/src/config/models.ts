/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const DEFAULT_QWEN_MODEL = 'coder-model';
export const DEFAULT_QWEN_FLASH_MODEL = 'coder-model';
export const DEFAULT_QWEN_EMBEDDING_MODEL = 'text-embedding-v4';
export const MAINLINE_CODER_MODEL = 'qwen3.5-plus';

/**
 * Resolve the model to use, optionally downgrading preview models when
 * the caller does not have access to preview builds.
 *
 * @param model - The requested model name (may be a preview variant)
 * @param hasAccessToPreview - When false, preview models are downgraded to
 *   their stable equivalents to avoid 404/access errors.
 * @returns The resolved model name
 */
export function resolveModel(
  model: string,
  hasAccessToPreview: boolean = true,
): string {
  if (hasAccessToPreview) return model;

  const m = model.toLowerCase();
  if (!m.includes('preview')) return model;

  // Gemini preview flash → stable flash
  if (/gemini.*flash.*preview|gemini.*preview.*flash/.test(m)) {
    return model.replace(/[-_]?preview/gi, '').replace(/--+/g, '-');
  }

  // Gemini preview pro / 3.1 preview → stable pro
  if (/gemini.*pro.*preview|gemini.*preview.*pro|gemini-3\.1/.test(m)) {
    return model.replace(/[-_]?preview/gi, '').replace(/--+/g, '-');
  }

  // Generic: strip preview suffix and fall back to stable pro
  const stripped = model.replace(/[-_]?preview/gi, '').replace(/--+/g, '-');
  return stripped || DEFAULT_QWEN_MODEL;
}

/**
 * lib/cache.ts
 * Server-side in-memory cache for business idea validation results.
 * Attached to globalThis to survive Hot Module Replacement (HMR) during development.
 */

import { ValidationResult } from "./gemini";

const globalForCache = globalThis as unknown as {
  validationCache?: Map<string, ValidationResult>;
};

export const validationCache =
  globalForCache.validationCache ?? new Map<string, ValidationResult>();

if (process.env.NODE_ENV !== "production") {
  globalForCache.validationCache = validationCache;
}

/**
 * Normalizes a business idea and emirate to generate a consistent cache key.
 * Lowercases, strips punctuation/special characters, and collapses whitespace.
 */
export function generateCacheKey(idea: string, emirate: string): string {
  const normalizedEmirate = emirate.trim().toLowerCase();
  const normalizedIdea = idea
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/\s+/g, " ")    // Collapse multiple spaces/newlines into a single space
    .trim();

  return `${normalizedEmirate}:${normalizedIdea}`;
}

export function getCachedValidation(idea: string, emirate: string): ValidationResult | undefined {
  const key = generateCacheKey(idea, emirate);
  const cached = validationCache.get(key);
  if (cached) {
    console.log(`[Cache Hit] Serving cached result for key: ${key.substring(0, 50)}...`);
  }
  return cached;
}

export function setCachedValidation(idea: string, emirate: string, result: ValidationResult): void {
  const key = generateCacheKey(idea, emirate);
  console.log(`[Cache Miss/Store] Caching result for key: ${key.substring(0, 50)}...`);
  validationCache.set(key, result);
}

import { toCamelCase } from './aem.js';

/**
 * Fetches and caches placeholders for a given language prefix.
 * Placeholders are expected to be authored in /placeholders.json.
 * @param {string} prefix Language prefix, for example "en".
 * @returns {Promise<Record<string, string>>}
 */
export default async function fetchAllLangPlaceholders(prefix = 'en') {
  window.placeholders = window.placeholders || {};

  if (window.placeholders[prefix]) return window.placeholders[prefix];

  let json;

  try {
    const response = await fetch('/placeholders.json');

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch placeholders: ${response.status} ${response.statusText}`);
      window.placeholders[prefix] = {};
      return window.placeholders[prefix];
    }

    json = await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Could not load placeholders:', error);
    window.placeholders[prefix] = {};
    return window.placeholders[prefix];
  }

  if (!Array.isArray(json.data)) {
    // eslint-disable-next-line no-console
    console.error('Invalid placeholders format: missing data array');
    window.placeholders[prefix] = {};
    return window.placeholders[prefix];
  }

  const entries = json.data
    .filter((entry) => entry[prefix] !== undefined)
    .map((entry) => [toCamelCase(entry.Key), entry[prefix]]);

  if (entries.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`No placeholders found for prefix "${prefix}"`);
  }

  window.placeholders[prefix] = Object.fromEntries(entries);
  return window.placeholders[prefix];
}

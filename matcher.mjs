export const normalize = s => s.toLocaleLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]/gu,'');
// cursor points to the next unread word. Only a contiguous phrase near it can advance.
export function matchSpeech(tokens, spoken, cursor) {
 const phrase = spoken.split(/\s+/).map(normalize).filter(Boolean);
 if (!phrase.length || cursor >= tokens.length) return null;
 let best = null;
 for (let end = cursor; end < Math.min(tokens.length, cursor + 12); end++) {
  let matched = 0;
  while (matched < Math.min(phrase.length, 24, end + 1) &&
         tokens[end - matched] === phrase[phrase.length - 1 - matched]) matched++;
  const start = end - matched + 1;
  // An isolated word must be the expected word and the entire recognition phrase.
  if (matched === 1 && (end !== cursor || phrase.length !== 1)) continue;
  if (matched < 1 || (end > cursor && matched < 2)) continue;
  // Require evidence covering the current word, rather than a distant repeated phrase.
  if (start > cursor) continue;
  // Reject an unrelated lead-in followed by an accidental matching suffix.
  if (matched < Math.min(phrase.length, end + 1, 24)) continue;
  if (!best || matched > best.matched) best = { index: end, matched };
 }
 return best?.index ?? null;
}

export const normalize = s => s.toLocaleLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]/gu,'');
export function matchSpeech(tokens, spoken, cursor) {
 const phrase=spoken.split(/\s+/).map(normalize).filter(Boolean); if(!phrase.length)return null;
 let best=null;const low=Math.max(0,cursor-8),high=Math.min(tokens.length,cursor+75);
 for(let end=low;end<high;end++){
  let hits=0,total=Math.min(phrase.length,12,end+1);
  for(let k=0;k<total;k++) if(tokens[end-k]===phrase[phrase.length-1-k])hits++;
  const score=hits/total;
  if(tokens[end]!==phrase.at(-1)||score<.65||(total>1&&hits<2))continue;
  const rank=hits*3-score*Math.abs(end-cursor)*.025;
  if(!best||rank>best.rank)best={index:end,rank};
 }
 return best?.index??null;
}

// @ts-ignore
const terminalFromGlobals = globalThis['terminal'];
// @ts-ignore
const rofiFromGlobals = globalThis['rofi'];

export const terminal = terminalFromGlobals || 'kitty';
export const rofi =
  typeof rofiFromGlobals === 'string' ? [rofiFromGlobals] : rofiFromGlobals || ['rofi'];

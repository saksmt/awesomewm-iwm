export const intersect = <T>(a: T[], b: T[]) => a.filter((it) => b.includes(it));
export const union = <T>(a: T[], b: T[]) => [...a, ...b];
export const diff = <T>(a: T[], b: T[]) => a.filter((it) => !b.includes(it));
export const isSubset = <T>(a: T[], b: T[]) => intersect(a, b).length == b.length;

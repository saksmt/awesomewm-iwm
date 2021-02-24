export const forall = <T>(a: T[], p: (t: T) => boolean) => a.reduce((acc, t) => acc && p(t), true);
export const exists = <T>(a: T[], p: (t: T) => boolean) => a.reduce((acc, t) => acc || p(t), false);

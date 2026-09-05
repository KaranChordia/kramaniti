export type KoshContextKind = 'personal' | 'professional';

export type KoshAdaptationContext = {
  personal: string;
  professional: string;
};

const emptyContext = (): KoshAdaptationContext => ({
  personal: '',
  professional: '',
});

export const parseKoshContext = (value: string | null | undefined): KoshAdaptationContext => {
  if (!value?.trim()) return emptyContext();

  try {
    const parsed = JSON.parse(value) as Partial<Record<KoshContextKind, unknown>>;
    return {
      personal: typeof parsed.personal === 'string' ? parsed.personal : '',
      professional: typeof parsed.professional === 'string' ? parsed.professional : '',
    };
  } catch {
    // Context saved before the two-profile format remains useful as professional context.
    return { personal: '', professional: value };
  }
};

export const serializeKoshContext = (context: KoshAdaptationContext) => JSON.stringify({
  personal: context.personal.trim(),
  professional: context.professional.trim(),
});

export interface ReadmeRuleModule {
    readonly meta?:
        | {
              readonly docs?:
                  | {
                        readonly typefestConfigs?:
                            | readonly string[]
                            | string
                            | undefined;
                        readonly url?: string | undefined;
                    }
                  | undefined;
              readonly fixable?: string | undefined;
              readonly hasSuggestions?: boolean | undefined;
          }
        | undefined;
}

export interface ReadmePlugin {
    readonly meta?:
        | {
              readonly namespace?: string | undefined;
          }
        | undefined;
    readonly rules: Readonly<Record<string, ReadmeRuleModule>>;
    readonly configs?:
        | Readonly<
              Record<
                  string,
                  {
                      readonly rules?:
                          | Readonly<Record<string, unknown>>
                          | undefined;
                  }
              >
          >
        | undefined;
}

export type PresetName = "all" | "recommended";

export type PresetRuleNamesByPreset = Readonly<Record<PresetName, Set<string>>>;

export function derivePresetRuleNamesByPresetFromPlugin(
    plugin: ReadmePlugin
): PresetRuleNamesByPreset;

export function generateReadmeRulesSectionFromRules(
    rules: Readonly<Record<string, ReadmeRuleModule>>,
    presetRuleNamesByPreset: PresetRuleNamesByPreset
): string;

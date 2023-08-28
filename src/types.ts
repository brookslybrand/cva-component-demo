import type { VariantProps } from "class-variance-authority";
import type { Simplify } from "type-fest";

export type RequiredVariantProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any) => any,
  // By default, all variants will be required
  Keys extends keyof VariantProps<T> = keyof VariantProps<T>
> = Simplify<
  // Create an intersection of all variants with those being marked as required
  VariantProps<T> & {
    // For each variant being marked as required, remove null and undefined
    [Variant in Keys]: Exclude<VariantProps<T>[Variant], null | undefined>;
  }
>;

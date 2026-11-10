import z from "zod";

const TrackerBaseZod = z.object({
  id: z.string(),
  color: z.number(),
  name: z.string().optional(),
  showOnMap: z.boolean().optional(),
  inlineMath: z.boolean().optional(),
  // Bubble-only presentation options. Missing values preserve the original look.
  bubbleSize: z.number().min(8).max(64).optional(),
  bubbleOffsetX: z.number().min(-200).max(200).optional(),
  bubbleOffsetY: z.number().min(-200).max(200).optional(),
  bubbleTextColor: z.string().optional(),
  bubbleFontFamily: z.string().optional(),
  bubbleFontSize: z.number().min(6).max(48).optional(),
  bubbleFontWeight: z.number().min(300).max(700).optional(),
  bubbleOutlineColor: z.string().optional(),
  bubbleOutlineWidth: z.number().min(0).max(6).optional(),
  bubbleTextOutlineColor: z.string().optional(),
  bubbleTextOutlineWidth: z.number().min(0).max(4).optional(),
  barWidthPercent: z.number().min(30).max(150).optional(),
  barHeight: z.number().min(8).max(48).optional(),
  barOffsetX: z.number().min(-200).max(200).optional(),
  barOffsetY: z.number().min(-200).max(200).optional(),
  barFontFamily: z.string().optional(),
  barFontSize: z.number().min(6).max(48).optional(),
  barFontWeight: z.number().min(300).max(700).optional(),
  barTextColor: z.string().optional(),
  barOutlineColor: z.string().optional(),
  barOutlineWidth: z.number().min(0).max(6).optional(),
  barTextOutlineColor: z.string().optional(),
  barTextOutlineWidth: z.number().min(0).max(4).optional(),
});
const ValueTrackerZod = z.object({
  variant: z.literal("value"),
  value: z.number(),
  ...TrackerBaseZod.shape,
});
const BarTrackerZod = z.object({
  variant: z.literal("value-max"),
  value: z.number(),
  max: z.number(),
  ...TrackerBaseZod.shape,
});
const CheckboxTrackerZod = z.object({
  variant: z.literal("checkbox"),
  checked: z.boolean(),
  ...TrackerBaseZod.shape,
});
const CounterTrackerZod = z.object({
  variant: z.literal("counter"),
  value: z.number(),
  ...TrackerBaseZod.shape,
});
export const TrackerZod = z.union([
  ValueTrackerZod,
  BarTrackerZod,
  CheckboxTrackerZod,
  CounterTrackerZod,
]);

export type Tracker = z.infer<typeof TrackerZod>;

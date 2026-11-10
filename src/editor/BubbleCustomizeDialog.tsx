import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Tracker } from "../TrackerZod";
import { getColor } from "../colorHelpers";

const FONT_OPTIONS = [
  "Roboto, sans-serif",
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Trebuchet MS, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Courier New, monospace",
  "Impact, sans-serif",
];

export default function BubbleCustomizeDialog({
  open,
  tracker,
  onChange,
  onClose,
}: {
  open: boolean;
  tracker: Tracker;
  onChange: (
    field: BubbleStyleField,
    content: string | number,
  ) => void;
  onClose: () => void;
}) {
  const diameter = tracker.bubbleSize ?? 30;
  const fontSize = tracker.bubbleFontSize ?? Math.max(10, diameter - 8);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Customize stat bubble</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.25} sx={{ pt: 0.5 }}>
          <Typography variant="subtitle2">Position and size</Typography>
          <RangeControl
            label="Bubble size"
            value={diameter}
            min={10}
            max={64}
            suffix=" px"
            onChange={(value) => onChange("bubbleSize", value)}
          />
          <RangeControl
            label="Horizontal position"
            value={tracker.bubbleOffsetX ?? 0}
            min={-150}
            max={150}
            suffix=" px"
            onChange={(value) => onChange("bubbleOffsetX", value)}
          />
          <RangeControl
            label="Vertical position"
            value={tracker.bubbleOffsetY ?? 0}
            min={-150}
            max={150}
            suffix=" px"
            onChange={(value) => onChange("bubbleOffsetY", value)}
          />

          <Typography variant="subtitle2">Text</Typography>
          <ColorControl
            label="Bubble fill color"
            value={tracker.customColor ?? getColor(tracker.color)}
            onChange={(value) => onChange("customColor", value)}
          />
          <TextField
            select
            size="small"
            label="Font"
            value={tracker.bubbleFontFamily ?? FONT_OPTIONS[0]}
            onChange={(event) =>
              onChange("bubbleFontFamily", event.target.value)
            }
          >
            {FONT_OPTIONS.map((font) => (
              <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                {font.split(",")[0]}
              </MenuItem>
            ))}
          </TextField>
          <RangeControl
            label="Text size"
            value={fontSize}
            min={10}
            max={48}
            suffix=" px"
            onChange={(value) => onChange("bubbleFontSize", value)}
          />
          <RangeControl
            label="Text weight"
            value={tracker.bubbleFontWeight ?? 400}
            min={300}
            max={700}
            step={100}
            onChange={(value) => onChange("bubbleFontWeight", value)}
          />
          <RangeControl
            label="Text horizontal position"
            value={tracker.bubbleTextOffsetX ?? 0}
            min={-100}
            max={100}
            suffix=" px"
            onChange={(value) => onChange("bubbleTextOffsetX", value)}
          />
          <RangeControl
            label="Text vertical position"
            value={tracker.bubbleTextOffsetY ?? 0}
            min={-100}
            max={100}
            suffix=" px"
            onChange={(value) => onChange("bubbleTextOffsetY", value)}
          />
          <ColorControl
            label="Text color"
            value={tracker.bubbleTextColor ?? "#ffffff"}
            onChange={(value) => onChange("bubbleTextColor", value)}
          />

          <Typography variant="subtitle2">Outlines</Typography>
          <ColorControl
            label="Bubble outline color"
            value={tracker.bubbleOutlineColor ?? "#ffffff"}
            onChange={(value) => onChange("bubbleOutlineColor", value)}
          />
          <RangeControl
            label="Bubble outline width"
            value={tracker.bubbleOutlineWidth ?? 0}
            min={0}
            max={6}
            suffix=" px"
            onChange={(value) => onChange("bubbleOutlineWidth", value)}
          />
          <ColorControl
            label="Text outline color"
            value={tracker.bubbleTextOutlineColor ?? "#000000"}
            onChange={(value) => onChange("bubbleTextOutlineColor", value)}
          />
          <RangeControl
            label="Text outline width"
            value={tracker.bubbleTextOutlineWidth ?? 0}
            min={0}
            max={4}
            step={0.5}
            suffix=" px"
            onChange={(value) => onChange("bubbleTextOutlineWidth", value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

type BubbleStyleField =
  | "customColor"
  | "bubbleSize"
  | "bubbleOffsetX"
  | "bubbleOffsetY"
  | "bubbleFontFamily"
  | "bubbleFontSize"
  | "bubbleFontWeight"
  | "bubbleTextColor"
  | "bubbleTextOffsetX"
  | "bubbleTextOffsetY"
  | "bubbleOutlineColor"
  | "bubbleOutlineWidth"
  | "bubbleTextOutlineColor"
  | "bubbleTextOutlineWidth";

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Typography variant="body2">{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {value}
          {suffix}
        </Typography>
      </div>
      <Slider
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        size="small"
        valueLabelDisplay="auto"
        onChange={(_, nextValue) =>
          onChange(Array.isArray(nextValue) ? nextValue[0] : nextValue)
        }
      />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <TextField
      type="color"
      size="small"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ htmlInput: { "aria-label": label } }}
      sx={{ "& input": { height: 24, p: 0.5, cursor: "pointer" } }}
    />
  );
}

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

type BarStyleField =
  | "customColor"
  | "barWidthPercent"
  | "barHeight"
  | "barCornerRadius"
  | "barOffsetX"
  | "barOffsetY"
  | "barFontFamily"
  | "barFontSize"
  | "barFontWeight"
  | "barTextColor"
  | "barTextOffsetX"
  | "barTextOffsetY"
  | "barOutlineColor"
  | "barOutlineWidth"
  | "barTextOutlineColor"
  | "barTextOutlineWidth";

export default function BarCustomizeDialog({
  open,
  tracker,
  onChange,
  onClose,
}: {
  open: boolean;
  tracker: Tracker;
  onChange: (field: BarStyleField, content: string | number) => void;
  onClose: () => void;
}) {
  const barHeight = tracker.barHeight ?? 20;
  const cornerRadius = Math.min(
    tracker.barCornerRadius ?? Math.min(10, barHeight / 2),
    barHeight / 2,
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Customize stat bar</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.25} sx={{ pt: 0.5 }}>
          <Typography variant="subtitle2">Position and size</Typography>
          <RangeControl
            label="Bar width"
            value={tracker.barWidthPercent ?? 100}
            min={5}
            max={150}
            suffix="%"
            onChange={(value) => onChange("barWidthPercent", value)}
          />
          <RangeControl
            label="Bar height"
            value={barHeight}
            min={1}
            max={48}
            suffix=" px"
            onChange={(value) => onChange("barHeight", value)}
          />
          <RangeControl
            label="Corner roundness"
            value={cornerRadius}
            min={0}
            max={Math.min(24, barHeight / 2)}
            suffix=" px"
            onChange={(value) => onChange("barCornerRadius", value)}
          />
          <RangeControl
            label="Horizontal position"
            value={tracker.barOffsetX ?? 0}
            min={-150}
            max={150}
            suffix=" px"
            onChange={(value) => onChange("barOffsetX", value)}
          />
          <RangeControl
            label="Vertical position"
            value={tracker.barOffsetY ?? 0}
            min={-150}
            max={150}
            suffix=" px"
            onChange={(value) => onChange("barOffsetY", value)}
          />

          <Typography variant="subtitle2">Text</Typography>
          <ColorControl
            label="Bar fill color"
            value={tracker.customColor ?? getColor(tracker.color)}
            onChange={(value) => onChange("customColor", value)}
          />
          <TextField
            select
            size="small"
            label="Font"
            value={tracker.barFontFamily ?? FONT_OPTIONS[0]}
            onChange={(event) => onChange("barFontFamily", event.target.value)}
          >
            {FONT_OPTIONS.map((font) => (
              <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                {font.split(",")[0]}
              </MenuItem>
            ))}
          </TextField>
          <RangeControl
            label="Text size"
            value={tracker.barFontSize ?? barHeight + 2}
            min={1}
            max={48}
            suffix=" px"
            onChange={(value) => onChange("barFontSize", value)}
          />
          <RangeControl
            label="Text weight"
            value={tracker.barFontWeight ?? 400}
            min={300}
            max={700}
            step={100}
            onChange={(value) => onChange("barFontWeight", value)}
          />
          <RangeControl
            label="Text horizontal position"
            value={tracker.barTextOffsetX ?? 0}
            min={-100}
            max={100}
            suffix=" px"
            onChange={(value) => onChange("barTextOffsetX", value)}
          />
          <RangeControl
            label="Text vertical position"
            value={tracker.barTextOffsetY ?? 0}
            min={-100}
            max={100}
            suffix=" px"
            onChange={(value) => onChange("barTextOffsetY", value)}
          />
          <ColorControl
            label="Text color"
            value={tracker.barTextColor ?? "#ffffff"}
            onChange={(value) => onChange("barTextColor", value)}
          />

          <Typography variant="subtitle2">Outlines</Typography>
          <ColorControl
            label="Bar outline color"
            value={tracker.barOutlineColor ?? "#ffffff"}
            onChange={(value) => onChange("barOutlineColor", value)}
          />
          <RangeControl
            label="Bar outline width"
            value={tracker.barOutlineWidth ?? 0}
            min={0}
            max={6}
            suffix=" px"
            onChange={(value) => onChange("barOutlineWidth", value)}
          />
          <ColorControl
            label="Text outline color"
            value={tracker.barTextOutlineColor ?? "#000000"}
            onChange={(value) => onChange("barTextOutlineColor", value)}
          />
          <RangeControl
            label="Text outline width"
            value={tracker.barTextOutlineWidth ?? 0}
            min={0}
            max={4}
            step={0.5}
            suffix=" px"
            onChange={(value) => onChange("barTextOutlineWidth", value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

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

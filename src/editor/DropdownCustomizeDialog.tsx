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

type DropdownStyleField =
  | "customColor"
  | "dropdownLabelWidth"
  | "dropdownLabelHeight"
  | "dropdownCornerRadius"
  | "dropdownOffsetX"
  | "dropdownOffsetY"
  | "dropdownTextOffsetX"
  | "dropdownTextOffsetY"
  | "dropdownFontFamily"
  | "dropdownFontSize"
  | "dropdownFontWeight"
  | "dropdownTextColor"
  | "dropdownOutlineColor"
  | "dropdownOutlineWidth"
  | "dropdownTextOutlineColor"
  | "dropdownTextOutlineWidth";

export default function DropdownCustomizeDialog({
  open,
  tracker,
  onChange,
  onClose,
}: {
  open: boolean;
  tracker: Tracker;
  onChange: (field: DropdownStyleField, content: string | number) => void;
  onClose: () => void;
}) {
  if (tracker.variant !== "dropdown") return null;
  const labelWidth =
    tracker.dropdownLabelWidth ??
    Math.min(
      400,
      Math.max(
        72,
        Math.ceil(tracker.value.length * (tracker.dropdownFontSize ?? 16) * 0.62 + 20),
      ),
    );
  const labelHeight = tracker.dropdownLabelHeight ?? 26;
  const cornerRadius = Math.min(
    tracker.dropdownCornerRadius ?? labelHeight / 2,
    labelHeight / 2,
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Customize dropdown label</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.25} sx={{ pt: 0.5 }}>
          <Typography variant="subtitle2">Position and size</Typography>
          <RangeControl
            label="Label width"
            value={labelWidth}
            min={10}
            max={400}
            suffix=" px"
            onChange={(value) => onChange("dropdownLabelWidth", value)}
          />
          <RangeControl
            label="Label height"
            value={labelHeight}
            min={10}
            max={64}
            suffix=" px"
            onChange={(value) => onChange("dropdownLabelHeight", value)}
          />
          <RangeControl
            label="Corner roundness"
            value={cornerRadius}
            min={0}
            max={Math.min(32, labelHeight / 2)}
            suffix=" px"
            onChange={(value) => onChange("dropdownCornerRadius", value)}
          />
          <RangeControl
            label="Horizontal position"
            value={tracker.dropdownOffsetX ?? 0}
            min={-150}
            max={150}
            suffix=" px"
            onChange={(value) => onChange("dropdownOffsetX", value)}
          />
          <RangeControl
            label="Vertical position"
            value={tracker.dropdownOffsetY ?? 0}
            min={-150}
            max={150}
            suffix=" px"
            onChange={(value) => onChange("dropdownOffsetY", value)}
          />

          <Typography variant="subtitle2">Text and colors</Typography>
          <ColorControl
            label="Label fill color"
            value={tracker.customColor ?? getColor(tracker.color)}
            onChange={(value) => onChange("customColor", value)}
          />
          <TextField
            select
            size="small"
            label="Font"
            value={tracker.dropdownFontFamily ?? FONT_OPTIONS[0]}
            onChange={(event) => onChange("dropdownFontFamily", event.target.value)}
          >
            {FONT_OPTIONS.map((font) => (
              <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                {font.split(",")[0]}
              </MenuItem>
            ))}
          </TextField>
          <RangeControl
            label="Text size"
            value={tracker.dropdownFontSize ?? 16}
            min={10}
            max={48}
            suffix=" px"
            onChange={(value) => onChange("dropdownFontSize", value)}
          />
          <RangeControl
            label="Text weight"
            value={tracker.dropdownFontWeight ?? 400}
            min={300}
            max={700}
            step={100}
            onChange={(value) => onChange("dropdownFontWeight", value)}
          />
          <RangeControl
            label="Text horizontal position"
            value={tracker.dropdownTextOffsetX ?? 0}
            min={-100}
            max={100}
            suffix=" px"
            onChange={(value) => onChange("dropdownTextOffsetX", value)}
          />
          <RangeControl
            label="Text vertical position"
            value={tracker.dropdownTextOffsetY ?? 0}
            min={-100}
            max={100}
            suffix=" px"
            onChange={(value) => onChange("dropdownTextOffsetY", value)}
          />
          <ColorControl
            label="Text color"
            value={tracker.dropdownTextColor ?? "#ffffff"}
            onChange={(value) => onChange("dropdownTextColor", value)}
          />
          <ColorControl
            label="Label outline color"
            value={tracker.dropdownOutlineColor ?? "#ffffff"}
            onChange={(value) => onChange("dropdownOutlineColor", value)}
          />
          <RangeControl
            label="Label outline width"
            value={tracker.dropdownOutlineWidth ?? 0}
            min={0}
            max={6}
            suffix=" px"
            onChange={(value) => onChange("dropdownOutlineWidth", value)}
          />
          <ColorControl
            label="Text outline color"
            value={tracker.dropdownTextOutlineColor ?? "#000000"}
            onChange={(value) => onChange("dropdownTextOutlineColor", value)}
          />
          <RangeControl
            label="Text outline width"
            value={tracker.dropdownTextOutlineWidth ?? 0}
            min={0}
            max={4}
            step={0.5}
            suffix=" px"
            onChange={(value) => onChange("dropdownTextOutlineWidth", value)}
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

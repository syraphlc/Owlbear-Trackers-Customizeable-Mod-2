import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Tracker } from "../TrackerZod";

export default function DropdownOptionsDialog({
  open,
  tracker,
  onApply,
  onClose,
}: {
  open: boolean;
  tracker: Tracker;
  onApply: (options: string[]) => void;
  onClose: () => void;
}) {
  const [optionsText, setOptionsText] = useState("");
  const currentOptions = tracker.variant === "dropdown" ? tracker.options : [];
  useEffect(() => {
    if (open) setOptionsText(currentOptions.join("\n"));
  }, [open, tracker.id]);
  const parsedOptions = optionsText
    .split("\n")
    .map((option) => option.trim())
    .filter(Boolean)
    .filter((option, index, allOptions) => allOptions.indexOf(option) === index);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOptionsText("");
        onClose();
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Set dropdown choices</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          minRows={5}
          maxRows={12}
          fullWidth
          label="One choice per line"
          value={optionsText}
          onChange={(event) => setOptionsText(event.target.value)}
          helperText="Players choose one of these options from the tracker card."
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOptionsText("");
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={parsedOptions.length === 0}
          onClick={() => {
            onApply(parsedOptions);
            setOptionsText("");
            onClose();
          }}
        >
          Save choices
        </Button>
      </DialogActions>
    </Dialog>
  );
}

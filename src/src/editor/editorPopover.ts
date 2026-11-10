import OBR, { Popover } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";

const EDITOR_ID = getPluginId("editor");
const EDITOR_URL = "/src/editor/editor.html";
const EDITOR_WIDTH = 430;
const EDITOR_HEIGHT = 550;
const POSITION_KEY = "owl-trackers-editor-popover-position";

type Position = { left: number; top: number };

export async function openEditorPopover() {
  const viewport = await getViewportSize();
  const storedPosition = readPosition();
  const position = clampPosition(
    storedPosition ?? {
      left: viewport.width / 2,
      top: viewport.height / 2,
    },
    viewport,
    { width: EDITOR_WIDTH, height: EDITOR_HEIGHT },
  );
  writePosition(position);
  await OBR.popover.open(createPopover(position));
}

export async function moveEditorPopoverBy(deltaX: number, deltaY: number) {
  const [viewport, width, height] = await Promise.all([
    getViewportSize(),
    OBR.popover.getWidth(EDITOR_ID),
    OBR.popover.getHeight(EDITOR_ID),
  ]);
  const currentPosition = readPosition() ?? {
    left: viewport.width / 2,
    top: viewport.height / 2,
  };
  const position = clampPosition(
    {
      left: currentPosition.left + deltaX,
      top: currentPosition.top + deltaY,
    },
    viewport,
    {
      width: width ?? EDITOR_WIDTH,
      height: height ?? EDITOR_HEIGHT,
    },
  );
  writePosition(position);
  await OBR.popover.open(createPopover(position));
}

function createPopover(position: Position): Popover {
  return {
    id: EDITOR_ID,
    url: EDITOR_URL,
    width: EDITOR_WIDTH,
    height: EDITOR_HEIGHT,
    anchorReference: "POSITION",
    anchorPosition: position,
    anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
    transformOrigin: { horizontal: "CENTER", vertical: "CENTER" },
  };
}

async function getViewportSize() {
  const [width, height] = await Promise.all([
    OBR.viewport.getWidth(),
    OBR.viewport.getHeight(),
  ]);
  return { width, height };
}

function clampPosition(
  position: Position,
  viewport: { width: number; height: number },
  popover: { width: number; height: number },
): Position {
  const halfWidth = Math.min(popover.width / 2, viewport.width / 2);
  const halfHeight = Math.min(popover.height / 2, viewport.height / 2);
  return {
    left: Math.min(Math.max(halfWidth, position.left), viewport.width - halfWidth),
    top: Math.min(Math.max(halfHeight, position.top), viewport.height - halfHeight),
  };
}

function readPosition(): Position | undefined {
  try {
    const value = localStorage.getItem(POSITION_KEY);
    if (!value) return undefined;
    const position = JSON.parse(value) as Position;
    if (Number.isFinite(position.left) && Number.isFinite(position.top))
      return position;
  } catch {
    return undefined;
  }
  return undefined;
}

function writePosition(position: Position) {
  localStorage.setItem(POSITION_KEY, JSON.stringify(position));
}

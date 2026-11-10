import {
  AttachmentBehavior,
  Image,
  Item,
  buildCurve,
  buildImage,
  buildShape,
  buildText,
} from "@owlbear-rodeo/sdk";
import { getColor } from "../colorHelpers";
import { Tracker } from "../TrackerZod";
import { createRoundedRectangle, getFillPortion } from "./mathHelpers";

// Constants used in multiple functions
const FONT = "Roboto, sans-serif";
const DISABLE_HIT = true;
const BUBBLE_OPACITY = 0.7;
const DISABLE_ATTACHMENT_BEHAVIORS: AttachmentBehavior[] = [
  "ROTATION",
  "VISIBLE",
  "COPY",
  "SCALE",
];
const TEXT_VERTICAL_OFFSET = -1.2;

// Constants used in createStatBubble()
export const BUBBLE_DIAMETER = 30;

/** Creates Stat Bubble component items */
export function createTrackerBubble(
  item: Item,
  tracker: Tracker,
  position: { x: number; y: number },
  index: number,
): Item[] {
  if (
    tracker.variant !== "value" &&
    tracker.variant !== "counter" &&
    tracker.variant !== "checkbox"
  )
    throw new Error("Expected value or counter tracker variant");

  const diameter = tracker.bubbleSize ?? BUBBLE_DIAMETER;
  const bubblePosition = {
    x: position.x + (tracker.bubbleOffsetX ?? 0),
    y: position.y + (tracker.bubbleOffsetY ?? 0),
  };
  const bubbleShape = buildShape()
    .width(diameter)
    .height(diameter)
    .shapeType("CIRCLE")
    .fillColor(tracker.customColor ?? getColor(tracker.color))
    .fillOpacity((tracker.bubbleOpacity ?? 70) / 100)
    .strokeColor(tracker.bubbleOutlineColor ?? getColor(tracker.color))
    .strokeOpacity(tracker.bubbleOutlineWidth ? 1 : 0.5)
    .strokeWidth(tracker.bubbleOutlineWidth ?? 0)
    .position(bubblePosition)
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBubbleBackgroundId(item.id, index))
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  const valueText =
    tracker.variant === "checkbox"
      ? tracker.checked === true
        ? "✓"
        : "◯"
      : tracker.value.toString();

  if (tracker.variant === "checkbox") bubblePosition.y += 3;

  const defaultFontSize =
    valueText.length === 3
      ? Math.max(10, diameter - 15)
      : Math.max(10, diameter - 8);

  const bubbleTextBuilder = buildText()
    .position({
      x:
        bubblePosition.x -
        diameter / 2 +
        (tracker.bubbleTextOffsetX ?? 0),
      y:
        bubblePosition.y -
        diameter / 2 +
        TEXT_VERTICAL_OFFSET +
        (tracker.bubbleTextOffsetY ?? 0),
    })
    .plainText(valueText.length > 3 ? String.fromCharCode(0x2026) : valueText)
    .textAlign("CENTER")
    .textAlignVertical("MIDDLE")
    .fontSize(tracker.bubbleFontSize ?? defaultFontSize)
    .fontFamily(tracker.bubbleFontFamily ?? FONT)
    .textType("PLAIN")
    .height(diameter + 2)
    .width(diameter)
    .fontWeight(tracker.bubbleFontWeight ?? 400)
    .attachedTo(item.id)
    .layer("TEXT")
    .locked(true)
    .id(getBubbleTextId(item.id, index))
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT);

  if (tracker.bubbleTextColor !== undefined)
    bubbleTextBuilder.fillColor(tracker.bubbleTextColor);
  if ((tracker.bubbleTextOutlineWidth ?? 0) > 0) {
    bubbleTextBuilder
      .strokeColor(tracker.bubbleTextOutlineColor ?? "#000000")
      .strokeWidth(tracker.bubbleTextOutlineWidth ?? 0);
  }

  const bubbleText = bubbleTextBuilder.build();

  return [bubbleShape, bubbleText];
}

export function getDropdownLabelDimensions(
  tracker: Tracker,
  tokenWidth?: number,
) {
  if (tracker.variant !== "dropdown")
    throw new Error("Expected dropdown tracker variant");
  const fontSize = tracker.dropdownFontSize ?? 16;
  const width =
    tokenWidth !== undefined && tracker.dropdownWidthPercent !== undefined
      ? tokenWidth * (tracker.dropdownWidthPercent / 100)
      : (tracker.dropdownLabelWidth ??
        Math.min(
          400,
          Math.max(72, Math.ceil(tracker.value.length * fontSize * 0.62 + 20)),
        ));
  return { width, height: tracker.dropdownLabelHeight ?? 26 };
}

export function createTrackerDropdownLabel(
  item: Item,
  tracker: Tracker,
  center: { x: number; y: number },
  index: number,
  tokenWidth?: number,
): Item[] {
  if (tracker.variant !== "dropdown")
    throw new Error("Expected dropdown tracker variant");
  const { width, height } = getDropdownLabelDimensions(tracker, tokenWidth);
  const position = {
    x: center.x + (tracker.dropdownOffsetX ?? 0) - width / 2,
    y: center.y + (tracker.dropdownOffsetY ?? 0) - height / 2,
  };
  const radius = Math.min(
    tracker.dropdownCornerRadius ?? height / 2,
    height / 2,
    width / 2,
  );
  const backgroundBuilder = buildCurve()
    .fillColor(tracker.customColor ?? getColor(tracker.color))
    .fillOpacity((tracker.dropdownOpacity ?? 70) / 100)
    .strokeWidth(tracker.dropdownOutlineWidth ?? 0)
    .position(position)
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBubbleBackgroundId(item.id, index))
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(createRoundedRectangle(width, height, radius));

  if ((tracker.dropdownOutlineWidth ?? 0) > 0)
    backgroundBuilder
      .strokeColor(tracker.dropdownOutlineColor ?? "#ffffff")
      .strokeOpacity(1);
  const background = backgroundBuilder.build();

  const textBuilder = buildText()
    .position({
      x: position.x + (tracker.dropdownTextOffsetX ?? 0),
      y: position.y + (tracker.dropdownTextOffsetY ?? 0),
    })
    .plainText(tracker.value)
    .textAlign("CENTER")
    .textAlignVertical("MIDDLE")
    .fontSize(tracker.dropdownFontSize ?? 16)
    .fontFamily(tracker.dropdownFontFamily ?? FONT)
    .fontWeight(tracker.dropdownFontWeight ?? 400)
    .textType("PLAIN")
    .height(height + 2)
    .width(width)
    .attachedTo(item.id)
    .layer("TEXT")
    .locked(true)
    .id(getBubbleTextId(item.id, index))
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT);

  if (tracker.dropdownTextColor !== undefined)
    textBuilder.fillColor(tracker.dropdownTextColor);
  if ((tracker.dropdownTextOutlineWidth ?? 0) > 0) {
    textBuilder
      .strokeColor(tracker.dropdownTextOutlineColor ?? "#000000")
      .strokeWidth(tracker.dropdownTextOutlineWidth ?? 0);
  }
  return [background, textBuilder.build()];
}

export function createImageBubble(
  item: Image,
  sceneDpi: number,
  position: { x: number; y: number },
  color: string,
  url: string,
  imageLabel: string,
  backgroundLabel: string,
): Item[] {
  const bubbleShape = buildShape()
    .width(BUBBLE_DIAMETER)
    .height(BUBBLE_DIAMETER)
    .shapeType("CIRCLE")
    .fillColor(color)
    .fillOpacity(BUBBLE_OPACITY)
    .strokeColor(color)
    .strokeOpacity(0.5)
    .strokeWidth(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(backgroundLabel)
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  const desiredLength = 24;
  const IMAGE_DPI = 150; // Specific to visibility off icon used in extension, square so height and width are equal
  const imageObject = {
    width: IMAGE_DPI,
    height: IMAGE_DPI,
    mime: "image/png",
    url: url,
  };
  const imageInSceneDpi = (sceneDpi * IMAGE_DPI) / desiredLength;

  const image = buildImage(imageObject, {
    offset: { x: sceneDpi / 2, y: sceneDpi / 2 },
    dpi: imageInSceneDpi,
  })
    .position(position)
    .attachedTo(item.id)
    .locked(true)
    .id(imageLabel)
    .layer("NOTE")
    .disableHit(DISABLE_HIT)
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .build();

  return [bubbleShape, image];
}

// Constants used in createBarTacker()
const BAR_PADDING = 2;
export const FULL_BAR_HEIGHT = 20;
export const REDUCED_BAR_HEIGHT = 16;
const BAR_CORNER_RADIUS = FULL_BAR_HEIGHT / 2;

/** Creates bar component items */
export function createTrackerBar(
  item: Item,
  bounds: { width: number; height: number },
  tracker: Tracker,
  origin: { x: number; y: number },
  index: number,
  reducedHeight = false,
  segments = 0,
): Item[] {
  const defaultBarHeight = reducedHeight ? REDUCED_BAR_HEIGHT : FULL_BAR_HEIGHT;
  const barHeight = tracker.barHeight ?? defaultBarHeight;
  const baseBarWidth = bounds.width - BAR_PADDING * 2;
  const barWidth = baseBarWidth * ((tracker.barWidthPercent ?? 100) / 100);
  const position = {
    x:
      origin.x -
      bounds.width / 2 +
      BAR_PADDING +
      (baseBarWidth - barWidth) / 2 +
      (tracker.barOffsetX ?? 0),
    y: origin.y - barHeight + (tracker.barOffsetY ?? 0),
  };
  const setVisibilityProperty = item.visible;

  if (tracker.variant !== "value-max") throw "Error";

  const trackerBackgroundColor = "black"; // "#A4A4A4";

  const barCornerRadius =
    tracker.barCornerRadius ??
    (tracker.barHeight === undefined
      ? BAR_CORNER_RADIUS
      : Math.min(BAR_CORNER_RADIUS, barHeight / 2));
  const backgroundBuilder = buildCurve()
    .fillColor(trackerBackgroundColor)
    .fillOpacity((tracker.barBackgroundOpacity ?? 70) / 100)
    .strokeWidth(tracker.barOutlineWidth ?? 0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBarBackgroundId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(
      createRoundedRectangle(
        barWidth,
        barHeight,
        barCornerRadius,
      ),
    );

  if ((tracker.barOutlineWidth ?? 0) > 0)
    backgroundBuilder
      .strokeColor(tracker.barOutlineColor ?? "#ffffff")
      .strokeOpacity(1);

  const backgroundShape = backgroundBuilder.build();

  const fillPortion = getFillPortion(tracker.value, tracker.max, segments);

  const fillShape = buildCurve()
    .fillColor(tracker.customColor ?? getColor(tracker.color))
    .fillOpacity((tracker.barFillOpacity ?? 80) / 100)
    .strokeWidth(0)
    .strokeOpacity(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBarFillId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(
      createRoundedRectangle(
        barWidth,
        barHeight,
        barCornerRadius,
        fillPortion,
      ),
    )
    .build();

  const barTextHeight = barHeight + 8;
  const barFontSize = tracker.barFontSize ?? barHeight + 2;

  const barTextBuilder = buildText()
    .position({
      x: position.x + (tracker.barTextOffsetX ?? 0),
      y:
        position.y +
        TEXT_VERTICAL_OFFSET +
        -5.3 -
        (reducedHeight ? -0.8 : 0) +
        (tracker.barTextOffsetY ?? 0),
    })
    .plainText(`${tracker.value}/${tracker.max}`)
    .textAlign("CENTER")
    .textAlignVertical("MIDDLE")
    .fontSize(barFontSize)
    .fontFamily(tracker.barFontFamily ?? FONT)
    .textType("PLAIN")
    .height(barTextHeight)
    .width(barWidth)
    .fontWeight(tracker.barFontWeight ?? 400)
    .attachedTo(item.id)
    .fillOpacity(1)
    .layer("TEXT")
    .locked(true)
    .id(getBarTextId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT);

  if (tracker.barTextColor !== undefined)
    barTextBuilder.fillColor(tracker.barTextColor);
  if ((tracker.barTextOutlineWidth ?? 0) > 0) {
    barTextBuilder
      .strokeColor(tracker.barTextOutlineColor ?? "#000000")
      .strokeWidth(tracker.barTextOutlineWidth ?? 0);
  }

  const barText = barTextBuilder.build();

  return [backgroundShape, fillShape, barText];
}

export const MINIMAL_BAR_HEIGHT = 12;

/** Creates bar component items */
export function createMinimalTrackerBar(
  item: Item,
  bounds: { width: number; height: number },
  tracker: Tracker,
  origin: { x: number; y: number },
  segments = 0,
  index: number,
): Item[] {
  const barHeight = tracker.barHeight ?? MINIMAL_BAR_HEIGHT;
  const baseBarWidth = bounds.width - BAR_PADDING * 2;
  const barWidth = baseBarWidth * ((tracker.barWidthPercent ?? 100) / 100);
  const position = {
    x:
      origin.x -
      bounds.width / 2 +
      BAR_PADDING +
      (baseBarWidth - barWidth) / 2 +
      (tracker.barOffsetX ?? 0),
    y: origin.y - barHeight + (tracker.barOffsetY ?? 0),
  };
  const setVisibilityProperty = item.visible;

  if (tracker.variant !== "value-max") throw "Error";

  const trackerBackgroundColor = "black"; // "#A4A4A4";

  const barCornerRadius =
    tracker.barCornerRadius ??
    (tracker.barHeight === undefined
      ? BAR_CORNER_RADIUS
      : Math.min(BAR_CORNER_RADIUS, barHeight / 2));
  const backgroundBuilder = buildCurve()
    .fillColor(trackerBackgroundColor)
    .fillOpacity((tracker.barBackgroundOpacity ?? 70) / 100)
    .strokeWidth(tracker.barOutlineWidth ?? 0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBarBackgroundId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(
      createRoundedRectangle(
        barWidth,
        barHeight,
        barCornerRadius,
      ),
    );

  if ((tracker.barOutlineWidth ?? 0) > 0)
    backgroundBuilder
      .strokeColor(tracker.barOutlineColor ?? "#ffffff")
      .strokeOpacity(1);

  const backgroundShape = backgroundBuilder.build();

  const fillPortion = getFillPortion(tracker.value, tracker.max, segments);

  const fillShape = buildCurve()
    .fillColor(tracker.customColor ?? getColor(tracker.color))
    .fillOpacity((tracker.barFillOpacity ?? 80) / 100)
    .strokeWidth(0)
    .strokeOpacity(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBarFillId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(
      createRoundedRectangle(
        barWidth,
        barHeight,
        barCornerRadius,
        fillPortion,
      ),
    )
    .build();

  return [backgroundShape, fillShape];
}

export const getBubbleBackgroundId = (itemId: string, position: number) =>
  `${itemId}-${position}-bubble-bg`;
export const getBubbleTextId = (itemId: string, position: number) =>
  `${itemId}-${position}-bubble-text`;

export const getImageBackgroundId = (itemId: string, label: string) =>
  `${itemId}-${label}-img-bg`;
export const getImageId = (itemId: string, label: string) =>
  `${itemId}-${label}-img`;

export const getBarBackgroundId = (itemId: string, position: number) =>
  `${itemId}-${position}-bar-bg`;
export const getBarFillId = (itemId: string, position: number) =>
  `${itemId}-${position}-bar-fill`;
export const getBarTextId = (itemId: string, position: number) =>
  `${itemId}-${position}-bar-text`;

export function getBubbleItemIds(itemId: string, position: number) {
  return [
    getBubbleBackgroundId(itemId, position),
    getBubbleTextId(itemId, position),
  ];
}

export function getImageBubbleItemIds(itemId: string, label: string) {
  return [getImageBackgroundId(itemId, label), getImageId(itemId, label)];
}

export function getBarItemIds(itemId: string, position: number) {
  return [
    getBarBackgroundId(itemId, position),
    getBarFillId(itemId, position),
    getBarTextId(itemId, position),
  ];
}

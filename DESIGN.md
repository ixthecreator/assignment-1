# A Face Is a Link — first-step plan

## Concept

Continue the existing face / nodes / mismatch idea: does recognizing someone's facial features mean understanding the person? The three pages move from a whole face to isolated parts, then to a face assembled from mismatched fragments. Links let the viewer revisit the same question in a different order.

This is a layout scaffold, the very first draft.

## Desktop grid sketches

Numbers refer to the ten labeled image positions on each page. Rows grow if their content needs more space; gaps are 12px.

### 01 Face — 4 columns × 4 rows

```text
01 01 02 03
01 01 04 05
06 07 08 09
10 10 10 10
```

The portrait dominates, with smaller details beside it. Use `repeat(4, minmax(0, 1fr))`; image 01 spans two columns and two rows, and image 10 spans the full width.

### 02 Nodes — 5 columns × 2 rows

```text
01 02 03 04 05
06 07 08 09 10
```

Equal cells turn the face into comparable fragments. Use `repeat(5, minmax(0, 1fr))`, with no spanning images.

### 03 Mismatch — 3 columns × 4 rows

```text
01 01 01
02 03 04
05 06 07
08 09 10
```

A wide assembled face sits above its disconnected parts. Use `repeat(3, minmax(0, 1fr))`; image 01 spans the full width.

At 640px and below, use two columns so labels and eventual images remain legible. Each image space contains a number and a short caption.

## First commit

- [x] Three linked HTML pages with semantic headings, sections, and figures.
- [x] Three different desktop CSS Grid layouts and a small-screen layout.
- [x] Ten labeled image spaces per page.
- [x] Short README describing setup.
- [ ] Make original photographs or drawings and collect found media.
- [ ] Replace the spaces with at least ten actual images per page, with alt text.
- [ ] Add image credits and source links directly to each page.
- [ ] Refine image scale, overlap, and links between individual fragments.
- [ ] Review the finished three-page work before submitting its repository in Canvas.

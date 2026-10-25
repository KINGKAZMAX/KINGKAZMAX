# Agumon pet assets

These files derive from the existing local `agumon` pet selected by the site owner. They do not claim original authorship of the Agumon character or official affiliation. No new character artwork was generated or redrawn.

## Files

- `atlas.webp`: lossless RGBA sprite atlas, 1536 × 1872, eight columns and nine rows. Each cell is 192 × 208. Only the RGB values of fully transparent pixels were cleared; visible pixels, alpha, layout, and frame order were retained.
- `agumon.gif`: 192 × 208, 22 frames, 4,000 ms loop, approximately 203 KB. Sequence: idle → idle → waving → idle. GIF uses indexed color and binary transparency as a lightweight README preview.
- `poster.png`: the first idle frame at its original 192 × 208 cell size.
- `pet-manifest.json`: atlas geometry, all nine animation rows, frame counts, per-frame durations, average frame rates, and source provenance.

## Playback

Load `pet-manifest.json` relative to this directory. For an animation's frame `i`, crop the atlas at `(i × 192, row × 208)` with size `192 × 208`. When using a CSS sprite, use `background-size: 1536px 1872px` and `background-position: (-i × 192)px (-row × 208)px`. Multiply every dimension by the same scale factor when resizing.

Use each row's `frameDurationsMs` for timing. Its `fps` value is an average, not a fixed step rate. The durations are the documented defaults from the installed Work Pets 0.1.6 reference; the original local `pet.json` does not contain timings.

Use the first idle frame when motion is paused or `prefers-reduced-motion` is active. Expose the actions as keyboard-operable controls. V1 has no look-direction rows and no separate `happy` animation. The legacy `running` row depicts locomotion; do not present it as evidence that an AI or remote process is running.

The GIF can be embedded as an ordinary Markdown image and linked to the interactive page. GitHub README renders the preview; browser input and pet state changes belong on the Pages site.

## Source and conversion record

- Local source identity: `~/.codex/pets/agumon/pet.json`, ID `agumon`, display name `Agumon`.
- Local source image: `~/.codex/pets/agumon/spritesheet.webp`.
- Original SHA-256: `0ff19c7fcf25d59dc491549550b4b9e7ae5fc5d8491ec74faa32f40e83352c59`.
- Derived atlas SHA-256: `94132e61fddfd15ae00c1b0f57f654117adb95962d29aaddb58ecc42c0fb4c8c`.
- Conversion date: 2026-10-26.
- Fully transparent pixels whose hidden RGB values were cleared: 1,334,554.
- Structural validation: 57 occupied required cells, 15 transparent unused cells; the bundled `validate_atlas.py` passes with no errors or warnings on the exact derived WebP.
- The original local pet configuration and sprite file were not changed. No pet was selected, uploaded, replaced, or published by this conversion.

该资源来自用户选择的既有本地亚古兽宠物。本次仅做技术转换与现有帧的动图编排，不把角色宣称为原创，也不暗示官方关系。

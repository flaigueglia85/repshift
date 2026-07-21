# Exercise data sources

RepShift keeps its curated exercise model as the product source of truth. External datasets are used to accelerate discovery, taxonomy review and temporary visual references; they are not imported blindly into the production catalog.

## Free Exercise DB

Repository: `yuhonas/free-exercise-db`

- 800+ exercise records in JSON.
- Common fields include name, level, equipment, primary/secondary muscles, instructions and two images.
- Repository license: Unlicense / public-domain dedication.
- Current RepShift use: matched visual references for existing curated exercises.
- Images are marked `referenceOnly` in code so they can later be replaced by proprietary RepShift artwork without changing the exercise IDs or UI structure.

## wger

Project: `wger-project/wger`

- Useful REST API, multilingual exercise data, taxonomy and community-maintained content.
- Application code is AGPL-3.0-or-later.
- Exercise data and media can have Creative Commons or entry-specific licensing.
- Current RepShift use: evaluation and future taxonomy validation only.
- Rule for future imports: retain source ID, author, license and attribution for every imported entry; reject entries without an explicitly accepted license.

## Import policy

1. No automatic bulk merge directly into `exerciseCatalog`.
2. Normalize external equipment and muscles into RepShift IDs.
3. Deduplicate by movement, equipment and common aliases.
4. Review descriptions and coaching cues before publishing.
5. Keep source metadata alongside any imported record.
6. External imagery remains a temporary/reference layer until replaced by RepShift-owned visuals.
7. Run a manual visual check: a matching filename does not guarantee that an image is technically correct or suitable for RepShift.

## Next catalog expansion

The recommended expansion path is a curated batch of roughly 80–120 strength exercises selected from Free Exercise DB, then reviewed against wger for naming, muscles, equipment and missing variants. Each published exercise must still receive RepShift-specific Italian/English copy, loading behaviour and alternatives.

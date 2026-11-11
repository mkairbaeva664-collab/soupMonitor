# Project Notes: ML Training Monitor

## Data
- Created 20 distinct training runs with varied behaviors.
- Included one massive training run (Run 20) containing **1 million points** and a sharp spike in Loss.
- Included runs with special data challenges: `null` values, out-of-order steps, and duplicate step numbers.

## Data Processing & Algorithms
- **Sorting (`sortData`):** Synchronously sorts steps and values in ascending order.
- **Deduplication (`removeDuplicates`):** Handles duplicate steps by keeping the latest recorded value.
- **Validation (`validateData`):** Filters out `NaN`, `Infinity`, and `null` values cleanly without coercing them to zero to avoid distorting charts.
- **Min/Max Downsampling (`downsampleData`):** Divides the large dataset into blocks and preserves both the minimum and maximum values in each block. This ensures that extreme spikes (like the 1M-point run spike) are completely preserved while rendering efficiently.

## Testing
- Used **Vitest** for automated testing.
- Created 4 core unit tests:
  1. **Sorting test:** Verifies correct ascending sequence.
  2. **Duplicate test:** Confirms proper handling of repeating steps.
  3. **NaN/Null test:** Ensures invalid values are dropped rather than converted to zeros.
  4. **Spike test:** Confirms that min/max downsampling retains extreme spike values.

## Performance
- **Before optimization:** Attempting to render 1 million points directly caused severe UI lag and freezing in the browser.
- **After optimization (Min/Max downsampling):** The chart renders smoothly and instantly (under ~100ms) while keeping the critical spike visible.

## AI Tools Usage
- Collaborated with AI (Gemini) to structure the project layout, write and debug the min/max downsampling algorithm, and set up Vitest testing. All generated code was manually reviewed and tested locally.

## Final Decision: SHIP
- Clean, responsive Bootstrap interface.
- Robust data handling and downsampling.
- Fully tested with green test suites and successfully deployed.
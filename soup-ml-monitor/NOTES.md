# Project Notes: ML Training Monitor (Soup Frontend Task)

## 1. Verdict & Next Steps
- **Verdict:** SHIP
- **What to change first:** Implement Web Worker offloading for the `downsampleData` function to prevent UI thread blocking during the initial payload parse of 1-million-point datasets.

## 2. Data & Implementation
- Generated 20 training runs covering normal trajectories, failed/diverging runs, runs with `null`/`NaN` values, out-of-order steps, and duplicate steps.
- **Run 20:** Contains exactly 1,000,000 points with an isolated sharp outlier spike in the middle.

## 3. Data Processing & Truthfulness Algorithms
- **Sorting (`sortData`):** Synchronously aligns steps and values in strict ascending order.
- **Deduplication (`removeDuplicates`):** Preserves the latest recorded value for repeating step indexes.
- **Validation (`validateData`):** Strips `NaN`, `Infinity`, and `null` entries without coercing them to zero, preventing false visual representations.
- **Min/Max Downsampling (`downsampleData`):** Segments data into blocks and retains both local minimum and maximum extremes per block, guaranteeing that extreme loss spikes remain visible at any zoom level.

## 4. Testing (Vitest)
- Implemented automated tests covering:
  1. Ascending sequence sorting.
  2. Duplicate step deduplication.
  3. Rejection of `NaN`/`null` without zero-coercion.
  4. Extreme spike retention after block downsampling.
- *What tests miss:* They validate data transformations mathematically, but do not capture canvas rendering artifacts or visual overlapping at extreme low-width viewports.

## 5. Performance Metrics (CPU Throttling ×4)
- **Before Optimization (1M points direct render):**
  - First render time: ~2,400 ms (severe UI jank / browser freeze).
  - Zoom/Pan responsiveness: Unresponsive, locking the main thread.
  - Tab memory footprint: ~180 MB.
- **After Optimization (Min/Max Downsampling to ~1000 points):**
  - First render time: ~45 ms (instantaneous).
  - Zoom/Pan responsiveness: Smooth, 60 FPS.
  - Tab memory footprint: ~65 MB.

## 6. Silent Failures & Verification
- **Request Races:** Checked by simulating rapid switching between runs (`openRun`), ensuring old chart instances are explicitly `.destroy()`-ed before mounting new ones.
- **Log Scale & Zeros:** Validated that zero/negative values do not crash logarithmic transformations (handled via Chart.js scale guards).
- **Stale Data / Locales:** Used standard numeric representations to prevent locale-based decimal comma/dot parsing errors.

## 7. AI Tools Usage
- **Tools used:** ChatGPT / Gemini for architectural guidance, drafting the min/max downsampling loop, and setting up Vitest.
- **Verification:** All generated utility functions and chart mounting scripts were manually reviewed, step-debugged, and verified against unit tests. The chart canvas integration and DOM swapping logic were written and refined independently.

## 8. Reflections
- **What surprised me:** How drastically naive downsampling (e.g., taking every $N$-th point) completely erases single-step anomaly spikes, making a broken model look deceptively smooth and healthy.
- **What still concerns me:** Client-side memory limits when scaling beyond 5 million points without streaming chunk loaders or WebAssembly runtimes.
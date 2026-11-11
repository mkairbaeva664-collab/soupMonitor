import { describe, it, expect } from 'vitest';
import { sortData, removeDuplicates, validateData, downsampleData } from '../src/utils.js';

describe('ML Monitor Utilities', () => {
    
    it('Sorting test: should sort steps in ascending order', () => {
        const steps = [300, 100, 200];
        const values = [0.3, 0.9, 0.5];
        const sorted = sortData(steps, values);
        expect(sorted.steps).toEqual([100, 200, 300]);
        expect(sorted.values).toEqual([0.9, 0.5, 0.3]);
    });

    it('Duplicate test: should keep the last value for duplicate steps', () => {
        const steps = [100, 200, 200];
        const values = [0.9, 0.7, 0.65];
        const result = removeDuplicates(steps, values);
        expect(result.steps).toEqual([100, 200]);
        expect(result.values).toEqual([0.9, 0.65]);
    });

    it('NaN/Null test: should filter out invalid values without converting them to zero', () => {
        const steps = [1, 2, 3, 4];
        const values = [0.9, null, NaN, 0.4];
        const result = validateData(steps, values);
        expect(result.values).toEqual([0.9, 0.4]);
        expect(result.values).not.toContain(0); 
    });

    it('Spike test: min/max downsampling should preserve extreme spikes', () => {
        const steps = Array.from({ length: 10000 }, (_, i) => i + 1);
        const values = Array.from({ length: 10000 }, () => 0.1);
        values[5000] = 50.0; 

        const result = downsampleData(steps, values, 100);
        
        expect(result.values).toContain(50.0);
    });
});
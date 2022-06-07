import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Sample from './Sample.svelte';

describe("Sample Test", () => {

    it('should not throw an error', () => {
        const { getByText } = render(Sample);
        expect(() => getByText(/null/i)).not.toThrow();
    })
})

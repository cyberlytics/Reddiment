import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Footer from "../lib/components/Footer.svelte";

describe("Footer Test", () => {

    it('should not throw an error', () => {
        const { getByText } = render(Footer);
        expect(() => getByText(/© 2022 Reddiment. All Rights Reserved./i)).not.toThrow();
    })
})

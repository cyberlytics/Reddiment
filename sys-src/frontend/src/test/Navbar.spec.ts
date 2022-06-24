import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Navbar from "../lib/components/Navbar.svelte";

describe("Navbar Test", () => {

    it('should not throw an error', () => {
        const { getByText } = render(Navbar);
        expect(() => getByText(/Reddiment/i)).not.toThrow();
    })

})

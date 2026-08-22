import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { EmptyIllustration } from '@/components/EmptyIllustration';

describe('Tier 1: EmptyIllustration Component', () => {
  it('renders SVG illustration with custom className and aria-hidden', () => {
    const { container } = render(<EmptyIllustration className="w-20 h-20 custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('custom-class');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 160 112');
  });
});

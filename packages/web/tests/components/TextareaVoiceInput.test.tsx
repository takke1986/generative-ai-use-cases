import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Textarea from '../../src/components/Textarea';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'ja' } }),
}));

// A browser with a microphone, so only the settings decide the button
vi.mock('../../src/hooks/useVoiceInput', () => {
  const voice = () => ({
    supported: true,
    status: 'idle',
    error: null,
    toggle: vi.fn(),
  });
  return {
    voiceInputEnabled: true,
    default: voice,
    useVoiceInputInto: voice,
    useShowVoiceInput: () => localStorage.getItem('showVoiceInput') !== 'false',
  };
});

// The textarea resizes itself with ResizeObserver, which jsdom does not have
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

const renderTextarea = (voiceInput?: boolean, label?: string) =>
  render(
    <Textarea
      value=""
      onChange={() => {}}
      voiceInput={voiceInput}
      label={label}
    />
  );

describe('Textarea voice input button', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the microphone button on a field that asks for it', () => {
    renderTextarea(true);
    expect(screen.getByText('inputs.voice_input')).toBeTruthy();
  });

  it('hides it when the user turns it off on the Settings page', () => {
    localStorage.setItem('showVoiceInput', 'false');
    renderTextarea(true);
    expect(screen.queryByText('inputs.voice_input')).toBeNull();
  });

  it('shows one button on a field with a label too', () => {
    renderTextarea(true, 'Prompt');
    expect(screen.getAllByText('inputs.voice_input')).toHaveLength(1);
  });

  it('does not show it on other fields', () => {
    renderTextarea();
    expect(screen.queryByText('inputs.voice_input')).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { appendTranscript } from '../../src/hooks/useVoiceInput';

describe('appendTranscript', () => {
  it('puts the transcript in an empty field as it is', () => {
    expect(appendTranscript('', 'Hello')).toBe('Hello');
  });

  it('adds a space after the text there', () => {
    expect(appendTranscript('Summarize this', 'in three lines')).toBe(
      'Summarize this in three lines'
    );
  });

  it('does not add a second space or break a new line', () => {
    expect(appendTranscript('First line\n', 'second')).toBe(
      'First line\nsecond'
    );
    expect(appendTranscript('Text ', 'more')).toBe('Text more');
  });
});

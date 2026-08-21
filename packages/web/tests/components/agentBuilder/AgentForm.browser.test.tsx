import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// i18n: return the key itself so assertions do not depend on translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../src/hooks/useModel', () => ({
  MODELS: {
    modelIds: ['test.model-1'],
    modelDisplayName: (modelId: string) => modelId,
  },
}));

vi.mock('../../../src/components/agentBuilder/MCPServerManager', () => ({
  default: () => <div data-testid="mcp-server-manager" />,
}));

vi.mock('../../../src/hooks/useMCPServers', () => ({
  default: () => [],
}));

vi.mock('../../../src/hooks/usePromptGeneration', () => ({
  default: () => ({
    generatedPrompt: '',
    suggestedMCPServers: [],
    isGenerating: false,
    error: undefined,
    generate: vi.fn(),
    cancel: vi.fn(),
    reset: vi.fn(),
  }),
}));

import AgentForm, {
  AgentFormData,
} from '../../../src/components/agentBuilder/AgentForm';

const renderForm = (props: Partial<Parameters<typeof AgentForm>[0]> = {}) => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const onCancel = vi.fn();
  const onFormDataChange = vi.fn();
  render(
    <AgentForm
      onSave={onSave}
      onCancel={onCancel}
      onFormDataChange={onFormDataChange}
      {...props}
    />
  );
  return { onSave, onCancel, onFormDataChange };
};

const browserCheckbox = () =>
  document.querySelector('#browserEnabled') as HTMLInputElement;

describe('AgentForm browser tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // The browser tool is opted in at deploy time
    vi.stubEnv('VITE_APP_AGENT_CORE_AGENT_BUILDER_BROWSER_ENABLED', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders the browser checkbox with its label and description', () => {
    renderForm();

    const checkbox = browserCheckbox();
    expect(checkbox).not.toBeNull();
    expect(checkbox.type).toBe('checkbox');
    expect(screen.getByText('agent_builder.enable_browser')).toBeDefined();
    expect(screen.getByText('agent_builder.browser_description')).toBeDefined();
  });

  it('is unchecked by default', () => {
    renderForm();
    expect(browserCheckbox().checked).toBe(false);
  });

  it('reflects the value from initialData', () => {
    renderForm({ initialData: { browserEnabled: true } });
    expect(browserCheckbox().checked).toBe(true);
  });

  it('reports the change through onFormDataChange when toggled', () => {
    const { onFormDataChange } = renderForm();

    expect(browserCheckbox().checked).toBe(false);
    fireEvent.click(browserCheckbox());

    expect(browserCheckbox().checked).toBe(true);
    const lastCall = onFormDataChange.mock.calls.at(-1);
    expect((lastCall?.[0] as AgentFormData).browserEnabled).toBe(true);
  });

  it('is not rendered when the browser tool is not enabled at deploy time', () => {
    vi.stubEnv('VITE_APP_AGENT_CORE_AGENT_BUILDER_BROWSER_ENABLED', 'false');
    renderForm();

    expect(browserCheckbox()).toBeNull();
    // Code execution stays available
    expect(document.querySelector('#codeExecutionEnabled')).not.toBeNull();
  });

  it('keeps code execution independent from the browser tool', () => {
    renderForm();

    const codeExecution = document.querySelector(
      '#codeExecutionEnabled'
    ) as HTMLInputElement;

    fireEvent.click(browserCheckbox());

    expect(browserCheckbox().checked).toBe(true);
    expect(codeExecution.checked).toBe(false);
  });
});

import React from 'react';
import { useTranslation } from 'react-i18next';
import { PiMicrophone, PiSpinnerGap, PiStopFill } from 'react-icons/pi';
import ButtonIcon from './ButtonIcon';
import Tooltip from './Tooltip';
import {
  VoiceInput,
  useShowVoiceInput,
  useVoiceInputInto,
} from '../hooks/useVoiceInput';

type ButtonProps = {
  voice: VoiceInput;
  disabled?: boolean;
};

/** Starts the recording, and stops it to turn the speech into text */
export const VoiceInputButton: React.FC<ButtonProps> = ({
  voice,
  disabled,
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      message={
        voice.status === 'recording'
          ? t('inputs.voice_stop')
          : t('inputs.voice_input')
      }
      position="center"
      topPosition="-top-16"
      nowrap>
      <ButtonIcon
        onClick={voice.toggle}
        disabled={voice.status === 'transcribing' || disabled}
        className={
          voice.status === 'recording'
            ? 'animate-pulse text-red-500'
            : 'text-gray-500'
        }>
        {voice.status === 'transcribing' ? (
          <PiSpinnerGap className="animate-spin" />
        ) : voice.status === 'recording' ? (
          <PiStopFill />
        ) : (
          <PiMicrophone />
        )}
      </ButtonIcon>
    </Tooltip>
  );
};

type FieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

/** The microphone button of a text field, adding the speech to its text */
export const VoiceInputField: React.FC<FieldProps> = (props) => {
  const { t, i18n } = useTranslation();
  const voice = useVoiceInputInto(i18n.language, props.value, props.onChange);
  if (!useShowVoiceInput(voice)) {
    return null;
  }
  return (
    <div
      className={`${props.className ?? ''} flex items-center justify-end gap-2`}>
      {voice.error && (
        <p className="text-xs text-red-500">
          {t(`inputs.voice_error_${voice.error}`)}
        </p>
      )}
      <VoiceInputButton voice={voice} disabled={props.disabled} />
    </div>
  );
};

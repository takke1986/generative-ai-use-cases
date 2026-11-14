import { Request, Response } from 'express';
import { getClaims } from './api/user';
import { v4 as uuidv4 } from 'uuid';
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  LanguageCode,
} from '@aws-sdk/client-transcribe';
import { StartTranscriptionRequest } from 'generative-ai-use-cases';
import { sanitizeTranscribeLanguageOptions } from '@generative-ai-use-cases/common';

export const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = new TranscribeClient({});
    const input: StartTranscriptionRequest = req.body;
    const userId = getClaims(req).sub;

    const { audioUrl, speakerLabel, maxSpeakers, languageCode } = input;
    // The browser sends the user's candidate languages; only known codes are
    // used, and a missing or invalid list falls back to Japanese and English
    const languageOptions = sanitizeTranscribeLanguageOptions(
      input.languageOptions
    ) as LanguageCode[];

    const uuid = uuidv4();

    const command = new StartTranscriptionJobCommand({
      IdentifyLanguage: !languageCode, // Enable auto-detection when no language specified
      LanguageCode: languageCode ? (languageCode as LanguageCode) : undefined, // Use specified language when provided
      LanguageOptions: !languageCode ? languageOptions : undefined, // Language candidates for auto-detection only
      Media: { MediaFileUri: audioUrl },
      TranscriptionJobName: uuid,
      Settings: {
        ShowSpeakerLabels: speakerLabel,
        MaxSpeakerLabels: speakerLabel ? maxSpeakers : undefined,
      },
      OutputBucketName: process.env.TRANSCRIPT_BUCKET_NAME,
      Tags: [
        {
          Key: 'userId',
          Value: userId,
        },
      ],
    });
    const result = await client.send(command);

    res.status(200).json({
      jobName: result.TranscriptionJob!.TranscriptionJobName,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

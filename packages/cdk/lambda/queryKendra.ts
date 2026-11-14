import {
  AttributeFilter,
  KendraClient,
  QueryCommand,
} from '@aws-sdk/client-kendra';

const INDEX_ID = process.env.INDEX_ID;
const LANGUAGE = process.env.LANGUAGE;

// Searches the Kendra index for the query.
export const queryKendra = async (query: string) => {
  // The default language is English, so language settings must be done.
  const attributeFilter: AttributeFilter = {
    AndAllFilters: [
      {
        EqualsTo: {
          Key: '_language_code',
          Value: {
            StringValue: LANGUAGE,
          },
        },
      },
    ],
  };

  const kendra = new KendraClient({});
  const queryCommand = new QueryCommand({
    IndexId: INDEX_ID,
    QueryText: query,
    AttributeFilter: attributeFilter,
  });

  const queryRes = await kendra.send(queryCommand);

  return queryRes;
};

import { router } from '../../lambda/api/routes/shares';
import { callRoute } from './api/callRoute';
import { createShareId, findChatById } from '../../lambda/repository';
import { ShareId, UserIdAndChatId } from 'generative-ai-use-cases';

// Mock the repository
jest.mock('../../lambda/repository');
const mockedCreateShareId = createShareId as jest.MockedFunction<
  typeof createShareId
>;
const mockedFindChatById = findChatById as jest.MockedFunction<
  typeof findChatById
>;

// Sends POST /shares/chat/:chatId, as the user when userId is given
const shareChat = (chatId: string, userId?: string) =>
  callRoute(router, 'POST', `/chat/${chatId}`, { userId });

describe('POST /shares/chat/:chatId', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Test for successful request
  test('returns correct response for valid request', async () => {
    // Test data
    const userId = 'testUser';
    const chatId = 'chat123';
    const createdDate = '1234567890';
    const shareId = 'share#test-uuid';

    // Mock the expected return values
    const mockShareId: ShareId = {
      id: `user#${userId}_chat#${chatId}`,
      createdDate,
      shareId,
    };

    const mockUserIdAndChatId: UserIdAndChatId = {
      id: shareId,
      createdDate,
      userId: `user#${userId}`,
      chatId: `chat#${chatId}`,
    };

    // Set up mocks
    mockedFindChatById.mockResolvedValue({
      id: `user#${userId}`,
      createdDate,
      chatId: `chat#${chatId}`,
      usecase: '',
      title: '',
      updatedDate: '',
    });

    mockedCreateShareId.mockResolvedValue({
      shareId: mockShareId,
      userIdAndChatId: mockUserIdAndChatId,
    });

    // Execute test
    const result = await shareChat(chatId, userId);

    // Verify results
    expect(result.statusCode).toBe(200);
    expect(mockedFindChatById).toHaveBeenCalledWith(userId, chatId);
    expect(mockedCreateShareId).toHaveBeenCalledWith(userId, chatId);
    expect(JSON.parse(result.body)).toEqual({
      shareId: mockShareId,
      userIdAndChatId: mockUserIdAndChatId,
    });
  });

  // Test for unauthorized access
  test('returns 403 error when user does not have access to the chat', async () => {
    const userId = 'testUser';
    const chatId = 'chat123';

    // Set up mock - chat not found
    mockedFindChatById.mockResolvedValue(null);

    // Execute test
    const result = await shareChat(chatId, userId);

    // Verify results
    expect(result.statusCode).toBe(403);
    expect(JSON.parse(result.body)).toEqual({
      message: 'You do not have permission to share this chat.',
    });
    expect(mockedCreateShareId).not.toHaveBeenCalled();
  });

  // Test for server error
  test('returns 500 error when an exception occurs', async () => {
    const userId = 'testUser';
    const chatId = 'chat123';

    // Set up mock to throw error
    mockedFindChatById.mockResolvedValue({
      id: `user#${userId}`,
      createdDate: '1234567890',
      chatId: `chat#${chatId}`,
      usecase: '',
      title: '',
      updatedDate: '',
    });

    // Mock console.log to prevent actual logging during test
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    mockedCreateShareId.mockRejectedValue(new Error('Database error'));

    // Execute test
    const result = await shareChat(chatId, userId);

    // Restore console.log
    console.log = originalConsoleLog;

    // Verify results
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Internal Server Error',
    });
  });

  // Test for a request without a signed-in user
  test('returns 500 error when there is no signed-in user', async () => {
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    const result = await shareChat('chat123');

    console.log = originalConsoleLog;

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Internal Server Error',
    });
    expect(mockedFindChatById).not.toHaveBeenCalled();
    expect(mockedCreateShareId).not.toHaveBeenCalled();
  });
});

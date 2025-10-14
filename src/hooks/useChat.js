import chatApi from "@/services/chatApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

const useChat = {
  /**
   * 📂 GET ALL CHATS HOOK
   * Fetches paginated chats with full details
   * Perfect for admin dashboards, inbox pages
   * Returns: isLoadingChats, chats, errorChats
   * Example: const { isLoadingChats, chats } = useChat.useAll({page: 1, limit: 10});
   */
  useAll: (queryParams = {}, options = {}) => {
    const [searchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page")) || queryParams.page;
    const limit = parseInt(searchParams.get("limit")) || queryParams.limit;

    const mergedFilters = {
      ...queryParams,
      page,
      limit,
    };

    const query = useQuery({
      queryKey: ["chats", "all", mergedFilters],
      queryFn: () => chatApi.getAll(mergedFilters),
      staleTime: 1 * 60 * 1000, // 1 minute - chats update frequently
      cacheTime: 3 * 60 * 1000,
      keepPreviousData: true,
      ...options,
    });

    return {
      isLoadingChats: query.isLoading,
      chats: query.data,
      errorChats: query.error,
      isErrorChats: query.isError,
      refetchChats: query.refetch,
      isFetchingChats: query.isFetching,
      isPreviousData: query.isPreviousData,
    };
  },

  /**
   * 🎯 GET SINGLE CHAT HOOK
   * Fetches complete chat details
   * Returns: isLoadingChat, chat, errorChat
   * Example: const { isLoadingChat, chat } = useChat.useById(123);
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["chats", id],
      queryFn: () => chatApi.getById(id),
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingChat: query.isLoading,
      chat: query.data,
      errorChat: query.error,
      isErrorChat: query.isError,
      refetchChat: query.refetch,
    };
  },

  /**
   * 💬 CREATE NEW CHAT HOOK
   * Starts a new chat session
   * Returns: isPendingChat, createChat, errorCreateChat
   * Example: const { isPendingChat, createChat } = useChat.useCreate();
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: chatApi.create,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["chats"], type: "all" });
        toast.success("Chat created successfully!");

        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`Failed to create chat: ${error.message}`);

        if (options.onError) {
          options.onError(error);
        }
      },
      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError"].includes(key)
        )
      ),
    });

    return {
      isPendingChat: mutation.isPending,
      createChat: mutation.mutate,
      createChatAsync: mutation.mutateAsync,
      errorCreateChat: mutation.error,
      isErrorCreateChat: mutation.isError,
      resetCreateChat: mutation.reset,
    };
  },

  /**
   * 📨 SEND MESSAGE HOOK
   * Sends a new message in a chat
   * Returns: isPendingMessage, sendMessage, errorSendMessage
   * Example: const { isPendingMessage, sendMessage } = useChat.useSendMessage(123);
   */
  useSendMessage: (chatId, options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: (messageData) => chatApi.createMessage(chatId, messageData),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["chats", chatId, "messages"],
        });
        queryClient.invalidateQueries({ queryKey: ["chats", chatId] });
        toast.success("Message sent!");

        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`Failed to send message: ${error.message}`);

        if (options.onError) {
          options.onError(error);
        }
      },
      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError"].includes(key)
        )
      ),
    });

    return {
      isPendingMessage: mutation.isPending,
      sendMessage: mutation.mutate,
      sendMessageAsync: mutation.mutateAsync,
      errorSendMessage: mutation.error,
      isErrorSendMessage: mutation.isError,
      resetSendMessage: mutation.reset,
    };
  },

  /**
   * 📬 GET MESSAGES HOOK
   * Fetches paginated messages for a chat
   * Returns: isLoadingMessages, messages, errorMessages
   * Example: const { isLoadingMessages, messages } = useChat.useMessages(123, {page: 1, limit: 20});
   */
  useMessages: (chatId, queryParams = {}, options = {}) => {
    const [searchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page")) || queryParams.page;
    const limit = parseInt(searchParams.get("limit")) || queryParams.limit;
    const isAdmin = searchParams.get("isAdmin") || queryParams.isAdmin;

    const mergedFilters = {
      ...queryParams,
      page,
      limit,
      isAdmin,
    };

    const query = useQuery({
      queryKey: ["chats", chatId, "messages", mergedFilters],
      queryFn: () => chatApi.getMessages(chatId, mergedFilters),
      enabled: !!chatId,
      staleTime: 30 * 1000, // 30 seconds - messages update frequently
      cacheTime: 2 * 60 * 1000,
      keepPreviousData: true,
      ...options,
    });

    return {
      isLoadingMessages: query.isLoading,
      messages: query.data,
      errorMessages: query.error,
      isErrorMessages: query.isError,
      refetchMessages: query.refetch,
      isFetchingMessages: query.isFetching,
      isPreviousData: query.isPreviousData,
    };
  },
};

export default useChat;

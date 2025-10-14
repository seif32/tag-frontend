import { api } from "./api";

const chatApi = {
  /**
   * 💬 CREATE NEW CHAT
   * Starts a new chat session for a user
   * Example: const chat = await chatApi.create({user_id: 42});
   */
  create: async (chatData, options = {}) => {
    if (!chatData.user_id) {
      throw new Error("User ID is required");
    }

    try {
      return await api.post("/chats", chatData, options);
    } catch (error) {
      console.error("Failed to create chat:", {
        data: chatData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 📥 GET ALL CHATS
   * Fetches paginated list of chats
   * Perfect for admin chat management, inbox pages
   * Example: const chats = await chatApi.getAll({page: 1, limit: 10});
   */
  getAll: async (queryParams = {}, options = {}) => {
    try {
      const params = new URLSearchParams();

      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);

      const queryString = params.toString();
      const url = `/chats${queryString ? `?${queryString}` : ""}`;

      return await api.get(url, options);
    } catch (error) {
      console.error("Failed to fetch chats:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 🎯 GET SINGLE CHAT BY ID
   * Fetches complete chat details
   * Great for chat detail pages, conversation views
   * Example: const chat = await chatApi.getById(123);
   */
  getById: async (id, options = {}) => {
    if (!id) {
      throw new Error("Chat ID is required");
    }

    try {
      return await api.get(`/chats/${id}`, options);
    } catch (error) {
      console.error(`Failed to fetch chat ${id}:`, error.details);
      throw error;
    }
  },

  /**
   * 📨 SEND MESSAGE IN CHAT
   * Posts a new message to an existing chat
   * Example: await chatApi.createMessage(123, {
   *   sender_id: 5,
   *   sender_type: 'user',
   *   message: 'Hello!'
   * });
   */
  createMessage: async (chatId, messageData, options = {}) => {
    if (!chatId) {
      throw new Error("Chat ID is required");
    }
    if (!messageData.sender_id) {
      throw new Error("Sender ID is required");
    }
    if (
      !messageData.sender_type ||
      !["user", "admin"].includes(messageData.sender_type)
    ) {
      throw new Error("Sender type must be 'user' or 'admin'");
    }
    if (!messageData.message || messageData.message.trim() === "") {
      throw new Error("Message cannot be empty");
    }

    try {
      return await api.post(`/chats/${chatId}/messages`, messageData, options);
    } catch (error) {
      console.error(`Failed to send message in chat ${chatId}:`, {
        data: messageData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 📬 GET MESSAGES FROM CHAT
   * Fetches paginated messages for a specific chat
   * Example: const messages = await chatApi.getMessages(123, {page: 1, limit: 20, isAdmin: false});
   */
  getMessages: async (chatId, queryParams = {}, options = {}) => {
    if (!chatId) {
      throw new Error("Chat ID is required");
    }

    try {
      const params = new URLSearchParams();

      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);
      if (queryParams.isAdmin !== undefined)
        params.append("isAdmin", queryParams.isAdmin);

      const queryString = params.toString();
      const url = `/chats/${chatId}/messages${
        queryString ? `?${queryString}` : ""
      }`;

      return await api.get(url, options);
    } catch (error) {
      console.error(`Failed to fetch messages for chat ${chatId}:`, {
        queryParams,
        error: error.details,
      });
      throw error;
    }
  },
};

export default chatApi;

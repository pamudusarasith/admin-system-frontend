import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// The WebSocket endpoint you configured in your Spring Boot backend
const WEBSOCKET_URL = 'http://localhost:8080/ws'

// The private topic that the backend will send user-specific notifications to
const NOTIFICATION_TOPIC = '/user/queue/notifications'

// --- ADDED ---: Define a type for our notification object for type safety
export interface Notification {
  title: string
  message: string
  link?: string
}

// --- ADDED ---: Define the type for the callback function
type NotificationCallback = (notification: Notification) => void

class WebSocketService {
  // --- MODIFIED ---: Properly type the stompClient property
  private stompClient: Client | null = null

  /**
   * Connects to the WebSocket server and subscribes to notifications.
   * @param authToken - The user's JWT token for authentication.
   * @param onNotificationReceived - A callback function to run when a notification arrives.
   */
  public connect(
    authToken: string,
    onNotificationReceived: NotificationCallback,
  ): void {
    // Avoid reconnecting if already connected or connecting
    if (this.stompClient && this.stompClient.active) {
      console.log('WebSocket client is already connected.')
      return
    }

    this.stompClient = new Client({
      // Use SockJS as the WebSocket factory for better browser compatibility
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),

      // These headers are sent on connection, this is how we authenticate!
      connectHeaders: {
        Authorization: `Bearer ${authToken}`,
      },

      // Set up heart-beating to keep the connection alive
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // Log connection events
      onConnect: () => {
        console.log('Successfully connected to WebSocket server.')

        // Subscribe to the user-specific notification topic
        this.stompClient?.subscribe(NOTIFICATION_TOPIC, (message) => {
          // When a message arrives, parse it and call the provided callback function
          const notification: Notification = JSON.parse(message.body)
          onNotificationReceived(notification)
        })
      },

      // Log errors
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message'])
        console.error('Additional details: ' + frame.body)
      },
    })

    // Start the connection
    this.stompClient.activate()
  }

  /**
   * Disconnects from the WebSocket server.
   */
  public disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate()
      console.log('Disconnected from WebSocket.')
    }
  }
}

// Export a single instance of the service so the whole app shares one connection
export const webSocketService = new WebSocketService()

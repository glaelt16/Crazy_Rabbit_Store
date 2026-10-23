import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  messages = signal<ChatMessage[]>([]);
  isOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen() && this.messages().length === 0) {
      this.messages.set([
        { role: 'assistant', content: 'Hi there! I am the Crazy Rabbit Apparel assistant. How can I help you today?' }
      ]);
    }
  }

  async sendMessage(content: string) {
    if (!content.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content };
    this.messages.update(msgs => [...msgs, userMessage]);
    this.isLoading.set(true);

    try {
      const response = await this.http.post<{ message: ChatMessage }>(
        `${environment.apiUrl}/chat`,
        { messages: this.messages().filter(m => m.role !== 'system') }
      ).toPromise();

      if (response && response.message) {
        this.messages.update(msgs => [...msgs, response.message]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      this.messages.update(msgs => [...msgs, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      this.isLoading.set(false);
    }
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

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

  initProactiveChat() {
    if (this.messages().length === 0) {
      setTimeout(() => {
        if (this.messages().length === 0) {
          this.messages.set([
            { role: 'assistant', content: 'Hi there! I am the Crazy Rabbit Apparel assistant. Do you need any help with our products and selection today?' }
          ]);
          this.isOpen.set(true);
        }
      }, 60000); // 1 minute delay before asking
    }
  }

  toggleChat() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen() && this.messages().length === 0) {
      this.messages.set([
        { role: 'assistant', content: 'Hi there! I am the Crazy Rabbit Apparel assistant. Do you need any help with our products and selection today?' }
      ]);
    }
  }

  async sendMessage(content: string) {
    if (!content.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content };
    this.messages.update(msgs => [...msgs, userMessage]);
    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<{ message: ChatMessage }>(
          `${environment.apiUrl}/chat`,
          { messages: this.messages().filter(m => m.role !== 'system') }
        )
      );

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

import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit, OnDestroy, Pipe, PipeTransform, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatBotService } from '../../core/services/chat-bot.service';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return marked.parse(value) as string;
  }
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.scss'
})
export class ChatBot implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  userInput: string = '';
  private inactivityTimer: any;

  constructor(public chatService: ChatBotService) {
    effect(() => {
      if (this.chatService.isOpen()) {
        this.resetInactivityTimer();
      } else {
        this.clearInactivityTimer();
      }
    });
  }

  ngOnInit() {
    this.chatService.initProactiveChat();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  ngOnDestroy() {
    this.clearInactivityTimer();
  }

  resetInactivityTimer() {
    this.clearInactivityTimer();
    if (this.chatService.isOpen()) {
      this.inactivityTimer = setTimeout(() => {
        this.chatService.isOpen.set(false);
      }, 10000);
    }
  }

  clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.chatService.sendMessage(this.userInput);
    this.userInput = '';
    this.resetInactivityTimer();
  }
}

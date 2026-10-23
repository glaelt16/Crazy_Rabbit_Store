import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatBotService } from '../../core/services/chat-bot.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.scss'
})
export class ChatBot implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  userInput: string = '';

  constructor(public chatService: ChatBotService) {}

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

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.chatService.sendMessage(this.userInput);
    this.userInput = '';
  }
}

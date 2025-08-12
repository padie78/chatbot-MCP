import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  inputMessage = '';
  private msgSub?: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.connect('http://localhost:3000'); // Cambia al URL de tu backend WS

    this.msgSub = this.chatService.onMessage().subscribe({
      next: (msg) => this.messages.push(msg),
      error: (err) => this.messages.push({ role: 'bot', content: 'Error: ' + err }),
    });
  }

  ngOnDestroy() {
    this.msgSub?.unsubscribe();
    this.chatService.disconnect();
  }

  send() {
    if (this.inputMessage.trim()) {
      this.messages.push({ role: 'user', content: this.inputMessage });
      this.chatService.sendMessage(this.inputMessage);
      this.inputMessage = '';
    }
  }
}

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket!: Socket;

  connect(url: string) {
    this.socket = io(url);

    this.socket.on('connect', () => {
      console.log('Conectado a WebSocket:', this.socket.id);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(message: string) {
    this.socket.emit('message', {
      title: 'chatMessage',
      emitName: 'message',
      body: message,
    });
  }

  onMessage(): Observable<ChatMessage> {
    return new Observable((observer) => {
      this.socket.on('answer', (data: { answer: string }) => {
        observer.next({ role: 'bot', content: data.answer });
      });

      this.socket.on('error', (err: any) => {
        observer.error(err);
      });
    });
  }
}

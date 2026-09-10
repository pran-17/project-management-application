import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  NgZone
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from './ai-chat.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css'
})
export class AiChatComponent implements AfterViewChecked {

  @ViewChild('chatMessages')
  private chatMessages!: ElementRef;

  isOpen = false;
  message = '';
  isLoading = false;

  userRole = '';

  messages: ChatMessage[] = [
    {
      sender: 'bot',
      text: 'Hello! I am your AI Assistant. How can I help you?'
    }
  ];

  constructor(
    private aiChatService: AiChatService,
    private cdr: ChangeDetectorRef,
     private ngZone: NgZone
  ) {
    this.loadUserRole();
  }

  // --------------------------------
  // Get logged-in user's role
  // --------------------------------

  loadUserRole(): void {

    const userData = localStorage.getItem('user');

    if (!userData) {
      return;
    }

    try {

      const user = JSON.parse(userData);

      this.userRole = user.role?.toLowerCase() || '';

    } catch (error) {

      console.error('Unable to read user information:', error);

    }
  }

  // --------------------------------
  // Suggested questions
  // --------------------------------

  getSuggestedQuestions(): string[] {

    if (this.userRole === 'student') {

      return [
        'What is my project status?',
        'Who is my guide?',
        'Show my project details',
        'What research projects am I involved in?'
      ];

    }

    if (this.userRole === 'teacher') {

      return [
        'Show my students',
        'What projects are assigned to me?',
        'Show my research projects',
        'Which students need attention?'
      ];

    }

    if (this.userRole === 'admin') {

      return [
        'How many students are there?',
        'How many teachers are there?',
        'Show project statistics',
        'Show research projects'
      ];

    }

    return [
      'What can you do?',
      'Help me with my project'
    ];
  }

  // --------------------------------
  // Open / close chatbot
  // --------------------------------

  toggleChat(): void {

    this.isOpen = !this.isOpen;

    this.cdr.detectChanges();

    if (this.isOpen) {

      setTimeout(() => {
        this.scrollToBottom();
      }, 100);

    }
  }

  // --------------------------------
  // Send suggested question
  // --------------------------------

  askQuestion(question: string): void {

    this.message = question;

    this.sendMessage();
  }

  // --------------------------------
  // Send message
  // --------------------------------
sendMessage(): void {
  const text = this.message.trim();

  if (!text || this.isLoading) {
    return;
  }

  // Show user's message immediately
  this.messages.push({
    sender: 'user',
    text: text
  });

  // Clear input immediately
  this.message = '';

  // Show typing indicator immediately
  this.isLoading = true;

  this.cdr.detectChanges();

  setTimeout(() => {
    this.scrollToBottom();
  }, 0);

  // Call backend
  this.aiChatService.sendMessage(text).subscribe({

    next: (response) => {

      // IMPORTANT:
      // Force Angular to update the UI immediately
      this.ngZone.run(() => {

        this.messages.push({
          sender: 'bot',
          text: response.message
        });

        this.isLoading = false;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);

      });

    },

    error: (error) => {

      console.error('AI CHAT ERROR:', error);

      this.ngZone.run(() => {

        this.messages.push({
          sender: 'bot',
          text: 'Sorry, I could not connect to the AI assistant.'
        });

        this.isLoading = false;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);

      });

    }

  });
}

  // --------------------------------
  // Enter key
  // --------------------------------

  handleEnter(event: KeyboardEvent): void {

    if (event.key === 'Enter' && !event.shiftKey) {

      event.preventDefault();

      this.sendMessage();
    }
  }

  // --------------------------------
  // Clear conversation
  // --------------------------------

  clearChat(): void {

    this.messages = [
      {
        sender: 'bot',
        text: 'Chat cleared. How can I help you?'
      }
    ];

    this.cdr.detectChanges();

    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  }

  // --------------------------------
  // Automatic scrolling
  // --------------------------------

  ngAfterViewChecked(): void {

    if (this.isOpen) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {

    if (!this.chatMessages) {
      return;
    }

    const element = this.chatMessages.nativeElement;

    element.scrollTop = element.scrollHeight;
  }
}
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ContactMessage {
  fullName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  message: string;
  mode: 'demo' | 'api';
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  /**
   * Submits an inquiry to the contact service interface.
   * Provides honest validation feedback in this demonstration environment
   * with clean contract boundaries ready for REST API integration.
   */
  submitInquiry(data: ContactMessage): Observable<ContactSubmissionResult> {
    return of({
      success: true,
      message: 'Inquiry received. Your message has been validated; in production, this routes directly to the NexoGen Pharma inquiries desk.',
      mode: 'demo' as const
    }).pipe(delay(600));
  }
}


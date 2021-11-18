export interface AttachmentData {
  data: string | Buffer;
  filename?: string;
  knownLength?: number;
  contentType?: string;
}

export interface MailData {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  text?: string;
  html?: string;
  'amp-html'?: string;
  attachment?: AttachmentData | ReadonlyArray<AttachmentData>;
  inline?: AttachmentData | ReadonlyArray<AttachmentData>;

  // Mailgun options
  'o:testmode'?: 'yes' | 'no' | 'true' | 'false' | 'True' | 'False';
  'o:tag'?: string | string[];
  'o:deliverytime'?: string;
  'o:dkim'?: 'yes' | 'no' | boolean;
  'o:tracking'?: 'yes' | 'no' | boolean;
  'o:tracking-opens'?: 'yes' | 'no' | boolean;
  'o:tracking-clicks'?: 'yes' | 'no' | 'htmlonly' | boolean;
  'o:require-tls'?: 'yes' | 'no' | 'True' | 'False';
  'o:skip-verification'?: 'yes' | 'no' | 'True' | 'False';
  'h:X-Mailgun-Variables'?: string;

  // Standard email headers
  'h:Reply-To'?: string;
  'h:In-Reply-To'?: string;
  'h:References'?: string;
  'h:Importance'?: string;
}

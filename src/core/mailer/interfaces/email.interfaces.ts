export type Headers = { [key: string]: string } | Array<{ key: string; value: string }>;

export interface AddressData {
  name: string;
  address: string;
}

export type Address = string | AddressData;

export type ContentLike = string | Buffer;

export interface Attachment {
  filename: string;
  content: ContentLike;
  contentId?: string;
  contentType?: string;
  contentDisposition?: 'attachment' | 'inline';
}

export interface EmailData {
  from?: Address;
  to?: Address | Address[];
  cc?: Address | Address[];
  bcc?: Address | Address[];
  replyTo?: Address;
  subject?: string;
  text?: ContentLike;
  html?: ContentLike;
  headers?: Headers;
  attachments?: Attachment[];
  date?: Date;
}

export type Email = EmailData & ({ text: ContentLike } | { html: ContentLike });

import { Address, AddressData, Attachment, Email } from 'src/core/mailer';
import {
  AttachmentData,
  MailData,
} from 'src/core/mailer/modules/mailgun/implementation/interfaces/mailgun-mail-data.interface';

export const addressDataToString = (addressData: AddressData): string => {
  if (addressData) return `${addressData.name} <${addressData.address}>`;
};

export const singleAddressToString = (address: Address): string => {
  if (typeof address === 'string') {
    return address;
  } else {
    return addressDataToString(address);
  }
};

export const addressToString = (address: Address | Address[]): string | string[] => {
  if (Array.isArray(address)) {
    return address.map(singleAddressToString);
  } else {
    return singleAddressToString(address);
  }
};

export const toAttachmentData = (attachment: Attachment): AttachmentData => {
  return {
    data: attachment.content,
    filename: attachment.filename,
    contentType: attachment.contentType,
  };
};

export const getAttachmentsByDisposition = (
  attachments: Attachment[]
): [attachment: Attachment[], inline: Attachment[]] => {
  const asInline: Attachment[] = [];
  const asAttachment: Attachment[] = [];

  for (let index = 0; index < attachments?.length; index++) {
    const currentAttachment = attachments[index];

    if (currentAttachment.contentDisposition === 'inline') {
      asInline.push(currentAttachment);
    } else {
      asAttachment.push(currentAttachment);
    }
  }

  return [asAttachment, asInline];
};

export const toMailgunMailData = (email: Partial<Email>): MailData => {
  const { from, to, cc, bcc, attachments, replyTo } = email;

  const mgFrom = singleAddressToString(from);
  const mgTo = addressToString(to);
  const mgCC = addressToString(cc);
  const mgBCC = addressToString(bcc);

  const mgReplyTo = singleAddressToString(replyTo);

  // Get attachments marked as inline in separate array
  const [asAttachment, asInline] = getAttachmentsByDisposition(attachments);

  const attachmentAttachments = asAttachment.map(toAttachmentData);
  const inlineAttachments = asInline.map(toAttachmentData);

  return {
    to: mgTo,
    from: mgFrom,
    cc: mgCC,
    bcc: mgBCC,
    subject: email.subject,
    text: email.text?.toString(),
    html: email.html?.toString(),
    attachment: attachmentAttachments,
    inline: inlineAttachments,
    'h:Reply-To': mgReplyTo,
  };
};

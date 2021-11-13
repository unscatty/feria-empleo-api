import { AttachmentData as SendgridAttachmentData } from '@sendgrid/helpers/classes/attachment';
import { EmailData as SendgridEmailData } from '@sendgrid/helpers/classes/email-address';
import { MailDataRequired } from '@sendgrid/mail';
import {
  Address as MailAddress,
  Attachment as MailAttachment,
  Email,
  Headers as MailHeaders,
} from 'src/core/mailer/interfaces/email.interfaces';

export const toSingleEmailData = (mailAddress: MailAddress): SendgridEmailData => {
  if (mailAddress) {
    if (typeof mailAddress === 'string') {
      return mailAddress;
    } else {
      return {
        name: mailAddress.name,
        email: mailAddress.address,
      };
    }
  }
};

export const toEmailData = (
  mailAddresses: MailAddress | MailAddress[]
): SendgridEmailData | SendgridEmailData[] => {
  if (Array.isArray(mailAddresses)) {
    return mailAddresses.map(toSingleEmailData);
  } else {
    return toSingleEmailData(mailAddresses);
  }
};

export const toAttachmentData = (attachment: MailAttachment): SendgridAttachmentData => {
  if (attachment) {
    return {
      filename: attachment.filename,
      // Sendgrid requires data to be base64 encoded
      content: attachment.content?.toString('base64'),
      type: attachment.contentType,
      disposition: attachment.contentDisposition,
      contentId: attachment.contentId,
    };
  }
};

export const toSendgridHeaders = (headers: MailHeaders): { [key: string]: string } => {
  if (headers) {
    if (Array.isArray(headers)) {
      return headers.reduce((acc, item) => (acc[item.key], acc[item.value]), {});
    } else {
      return headers;
    }
  }
};

const toSendgridMailData = (email: Partial<Email>): MailDataRequired => {
  const { to, cc, bcc, from, replyTo, date, attachments, headers } = email;

  const sgFrom = toSingleEmailData(from);
  const sgReplyTo = toSingleEmailData(replyTo);

  const sgTo = toEmailData(to);
  const sgCC = toEmailData(cc);
  const sgBCC = toEmailData(bcc);

  const sgAttachments = attachments?.map(toAttachmentData);
  const sgHeaders = toSendgridHeaders(headers);

  return {
    from: sgFrom,
    subject: email.subject,
    to: sgTo,
    cc: sgCC,
    bcc: sgBCC,
    replyTo: sgReplyTo,
    text: email.text?.toString(),
    html: email.html?.toString(),
    attachments: sgAttachments,
    sendAt: date?.getTime(),
    headers: sgHeaders,
  };
};

export default toSendgridMailData;

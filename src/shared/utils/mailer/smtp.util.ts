import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Attachment, Email } from 'src/core/mailer/interfaces/email.interfaces';

type NodeMailerAttachment = ISendMailOptions['attachments'][0];

export const toAttachment = (attachment: Attachment): NodeMailerAttachment => {
  if (attachment) {
    return {
      filename: attachment.filename,
      cid: attachment.contentId,
      content: attachment.content,
      contentType: attachment.contentType,
    };
  }
};

const toSMTPMailData = (email: Partial<Email>): ISendMailOptions => {
  const smtpAttachments = email.attachments?.map(toAttachment);

  return { ...email, attachments: smtpAttachments };
};

export default toSMTPMailData;

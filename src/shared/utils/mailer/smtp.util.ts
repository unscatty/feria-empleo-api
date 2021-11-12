import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Attachment } from 'src/core/mailer/interfaces/email.interfaces';

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

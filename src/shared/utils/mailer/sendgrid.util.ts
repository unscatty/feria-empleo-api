import { AttachmentData as SendgridAttachmentData } from '@sendgrid/helpers/classes/attachment';
import { EmailData as SendgridEmailData } from '@sendgrid/helpers/classes/email-address';
import {
  Address as MailAddress,
  Attachment as MailAttachment,
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
      content: attachment.content?.toString(),
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

export class sendMailDto {
  to: string[];
  bcc?: string[];
  cc?: string[];
  subject: string;
  html: string;
  data: any;
}

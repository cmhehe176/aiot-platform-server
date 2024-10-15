const footerMail = {
  title: 'AIot Platform - Hust',
  telephone: '0899999999',
  url: '#',
  iurl: 'http://www.google.com',
};

export const SourceMailForgotPassword = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="background: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset Request</div>
        
        <div>Dear {{name}},</div>
        
        <div style="margin-top: 10px;">You have requested to reset your password for your account. Please click the link below to reset your password:</div>
        <br>
				<a href="{{link}}" style="color: #007BFF; text-decoration: none;">Click to reset password</a>

        <div style="margin-top: 10px;">If you did not request this, please ignore this email. Your password will remain unchanged.</div>
        
        <div style="margin-top: 10px; font-weight: bold;">Note: This link is valid for 30 minutes. After 30 minutes, it will be deactivated.</div>
        
        <div style="margin-top: 20px;">Thank you!</div>

        <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
            <div>--------------------------------------</div>
            <div style="font-weight: bold;">${footerMail.title}</div>
            <div>TEL: ${footerMail.telephone} </div>
            <div>URL: <a href="${footerMail.url}" style="color: #007BFF; text-decoration: none;">${footerMail.iurl}</a></div>
            <div>--------------------------------------</div>
        </div>
    </div>
</div>
`;

export const SourceMailSupport = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="background: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Thank You for Your Support Request</div>
        
        <div>Dear {{name}},</div>
        
        <div style="margin-top: 10px;">Thank you for using our services. We have received your request for support and truly appreciate your feedback on this matter. We will get back to you as soon as possible.</div>
        
        <div style="margin-top: 10px;">Please note that we will be reviewing your request and responding shortly.</div>
        
        <div style="margin-top: 10px;">If you have any further questions, feel free to contact us in our website.</div>
        
        <div style="margin-top: 20px;">Thank you for your patience!</div>

        <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
            <div style="font-weight: bold;">${footerMail.title}</div>
            <div>TEL: ${footerMail.telephone} </div>
            <div>URL: <a href="${footerMail.url}" style="color: #007BFF; text-decoration: none;">${footerMail.iurl}</a></div>
        </div>
    </div>
</div>
`;

export const SourceMailSupportReply = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="font-size: 22px; font-weight: bold; color: #007BFF; margin-bottom: 20px;">Thank You for Contacting Support</div>
        
        <div style="font-size: 16px; margin-bottom: 10px;">Dear {{name}},</div>

        <div style="margin: 20px 0; font-size: 16px; line-height: 1.8;">
            We have received your support request and would like to thank you for reaching out. Below are the details of your submission:
        </div>
        
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 14px; margin-bottom: 20px;">
            <strong>Title:</strong> {{title}}<br>
            <strong>Description:</strong> {{description}}<br>
            <strong style="padding-top: 10px;">Reply:</strong> {{reply}}<br>
            <strong>Handled By:</strong> {{admin}}<br>
            <strong>Last Updated:</strong> {{updatedAt}}<br>
        </div>

        <div style="font-size: 16px; margin: 20px 0;">
            Thank you for your patience as we review your case. Our team is committed to providing you with a prompt and thorough response. Please rest assured that we are working diligently to resolve your issue as quickly as possible.
        </div>
        
        <div style="font-size: 16px; margin-top: 10px;">
            Should you need further assistance or have additional questions, feel free to reach out through our website. We are always here to help.
        </div>
        
        <div style="font-size: 16px; margin-top: 20px;">We appreciate your understanding and continued support.</div>

        <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 14px; color: #666;">
            <div style="font-weight: bold; margin-bottom: 5px;">${footerMail.title}</div>
            <div>TEL: <a href="tel:${footerMail.telephone}" style="color: #007BFF; text-decoration: none;">${footerMail.telephone}</a></div>
            <div>Website: <a href="${footerMail.url}" style="color: #007BFF; text-decoration: none;">${footerMail.iurl}</a></div>
        </div>
    </div>
</div>
`;

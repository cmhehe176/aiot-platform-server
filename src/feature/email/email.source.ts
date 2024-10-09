export const SourceMailForgotPassword = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="background: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset Request</div>
        
        <div>Dear {{name}},</div>
        
        <div style="margin-top: 10px;">You have requested to reset your password for your account. Please click the link below to reset your password:</div>
        <br>
				<a href="{{link}}" style="color: #007BFF; text-decoration: none;">Click to reset password</a>

        <div style="margin-top: 10px;">If you did not request this, please ignore this email. Your password will remain unchanged.</div>
        
        <div style="margin-top: 20px;">Thank you!</div>

        <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
            <div>--------------------------------------</div>
            <div>AIot Platform - Hust</div>
            <div>TEL: 0899999999 </div>
            <div>URL: <a href="#" style="color: #007BFF; text-decoration: none;">http://www.google.com</a></div>
            <div>--------------------------------------</div>
        </div>
    </div>
</div>
`;

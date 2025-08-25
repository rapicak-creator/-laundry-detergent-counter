// api/send-email.js
 import { Resend } from 'resend';
 
 const resend = new Resend(process.env.RESEND_API_KEY);
 const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
 
 export default async function handler(req, res) {
   if (req.method !== 'POST') {
     return res.status(405).json({ error: 'Method not allowed' });
   }
 
   const { type, remaining, to } = req.body;
 
   // 簡単なメールアドレスのバリデーション
   if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
     return res.status(400).json({ error: 'Invalid recipient email address' });
   }
 
   const subject = type === "半分"
     ? "【部屋干しスーパークリーン】洗剤の残量が半分になりました"
     : "【部屋干しスーパークリーン】洗剤の残りが少なくなっています";
 
   const primaryColor = '#4CAF50'; // 例：ブランドのメインカラー
   const backgroundColor = '#f4f4f4';
 
   const html = `
     <!DOCTYPE html>
     <html lang="ja">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>${subject}</title>
       <style>
         body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: ${backgroundColor}; color: #333; }
         .container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
         .header { color: ${primaryColor}; font-size: 28px; font-weight: bold; margin-bottom: 20px; text-align: center; }
         .content { margin-bottom: 25px; font-size: 16px; }
         .strong { font-weight: bold; color: ${primaryColor}; }
         .recommendation { background-color: #e0f7fa; padding: 15px; border-radius: 4px; margin-top: 20px; border: 1px solid #b2ebf2; font-size: 14px; }
         .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; }
         @media screen and (max-width: 480px) {
           .container { padding: 20px; margin: 10px auto; }
           .header { font-size: 24px; }
           .content { font-size: 15px; }
         }
       </style>
     </head>
     <body>
       <div class="container">
         <div class="header">${subject}</div>
         <div class="content">
           <p>いつも「部屋干しスーパークリーン」をご利用いただきありがとうございます。</p>
           <p>現在の洗剤の残量は、<span class="strong">${remaining}回分</span>です。</p>
           <p>残り少なくなってきましたので、お早めの補充をおすすめいたします。</p>
         </div>
         <div class="recommendation">
           <p>快適な洗濯を続けるために、ぜひ補充をご検討ください。</p>
         </div>
         <div class="footer">
           <p>本メールは自動送信されています。</p>
           <p>© [あなたの会社名] All rights reserved.</p>
         </div>
       </div>
     </body>
     </html>
   `;
 
   try {
     const data = await resend.emails.send({
       from: FROM_EMAIL,
       to: to,
       subject: subject,
       html: html,
       text: `「部屋干しスーパークリーン」の残りはあと${remaining}回分です。補充をおすすめします。（HTML形式で表示できない場合にご覧ください）`, // プレーンテキスト版
     });
 
     console.log('Email sent successfully:', data);
     return res.status(200).json({ message: 'Email sent', data });
   } catch (error) {
     console.error('Error sending email:', error);
     return res.status(500).json({ error: error.message || 'Failed to send email' });
   }
 }

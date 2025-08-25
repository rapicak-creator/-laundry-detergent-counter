// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, remaining, to } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // HTMLメールの本文を作成します
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
    .header { font-size: 28px; font-weight: bold; color: #4CAF50; text-align: center; }
    .content { margin-top: 20px; }
    .content p { font-size: 16px; }
    .highlight { color: #D32F2F; font-weight: bold; }
    .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }
    .button { display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .button:hover { background-color: #45a049; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">洗剤の残量のお知らせ</div>
    <div class="content">
      <p>「部屋干しスーパークリーン」の残りはあと<strong class="highlight">${remaining}回分</strong>です。</p>
      <p>補充をおすすめします。</p>
      <a href="https://laundry-detergent-counter.vercel.app/" class="button">今すぐ補充する</a>
    </div>
    <div class="footer">
      <p>これは自動送信メールです。</p>
    </div>
  </div>
</body>
</html>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to,
      subject: type === "半分"
        ? "洗剤の残量が半分になりました"
        : "洗剤の残りが少なくなっています",
      // textプロパティの代わりにhtmlプロパティを使用
      html: emailHtml,
    }),
  });

  if (response.ok) {
    res.status(200).json({ message: "Email sent" });
  } else {
    const error = await response.json();
    res.status(500).json({ error });
  }
}



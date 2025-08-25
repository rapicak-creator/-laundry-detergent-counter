// /api/send-email.js

// --- 設定項目 ---
// このセクションで、メールの送信元やAPIキー、洗剤の名前などを一元管理します。
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "notification@your-domain.com"; // Resendで設定した送信元メールアドレス
const DETERGENT_NAME = "部屋干しスーパークリーン";

/**
 * 通知タイプに応じたメールの件名と本文を生成します。
 * @param {string} type - 通知の種類 ('半分' または '残りわずか')
 * @param {number} remaining - 洗剤の残り回数
 * @returns {{subject: string, html: string}}
 */
const createEmailContent = (type, remaining) => {
  const subjectMapping = {
    '半分': `【お知らせ】${DETERGENT_NAME}の残量が半分になりました`,
    '残りわずか': `【要確認】${DETERGENT_NAME}の残量が残りわずかです`,
  };

  const subject = subjectMapping[type] || `【お知らせ】${DETERGENT_NAME}について`;
  const remainingColor = type === '残りわずか' ? '#d9534f' : '#f0ad4e'; // 残りわずかなら赤、半分ならオレンジ

  const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
        .header { background-color: #007bff; color: #ffffff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 32px; color: #343a40; line-height: 1.7; }
        .content p { margin: 0 0 16px; }
        .highlight { font-size: 28px; font-weight: bold; color: ${remainingColor}; }
        .footer { background-color: #f1f3f5; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>洗剤残量のお知らせ</h1>
        </div>
        <div class="content">
          <p>お使いの「${DETERGENT_NAME}」の残量についてお知らせします。</p>
          <p>現在の残りは</p>
          <p style="text-align:center;">
            <span class="highlight">約 ${remaining} 回分</span>
          </p>
          <p>です。お早めの補充をおすすめします。</p>
        </div>
        <div class="footer">
          <p>このメールはシステムから自動的に送信されています。</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};

/**
 * APIリクエストを処理するメインのハンドラ関数
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', 'POST').json({ error: 'Method Not Allowed' });
  }

  try {
    const { type, remaining, to } = req.body;

    // リクエストボディの必須項目を検証
    if (!type || !remaining || !to) {
      return res.status(400).json({ error: 'Missing required fields: type, remaining, to' });
    }

    const { subject, html } = createEmailContent(type, remaining);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ message: "Email sent successfully" });
    } else {
      // Resend APIからのエラーレスポンスをそのままクライアントに返す
      const errorData = await response.json();
      return res.status(response.status).json({ error: 'Failed to send email', details: errorData });
    }

  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

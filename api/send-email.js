// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, remaining, to } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // HTMLメールテンプレートの構築（メールクライアント互換性を考慮）
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>洗剤残量のお知らせ</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc; -webkit-text-size-adjust: 100%;">
      <table role="presentation" width="100%" style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- ヘッダーセクション -->
        <tr>
          <td style="padding: 24px 32px; background: linear-gradient(to right, #f0f9ff, #e0f2fe); border-bottom: 1px solid #dbeafe;">
            <table role="presentation" width="100%">
              <tr>
                <td style="vertical-align: middle;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background: #0ea5e9; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-weight: bold; font-size: 18px;">💧</span>
                    </div>
                    <h1 style="margin: 0; font-size: 20px; color: #0c4a6e; font-weight: 700;">部屋干しスーパークリーン</h1>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- メインコンテンツ -->
        <tr>
          <td style="padding: 32px;">
            <div style="margin-bottom: 24px;">
              <h2 style="color: ${type === "半分" ? '#0c4a6e' : '#92400e'}; font-size: 22px; margin: 0 0 16px 0; font-weight: 700; line-height: 1.4;">
                ${type === "半分" 
                  ? "✨ 洗剤の残量が半分になりました" 
                  : "⚠️ 洗剤の残りが少なくなっています"}
              </h2>
              
              <p style="font-size: 16px; margin: 0 0 20px 0;">
                「<strong style="color: #0c4a6e;">部屋干しスーパークリーン</strong>」の残りはあと<strong style="color: #f59e0b; font-weight: 700;">${remaining}回分</strong>です。
              </p>
              
              <!-- 警告カード -->
              <div style="background: #fff8e6; border-left: 3px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; font-weight: 600; color: #92400e; display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 20px;">🔔</span> 補充をおすすめします
                </p>
              </div>
              
              <!-- プログレスバー -->
              <div style="background: #e2e8f0; border-radius: 20px; height: 12px; margin: 24px 0; overflow: hidden;">
                <div style="background: ${type === "半分" ? '#3b82f6' : '#f59e0b'}; height: 100%; border-radius: 20px; width: ${type === "半分" ? '50%' : '20%'};"></div>
              </div>
              
              <p style="font-size: 14px; color: #64748b; margin: 0;">
                残量: <strong>${remaining}回分</strong> / 満タン: 30回分
              </p>
            </div>
            
            <!-- CTAボタン -->
            <div style="text-align: center; margin: 32px 0 24px;">
              <a href="https://example.com/replenish" 
                 style="display: inline-block; background: #0ea5e9; color: white; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 8px; font-size: 16px; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(14, 165, 233, 0.25);"
                 onmouseover="this.style.background='#0d94d3'; this.style.boxShadow='0 4px 6px rgba(14, 165, 233, 0.3)';"
                 onmouseout="this.style.background='#0ea5e9'; this.style.boxShadow='0 2px 4px rgba(14, 165, 233, 0.25)';">
                補充キットを注文する →
              </a>
            </div>
            
            <!-- フッターセクション -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px; color: #64748b; font-size: 14px;">
              <p style="margin: 0 0 12px 0;">
                このメールは自動送信です。ご質問やお困りの場合は
                <a href="https://example.com/contact" style="color: #0ea5e9; text-decoration: none;">お問い合わせページ</a> よりご連絡ください。
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © 2023 部屋干しスーパークリーン. All rights reserved.<br>
                〒100-0005 東京都千代田区丸の内1-9-2
              </p>
            </div>
          </td>
        </tr>
      </table>
      
      <!-- モバイル最適化用 -->
      <div style="max-width: 600px; margin: 0 auto; padding: 0 16px; font-size: 12px; color: #94a3b8; text-align: center; margin-top: 12px;">
        <p style="margin: 8px 0;">このメールはスマートフォンでも最適表示されます</p>
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
      from: "noreply@super-clean.example.com",
      to,
      subject: type === "半分" 
        ? "【重要】洗剤の残量が半分になりました" 
        : "【補充推奨】洗剤の残りが少なくなっています",
      text: `「部屋干しスーパークリーン」の残りはあと${remaining}回分です。補充をおすすめします。`,
      html: htmlContent,
    }),
  });

  if (response.ok) {
    res.status(200).json({ message: "Email sent successfully" });
  } else {
    const error = await response.json();
    console.error("Email send failed:", error);
    res.status(500).json({ 
      error: "Failed to send email", 
      details: error 
    });
  }
}

// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, remaining, to } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // HTMLメールの本文を作成します
  const emailHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ja">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>洗剤の残量のお知らせ</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* クライアント固有のスタイルリセット */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* 基本スタイル */
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      background-color: #f8fafc;
      color: #334155;
    }
    
    /* Outlookのための特別なスタイル */
    .ExternalClass {
      width: 100%;
    }
    
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }
    
    /* メインコンテナ */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* ユーティリティクラス */
    .text-center {
      text-align: center;
    }
    
    .text-left {
      text-align: left;
    }
    
    .bg-white {
      background-color: #ffffff;
    }
    
    .bg-light {
      background-color: #f1f5f9;
    }
    
    .bg-success {
      background-color: #10b981;
    }
    
    .bg-warning {
      background-color: #f59e0b;
    }
    
    .bg-error {
      background-color: #ef4444;
    }
    
    .text-white {
      color: #ffffff;
    }
    
    .text-dark {
      color: #0f172a;
    }
    
    .text-gray {
      color: #64748b;
    }
    
    .text-success {
      color: #10b981;
    }
    
    .text-warning {
      color: #f59e0b;
    }
    
    .text-error {
      color: #ef4444;
    }
    
    .text-primary {
      color: #0ea5e9;
    }
    
    .text-sm {
      font-size: 14px;
    }
    
    .text-base {
      font-size: 16px;
    }
    
    .text-lg {
      font-size: 18px;
    }
    
    .text-xl {
      font-size: 20px;
    }
    
    .text-2xl {
      font-size: 24px;
    }
    
    .text-3xl {
      font-size: 30px;
    }
    
    .text-4xl {
      font-size: 36px;
    }
    
    .font-bold {
      font-weight: bold;
    }
    
    .p-sm {
      padding: 8px;
    }
    
    .p-md {
      padding: 16px;
    }
    
    .p-lg {
      padding: 24px;
    }
    
    .py-sm {
      padding-top: 8px;
      padding-bottom: 8px;
    }
    
    .py-md {
      padding-top: 16px;
      padding-bottom: 16px;
    }
    
    .py-lg {
      padding-top: 24px;
      padding-bottom: 24px;
    }
    
    .px-sm {
      padding-left: 8px;
      padding-right: 8px;
    }
    
    .px-md {
      padding-left: 16px;
      padding-right: 16px;
    }
    
    .px-lg {
      padding-left: 24px;
      padding-right: 24px;
    }
    
    .mt-sm {
      margin-top: 8px;
    }
    
    .mt-md {
      margin-top: 16px;
    }
    
    .mt-lg {
      margin-top: 24px;
    }
    
    .mb-sm {
      margin-bottom: 8px;
    }
    
    .mb-md {
      margin-bottom: 16px;
    }
    
    .mb-lg {
      margin-bottom: 24px;
    }
    
    .border-bottom {
      border-bottom: 1px solid #e2e8f0;
    }
    
    .border-top {
      border-top: 1px solid #e2e8f0;
    }
    
    .border-left {
      border-left: 4px solid;
    }
    
    .rounded {
      border-radius: 8px;
    }
    
    .rounded-full {
      border-radius: 9999px;
    }
    
    .shadow {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    /* ボタンスタイル */
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #0ea5e9;
      color: #ffffff !important;
      font-weight: bold;
      text-decoration: none;
      border-radius: 6px;
      mso-padding-alt: 0;
      text-underline-color: #0ea5e9;
    }
    
    /* Outlook用のボタン修正 */
    .msoBtnFix {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    
    .msoBtnFix a {
      border: 1px solid #0ea5e9;
    }
    
    /* 残量表示用の円形スタイル - テーブルベース */
    .circle-container {
      width: 180px;
      height: 180px;
      margin: 0 auto;
      border-collapse: separate;
    }
    
    /* メッセージボックス */
    .message-box {
      padding: 16px;
      margin: 24px 0;
      text-align: left;
      border-radius: 4px;
    }
    
    /* レスポンシブ対応 */
    @media screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
      }
      
      .stack-column,
      .stack-column-center {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        direction: ltr !important;
      }
      
      .stack-column-center {
        text-align: center !important;
      }
      
      .circle-container {
        width: 150px !important;
        height: 150px !important;
      }
      
      .text-4xl {
        font-size: 32px !important;
      }
    }
  </style>
</head>
<body>
  <center style="width: 100%; background-color: #f8fafc; padding: 20px 0;">
    <!-- メール全体のコンテナ -->
    <div class="email-container">
      <!-- ヘッダー -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 12px 12px 0 0; overflow: hidden;">
        <tr>
          <td class="bg-success text-white text-center p-lg" style="background: linear-gradient(135deg, #10b981, #2E7D32);">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
              <span style="font-size: 1.5em; vertical-align: middle;">🧺</span> 洗剤の残量のお知らせ
            </h1>
          </td>
        </tr>
      </table>
      
      <!-- メインコンテンツ -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff;">
        <!-- 製品情報 -->
        <tr>
          <td class="text-center p-lg border-bottom">
            <p class="text-lg font-bold mb-md">
              <span style="color: #0369a1;">「部屋干しスーパークリーン」</span>の残量状況
            </p>
          </td>
        </tr>
        
        <!-- 残量表示 -->
        <tr>
          <td class="text-center p-lg">
            <p class="text-base mb-sm">現在の残り回数</p>
            
            <!-- 円形の残量表示 -->
            <table class="circle-container" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 50%;">
              <tr>
                <td class="text-center" style="height: 180px; vertical-align: middle;">
                  <div>
                    <p style="font-size: 56px; font-weight: 700; line-height: 1; margin: 0; color: ${parseInt(remaining) <= 3 ? '#ef4444' : (parseInt(remaining) <= 5 ? '#f59e0b' : '#10b981')}">
                      ${remaining}
                    </p>
                    <p style="font-size: 18px; font-weight: 600; margin: 4px 0 0 0;">
                      回分
                    </p>
                    <p style="font-size: 12px; color: #64748b; margin: 8px 0 0 0;">
                      ※1回の使用量：22ml
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- メッセージ -->
        <tr>
          <td class="p-lg">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="message-box" style="background-color: ${parseInt(remaining) <= 3 ? 'rgba(239, 68, 68, 0.08)' : (parseInt(remaining) <= 5 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)')}; border-left: 4px solid ${parseInt(remaining) <= 3 ? '#ef4444' : (parseInt(remaining) <= 5 ? '#f59e0b' : '#10b981')}">
              <tr>
                <td class="p-md">
                  <p style="margin: 0;">
                    ${parseInt(remaining) <= 3 ? '⚠️ 洗剤が残りわずかです。早めの補充をおすすめします。' : (parseInt(remaining) <= 5 ? '📝 そろそろ補充のタイミングです。次回のお買い物リストに加えましょう。' : '✓ まだ十分な量が残っています。')}
                  </p>
                </td>
              </tr>
            </table>
            
            <p class="text-center mt-md mb-lg">スムーズな洗濯ライフを続けるために、計画的な補充をおすすめします。</p>
      
      <!-- フッター -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 0 0 12px 12px; overflow: hidden;">
        <tr>
          <td class="bg-light text-center p-md" style="border-top: 1px solid #e2e8f0;">
            <p style="font-size: 20px; color: #0ea5e9; margin-bottom: 8px;">📧</p>
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              これは自動送信メールです。ご不明な点がございましたら、返信しないでください。
            </p>
          </td>
        </tr>
      </table>
    </div>
  </center>
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





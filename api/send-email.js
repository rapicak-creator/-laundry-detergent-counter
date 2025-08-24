// api/send-email.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, remaining, status } = req.body;

  // メールのHTMLテンプレート
  const generateEmailHTML = (remaining, status) => {
    const getStatusColor = () => {
      if (status === 'critical') return '#f87171';
      if (status === 'low') return '#facc15';
      return '#38bdf8';
    };

    const getStatusText = () => {
      if (status === 'critical') return '緊急';
      if (status === 'low') return '注意';
      return '正常';
    };

    const getStatusMessage = () => {
      if (status === 'critical') return '洗剤がもうすぐなくなります！';
      if (status === 'low') return '洗剤の残量が少なくなってきました';
      return '洗剤の残量に余裕があります';
    };

    const getActionButtonText = () => {
      if (status === 'critical') return '今すぐ購入';
      if (status === 'low') return '購入を検討';
      return '在庫を確認';
    };

    const getActionButtonColor = () => {
      if (status === 'critical') return '#ef4444';
      if (status === 'low') return '#eab308';
      return '#0ea5e9';
    };

    return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detergent Pal 通知</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'M PLUS Rounded 1c', sans-serif; background: linear-gradient(135deg, #f0f9ff, #f5f3ff);">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);">
        <!-- ヘッダー -->
        <div style="background: linear-gradient(135deg, #38bdf8, #a78bfa); padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">🧼 Detergent Pal</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">あなたの洗濯パートナー</p>
        </div>

        <!-- メインコンテンツ -->
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 80px; height: 80px; background: ${getStatusColor()}; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 36px; color: white;">${status === 'critical' ? '⚠️' : status === 'low' ? '🔔' : '✅'}</span>
            </div>
            <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">${getStatusMessage()}</h2>
            <p style="color: #64748b; font-size: 16px; margin: 0;">現在の残り回数: <strong style="color: ${getStatusColor()}; font-size: 20px;">${remaining}回</strong></p>
            <span style="display: inline-block; background: ${getStatusColor()}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 12px;">${getStatusText()}</span>
          </div>

          <!-- 情報カード -->
          <div style="background: rgba(241, 245, 249, 0.6); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <h3 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">📊 使用状況</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <span style="color: #64748b;">使用済み</span>
              <span style="color: #1e293b; font-weight: 700;">${83 - remaining}回</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <span style="color: #64748b;">残り</span>
              <span style="color: ${getStatusColor()}; font-weight: 700;">${remaining}回</span>
            </div>
            <div style="background: #e2e8f0; border-radius: 8px; height: 8px; overflow: hidden;">
              <div style="background: ${getStatusColor()}; height: 100%; width: ${((83 - remaining) / 83) * 100}%;"></div>
            </div>
          </div>

          <!-- アクションボタン -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://your-store-url.com" style="display: inline-block; background: ${getActionButtonColor()}; color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.2s;">${getActionButtonText()}</a>
          </div>

          <!-- フッター -->
          <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 24px;">
            <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px 0;">Detergent Palはあなたの洗濯をサポートします</p>
            <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
              このメールは自動的に送信されています。<br>
              ご質問がある場合は support@detergent-pal.com までお問い合わせください。
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  };

  try {
    const msg = {
      to,
      from: {
        email: process.env.FROM_EMAIL,
        name: 'Detergent Pal'
      },
      subject: `【${subject}】洗剤残量通知`,
      html: generateEmailHTML(remaining, status),
      trackingSettings: {
        clickTracking: {
          enable: false
        },
        openTracking: {
          enable: false
        }
      }
    };

    await sgMail.send(msg);
    res.status(200).json({ success: true, message: 'メールを送信しました' });
  } catch (error) {
    console.error('メール送信エラー:', error);
    res.status(500).json({ error: 'メール送信に失敗しました', details: error.message });
  }
}

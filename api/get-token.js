const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = (req, res) => {
    // تفعيل السماح بالوصول من أي تطبيق (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // البيانات الخاصة بحسابك في أجورا
    const appId = '0cca4db1d0fb490fbda15219660bd04d';
    const appCertificate = '3be93e5929ff40ce9dba3e267448342f';

    // استقبال اسم القناة من التطبيق تلقائياً عبر الرابط
    const channelName = req.query.channel;

    if (!channelName) {
        return res.status(400).json({ error: 'اسم القناة (channel) مطلوب في الرابط!' });
    }

    const uid = 0; // دخول تلقائي للمستخدمين
    const role = RtcRole.PUBLISHER; // وضع البث
    
    // حساب وقت الصلاحية (ساعة كاملة من لحظة الطلب)
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    try {
        // توليد التوكن الرسمي والمعتمد من سيرفرات أجورا 100%
        const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
        
        // إرسال التوكن النظيف للتطبيق فوراً
        return res.status(200).json({ token: token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


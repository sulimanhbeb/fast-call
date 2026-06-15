const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = (req, res) => {
    // السماح بالوصول من أي تطبيق
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // بيانات حسابك الثابتة في أجورا
    const appId = '0cca4db1d0fb490fbda15219660bd04d';
    const appCertificate = '3be93e5929ff40ce9dba3e267448342f';

    // جلب اسم الغرفة من الرابط
    const channelName = req.query.channel;

    if (!channelName) {
        return res.status(400).send('اسم القناة مطلوب!');
    }

    const uid = 0; 
    const role = RtcRole.PUBLISHER; 
    
    // صلاحية التوكن (ساعة كاملة)
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    try {
        // توليد التوكن الرسمي 100%
        const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
        
        // إرسال التوكن كنص صافي (Plain Text) لتسهيل استلامه في سكتشوير
        return res.status(200).send(token);
    } catch (error) {
        return res.status(500).send('خطأ في السيرفر: ' + error.message);
    }
};


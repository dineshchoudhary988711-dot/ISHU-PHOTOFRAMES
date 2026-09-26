const crypto=require('crypto');
module.exports=async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body||{};
 if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature) return res.status(400).json({verified:false});
 const secret=process.env.RAZORPAY_KEY_SECRET;
 if(!secret) return res.status(500).json({verified:false,error:'Payment configuration missing'});
 const expected=crypto.createHmac('sha256',secret).update(razorpay_order_id+'|'+razorpay_payment_id).digest('hex');
 const a=Buffer.from(expected),b=Buffer.from(String(razorpay_signature));
 const verified=a.length===b.length&&crypto.timingSafeEqual(a,b);
 return res.status(verified?200:400).json({verified});
}
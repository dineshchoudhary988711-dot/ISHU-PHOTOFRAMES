module.exports = async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 try{
  const {amount,product}=req.body||{};
  const rupees=Number(amount);
  if(!Number.isFinite(rupees)||rupees<1) return res.status(400).json({error:'Invalid amount'});
  const key=process.env.RAZORPAY_KEY_ID, secret=process.env.RAZORPAY_KEY_SECRET;
  if(!key||!secret) return res.status(500).json({error:'Payment configuration missing'});
  const auth=Buffer.from(key+':'+secret).toString('base64');
  const rr=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{'Authorization':'Basic '+auth,'Content-Type':'application/json'},body:JSON.stringify({amount:Math.round(rupees*100),currency:'INR',receipt:'ishu_'+Date.now(),notes:{product:String(product||'Photo Frame')}})});
  const data=await rr.json();
  if(!rr.ok) return res.status(502).json({error:data?.error?.description||'Razorpay order failed'});
  return res.status(200).json({id:data.id,amount:data.amount,currency:data.currency,key_id:key});
 }catch(e){return res.status(500).json({error:'Unable to create payment order'})}
}
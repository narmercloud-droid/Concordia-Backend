const http = require('http');
function get(u){
  return new Promise((res, rej)=>{
    http.get(u, r=>{
      let d='';
      r.on('data', c=>d+=c);
      r.on('end', ()=>{
        try{res(JSON.parse(d))}catch(e){res({raw:d})}
      });
    }).on('error', e=>rej(e));
  });
}

(async ()=>{
  try{
    const orderId = process.argv[2] || 'a31e9f96-275a-4099-b402-c2074415e735';
    const orderResp = await get('http://127.0.0.1:4000/track/order/'+orderId);
    const token = orderResp && orderResp.tracking_token;
    if(!token) {
      console.error(JSON.stringify({error:'No tracking token found',orderResp}));
      process.exit(2);
    }
    const trackResp = await get('http://127.0.0.1:4000/track/'+token);
    const timeline = Array.isArray(trackResp.timeline) ? trackResp.timeline : [];
    const timelineExists = Array.isArray(trackResp.timeline);
    const noNullTimestamps = timeline.every(e=>e.timestamp!=null);
    const timestamps = timeline.map(e=>new Date(e.timestamp).getTime());
    const sortedAsc = timestamps.every((t,i,arr)=> i===0 || t>=arr[i-1]);
    const firstIsCreated = timeline.length>0 && (timeline[0].event === 'created');
    const seen = new Set();
    let duplicates = false;
    for(const e of timeline){
      const key = (e.event || '') + '|' + (e.timestamp || '');
      if(seen.has(key)){ duplicates = true; break; }
      seen.add(key);
    }
    const statusMatchesLast = (trackResp.order && timeline.length>0) ? (trackResp.order.status === timeline[timeline.length-1].event) : null;
    const result = {
      order: { id: orderId, tracking_token: token, status: orderResp.status },
      timeline,
      checks: { timelineExists, sortedAsc, firstIsCreated, noNullTimestamps, duplicates, statusMatchesLast },
      errors: []
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }catch(err){
    console.error(JSON.stringify({error: err.message, stack: err.stack}));
    process.exit(1);
  }
})();

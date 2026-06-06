const fs=require('fs');
const s=fs.readFileSync('docs/openapi/openapi.yaml','utf8');
const lines=s.split('\n');
const ops=[];
for(let i=0;i<lines.length;i++){
  const l=lines[i];
  const m=l.match(/^\s{4}(get|post|put|patch|delete|head|options):\s*$/);
  if(m){
    const method=m[1];
    let j=i+1; let has2xx=false; let end=false;
    while(j<lines.length){
      const lj=lines[j];
      if(/^\s{4}(get|post|put|patch|delete|head|options):\s*$/.test(lj) || /^\s{2}\/.*:\s*$/.test(lj)) break;
      if(/^[\s\"]*200[\"\s]*:/.test(lj)) { has2xx=true; break; }
      j++;
    }
    ops.push({line:i+1,method,has2xx});
  }
}
const no2xx=ops.filter(o=>!o.has2xx);
console.log('operations checked:',ops.length,'without 2xx:',no2xx.length);
console.log(no2xx.slice(0,50));

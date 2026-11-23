// 自動で24試合を進め、エラーが出ないか・一画面（390x700）に収まるかを確かめる。使い方: node tools/smoke.js
const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:700}});
  const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+require('path').join(__dirname,'..','index.html'));
  const results=[];const presets=['soku','mamori','wana','kin'];
  for(let g=0;g<24;g++){
    if(g%6===0){
      await p.click('[data-act=go-builder]');
      await p.click(`[data-act=preset][data-key=${presets[(g/6)%4]}]`);
      await p.click('[data-act=go-menu]');
    }
    await p.click('[data-act=go-ability]');
    const abs=await p.$$('[data-act=pick-ability]');
    await abs[g%5].click();
    for(let i=0;i<120;i++){
      if(await p.$('.modal h2'))break;
      const ph=await p.evaluate(()=>G.phase);
      if(ph==='select'){
        if(Math.random()<0.15&&await p.$('[data-act=ability]'))await p.click('[data-act=ability]');
        const hs=await p.$$('[data-act=hand]:not(.off)');
        if(Math.random()<0.3){await p.click('[data-act=burn]');const all=await p.$$('[data-act=hand]');if(all.length)await all[Math.floor(Math.random()*all.length)].click();}
        const hs2=await p.$$('[data-act=hand]:not(.off)');
        if(!hs2.length||Math.random()<0.1){await p.click('[data-act=pass]');continue}
        const idx=Math.floor(Math.random()*hs2.length);
        await hs2[idx].click();
        const again=(await p.$$('.card.sel'))[0];
        if(again)await again.click();
      }else if(ph==='after'){
        const o=(await p.$('[data-act=after-surikae]'))||(await p.$('[data-act=after-funbari]'));
        await ((o&&Math.random()<0.6)?o:await p.$('[data-act=after-skip]')).click();
      }else if(ph==='swap'){
        const hs=await p.$$('[data-act=hand]:not(.off)');
        if(hs.length)await hs[0].click();else await p.click('[data-act=swap-cancel]');
      }else if(ph==='result'){
        if(await p.$('[data-act=next]'))await p.click('[data-act=next]');
      }
    }
    results.push(await p.evaluate(()=>[G.over&&G.over.winner,G.turn,G.gauge,G.cpuDeck]));
    await p.click('[data-act=go-menu]');
  }
  // 画面確認用：数手進めたところ
  await p.click('[data-act=go-ability]');
  await (await p.$$('[data-act=pick-ability]'))[0].click();
  await p.click('[data-act=pass]');
  await p.click('[data-act=next]');
  const hs=await p.$$('[data-act=hand]:not(.off)');
  if(hs.length)await hs[0].click();
  await p.screenshot({path:require('os').tmpdir()+'/fusefuda-select.png'});
  if(hs.length)await (await p.$$('.card.sel'))[0].click();
  const ph=await p.evaluate(()=>G.phase);if(ph==='after')await p.click('[data-act=after-skip]');
  await p.screenshot({path:require('os').tmpdir()+'/fusefuda-result.png'});
  console.log(JSON.stringify(results));
  const w={p:0,c:0,n:0};results.forEach(r=>w[r[0]||'n']++);
  console.log('wins',JSON.stringify(w),'avgTurns',(results.reduce((a,r)=>a+r[1],0)/results.length).toFixed(1));
  console.log('FIT',await p.evaluate(()=>[document.documentElement.scrollHeight,innerHeight]));
  console.log('ERRS',JSON.stringify(errs));
  await b.close();
})();

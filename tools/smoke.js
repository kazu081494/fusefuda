// 自動で25試合を進め、エラーが出ないか・一画面（390x700）に収まるかを確かめる。使い方: node tools/smoke.js
const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:700}});
  const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+require('path').join(__dirname,'..','index.html'));
  // 最初に開いたときは序章が出るので、タップして進める
  if(await p.$('[data-act=prologue-end]'))await p.click('[data-act=prologue-end]');
  const results=[];const presets=['soku','mamori','hono','wana','kin'];
  for(let g=0;g<25;g++){
    if(g%5===0){
      await p.click('[data-act=go-builder]');
      await p.click(`[data-act=preset][data-key=${presets[(g/5)%5]}]`);
      await p.click('[data-act=go-menu]');
    }
    await p.click('[data-act=go-school]');
    await (await p.$$('[data-act=pick-ougi]'))[g%11].click();
    await p.click('[data-act=start-game]');
    for(let i=0;i<120;i++){
      if(await p.$('.modal h2'))break;
      const ph=await p.evaluate(()=>G.phase);
      // 相手の奥義やカットインで画面が描き直されると、押そうとした札が消えることがある。そのときはやり直す
      if(ph==='select')try{
        if(Math.random()<0.15&&await p.$('[data-act=ougi]'))await p.click('[data-act=ougi]');
        if(Math.random()<0.3){await p.click('[data-act=burn]');const all=await p.$$('[data-act=hand]');if(all.length){await all[Math.floor(Math.random()*all.length)].click();if(Math.random()<0.6){await p.click('[data-act=commit]');continue}}}
        const hs2=await p.$$('[data-act=hand]:not(.off)');
        if(!hs2.length){  // 出せる札が無い：燃やす（それもできなければ「何もできない」）
          if(await p.$('[data-act=pass]')){await p.click('[data-act=pass]',{timeout:2000});continue}
          await p.click('[data-act=burn]');const all=await p.$$('[data-act=hand]:not(.off)');if(all.length){await all[0].click();await p.click('[data-act=commit]',{timeout:2000})}continue}
        const idx=Math.floor(Math.random()*hs2.length);
        await hs2[idx].click();
        const again=(await p.$$('.card.sel'))[0];
        if(again)await again.click({timeout:2000});
      }catch(e){if(!/not attached|Timeout/.test(e.message))throw e}
      else if(ph==='result'){
        if(await p.$('[data-act=next]'))await p.click('[data-act=next]');
      }
    }
    results.push(await p.evaluate(()=>[G.over&&G.over.winner,G.turn,G.gauge,G.p.kata+'/'+G.p.ougi,G.c.kata+'/'+G.c.ougi]));
    await p.click('[data-act=go-menu]');
  }
  // 画面確認用：数手進めたところ
  await p.click('[data-act=go-school]');
  await p.click('[data-act=start-game]');
  await p.click('[data-act=burn]');await (await p.$$('[data-act=hand]:not(.off)'))[0].click();await p.click('[data-act=commit]');
  await p.click('[data-act=next]');
  const hs=await p.$$('[data-act=hand]:not(.off)');
  if(hs.length)await hs[0].click();
  await p.screenshot({path:require('os').tmpdir()+'/fusefuda-select.png'});
  if(hs.length)await (await p.$$('.card.sel'))[0].click();
  await p.screenshot({path:require('os').tmpdir()+'/fusefuda-result.png'});
  console.log(JSON.stringify(results));
  const w={p:0,c:0,n:0};results.forEach(r=>w[r[0]||'n']++);
  console.log('wins',JSON.stringify(w),'avgTurns',(results.reduce((a,r)=>a+r[1],0)/results.length).toFixed(1));
  console.log('FIT',await p.evaluate(()=>[document.documentElement.scrollHeight,innerHeight]));
  console.log('ERRS',JSON.stringify(errs));
  await b.close();
})();

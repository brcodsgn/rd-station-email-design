# Snippets do editor de e-mail do RD (BEE)

Rode com `javascript_tool` na aba `/email/<id>/edit`, ~7 s depois de carregar.

## 1. Achar a API do BEE
`window.__beePluginInstances` só expõe `create/destroy`. A instância com `load/save` está na árvore React do container:

```js
const el=document.getElementById('bee-plugin-container'); let f=el[Object.keys(el).find(k=>k.startsWith('__reactFiber'))]; let d=0; window.__beeApi=null;
function scan(v,seen,k){ if(!v||typeof v!=='object'||seen.has(v)||k>4) return; seen.add(v);
 if(typeof v.load==='function'&&typeof v.save==='function'&&typeof v.loadRows==='function'){window.__beeApi=v; return}
 for(const x of Object.keys(v).slice(0,50)){try{scan(v[x],seen,k+1)}catch(e){}} }
while(f&&d<40&&!window.__beeApi){ const s=new Set(); let h=f.memoizedState,i=0; while(h&&i<30){scan(h.memoizedState,s,0);h=h.next;i++} scan(f.memoizedProps,s,0); f=f.return; d++ }
!!window.__beeApi
```
A API some ao recarregar a página: rode de novo.

## 2. Ler o JSON atual
O BEE roda em iframe e devolve o JSON por `postMessage` quando você chama `save()` (o RD também grava — inofensivo se nada mudou):

```js
window.__msgs=[]; addEventListener('message',e=>{try{const t=typeof e.data==='string'?e.data:JSON.stringify(e.data); if(t.includes('onSave')) __msgs.push(t)}catch(x){}});
__beeApi.save(); await new Promise(r=>setTimeout(r,4000));
window.__orig=JSON.parse(JSON.parse(__msgs[__msgs.length-1]).args[0]);
__orig.page.rows.map((r,i)=>i+': '+r.columns.map(c=>c.modules.map(m=>m.type.split('-').pop()).join(',')).join(' | '))
```
Ao devolver dados para você, remova URLs com query string (`.replace(/https?:[^"]*/g,'URL')`) — senão o retorno é bloqueado.

## 3. Copiar modelos de outro e-mail (mesma origem)
No e-mail-base: `localStorage.setItem('__base', JSON.stringify(__orig))`. No e-mail novo: `window.__orig=JSON.parse(localStorage.getItem('__base')); localStorage.removeItem('__base')`.

## 4. Injetar o script de montagem
```js
let i=document.getElementById('rdb-loader'); if(!i){i=document.createElement('input');i.type='file';i.id='rdb-loader';
i.setAttribute('aria-label','rdb loader');i.style.cssText='position:fixed;left:0;top:0;width:10px;height:10px;opacity:.01;z-index:99999';
document.body.appendChild(i);i.addEventListener('change',async()=>{window.__code=await i.files[0].text()})} 'ok'
```
`find` "rdb loader file input" → `file_upload` com o `.js` → `(0,eval)(window.__code)`. Rode `node --check arquivo.js` antes (erros de colchete são comuns em arrays de linhas).

## 5. Aplicar e salvar
`__beeApi.load(N)` (só canvas) → conferir → `__beeApi.save()` → aguardar ~6 s → recarregar e conferir.

## Formato (o essencial)
- `page.body.container.style['background-color']` = fundo externo; `page.rows[]`.
- Linha: `type` (`one-column-empty`, `two-columns-empty`, `three-columns-empty`), `container.style` (faixa externa), `content.style` (fundo, `background-image:url('...')`, `border-radius`, paddings, `width:'600px'`), `content.computedStyle` (`verticalAlign`, `rowColStackOnMobile`, `rowReverseColStackOnMobile`).
- Coluna: `grid-columns` (soma 12), `style` (fundo, bordas, paddings), **`mobileStyle`** (paddings no celular), `modules[]`.
- Texto (`mailup-bee-newsletter-modules-text`): `descriptor.text.html` (`<div class="txtTinyMce-wrapper">…<p>`), `descriptor.style` (paddings), **`descriptor.mobileStyle`**.
- Imagem: `descriptor.image` (`src`, `width`/`height` reais em px, `alt`, `href`, **`percWidth`**), `descriptor.computedStyle.class` (`center autowidth` ou `center fixedwidth` + `width:'110px'`).
- Botão: `descriptor.button.label` (html), `href`, `style` (cor, raio, paddings, bordas).
- Ao clonar, troque sempre o `uuid` (`crypto.randomUUID()`).

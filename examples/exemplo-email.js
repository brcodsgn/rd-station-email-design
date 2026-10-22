// Exemplo de montagem (estrutura real, conteúdo genérico). Requer window.__orig (JSON de um e-mail finalizado da
// campanha, com linhas de logo, hero, CTA e rodapé) e window.__beeApi. Troque <ID_DA_CONTA>, arquivos, textos e cores.
// Já inclui as correções de mobile (column.mobileStyle zerado, descriptor.mobileStyle, image.percWidth:100).
(()=>{
const O=__orig, R=O.page.rows, C=x=>JSON.parse(JSON.stringify(x)), U=()=>crypto.randomUUID();
const all=[]; R.forEach(r=>r.columns.forEach(c=>c.modules.forEach(m=>all.push(m))));
const T=t=>all.find(m=>m.type.endsWith('-'+t));
const tText=T('text'), tImg=T('image');
const row1c=R.find(r=>r.columns.length===1), row2c=R.find(r=>r.columns.length===2)||row1c;
const FONT="'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif";
const S3='https://email-editor-production.s3.amazonaws.com/images/<ID_DA_CONTA>/';
const pad=p=>({'padding-top':p[0]+'px','padding-right':p[1]+'px','padding-bottom':p[2]+'px','padding-left':p[3]+'px'});
function text(html,o){o=Object.assign({pad:[0,24,0,24],color:'#FFFFFF',size:15,lh:160,align:'left'},o||{});
 const m=C(tText); m.uuid=U(); const lhpx=Math.round(o.lh/100*o.size);
 m.descriptor.style=pad(o.pad); m.descriptor.mobileStyle=pad(o.pad);
 m.descriptor.text.style={color:o.color,'font-family':FONT,'line-height':o.lh+'%'};
 m.descriptor.text.computedStyle={linkColor:'#4FB3E0'};
 m.descriptor.text.html='<div class="txtTinyMce-wrapper" style="font-size:'+o.size+'px;line-height:'+lhpx+'px;text-align:'+o.align+';">'+html+'</div>';
 return m}
function pic(file,w,h,alt,o){o=Object.assign({pad:[0,0,0,0]},o||{}); const m=C(tImg); m.uuid=U();
 Object.assign(m.descriptor.image,{src:S3+file,width:w+'px',height:h+'px',alt:alt,href:'',percWidth:100});
 m.descriptor.style=Object.assign({},m.descriptor.style||{},pad(o.pad),{width:'100%','border-radius':'0px'});
 m.descriptor.mobileStyle=pad(o.pad);
 m.descriptor.computedStyle=Object.assign({},m.descriptor.computedStyle||{},{class:'center autowidth',width:(600-o.pad[1]-o.pad[3])+'px'});
 return m}
function row(cols,o){o=Object.assign({bg:'#071E33',cpad:[0,0,0,0],valign:'top',stack:true},o||{});
 const r=C(cols.length===1?row1c:row2c); r.uuid=U();
 r.type=['','one-column-empty','two-columns-empty','three-columns-empty'][cols.length];
 r.container.style={'background-color':'transparent','background-image':'none','background-position':'top left','background-repeat':'no-repeat'};
 Object.assign(r.content.style,{'background-color':o.bg,'background-image':'none','border-radius':'0px',width:'600px'},pad(o.cpad));
 r.content.computedStyle=Object.assign({},r.content.computedStyle,{verticalAlign:o.valign,rowColStackOnMobile:o.stack,rowReverseColStackOnMobile:false});
 const base=C((row2c.columns||row1c.columns)[0]);
 r.columns=cols.map(cc=>{const c=C(base); c.uuid=U(); c['grid-columns']=cc[0];
  c.style=Object.assign({},c.style,{'background-color':cc[2]||'transparent','padding-top':'0px','padding-bottom':'0px','padding-left':'0px','padding-right':'0px','border-top':cc[3]||'0px solid transparent','border-left':cc[4]||'0px solid transparent','border-right':cc[5]||'0px solid transparent','border-bottom':cc[6]||'0px solid transparent'}); c.mobileStyle={'padding-top':'0px','padding-right':'0px','padding-bottom':'0px','padding-left':'0px'}; c.modules=cc[1]; return c});
 return r}
const p=(t,s)=>'<p style="margin:0;'+(s||'')+'">'+t+'</p>';
const GAP='6px solid #071E33';
function stat(n,l){return text(p('<strong>'+n+'</strong>','font-size:19px;line-height:23px;color:#4FB3E0;white-space:nowrap;')+p(l,'margin-top:6px;font-size:13px;line-height:19px;color:#D6ECF6;'),{pad:[20,14,22,16]})}
const chip=(t,on)=>'<span style="display:inline-block;border:1px solid #4FB3E0;border-radius:20px;padding:6px 12px;font-size:12px;font-weight:800;letter-spacing:1px;'+(on?'background-color:#4FB3E0;color:#071E33;':'color:#FFFFFF;')+'">'+t+'</span>';
const arrow='<span style="color:#4FB3E0;font-size:15px;"> &rarr; </span>';
const ck=t=>p('<span style="color:#4FB3E0;"><strong>&#10003;</strong></span>&nbsp;&nbsp;'+t,'margin-bottom:10px;font-size:15px;line-height:23px;padding-left:22px;text-indent:-22px;');
const hero=C(R[1]); hero.uuid=U(); const hm=hero.columns[0].modules[0]; hm.uuid=U();
Object.assign(hm.descriptor.image,{src:S3+'hero.jpg',width:'1200px',height:'675px',alt:'Título do hero (texto dentro da imagem)',href:''});
const ctaRow=R.find(r=>r.columns[0].modules.some(m=>m.type.endsWith('-button')));
const cta=C(ctaRow); cta.uuid=U();
cta.columns[0].modules.forEach(m=>{m.uuid=U(); if(m.type.endsWith('-button')){m.descriptor.button.label='<div class="txtTinyMce-wrapper"><p style="word-break:break-word;"><strong>Texto do botão</strong></p></div>'; m.descriptor.button.href='';}});
Object.assign(cta.content.style,{'background-color':'#071E33','border-radius':'0px 0px 20px 20px'});
const iBtn=cta.columns[0].modules.findIndex(m=>m.type.endsWith('-button'));
cta.columns[0].modules.splice(iBtn+1,0,text(p('Referência: Autor A, Autor B. Título do estudo. Revista. Ano;vol:pág.','font-size:11px;line-height:17px;color:#8FA6B8;'),{pad:[0,24,24,24],size:11}));
const rows=[
 C(R[0]), hero,
 row([[12,[text(p('<em><strong>Título do estudo em destaque</strong></em>','font-size:19px;line-height:26px;')+p('Parágrafo de apresentação do estudo, com <strong>trecho em destaque</strong>.','margin-top:16px;color:#BFD6E4;'),{pad:[44,24,24,24]})]]]),
 row([[4,[stat('Dado 1','descrição do dado 1')],'#0B2E4A','3px solid #4FB3E0','0px solid transparent',GAP,GAP],[4,[stat('Dado 2','descrição do dado 2')],'#0B2E4A','3px solid #4FB3E0',GAP,GAP,GAP],[4,[stat('Dado 3','descrição do dado 3')],'#0B2E4A','3px solid #4FB3E0',GAP,'0px solid transparent',GAP]],{cpad:[0,24,38,24]}),
 row([[12,[text(p('<strong>Título da seção de evidência</strong>','font-size:26px;line-height:32px;')+p(chip('ETAPA 1')+arrow+chip('ETAPA 2')+arrow+chip('ETAPA 3',true),'margin-top:18px;line-height:34px;')+p('A avaliação por ultrassom confirmou a <strong>presença do ácido hialurônico na região glútea aos 12 meses</strong>.','margin-top:20px;color:#D6ECF6;')+p('No acompanhamento realizado em duas pacientes aos <strong>20 meses</strong>, o ácido hialurônico continuava sendo identificado na região, embora em menor quantidade.','margin-top:12px;color:#D6ECF6;'),{pad:[44,24,24,24]}),pic('figura-1.jpg',1200,431,'Descrição da figura 1',{pad:[0,24,44,24]})]]],{bg:'#0B3A5C'}),
 row([[12,[text(p('<strong>Mensagem de destaque da campanha.</strong>','font-size:19px;line-height:26px;'),{pad:[30,24,30,24],color:'#071E33'})]]],{bg:'#4FB3E0'}),
 row([[12,[text(p('<strong>Resultados</strong>','font-size:26px;line-height:32px;')+p('Introdução da lista:','margin:6px 0 16px;color:#BFD6E4;')+ck('Item 1;')+ck('Item 2;')+ck('Item 3.'),{pad:[44,24,20,24]}),pic('figura-2.jpg',1200,558,'Descrição da figura 2',{pad:[8,24,12,24]})]]]),
 cta, C(R[R.length-1])
];
rows[0].uuid=U(); rows[rows.length-1].uuid=U();
const N=C(O); N.page.rows=rows; window.__new=N; __beeApi.load(N); return 'loaded '+rows.length;
})()

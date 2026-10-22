---
name: rd_station_email_marketing
description: Cria e-mails marketing (campanhas de 1 ou mais disparos) e monta como e-mail NATIVO no editor de e-mail do RD Station Marketing (editor BEE), operando o Chrome do usuário já logado. Cobre briefing → design system → imagens no Magnific → preview HTML para aprovação → montagem em módulos editáveis (texto, imagem, botão, linhas) via API do BEE → ajuste mobile → salvar e verificar. Use sempre que o usuário quiser criar, diagramar, "subir", "montar" ou ajustar um e-mail marketing / e-mail de campanha no RD Station, mesmo sem citar "BEE" ou "módulos".
---

# E-mail marketing nativo no RD Station (editor BEE)

Objetivo: e-mail **editável pela equipe** (módulos nativos do editor), **fiel ao design aprovado** e **bom no celular**. Leia `references/armadilhas.md` antes de montar — tudo ali já deu problema real. `references/bee-api.md` tem os snippets do editor. `examples/exemplo-email.js` é uma montagem completa (conteúdo genérico).

## 0. Pré-requisitos e limites
- **Claude in Chrome** (carregue numa ToolSearch: `tabs_context_mcp, navigate, computer, find, javascript_tool, file_upload, read_network_requests, browser_batch, tabs_close_mcp, resize_window`). Se a extensão cair, use `list_connected_browsers` + `select_browser` e peça para o usuário reabrir o painel.
- Usuário **logado no RD no Chrome**. Nunca faça login.
- Imagens geradas: conector do **Magnific** (`images_generate`, `creations_wait`, `creations_request_upload`/`finalize_upload` para referências locais).
- **Não dá para subir arquivo no gerenciador de imagens do e-mail** (iframe `app.getbee.io`, outro domínio). O usuário sobe; você confere (passo 5).
- Envio/agendamento do e-mail é ação externa: nunca faça. Só salvar.

## 1. Briefing → texto final
- Separe **texto de comunicação** de **orientação ao designer**. Frases como "A ideia aqui é…", "Podemos trazer…", "Trazer como destaque…", "Dar bastante destaque…", "Criar uma leitura visual…", "Se tivermos disponível…", "Importante evitar…" são orientação: **não entram no e-mail**.
- Header, títulos de dados, itens de lista, CTA e frases redigidas como copy entram **palavra por palavra** (mesma pontuação). Não invente eyebrows, etiquetas, subtítulos nem parágrafos de apoio.
- O campo "Conteúdo" é ambíguo (às vezes é copy, às vezes orientação). **Pergunte** quando não for óbvio — o usuário já pediu as duas coisas em e-mails diferentes.
- Ao final, compare o texto do e-mail com o briefing frase a frase.

## 2. Design system (uma vez por campanha)
- Extraia do material da marca: paleta (tokens), tipografia (fonte oficial + alternativa web, ex.: fonte da marca → Montserrat → Arial), elementos gráficos, logos.
- Publique como página de referência (artifact) e mantenha os arquivos em `assets/`.
- Depois que a equipe ajustar os primeiros e-mails no RD, **abra a pré-visualização deles** (`/emails/preview?email_id=<id>`) e siga o padrão final deles nos próximos (ex.: cor de fundo, logo fora do card, card arredondado, hero com título dentro da imagem).

## 3. Imagens (Magnific)
- Gere 2 opções por imagem (`count:2`), proporção certa (hero 16:9 ou 2:1; fotos de região 4:5), sempre `no text` e com "empty space on the left for text" quando o título for sobreposto.
- Produto fiel: suba a foto da embalagem como referência (`creations_request_upload` → PUT com curl → `creations_finalize_upload`) e cite "from the first reference image". O modelo pode distorcer letras da embalagem — avise.
- Filtro de conteúdo do Magnific: descrever partes do corpo diretamente costuma ser recusado. Descreva roupa, pose e enquadramento ("athletic woman in leggings, three-quarter back view, cropped from waist to mid-thigh").
- Monte uma folha de contato (Chrome headless) para escolher; otimize para 1200px de largura JPG (~80–170 KB).
- **Títulos dentro da imagem (hero)**: renderize HTML + Chrome headless (`--screenshot`), com gradiente escuro à esquerda, caps bold e palavra de destaque em ciano. Confira se o texto não encosta no produto.
- Elementos que quebram no mobile (chips, setas, linhas do tempo, legendas sobre foto, áreas demarcadas no corpo) → **vire imagem** (mesmo processo).
- **Nunca gere** imagens que pareçam exame, microscopia ou antes/depois de paciente. Use as figuras reais do estudo/material: extraia o PDF com `scripts/pdf-para-png.swift` (PDFKit, sem dependências), recorte com `sips -c h w --cropOffset y x` e adicione legendas embaixo (ex.: os rótulos de tempo ou de etapa de cada figura). Imagem ilustrativa de algo citado como real → avise que deve ser trocada.

## 3b. Converter para WebP (antes de enviar ao usuário)
- Toda imagem final (hero, fotos, figuras, imagens com texto) vai em **.webp**: largura 2× a exibida (1200px para largura total, ~1104px para largura de texto), alvo ≤ 100 KB (fundos e heros até ~150 KB).
- Sem `cwebp` no Mac e o `sips` não grava WebP: use `scripts/webp/` (encoder do próprio Chrome). Coloque os originais em `<pasta>/orig/`, crie `<pasta>/lista.json` (`{"arquivo.jpg":[1200,100]}`), rode `python3 scripts/webp/servidor.py <pasta>` e abra `http://127.0.0.1:4322/converter.html` no Chrome; os arquivos saem em `<pasta>/webp/` com `resumo.json`.
- Compare original × WebP lado a lado (folha de contato) antes de enviar; texto dentro da imagem não pode ficar borrado (suba a qualidade se ficar).
- Mantenha o mesmo nome-base (`hero.webp`) e use esses arquivos no preview, no envio ao usuário e na verificação do passo 5.
- Atenção: o Outlook para Windows (desktop) não exibe WebP. Se a base tiver muitos leitores Outlook, avise o usuário e mantenha o JPG/PNG.

## 4. Preview HTML para aprovação
- E-mail em HTML de tabelas, 600px, estilos inline, um único sistema de margens (ex.: 24 ou 36px), botão "bulletproof".
- Publique como artifact (mesmo arquivo = mesmo link) e renderize localmente para revisar (Chrome headless). O teste mobile local sem viewport meta é enganoso — o mobile real se confere no editor do RD.
- Só monte no RD depois do "aprovado".

## 5. Imagens no RD
- Envie os arquivos ao usuário (`SendUserFile`) com os nomes finais e peça para subir no gerenciador do e-mail.
- Confira: `curl https://email-editor-production.s3.amazonaws.com/images/<conta>/<arquivo>` → 200 e bytes iguais ao local. A conta aparece nas URLs de imagens do próprio e-mail.
- Se o RD renomear (ex.: `image-1792683518598`) e não achar a URL: monte o módulo com imagem provisória e peça para o usuário usar **Trocar imagem** nele; depois leia o JSON para confirmar.

## 6. Montar no RD (editor BEE)
1. O usuário duplica um e-mail e passa `/email/<id>/edit`. Abra numa aba sua.
2. Pegue a API do BEE e o JSON atual (`references/bee-api.md`). Se o duplicado não tiver os módulos-modelo (texto, imagem, botão, linhas de 1/2 colunas, rodapé), copie o JSON de um e-mail finalizado da campanha via `localStorage` (snippet no bee-api.md).
3. Escreva a montagem num `.js` do projeto (fonte da verdade, reaplicável), clonando módulos do JSON: `text()`, `pic()`, `row()`, reaproveitando linhas da equipe (logo do topo, linha do CTA com banner, rodapé). Base: `examples/exemplo-email.js`.
4. Injete com o loader de arquivo (`file_upload` no input criado) e `(0,eval)(window.__code)` → `__beeApi.load(N)`.
5. Confira desktop e **mobile** no próprio editor (botão de celular ao lado do de desktop, ~x270,y77) com `zoom`.
6. `__beeApi.save()` → recarregue o editor ou a pré-visualização e confirme (textos com `innerText`, imagens com `naturalWidth`). Só diga "salvo" depois disso.

## 7. Ajustes depois (a equipe também edita)
- **Sempre** leia o JSON atual antes de mexer; altere só o módulo necessário e preserve o resto.
- Texto estranho que você não colocou (ex.: frase duplicada de outro bloco) → pergunte antes de remover.
- Diálogo "Leave site?" na sua aba = há alteração não salva (pode ser do usuário na mesma aba). Leia o JSON e salve; não force a navegação.
- Conexão caiu no meio de uma ação → verifique o estado (pré-visualização/JSON) antes de repetir.

## 8. Entrega
Resuma: o que foi montado (linhas/módulos), o que virou imagem, o que foi verificado e como, o que **não** foi verificado (celular real, envio de teste), pendências (link do CTA, imagem real a trocar). Feche as abas que abriu.

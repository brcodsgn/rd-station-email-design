# Armadilhas (todas aconteceram de verdade)

## Texto
| Sintoma | Causa | Solução |
|---|---|---|
| Usuário reclama de texto "que não estava no briefing" | Eyebrows, subtítulos e parágrafos inventados para "completar" o layout | Só texto do briefing. Rótulos de seção do briefing ("BLOCO 1 – ESTUDO") não viram texto |
| Frase de orientação apareceu no e-mail | "Aqui queremos…", "A ideia é…" lidos como copy | Tratar como orientação; perguntar quando ambíguo |
| Item encurtado ou CTA em caixa alta | Edição "para caber" | Manter exatamente; ajustar o layout, não o texto |

## Mobile (o principal problema)
| Sintoma | Causa | Solução |
|---|---|---|
| Textos com margens enormes / coluna estreita no celular | **Coluna** clonada com `mobileStyle` padding 50px (modelo da equipe) | Zerar `column.mobileStyle` nas linhas novas |
| Margem lateral diferente entre desktop e celular | `descriptor.mobileStyle` do módulo-modelo (ex.: 0px laterais) | Sempre gravar `mobileStyle` = mesmos paddings do `style` |
| Imagens minúsculas no celular | `image.percWidth` herdado do logo (20) | `percWidth:100` nas imagens de conteúdo |
| Logo ocupando a largura toda | Faltou largura fixa | `computedStyle:{class:'center fixedwidth',width:'110px'}` e `style.width:'110px'` |
| Chips/botões contornados quebrando, espaços enormes | Linha de 2 colunas empilha e cada botão vira um bloco | Virar texto corrido ("A + B + C") ou **imagem**; ou `rowColStackOnMobile:false` |
| Palavra quebrada no meio ("PERFORMANC/E") | `word-break:break-word` + título grande em coluna estreita | Tirar `word-break` e reduzir título (18–22px) |
| Linha do tempo com chips e setas desalinhada | HTML inline com `inline-block` | Renderizar como imagem (2× a largura do texto, mesmo fundo da seção) |
| `resize_window` não simula celular na pré-visualização | Janela não diminui abaixo de um mínimo | Conferir no botão de celular do editor |

## Imagens e upload
| Sintoma | Causa | Solução |
|---|---|---|
| Não acha input de arquivo no gerenciador | Iframe `app.getbee.io` (outro domínio) | Usuário sobe; você verifica por URL |
| URL dá 403 | Arquivo ainda não subiu ou o RD renomeou (`image-<timestamp>`) | Módulo com imagem provisória + usuário usa "Trocar imagem" |
| Magnific recusa ("NSFW") | Prompt descrevendo corpo diretamente | Descrever roupa, pose e enquadramento |
| Imagem "de microscopia/antes e depois" gerada por IA | — | Proibido apresentar como real; usar figuras do estudo e avisar quando algo é ilustrativo |
| Fundo com imagem deixa texto ilegível | Imagem clara atrás do texto | Escurecer (camada da cor de fundo ~60% via Chrome headless) |
| Sem Pillow/poppler na máquina | — | `sips` (resize/crop/convert), Chrome headless (composição), Swift + PDFKit (PDF) |

## Editor e salvamento
| Sintoma | Causa | Solução |
|---|---|---|
| `__beeApi is not defined` | Página recarregou | Rodar o snippet de busca de novo |
| Retorno do `javascript_tool` bloqueado | URL com query string ou base64 no texto devolvido | Limpar URLs antes de retornar |
| "Leave site?" ao navegar | Alteração não salva na sua aba (às vezes feita pelo usuário nela) | Ler JSON, `save()`, depois navegar. Não forçar |
| Conexão com o Chrome caiu no meio | Extensão desconectou | `list_connected_browsers`/`select_browser`; checar estado antes de repetir |
| Aba "não está no grupo" | Grupo de abas da sessão mudou | `navigate` sem `tabId` cria aba nova no grupo |
| E-mail duplicado veio quase vazio | Equipe duplicou um modelo, não o último e-mail | Copiar modelos de um e-mail final via `localStorage` |
| Linha do CTA ficou branca | Equipe mudou o fundo da linha no e-mail-base | Ajustar `content.style` da linha reaproveitada |
| Texto estranho num bloco | Edição da equipe em andamento | Perguntar antes de remover; nunca sobrescrever sem ler o JSON atual |

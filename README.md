# rd_station_email_marketing

Skill do Claude Code para criar e-mails marketing e montá-los como e-mail **nativo** no editor de e-mail do RD Station Marketing (editor BEE), com módulos editáveis pela equipe.

## O que cobre
- Separar o texto do briefing das orientações ao designer.
- Design system da campanha e preview HTML para aprovação.
- Imagens geradas no Magnific e composições (título no hero, linhas do tempo, legendas) via Chrome headless.
- Montagem no BEE por API (`load`/`save`), clonando módulos de um e-mail existente.
- Ajustes de mobile e verificação depois de salvar.

## Estrutura
```
SKILL.md                    processo completo
references/bee-api.md       snippets do editor BEE e formato do JSON
references/armadilhas.md    problemas reais e soluções
examples/exemplo-email.js   montagem completa (conteúdo genérico)
scripts/pdf-para-png.swift  extrai páginas de PDF em PNG + texto (PDFKit)
```

## Instalação
Copie a pasta para `~/.claude/skills/rd_station_email_marketing/`.

## Requisitos
Claude in Chrome com o usuário logado no RD Station; conector do Magnific para gerar imagens; macOS (usa `sips`, Swift/PDFKit e Google Chrome headless).

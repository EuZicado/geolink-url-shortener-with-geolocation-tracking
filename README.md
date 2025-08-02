# GeoLink - Encurtador de URL Avançado com Rastreamento de Geolocalização

GeoLink é um encurtador de URL moderno e rico em recursos que captura dados de geolocalização dos visitantes antes de redirecioná-los para a URL original. Construído com Next.js 15, TypeScript e Tailwind CSS.

**Criado por @iitslone** - Siga nas redes sociais:
- 📷 Instagram: @iitslone
- 🎵 TikTok: @iitslone  
- 📺 YouTube: @iitslone
- 🎮 Twitch: @iitslone

## Recursos

- 🔗 **Encurtamento de URL**: Crie links encurtados com códigos únicos
- 🌍 **Rastreamento de Geolocalização**: Capture automaticamente dados de localização dos visitantes
- 📊 **Painel de Análises**: Visualize análises detalhadas e dados dos visitantes
- 🎨 **Interface Moderna**: Design limpo e responsivo com suporte a modo escuro/claro
- ⚡ **Redirecionamentos Rápidos**: Redirecionamento instantâneo com contagem regressiva opcional
- 🔒 **Foco na Privacidade**: Captura de localização requer permissão do usuário
- 📱 **Amigável para Mobile**: Totalmente responsivo em todos os dispositivos

## Como Funciona

1. **Criar Link Encurtado**: Digite sua URL original para gerar um link encurtado
2. **Compartilhar Link**: Compartilhe o link encurtado com outros
3. **Rastrear Visitantes**: Quando alguém clica no link:
   - Sua geolocalização é capturada (com permissão)
   - Dados da visita são registrados para análises
   - Eles são redirecionados para a URL original
4. **Ver Análises**: Acesse análises detalhadas através do painel

## Começando

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd geolink
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:8000](http://localhost:8000) no seu navegador

## Endpoints da API

### Criar Link Encurtado
```http
POST /api/create
Content-Type: application/json

{
  "originalUrl": "https://exemplo.com"
}
```

**Resposta:**
```json
{
  "shortUrl": "http://localhost:8000/abc123",
  "shortCode": "abc123",
  "originalUrl": "https://exemplo.com"
}
```

### Verificar Código Encurtado
```http
GET /api/verify/[shortCode]
```

**Resposta:**
```json
{
  "originalUrl": "https://exemplo.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "visitCount": 5
}
```

### Registrar Dados da Visita
```http
POST /api/log
Content-Type: application/json

{
  "shortCode": "abc123",
  "location": {
    "lat": -23.5505,
    "lng": -46.6333,
    "accuracy": 10
  }
}
```

### Obter Análises
```http
GET /api/analytics
```

**Resposta:**
```json
{
  "abc123": {
    "originalUrl": "https://exemplo.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "logs": [
      {
        "timestamp": "2024-01-01T12:00:00.000Z",
        "location": {
          "lat": -23.5505,
          "lng": -46.6333,
          "accuracy": 10
        },
        "userAgent": "Mozilla/5.0...",
        "ip": "192.168.1.1"
      }
    ]
  }
}
```

## Testando com cURL

### Criar um link encurtado:
```bash
curl -X POST http://localhost:8000/api/create \
     -H "Content-Type: application/json" \
     -d '{"originalUrl": "https://google.com"}' \
     -w "\nHTTP: %{http_code}\nTempo: %{time_total}s\n" | jq '.'
```

### Testar registro:
```bash
curl -X POST http://localhost:8000/api/log \
     -H "Content-Type: application/json" \
     -d '{"shortCode": "abc123", "location": {"lat": -23.5505, "lng": -46.6333, "accuracy": 10}}' \
     -w "\nHTTP: %{http_code}\nTempo: %{time_total}s\n" | jq '.'
```

### Obter análises:
```bash
curl -X GET http://localhost:8000/api/analytics \
     -w "\nHTTP: %{http_code}\nTempo: %{time_total}s\n" | jq '.'
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── [shortCode]/          # Páginas de redirecionamento dinâmico
│   │   └── page.tsx
│   ├── analytics/            # Painel de análises
│   │   └── page.tsx
│   ├── api/                  # Rotas da API
│   │   ├── analytics/
│   │   ├── create/
│   │   ├── log/
│   │   └── verify/
│   ├── globals.css           # Estilos globais
│   ├── layout.tsx            # Layout raiz
│   └── page.tsx              # Página inicial
├── components/ui/            # Componentes de UI reutilizáveis
├── lib/
│   ├── db.ts                 # Banco de dados em memória
│   └── utils.ts              # Funções utilitárias
└── hooks/                    # Hooks personalizados do React
```

## Componentes Principais

### Banco de Dados (`src/lib/db.ts`)
- Armazenamento em memória para links e análises
- Funções para criar, recuperar e registrar dados
- Geração de códigos encurtados únicos

### Página Inicial (`src/app/page.tsx`)
- Formulário de entrada de URL com validação
- Geração e exibição de links encurtados
- Design moderno e responsivo

### Página de Redirecionamento (`src/app/[shortCode]/page.tsx`)
- Captura de geolocalização com permissão do usuário
- Redirecionamento automático com contagem regressiva
- Tratamento de erros para links inválidos

### Painel de Análises (`src/app/analytics/page.tsx`)
- Visualização abrangente de análises
- Rastreamento de visitas e dados de localização
- Estatísticas em tempo real

## Privacidade e Segurança

- **Geolocalização**: Capturada apenas com permissão explícita do usuário
- **Armazenamento de Dados**: Atualmente em memória (reinicia quando o servidor reinicia)
- **Validação de Entrada**: Todas as entradas são validadas e sanitizadas
- **Tratamento de Erros**: Tratamento gracioso de erros em toda a aplicação

## Personalização

### Estilização
A aplicação usa Tailwind CSS com um sistema de design personalizado. Cores e espaçamento podem ser personalizados em `src/app/globals.css`.

### Geração de Códigos Encurtados
Modifique a função `generateShortCode()` em `src/lib/db.ts` para alterar o formato ou comprimento dos códigos gerados.

### Comportamento de Redirecionamento
Personalize a contagem regressiva e comportamento de redirecionamento em `src/app/[shortCode]/page.tsx`.

## Deploy em Produção

Para uso em produção, considere:

1. **Banco de Dados**: Substitua o armazenamento em memória por um banco de dados persistente (PostgreSQL, MongoDB, etc.)
2. **Cache**: Implemente Redis para melhor performance
3. **Limitação de Taxa**: Adicione limitação de taxa para prevenir abuso
4. **Análises**: Integre com serviços de análises externos
5. **Domínio**: Use um domínio encurtado personalizado para links com marca

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça suas alterações
4. Adicione testes se aplicável
5. Envie um pull request

## Licença

Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

## Suporte

Para suporte, abra uma issue no GitHub ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ por @iitslone**

Siga nas redes sociais para mais projetos:
- 📷 Instagram: @iitslone
- 🎵 TikTok: @iitslone  
- 📺 YouTube: @iitslone
- 🎮 Twitch: @iitslone

# ⚡ Portfólio — Diogo Lopes (@Ruivo82)

Portfólio de alta performance e design editorial moderno, desenvolvido em **Next.js (React JSX)** com animações fluidas em **Three.js** e estilizado com **Tailwind CSS**.

🔗 **Repositório**: [https://github.com/Ruivo82/Portefolio](https://github.com/Ruivo82/Portefolio)

---

## 🚀 Destaques do Projeto

- **Piso 3D com Perspetiva Inclinada**: Renderizado com Three.js nativo, sem flickering, sem bordas bruscas e com transição atmosférica suave para a cor de fundo (`#0c0c0c`).
- **Navegação Integrada**: Navbar minimalista, 100% integrada e transparente no topo da página.
- **Projetos Reais Integrados**:
  - [`ne_estomago`](https://github.com/Ruivo82/ne_estomago) (FiveM / Lua / React)
  - [`FiveM-Event-Fix`](https://github.com/Ruivo82/FiveM-Event-Fix) (Node.js / FiveM)
  - [`RV Studios`](https://rv-studios.tebex.io/) (Tebex / Web Store)
- **Centralização de Dados**: Todas as informações estruturadas em [`src/data/portfolioData.js`](src/data/portfolioData.js).
- **Deploy Automático**: CI/CD configurado através do GitHub Actions para publicação contínua no **GitHub Pages**.

---

## 🛠️ Tecnologias

- **Framework**: [Next.js](https://nextjs.org/) (App Router, JavaScript & JSX)
- **3D & Gráficos**: [Three.js](https://threejs.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Deploy**: GitHub Pages (via GitHub Actions)

---

## 💻 Como Executar Localmente

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acede a [http://localhost:3000](http://localhost:3000) no teu browser.

3. **Compilar para produção (Static Export)**:
   ```bash
   npm run build
   ```
   Os ficheiros otimizados serão gerados na pasta `out/`.

---

## 🌐 Deploy no GitHub Pages

Este repositório está configurado com um workflow em `.github/workflows/deploy.yml`.

Para ativar a publicação automática:
1. Vai ao repositório no GitHub: **Settings** > **Pages**.
2. Na secção **Build and deployment** > **Source**, escolhe **GitHub Actions**.
3. A cada `git push` na branch `main`, o build e deploy serão realizados automaticamente.

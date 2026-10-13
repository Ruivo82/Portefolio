/**
 * Utilitário para sincronizar automaticamente os repositórios públicos do GitHub
 * com o portfólio, permitindo que novos projetos adicionados ao GitHub apareçam
 * instantaneamente sem necessidade de alterar o código manualmente.
 */

const CACHE_KEY = 'portfolio_github_repos_v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos de cache para evitar rate limit do GitHub

/**
 * Normaliza nomes de repositórios para comparar IDs com hífens ou underscores.
 * Ex: 'ne_estomago' === 'ne-estomago' -> 'neestomago'
 */
export function normalizeRepoName(name = '') {
  return name.toLowerCase().replace(/[-_\s]/g, '');
}

/**
 * Deteta a categoria e identificador de filtro adequado para um repositório GitHub
 * com base na linguagem principal, tópicos e convenções de nome (ex: ne_, fivem, bot).
 */
export function detectRepoCategory(repo, lang = 'pt') {
  const name = (repo.name || '').toLowerCase();
  const language = repo.language || '';
  const topics = Array.isArray(repo.topics) ? repo.topics.map((t) => t.toLowerCase()) : [];

  const isFiveM =
    name.startsWith('ne_') ||
    name.startsWith('ne-') ||
    name.includes('fivem') ||
    topics.includes('fivem') ||
    topics.includes('ox_lib');

  const isDiscord =
    name.includes('discord') ||
    name.includes('bot') ||
    topics.includes('discord') ||
    topics.includes('bot');

  if (isFiveM) {
    if (language === 'Lua' || topics.includes('lua')) {
      return { categoryId: 'fivemLua', label: 'FiveM / Lua' };
    }
    return { categoryId: 'fivemNode', label: 'FiveM / Node.js' };
  }

  if (language === 'Lua') {
    return { categoryId: 'fivemLua', label: 'FiveM / Lua' };
  }

  if (isDiscord) {
    return { categoryId: 'discord', label: 'Discord / Bot' };
  }

  if (
    ['JavaScript', 'TypeScript', 'HTML', 'CSS'].includes(language) ||
    topics.includes('react') ||
    topics.includes('nextjs') ||
    topics.includes('web')
  ) {
    return {
      categoryId: 'web',
      label: lang === 'pt' ? 'Web & Aplicações' : 'Web & Apps',
    };
  }

  if (language) {
    return {
      categoryId: language.toLowerCase(),
      label: language,
    };
  }

  return {
    categoryId: 'other',
    label: lang === 'pt' ? 'Outros' : 'Other',
  };
}

/**
 * Procura repositórios públicos do utilizador no GitHub com suporte a cache local.
 */
export async function fetchGitHubRepos(username = 'Ruivo82') {
  if (typeof window === 'undefined') return [];

  // 1. Tentar ler da cache do browser
  try {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (cached.username === username && Date.now() - cached.timestamp < CACHE_TTL && Array.isArray(cached.data)) {
        return cached.data;
      }
    }
  } catch {
    // localStorage inacessível ou corrompido
  }

  // 2. Fazer pedido à API pública do GitHub
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      // Se der erro (ex: 403 Rate Limit), tentar usar cache antiga mesmo expirada
      try {
        const cachedStr = localStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          if (Array.isArray(cached.data)) return cached.data;
        }
      } catch {
        // Ignora
      }
      return [];
    }

    const repos = await res.json();

    if (Array.isArray(repos)) {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            username,
            timestamp: Date.now(),
            data: repos,
          })
        );
      } catch {
        // Ignora erro de quota do localStorage
      }
      return repos;
    }
  } catch (err) {
    console.warn('Erro ao carregar repositórios do GitHub:', err);
  }

  return [];
}

/**
 * Combina os projetos curados e traduzidos com os repositórios reais do GitHub.
 * Garante que projetos novos criados no GitHub apareçam automaticamente.
 */
export function mergeProjectsWithGitHub(curatedProjects = [], gitHubRepos = [], lang = 'pt') {
  if (!Array.isArray(gitHubRepos) || gitHubRepos.length === 0) {
    return curatedProjects;
  }

  const matchedRepoNames = new Set();

  // 1. Processar projetos curados e enriquecer com dados reais do GitHub (estrelas, links)
  const enrichedCurated = curatedProjects.map((project) => {
    const projectIdNorm = normalizeRepoName(project.id);
    const repoMatch = gitHubRepos.find((repo) => {
      const nameNorm = normalizeRepoName(repo.name);
      const urlNorm = (repo.html_url || '').toLowerCase();
      const projUrlNorm = (project.github || '').toLowerCase();
      return nameNorm === projectIdNorm || (projUrlNorm && projUrlNorm === urlNorm);
    });

    if (repoMatch) {
      matchedRepoNames.add(repoMatch.id);
      return {
        ...project,
        stats:
          repoMatch.stargazers_count > 0
            ? `★ ${repoMatch.stargazers_count}`
            : project.stats,
        updatedAt: repoMatch.pushed_at || repoMatch.updated_at,
        isFromGithub: true,
      };
    }

    return project;
  });

  // 2. Criar cartões automáticos para novos repositórios do GitHub que ainda não constem na lista
  const newGithubProjects = [];

  for (const repo of gitHubRepos) {
    // Ignora repositórios já combinados
    if (matchedRepoNames.has(repo.id)) continue;

    // Ignora repositório especial de perfil (Ruivo82/Ruivo82)
    if ((repo.name || '').toLowerCase() === 'ruivo82') continue;

    // Ignora forks por defeito (mostra apenas projetos próprios)
    if (repo.fork) continue;

    // Determinar categoria automática
    const cat = detectRepoCategory(repo, lang);

    // Gerar tags
    const tags = Array.isArray(repo.topics) && repo.topics.length > 0
      ? repo.topics
      : [repo.language, 'GitHub', 'Open Source'].filter(Boolean);

    // Gerar descrição fallback caso o utilizador não tenha preenchido no GitHub
    const defaultDesc =
      lang === 'pt'
        ? `Repositório ${repo.name} em ${repo.language || 'código aberto'} desenvolvido por RV Studios.`
        : `${repo.name} repository in ${repo.language || 'open source'} developed by RV Studios.`;

    newGithubProjects.push({
      id: repo.name.toLowerCase(),
      title: repo.name,
      category: cat.label,
      categoryId: cat.categoryId,
      filterCategory: cat.label,
      description: repo.description || defaultDesc,
      tags: tags,
      github: repo.html_url,
      demo: repo.homepage || repo.html_url,
      featured: false,
      stats:
        repo.stargazers_count > 0
          ? `★ ${repo.stargazers_count}`
          : lang === 'pt'
          ? 'Código Aberto'
          : 'Open Source',
      isAutoSynced: true,
      updatedAt: repo.pushed_at || repo.updated_at,
    });
  }

  // Ordenar novos projetos pelos mais recentemente atualizados no GitHub
  newGithubProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return [...enrichedCurated, ...newGithubProjects];
}

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const configPath = resolve(repositoryRoot, 'client-hub.config.json');
const outputPath = resolve(repositoryRoot, 'website/src/data/client-hub-repositories.generated.json');
const workspaceSlugs = new Set();

const isInside = (basePath, targetPath) => {
  const relativePath = relative(basePath, targetPath);
  return relativePath === '' || (!relativePath.startsWith(`..${sep}`) && relativePath !== '..' && !isAbsolute(relativePath));
};

const runGit = (repositoryPath, args, fallback = '') => {
  try {
    return execFileSync('git', ['-C', repositoryPath, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return fallback;
  }
};

const config = JSON.parse(readFileSync(configPath, 'utf8'));

if (config.version !== 1 || !Array.isArray(config.workspaces)) {
  throw new Error('client-hub.config.json must contain a workspaces array.');
}

const workspaces = config.workspaces.map((workspace) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(workspace.slug ?? '')) {
    throw new Error(`Invalid Client Hub workspace slug: ${workspace.slug ?? '(missing)'}`);
  }
  if (workspaceSlugs.has(workspace.slug)) {
    throw new Error(`Duplicate Client Hub workspace slug: ${workspace.slug}`);
  }
  workspaceSlugs.add(workspace.slug);

  const configuredRepositoryPath = workspace.repositoryPath ?? '.';
  if (isAbsolute(configuredRepositoryPath)) {
    throw new Error(`Repository paths must be relative to the Kramaniti repository: ${configuredRepositoryPath}`);
  }

  const repositoryPath = resolve(repositoryRoot, configuredRepositoryPath);
  if (!isInside(repositoryRoot, repositoryPath)) {
    throw new Error(`Repository path leaves the Kramaniti repository: ${configuredRepositoryPath}`);
  }
  if (!existsSync(repositoryPath) || !statSync(repositoryPath).isDirectory()) {
    throw new Error(`Repository path does not exist: ${workspace.repositoryPath}`);
  }

  const revision = runGit(repositoryPath, ['rev-parse', '--short=12', 'HEAD'], null);
  const branch = runGit(repositoryPath, ['branch', '--show-current'], null);
  const dirty = Boolean(runGit(repositoryPath, ['status', '--porcelain'], ''));
  const repositoryLabel = workspace.repositoryLabel ?? workspace.name;

  if (!Array.isArray(workspace.items)) {
    throw new Error(`Client Hub workspace ${workspace.slug} must contain an items array.`);
  }

  const items = workspace.items.map((item) => {
    if (isAbsolute(item.path ?? '')) {
      throw new Error(`Client Hub item paths must be relative: ${item.path}`);
    }
    const itemPath = resolve(repositoryPath, item.path);
    if (!isInside(repositoryPath, itemPath)) {
      throw new Error(`Configured Client Hub item leaves its repository: ${item.path}`);
    }
    if (!existsSync(itemPath)) {
      throw new Error(`Configured Client Hub item does not exist: ${item.path}`);
    }

    const itemType = item.itemType ?? (statSync(itemPath).isDirectory() ? 'directory' : 'project');
    if (!['repository', 'directory', 'project'].includes(itemType)) {
      throw new Error(`Invalid Client Hub item type for ${item.path}: ${itemType}`);
    }
    if (!['shared', 'internal'].includes(item.visibility)) {
      throw new Error(`Client Hub item visibility must be shared or internal: ${item.path}`);
    }

    const safeRelativePath = relative(repositoryPath, itemPath).split(sep).join('/');

    return {
      sourceKey: `${workspace.slug}:${safeRelativePath}`,
      repositoryLabel,
      repositoryPath: safeRelativePath,
      itemType,
      title: item.title ?? safeRelativePath,
      summary: item.summary ?? '',
      visibility: item.visibility,
      sourceHash: revision,
      metadata: {
        branch,
        dirty,
      },
    };
  });

  return {
    slug: workspace.slug,
    name: workspace.name,
    repositorySummary: {
      repositoryLabel,
      branch,
      revision,
      dirty,
      itemCount: items.length,
    },
    items,
  };
});

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  workspaces,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`Client Hub repository manifest updated: ${workspaces.length} workspace(s).`);

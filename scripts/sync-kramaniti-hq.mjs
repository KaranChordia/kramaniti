import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const configPath = resolve(repositoryRoot, 'kramaniti-hq.config.json');
const outputPath = resolve(repositoryRoot, 'website/src/data/kramaniti-hq-repositories.generated.json');
const slugs = new Set();
const repositoryKeys = new Set();

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

const countLines = (value) => (value ? value.split(/\r?\n/).filter(Boolean).length : 0);

const readRepository = (source) => {
  const repositoryPath = resolve(repositoryRoot, source.repositoryPath);
  if (!existsSync(repositoryPath) || !statSync(repositoryPath).isDirectory()) {
    return {
      slug: source.slug,
      repositoryKey: source.repositoryKey,
      name: source.name,
      available: false,
      versioned: false,
      repositorySummary: {
        repositoryLabel: source.name,
        branch: null,
        revision: null,
        dirty: false,
        dirtyFileCount: 0,
        trackedFileCount: 0,
        lastCommitAt: null,
        lastCommitSubject: null,
        ahead: 0,
        behind: 0,
        itemCount: 0,
      },
      items: [],
    };
  }

  const status = runGit(repositoryPath, ['status', '--porcelain', '--untracked-files=all'], '');
  const versioned = runGit(repositoryPath, ['rev-parse', '--is-inside-work-tree'], '') === 'true';
  const lastCommit = runGit(repositoryPath, ['log', '-1', '--format=%cI%x00%s'], '');
  const [lastCommitAt = null, lastCommitSubject = null] = lastCommit ? lastCommit.split('\0') : [];
  const upstream = runGit(repositoryPath, ['rev-list', '--left-right', '--count', '@{upstream}...HEAD'], '');
  const [behindRaw = '0', aheadRaw = '0'] = upstream.split(/\s+/);
  const branch = runGit(repositoryPath, ['branch', '--show-current'], '') || null;
  const revision = runGit(repositoryPath, ['rev-parse', '--short=12', 'HEAD'], '') || null;
  const dirtyFileCount = countLines(status);
  const repositorySummary = {
    repositoryLabel: source.name,
    branch,
    revision,
    dirty: dirtyFileCount > 0,
    dirtyFileCount,
    trackedFileCount: countLines(runGit(repositoryPath, ['ls-files'], '')),
    lastCommitAt,
    lastCommitSubject,
    ahead: Number.parseInt(aheadRaw, 10) || 0,
    behind: Number.parseInt(behindRaw, 10) || 0,
    itemCount: 1,
  };

  return {
    slug: source.slug,
    repositoryKey: source.repositoryKey,
    name: source.name,
    available: true,
    versioned,
    repositorySummary,
    items: [
      {
        sourceKey: `${source.slug}:.`,
        repositoryLabel: source.name,
        repositoryPath: '.',
        itemType: 'repository',
        title: `${source.name} repository`,
        summary: 'Owner-only repository pulse. File contents, remotes, secrets and absolute paths are excluded.',
        visibility: 'internal',
        sourceHash: revision,
        metadata: {
          branch,
          dirty: dirtyFileCount > 0,
          dirtyFileCount,
          trackedFileCount: repositorySummary.trackedFileCount,
          lastCommitAt,
          lastCommitSubject,
          ahead: repositorySummary.ahead,
          behind: repositorySummary.behind,
        },
      },
    ],
  };
};

const sync = () => {
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.version !== 1 || !Array.isArray(config.repositories) || config.repositories.length > 20) {
    throw new Error('kramaniti-hq.config.json must contain an allowlisted repositories array.');
  }

  const workspaces = config.repositories.map((source) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.slug ?? '')) {
      throw new Error(`Invalid HQ workspace slug: ${source.slug ?? '(missing)'}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.repositoryKey ?? '')) {
      throw new Error(`Invalid HQ repository key: ${source.repositoryKey ?? '(missing)'}`);
    }
    if (!source.name || typeof source.repositoryPath !== 'string') {
      throw new Error(`HQ repository ${source.slug} requires a name and path.`);
    }
    if (isAbsolute(source.repositoryPath)) {
      throw new Error(`HQ repository paths must stay machine-portable and relative: ${source.repositoryPath}`);
    }
    if (slugs.has(source.slug) || repositoryKeys.has(source.repositoryKey)) {
      throw new Error(`Duplicate HQ repository identity: ${source.slug}`);
    }
    slugs.add(source.slug);
    repositoryKeys.add(source.repositoryKey);
    return readRepository(source);
  });

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    privacy: 'sanitized-metadata-only',
    workspaces,
  };

  if (existsSync(outputPath)) {
    try {
      const previous = JSON.parse(readFileSync(outputPath, 'utf8'));
      if (JSON.stringify(previous.workspaces) === JSON.stringify(manifest.workspaces)) {
        console.log(`Kramaniti HQ repository pulse unchanged: ${workspaces.length} repositories.`);
        return;
      }
    } catch {
      // A malformed generated file is safely replaced below.
    }
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Kramaniti HQ repository pulse updated: ${workspaces.length} repositories.`);
};

sync();

if (process.argv.includes('--watch')) {
  console.log('Watching the allowlisted repositories every 60 seconds. Press Ctrl+C to stop.');
  setInterval(sync, 60_000).unref?.();
  await new Promise(() => undefined);
}

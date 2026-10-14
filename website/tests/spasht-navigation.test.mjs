import { test } from 'node:test';
import assert from 'node:assert/strict';
import { workspaceViews, workspaceToolGroups, parseWorkspaceView, workspaceViewUrl } from '../src/lib/spasht/navigation.ts';

test('all restored supporting views have a distinct URL and can round-trip', () => {
  for (const view of workspaceViews) {
    const url = new URL(workspaceViewUrl('/spasht/', view), 'https://example.test');
    assert.equal(parseWorkspaceView(url.searchParams.get('view')), view);
  }
});

test('legacy links and invalid views resolve predictably', () => {
  assert.equal(parseWorkspaceView('circle'), 'community');
  assert.equal(parseWorkspaceView('square'), 'community');
  assert.equal(parseWorkspaceView('privacy'), 'memory');
  assert.equal(parseWorkspaceView('account'), 'settings');
  assert.equal(parseWorkspaceView('tools'), 'more');
  for (const value of ['toString', '__proto__', '<script>', 'unknown', null, {}]) assert.equal(parseWorkspaceView(value), 'home');
});

test('tools preserve the project and selected tab without leaking them into Home', () => {
  const url = new URL(workspaceViewUrl('/spasht/', 'loops', 'owned-project', 'steps'), 'https://example.test');
  assert.equal(url.searchParams.get('view'), 'loops');
  assert.equal(url.searchParams.get('project'), 'owned-project');
  assert.equal(url.searchParams.get('tab'), 'steps');
  assert.equal(workspaceViewUrl('/spasht/', 'home', 'owned-project'), '/spasht/');
});

test('the tool directory has no duplicate destinations and includes the former feature areas', () => {
  const views = workspaceToolGroups.flatMap(group => group.items.map(item => item.id));
  assert.equal(new Set(views).size, views.length);
  for (const view of ['path', 'context', 'loops', 'tasks', 'assistant', 'files', 'overview', 'memory', 'community']) assert.ok(views.includes(view));
  assert.ok(!views.includes('home') && !views.includes('projects'));
});

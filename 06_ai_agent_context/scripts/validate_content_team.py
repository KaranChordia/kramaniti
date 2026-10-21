"""Structural checks for the publication-aware team, using Python stdlib only.

Does not fetch URLs or certify account identity. Run from any working directory.
"""
import copy
import json
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]


def web_url(value):
    return isinstance(value, str) and urlparse(value).scheme == 'https' and bool(urlparse(value).netloc)


def registry_errors(data):
    errors = []
    items = data.get('items', [])
    ids = [item.get('id') for item in items]
    if len(set(ids)) != len(ids):
        errors.append('Duplicate content IDs')
    for item in items:
        cid = item.get('id', '<missing>')
        if not cid or not isinstance(item.get('revision'), int) or item['revision'] < 1:
            errors.append(f'{cid}: missing ID or positive revision')
        if item.get('stage') not in {'idea', 'brief', 'draft', 'generated', 'reviewed', 'retired'}:
            errors.append(f'{cid}: invalid production stage; publication lives in separate records')
        if item.get('stage') == 'generated' and not item.get('asset_paths'):
            errors.append(f'{cid}: generated item requires an actual asset')
        for name in item.get('asset_paths', []):
            target = (ROOT / name).resolve()
            if not target.is_relative_to(ROOT) or not target.is_file():
                errors.append(f'{cid}: missing or non-repository asset {name}')
        for approval in item.get('publication_approvals', []):
            required = ['revision', 'channel', 'account_url', 'action', 'approved_at', 'evidence']
            if any(not approval.get(k) for k in required):
                errors.append(f'{cid}: approval lacks revision/channel/account/action/date/evidence')
            elif approval['revision'] != item['revision']:
                errors.append(f'{cid}: approval is for a stale revision')
            elif approval['channel'] not in item.get('channels', []) or not web_url(approval['account_url']):
                errors.append(f'{cid}: approval account or channel invalid')
            elif approval['action'] not in {'publish', 'schedule'}:
                errors.append(f'{cid}: creative feedback is not a publication action')
    publications = data.get('publications', [])
    pids = [p.get('id') for p in publications]
    if len(set(pids)) != len(pids):
        errors.append('Duplicate publication IDs')
    seen = set()
    for publication in publications:
        pid = publication.get('id', '<missing>')
        if publication.get('content_id') is not None and publication['content_id'] not in ids:
            errors.append(f'{pid}: unknown content ID')
        status = publication.get('status')
        if status not in {'verified', 'reported', 'scheduled', 'failed', 'removed', 'unknown'}:
            errors.append(f'{pid}: invalid publication status')
        if status == 'verified':
            if not all(publication.get(k) for k in ['url', 'observed_at', 'evidence', 'account_url']):
                errors.append(f'{pid}: verified publication lacks URL, observation or evidence')
            if not web_url(publication.get('url')) or not web_url(publication.get('account_url')):
                errors.append(f'{pid}: verified publication requires HTTPS URLs')
        if publication.get('url') and status == 'verified':
            key = publication['url'].rstrip('/')
            if key in seen:
                errors.append(f'{pid}: duplicate verified post URL')
            seen.add(key)
        for key in ['published_at', 'observed_at']:
            if publication.get(key):
                try:
                    date.fromisoformat(publication[key])
                except (ValueError, TypeError):
                    errors.append(f'{pid}: {key} must be an ISO date')
    for channel in ['linkedin', 'instagram', 'website']:
        coverage = data.get('coverage', {}).get(channel, {})
        if not coverage:
            errors.append(f'{channel}: missing coverage statement')
        if coverage.get('status') in {'partial', 'complete'} and not all(coverage.get(k) for k in ['account_url', 'checked_at', 'window']):
            errors.append(f'{channel}: inspected coverage requires account, date and window')
    return errors


def team_errors():
    errors = []
    folder = ROOT / '06_ai_agent_context/agents'
    schema = json.loads((folder / 'agent_schema.json').read_text())
    all_ids = {json.loads(p.read_text()).get('id') for p in folder.glob('*.json') if p.name != 'agent_schema.json'}
    for name in ['digital_presence_orchestrator', 'content_director', 'distribution_analytics_agent']:
        d = json.loads((folder / (name + '.json')).read_text())
        for required in schema['required']:
            if required not in d:
                errors.append(f'{name}: missing config key {required}')
        # Existing agent files use $schema as editor metadata; this check accepts it.
        extras = set(d) - set(schema['properties']) - {'$schema'}
        if extras:
            errors.append(f'{name}: unknown configuration keys {sorted(extras)}')
        for support in d.get('supporting_agents', []):
            if support not in all_ids:
                errors.append(f'{name}: unknown supporting agent {support}')
        for task in d.get('recurring_tasks', []):
            if task.get('frequency') not in {'per_request', 'daily', 'weekly', 'monthly', 'as_needed'}:
                errors.append(f'{name}: invalid recurring task frequency')
        for mode in d.get('specialist_modes', []):
            if mode.get('parent_agent') != name:
                errors.append(f'{name}: specialist parent mismatch')
    routes = json.loads((ROOT / '06_ai_agent_context/routing/task_router.json').read_text())['routing_matrix']
    route = next((r for r in routes if r['intent'] == 'publication_aware_content_team'), None)
    if not route or route['lead_agent'] != 'digital_presence_orchestrator':
        errors.append('Missing content-team route')
    for r in routes:
        for ref in [r['lead_agent'], *r.get('supporting_agents', [])]:
            if ref not in all_ids:
                errors.append(f"Route {r['intent']} references missing agent {ref}")
    return errors


def guard_checks(data):
    """Check material false-publication/approval cases with isolated fixtures."""
    bad = copy.deepcopy(data)
    bad['publications'][0]['url'] = None
    assert registry_errors(bad), 'Missing live evidence was accepted'
    bad = copy.deepcopy(data)
    bad['items'][0]['stage'] = 'published'
    assert registry_errors(bad), 'Production state incorrectly allowed global publication'
    bad = copy.deepcopy(data)
    bad['items'][0]['publication_approvals'] = [{'revision': 1, 'action': 'looks_good'}]
    assert registry_errors(bad), 'Creative approval incorrectly accepted as publication authority'
    bad = copy.deepcopy(data)
    bad['items'][0]['publication_approvals'] = [{'revision': 2, 'channel': 'linkedin', 'account_url': 'https://www.linkedin.com/company/example/', 'action': 'publish', 'approved_at': '2026-10-15', 'evidence': 'fixture only'}]
    assert registry_errors(bad), 'Stale revision approval was accepted'


if __name__ == '__main__':
    data = json.loads((ROOT / '04_content_system/content_registry.json').read_text())
    errors = registry_errors(data) + team_errors()
    if errors:
        raise SystemExit('\n'.join(errors))
    guard_checks(data)
    print(f"Content team valid: 3 agent definitions, routing, {len(data['items'])} items, {len(data['publications'])} evidence records; 4 negative guard checks passed.")
    print('Social coverage remains unverified until exact account URLs are supplied. No live URL verification performed by this validator.')

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createDiagnosticSummary,
  createSyntheticRecruitmentWorkflow,
  validateWorkflowWorkspace,
} from './workflowDomain.ts';

test('the synthetic recruitment workflow satisfies the full structured workflow contract', () => {
  const workspace = createSyntheticRecruitmentWorkflow();
  const validation = validateWorkflowWorkspace(workspace);

  assert.equal(validation.errors.length, 0);
  assert.equal(validation.value?.workflow.steps.length, 10);
  assert.equal(validation.value?.workflow.steps.some((step) => step.classification === 'ai_assisted'), true);
});

test('validation rejects a workflow with an unowned approval step but no recorded ambiguity', () => {
  const workspace = createSyntheticRecruitmentWorkflow();
  workspace.workflow.issues = workspace.workflow.issues.filter((issue) => issue.type !== 'ownership_ambiguity');

  const validation = validateWorkflowWorkspace(workspace);

  assert.equal(validation.value, null);
  assert.match(validation.errors.join(' '), /ownership ambiguity/i);
});

test('the diagnostic summary retains the current-state, bottleneck, and measurement context', () => {
  const summary = createDiagnosticSummary(createSyntheticRecruitmentWorkflow());

  assert.match(summary, /10-step/);
  assert.match(summary, /Priority bottleneck/);
  assert.match(summary, /measurable improvement metric/i);
});

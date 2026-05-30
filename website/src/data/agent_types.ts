export type AgentLayer = 'leadership' | 'strategy' | 'delivery' | 'growth' | 'governance';
export type AgentStatus = 'active' | 'standby' | 'planned';

export interface AgentVoice {
  tone: string[];
  style: string[];
  avoids: string[];
}

export interface RecurringTask {
  task: string;
  frequency: string;
  outputs: string[];
}

export interface SpecialistMode {
  id: string;
  name: string;
  parent_agent: string;
  personality: string[];
  role: string;
  tasks: string[];
}

export interface AgentFrontend {
  icon: string;
  color: string;
  description: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  business_analogue: string;
  layer: AgentLayer;
  personality: string[];
  voice: AgentVoice;
  goals: string[];
  recurring_tasks: RecurringTask[];
  memory_sources?: string[];
  owned_files?: string[];
  inputs: string[];
  outputs: string[];
  supporting_agents?: string[];
  escalation_triggers: string[];
  hard_constraints: string[];
  specialist_modes?: SpecialistMode[];
  status: AgentStatus;
  frontend: AgentFrontend;
}

export interface TaskBrief {
  id: string;
  title: string;
  description: string;
  lead_agent: string;
  supporting_agents: string[];
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  created_at: string;
}

export interface AgentResponse {
  task_id: string;
  agent_id: string;
  content: string;
  updated_files?: string[];
  timestamp: string;
}

export interface EscalationRequest {
  id: string;
  agent_id: string;
  task_id: string;
  reason: string;
  options: string[];
  status: 'pending' | 'resolved';
}

export interface HandoffNote {
  from_agent: string;
  to_agent: string;
  task_id: string;
  context: string;
  timestamp: string;
}

export interface MemoryUpdate {
  agent_id: string;
  file_path: string;
  summary: string;
  timestamp: string;
}

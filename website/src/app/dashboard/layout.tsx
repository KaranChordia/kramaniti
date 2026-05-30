import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      {/* 
        This is a placeholder for the future Agent Dashboard layout.
        It will contain a sidebar with navigation to:
        - /dashboard (Overview)
        - /dashboard/agents (Agent Roster)
        - /dashboard/chat (Talk to Agents)
        - /dashboard/tasks (Task Board)
        - /dashboard/approvals (Pending Approvals)
      */}
      <div className="dashboard-sidebar" style={{ width: '250px', float: 'left', height: '100vh', borderRight: '1px solid var(--border-subtle)', padding: '2rem' }}>
        <h2>Kramaniti OS</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <a href="/kramaniti/dashboard">Overview</a>
          <a href="/kramaniti/dashboard/agents">Agents</a>
          <a href="/kramaniti/dashboard/chat">Chat</a>
          <a href="/kramaniti/dashboard/tasks">Tasks</a>
          <a href="/kramaniti/dashboard/approvals">Approvals</a>
        </nav>
      </div>
      <div className="dashboard-content" style={{ marginLeft: '250px', padding: '2rem' }}>
        {children}
      </div>
    </div>
  );
}

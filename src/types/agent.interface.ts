export interface Agent {
  id: string;
  name: string;
  metadata: AgentMetadata;
}

export interface AgentMetadata {
  lingo: string;
  traits: string[];
}

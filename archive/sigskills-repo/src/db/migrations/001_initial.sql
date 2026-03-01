-- Initial migration: Create core database schema
-- Migration version: 001
-- Created: 2025-12-21

-- Skills table - stores all indexed skills from various sources
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  format TEXT NOT NULL CHECK(format IN ('claude', 'codex', 'universal')),

  source_type TEXT NOT NULL CHECK(source_type IN ('local', 'github', 'codex', 'custom', 'generated')),
  source_path TEXT,
  source_repo TEXT,
  source_branch TEXT,
  source_commit TEXT,
  source_url TEXT,

  metadata TEXT NOT NULL DEFAULT '{}',
  embedding BLOB,
  checksum TEXT NOT NULL,

  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_synced_at INTEGER,

  UNIQUE(name, source_type, source_path)
);

-- MCP Tools table
CREATE TABLE IF NOT EXISTS mcp_tools (
  id TEXT PRIMARY KEY,
  server_name TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  description TEXT NOT NULL,
  parameters TEXT NOT NULL DEFAULT '{}',
  source TEXT NOT NULL,
  embedding BLOB,

  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE(server_name, tool_name)
);

-- Sources table
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('local', 'github', 'codex', 'custom')),
  path TEXT,
  repo TEXT,
  branch TEXT,
  url TEXT,
  config TEXT NOT NULL DEFAULT '{}',
  enabled INTEGER NOT NULL DEFAULT 1,
  skill_count INTEGER NOT NULL DEFAULT 0,
  last_synced_at INTEGER,

  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE(type, path, repo)
);

-- Sync state table
CREATE TABLE IF NOT EXISTS sync_state (
  skill_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  checksum TEXT NOT NULL,
  synced_at INTEGER NOT NULL DEFAULT (unixepoch()),

  PRIMARY KEY (skill_id, source_id),
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_source_type ON skills(source_type);
CREATE INDEX IF NOT EXISTS idx_skills_checksum ON skills(checksum);
CREATE INDEX IF NOT EXISTS idx_skills_updated_at ON skills(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_format ON skills(format);

-- Full-text search for skills
CREATE VIRTUAL TABLE IF NOT EXISTS skills_fts USING fts5(
  name,
  description,
  content,
  content=skills,
  content_rowid=rowid
);

CREATE TRIGGER IF NOT EXISTS skills_fts_insert AFTER INSERT ON skills BEGIN
  INSERT INTO skills_fts(rowid, name, description, content)
  VALUES (new.rowid, new.name, new.description, new.content);
END;

CREATE TRIGGER IF NOT EXISTS skills_fts_delete AFTER DELETE ON skills BEGIN
  DELETE FROM skills_fts WHERE rowid = old.rowid;
END;

CREATE TRIGGER IF NOT EXISTS skills_fts_update AFTER UPDATE ON skills BEGIN
  DELETE FROM skills_fts WHERE rowid = old.rowid;
  INSERT INTO skills_fts(rowid, name, description, content)
  VALUES (new.rowid, new.name, new.description, new.content);
END;

-- MCP Tools indexes
CREATE INDEX IF NOT EXISTS idx_mcp_tools_server ON mcp_tools(server_name);
CREATE INDEX IF NOT EXISTS idx_mcp_tools_name ON mcp_tools(tool_name);

-- Full-text search for MCP tools
CREATE VIRTUAL TABLE IF NOT EXISTS mcp_tools_fts USING fts5(
  server_name,
  tool_name,
  description,
  content=mcp_tools,
  content_rowid=rowid
);

CREATE TRIGGER IF NOT EXISTS mcp_tools_fts_insert AFTER INSERT ON mcp_tools BEGIN
  INSERT INTO mcp_tools_fts(rowid, server_name, tool_name, description)
  VALUES (new.rowid, new.server_name, new.tool_name, new.description);
END;

CREATE TRIGGER IF NOT EXISTS mcp_tools_fts_delete AFTER DELETE ON mcp_tools BEGIN
  DELETE FROM mcp_tools_fts WHERE rowid = old.rowid;
END;

CREATE TRIGGER IF NOT EXISTS mcp_tools_fts_update AFTER UPDATE ON mcp_tools BEGIN
  DELETE FROM mcp_tools_fts WHERE rowid = old.rowid;
  INSERT INTO mcp_tools_fts(rowid, server_name, tool_name, description)
  VALUES (new.rowid, new.server_name, new.tool_name, new.description);
END;

-- Sources indexes
CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(type);
CREATE INDEX IF NOT EXISTS idx_sources_enabled ON sources(enabled);
CREATE INDEX IF NOT EXISTS idx_sources_last_synced ON sources(last_synced_at);

-- Sync state indexes
CREATE INDEX IF NOT EXISTS idx_sync_state_source ON sync_state(source_id);
CREATE INDEX IF NOT EXISTS idx_sync_state_synced_at ON sync_state(synced_at DESC);

-- Auto-update timestamps
CREATE TRIGGER IF NOT EXISTS update_skills_timestamp
AFTER UPDATE ON skills
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE skills SET updated_at = unixepoch() WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_sources_timestamp
AFTER UPDATE ON sources
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE sources SET updated_at = unixepoch() WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_mcp_tools_timestamp
AFTER UPDATE ON mcp_tools
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE mcp_tools SET updated_at = unixepoch() WHERE id = NEW.id;
END;

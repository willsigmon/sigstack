-- SigSkills SQLite Schema
-- Local-first skill and MCP tool indexing with semantic search support

-- Skills table - stores all indexed skills from various sources
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,                    -- UUID or hash
  name TEXT NOT NULL,                     -- Skill name (e.g., "commit", "review-pr")
  description TEXT NOT NULL,              -- Brief description for search
  content TEXT NOT NULL,                  -- Full skill prompt/template
  format TEXT NOT NULL CHECK(format IN ('claude', 'codex', 'universal')),

  -- Source information
  source_type TEXT NOT NULL CHECK(source_type IN ('local', 'github', 'codex', 'custom', 'generated')),
  source_path TEXT,                       -- Local file path
  source_repo TEXT,                       -- GitHub repo URL
  source_branch TEXT,                     -- Git branch
  source_commit TEXT,                     -- Git commit hash
  source_url TEXT,                        -- Custom URL

  -- Metadata as JSON
  metadata TEXT NOT NULL DEFAULT '{}',    -- JSON: { author, version, tags, category, dependencies, mcp_tools, created_at, updated_at, last_used, usage_count }

  -- Semantic search support
  embedding BLOB,                         -- Vector embedding for semantic search

  -- Change detection
  checksum TEXT NOT NULL,                 -- SHA-256 hash for change detection

  -- Timestamps
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_synced_at INTEGER,

  UNIQUE(name, source_type, source_path)  -- Prevent duplicates from same source
);

-- MCP Tools table - stores indexed MCP tools from configured servers
CREATE TABLE IF NOT EXISTS mcp_tools (
  id TEXT PRIMARY KEY,                    -- server_name:tool_name hash
  server_name TEXT NOT NULL,              -- e.g., "sosumi", "github", "memory"
  tool_name TEXT NOT NULL,                -- e.g., "searchAppleDocumentation"
  description TEXT NOT NULL,

  -- JSON Schema for tool parameters
  parameters TEXT NOT NULL DEFAULT '{}',  -- JSON schema object

  -- Source information
  source TEXT NOT NULL,                   -- Server config path or URL

  -- Semantic search support
  embedding BLOB,                         -- Vector embedding for semantic search

  -- Timestamps
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE(server_name, tool_name)
);

-- Sources table - manages skill sources (local dirs, GitHub repos, etc.)
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,                    -- UUID
  type TEXT NOT NULL CHECK(type IN ('local', 'github', 'codex', 'custom')),

  -- Local source
  path TEXT,                              -- Local directory path

  -- GitHub source
  repo TEXT,                              -- GitHub repo URL
  branch TEXT,                            -- Git branch

  -- Custom source
  url TEXT,                               -- Custom registry URL

  -- Configuration as JSON
  config TEXT NOT NULL DEFAULT '{}',      -- JSON: { watch, sync_interval, auth, etc. }

  -- State
  enabled INTEGER NOT NULL DEFAULT 1,     -- 0 or 1 (boolean)
  skill_count INTEGER NOT NULL DEFAULT 0, -- Cached count
  last_synced_at INTEGER,

  -- Timestamps
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE(type, path, repo)                -- Prevent duplicate sources
);

-- Sync state table - tracks sync status between skills and sources
CREATE TABLE IF NOT EXISTS sync_state (
  skill_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  checksum TEXT NOT NULL,                 -- Last known checksum
  synced_at INTEGER NOT NULL DEFAULT (unixepoch()),

  PRIMARY KEY (skill_id, source_id),
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
);

-- Indexes for performance

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_source_type ON skills(source_type);
CREATE INDEX IF NOT EXISTS idx_skills_checksum ON skills(checksum);
CREATE INDEX IF NOT EXISTS idx_skills_updated_at ON skills(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_format ON skills(format);

-- Full-text search support for skills (keyword fallback)
CREATE VIRTUAL TABLE IF NOT EXISTS skills_fts USING fts5(
  name,
  description,
  content,
  content=skills,
  content_rowid=rowid
);

-- Triggers to keep FTS index in sync
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

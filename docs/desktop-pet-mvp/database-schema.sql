-- 桌面级猫咪宠物 MVP 数据库草案

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  uuid VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(128),
  nickname VARCHAR(64),
  avatar_url TEXT,
  locale VARCHAR(16) DEFAULT 'zh-CN',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE devices (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  device_id VARCHAR(128) NOT NULL,
  os_type VARCHAR(16) NOT NULL,
  os_version VARCHAR(32),
  app_version VARCHAR(32),
  last_seen_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

CREATE TABLE pets (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  name VARCHAR(64) NOT NULL,
  species VARCHAR(16) NOT NULL DEFAULT 'cat',
  style_type VARCHAR(32) NOT NULL DEFAULT '2d_chibi',
  mood_default VARCHAR(16) DEFAULT 'calm',
  level INT DEFAULT 1,
  intimacy_score INT DEFAULT 0,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pets_user_id ON pets(user_id);

CREATE TABLE pet_assets (
  id BIGSERIAL PRIMARY KEY,
  pet_id BIGINT NOT NULL REFERENCES pets(id),
  asset_type VARCHAR(32) NOT NULL,
  asset_url TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  width INT,
  height INT,
  checksum VARCHAR(128),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pet_assets_pet_id ON pet_assets(pet_id);

CREATE TABLE pet_generation_tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  pet_id BIGINT REFERENCES pets(id),
  task_id VARCHAR(64) UNIQUE NOT NULL,
  input_images JSONB NOT NULL,
  pipeline_version VARCHAR(32) NOT NULL,
  status VARCHAR(16) NOT NULL,
  progress INT DEFAULT 0,
  fail_code VARCHAR(32),
  fail_message VARCHAR(255),
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gen_tasks_user_id ON pet_generation_tasks(user_id);
CREATE INDEX idx_gen_tasks_status ON pet_generation_tasks(status);

CREATE TABLE interactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  pet_id BIGINT NOT NULL REFERENCES pets(id),
  interaction_type VARCHAR(32) NOT NULL,
  value INT DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interactions_pet_time ON interactions(pet_id, created_at);

CREATE TABLE reminder_settings (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  water_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  water_interval_m INT NOT NULL DEFAULT 60,
  rest_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  rest_interval_m INT NOT NULL DEFAULT 90,
  quiet_mode BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE event_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  device_id VARCHAR(128),
  event_name VARCHAR(64) NOT NULL,
  event_props JSONB,
  event_time TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_logs_event_time ON event_logs(event_time);
CREATE INDEX idx_event_logs_event_name ON event_logs(event_name);

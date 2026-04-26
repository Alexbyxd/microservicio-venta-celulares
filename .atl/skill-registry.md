# Skill Registry - microservicio-sis-celulares

Generated: 2026-04-07

## Project-Level Skills

### Backend Skills (priority)

| Skill | Location | Purpose |
|-------|----------|---------|
| nestjs-rabbitmq-microservices-expert | backend/.agents/skills/ | Expert patterns for RabbitMQ microservices |
| nestjs-best-practices | backend/.agents/skills/ | NestJS DTOs, DI, Testing, Security |
| rabbitmq-expert | backend/.agents/skills/ | RabbitMQ specific patterns |
| skill-creator | backend/.agents/skills/ | Creating AI skills |

### Frontend Skills (priority)

| Skill | Location | Purpose |
|-------|----------|---------|
| next-best-practices | frontend/.agent/skills/ | Next.js App Router patterns |
| next-best-practices | frontend/.agents/skills/ | Additional Next.js rules |
| shadcn | frontend/.agents/skills/ | Shadcn UI components |
| ui-ux-pro-max | frontend/.agents/skills/ | Advanced UI/UX patterns |

## User-Level Skills ( ~/.config/opencode/skills/ )

### SDD Workflow Skills

| Skill | Purpose |
|-------|---------|
| sdd-init | Initialize SDD context |
| sdd-explore | Explore ideas before committing |
| sdd-propose | Create change proposal |
| sdd-spec | Write specifications |
| sdd-design | Create technical design |
| sdd-tasks | Break down into tasks |
| sdd-apply | Implement tasks |
| sdd-verify | Validate implementation |
| sdd-archive | Archive completed change |
| sdd-onboard | Guided SDD walkthrough |

### Helper Skills

| Skill | Purpose |
|-------|---------|
| issue-creation | Create GitHub issues |
| branch-pr | PR workflow |
| judgment-day | Adversarial review |
| skill-creator | Create new AI skills |
| go-testing | Go testing patterns |
| find-docs | Context7 documentation |
| find-skills | Discover skills |

### Internal Skills (__shared)

| Skill | Purpose |
|-------|---------|
| engram-convention | Engram persistence format |
| openspec-convention | File-based persistence |
| persistence-contract | Persistence modes |
| skill-resolver | Skill loading logic |
| sdd-phase-common | Shared phase instructions |

## Convention Files (Project)

| File | Purpose |
|------|---------|
| backend/AGENT.md | Backend rules + RabbitMQ docs |
| frontend/AGENT.md | Frontend Next.js rules |
| backend/.agents/rules/arch.md | Architecture details |
| backend/.agents/rules/standards.md | NestJS standards |
| backend/.agents/rules/infra.md | Development infra |
| backend/.agents/rules/api.md | API documentation |
| backend/.agents/rules/testing.md | Testing rules |

## Notes

- Project uses dual architecture: NestJS microservices + Next.js frontend
- RabbitMQ as message broker (3 microservices + gateway)
- Two databases: PostgreSQL (auth) + MongoDB (catalog)
- Skills prioritized by project level first, then user level
- User-level SDD skills are standard (not project-specific)
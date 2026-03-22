# OctoMetrics API Documentation

## Base URL
```
https://octometrics.vercel.app
```

## Authentication
No authentication required. Rate limiting applies (100 requests/minute per IP).

## Response Types

### SVG Response (Success)
- **Content-Type**: `image/svg+xml`
- **Cache**: `public, max-age=21600` (6 hours)
- **Body**: Valid SVG document

### Error Response
- **Content-Type**: `image/svg+xml`
- **Content**: Error SVG with message
- **HTTP Status**: 200 (SVG content always returned)

## Endpoints

### 1. User Stats Card
Returns GitHub user statistics in SVG format.

**Endpoint**: `GET /api/stats`

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| username | string | Yes | - | GitHub username |
| theme | string | No | dark | Color theme (dark, light, tokyonight, dracula) |

**Example**:
```bash
curl "https://api.octometrics.dev/api/stats?username=octocat&theme=dark"
```

**Response**: SVG with user stats
```xml
<svg>
  <!-- Displays: repos count, followers, following, contributions, etc. -->
</svg>
```

**Caching**: 6 hours
**Rate Limit**: 100 requests/minute per IP

---

### 2. Programming Languages
Returns top programming languages used by the user.

**Endpoint**: `GET /api/languages`

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| username | string | Yes | - | GitHub username |
| theme | string | No | dark | Color theme |
| top | integer | No | 5 | Number of languages to show (only applies if view=top) |
| layout | string | No | bar | Layout style (`bar` or `circle`) |
| view | string | No | top | Language view (`top` or `all`) |

**Example**:
```bash
curl "https://api.octometrics.dev/api/languages?username=octocat&theme=dark&top=10"
```

**Response**: SVG with language statistics
```xml
<svg>
  <!-- Displays: JavaScript 45%, TypeScript 30%, Python 15%, etc. -->
</svg>
```

**Caching**: 6 hours
**Rate Limit**: 100 requests/minute per IP

---

### 3. Repositories
Returns top repositories created by the user.

**Endpoint**: `GET /api/repos`

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| username | string | Yes | - | GitHub username |
| theme | string | No | dark | Color theme |
| count | integer | No | 6 | Number of repos to show |
| sort | string | No | stars | Sort order (stars, forks, watchers, updated) |

**Example**:
```bash
curl "https://api.octometrics.dev/api/repos?username=octocat&theme=dark&top=6&sort=stars"
```

**Response**: SVG with repository cards
```xml
<svg>
  <!-- Displays: Repository name, stars, forks, description -->
</svg>
```

**Caching**: 6 hours
**Rate Limit**: 100 requests/minute per IP

---

### 4. GitHub Banner
Returns a decorative banner with user profile information.

**Endpoint**: `GET /api/banner`

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| name | string | Yes | - | Display name |
| title | string | No | - | Sub-title text (e.g., Developer) |
| subtitle | string | No | - | Smaller sub-text |
| tech | string | No | - | Comma-separated tech stack (e.g., `JS,React,Go`) |
| location | string | No | - | Location (shows 📍 icon) |
| social | string | No | - | Comma-separated social links |
| pattern | string | No | dots | Background pattern (`dots`, `grid`, `none`) |
| wave | boolean| No | true | Show animated wave at bottom |
| align | string | No | center | Text alignment (`center` or `left`) |
| theme | string | No | dark | Color theme |

**Example**:
```bash
curl "https://api.octometrics.dev/api/banner?username=octocat&theme=dark&title=GitHub%20Profile"
```

**Response**: SVG banner
```xml
<svg>
  <!-- Decorative banner with profile info -->
</svg>
```

**Caching**: 6 hours
**Rate Limit**: 100 requests/minute per IP

---

### 5. Typing Speed
Returns animated typing indicator with customizable text lines.

**Endpoint**: `GET /api/typing`

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| lines | string | Yes | - | Comma-separated lines to type (e.g., "Hello,World") |
| speed | integer | No | 80 | Typing speed in characters per second (1-200) |
| pause | integer | No | 1000 | Pause between lines in milliseconds (100-5000) |
| theme | string | No | dark | Color theme |

**Example**:
```bash
curl "https://api.octometrics.dev/api/typing?lines=Coding+in+JavaScript,Building+awesome+projects&speed=80&pause=1000&theme=dark"
```

**Response**: Animated SVG
```xml
<svg>
  <!-- Displays: Animated typing indicator with custom text -->
</svg>
```

**Caching**: 3 hours (animated content refreshes more frequently)
**Rate Limit**: 100 requests/minute per IP

---

### 6. Metric Badges
Returns badges for followers or repository metrics.

**Endpoint**: `GET /api/badges/:type`

**Path Parameters**:
| Parameter | Type | Required | Values | Description |
|-----------|------|----------|--------|-------------|
| type | string | Yes | followers, stars, forks, license, repo | Badge type |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user | string | Conditional | GitHub username (required for followers badge) |
| repo | string | Conditional | GitHub repository in format owner/repo (required for other badge types) |
| credit | boolean | No | Set to `true` to show attribution footer |
| credit_text | string | No | Custom attribution text |
| credit_link | string | No | Custom attribution link |

**Examples**:
```bash
# Followers badge
curl "https://api.octometrics.dev/api/badges/followers?user=octocat"

# Stars badge
curl "https://api.octometrics.dev/api/badges/stars?repo=torvalds/linux"

# Repository name badge
curl "https://api.octometrics.dev/api/badges/repo?repo=nikhilmnk/octometrics"

# License badge
curl "https://api.octometrics.dev/api/badges/license?repo=nikhilmnk/octometrics"
```

**Response**: SVG badge
```xml
<svg width="200" height="50">
  <!-- Badge with metric -->
</svg>
```

**Caching**: 6 hours
**Rate Limit**: 100 requests/minute per IP

---

### 7. Custom Badge
Returns custom text badges using the singular `badge` API.

**Endpoint**: `GET /api/badge/:badge`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| badge | string | Yes | Badge slug in the format `label-color` |

**Badge Path Format**:
- The last `-` separated segment is treated as the color.
- Everything before the final color segment becomes the badge label.
- Use `_` instead of spaces in the path.

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| style | string | No | flat | Badge style (`flat` or `for-the-badge`) |
| message | string | No | - | Optional second segment text |
| credit | boolean | No | false | Set to `true` to show attribution footer |
| credit_text | string | No | project default | Custom attribution text |
| credit_link | string | No | project default | Custom attribution link |

**Examples**:
```bash
# Single-segment custom badge
curl "https://api.octometrics.dev/api/badge/JavaScript-yellow?style=for-the-badge"

# Two-segment custom badge
curl "https://api.octometrics.dev/api/badge/Build-passing?style=flat&message=CI"

# Custom badge with attribution
curl "https://api.octometrics.dev/api/badge/Open_Source-blue?style=for-the-badge&credit=true"
```

**Response**: SVG badge
```xml
<svg width="200" height="50">
  <!-- Custom badge text rendered as SVG -->
</svg>
```

**Caching**: 6 hours
**Rate Limit**: 100 requests/minute per IP

---

### 8. Contribution Graph
Returns a GitHub-style contribution graph or 3D isometric visualization.

> **Note:** These endpoints query the GitHub GraphQL API and require a `GITHUB_TOKEN` to be set in your `.env` file. Without it, they will return an error SVG.

**Endpoint**: `GET /api/contributions` or `GET /api/contributions3d`

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| username | string | Yes | - | GitHub username |
| theme | string | No | dark | Color theme |
| year | integer | No | current | Year to display (2015-current) |

**Examples**:
```bash
# 2D contribution graph
curl "https://api.octometrics.dev/api/contributions?username=octocat&theme=dark&year=2024"

# 3D contribution visualization
curl "https://api.octometrics.dev/api/contributions3d?username=octocat&theme=dark"
```

**Response**: SVG contribution graph (2D or 3D)
```xml
<svg>
  <!-- GitHub-style contribution calendar grid or 3D visualization -->
</svg>
```

**Caching**: 3 hours (more volatile data)
**Rate Limit**: 100 requests/minute per IP

---

### 9. Combined Dashboard
Returns a comprehensive dashboard with all user statistics.

**Endpoint**: `GET /api/dashboard`

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| username | string | Yes | - | GitHub username |
| theme | string | No | dark | Color theme |
| layout | string | No | default | Layout style (`default` 2-col, `compact` 1-col, `wide` 3-col) |

**Example**:
```bash
curl "https://api.octometrics.dev/api/dashboard?username=octocat&theme=dark&layout=full"
```

**Response**: Combined SVG dashboard
```xml
<svg>
  <!-- All sections combined: stats, languages, top repos, contributions -->
</svg>
```

**Caching**: 1 hour (multiple data sources, more volatile)
**Rate Limit**: 100 requests/minute per IP

---

## Themes

### Available Themes

#### Dark (Default)
- Background: #0d1117
- Primary: #0366d6
- Text: #c9d1d9
- Accent: #79c0ff

#### Light
- Background: #ffffff
- Primary: #0366d6
- Text: #24292f
- Accent: #0973d0

#### TokyoNight
- Background: #1a1b26
- Primary: #7aa2f7
- Text: #c0caf5
- Accent: #bb9af7

#### Dracula
- Background: #282a36
- Primary: #50fa7b
- Text: #f8f8f2
- Accent: #ff79c6

**Usage**:
```
?theme=dark
?theme=light
?theme=tokyonight
?theme=dracula
```

---

## Health Endpoints

### Health Check (Liveness)
Returns 200 if server is running.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "uptime": 1234,
  "timestamp": "2024-01-15T10:30:45Z",
  "version": "1.0.0"
}
```

---

### Readiness Check
Returns 200 if server is ready for traffic.

**Endpoint**: `GET /ready`

**Response**:
```json
{
  "ready": true,
  "checks": {
    "cache": true,
    "memory": true
  },
  "memory": {
    "heapUsedMB": 45,
    "heapTotalMB": 256,
    "percentUsed": "17.6"
  }
}
```

**Returns 503** if service is not ready (high memory, cache issues, etc.)

---

### Metrics
Returns Prometheus-compatible metrics.

**Endpoint**: `GET /metrics`

**Response**:
```json
{
  "uptime": 1234,
  "memory": {
    "heapUsedMB": 45,
    "heapTotalMB": 256,
    "rssMB": 120
  },
  "cache": {
    "size": 42,
    "calculatedSize": 12345678,
    "percentUsed": "2.47"
  }
}
```

---

## Error Handling

### Invalid Username
```
GET /api/stats?username=invalid@user
Response: SVG with error message
"Error: Invalid username parameter"
```

### User Not Found
```
GET /api/stats?username=nonexistent1234567890
Response: SVG with error message
"Error: GitHub user not found"
```

### Rate Limited
```
HTTP Status: 429 Too Many Requests
Retry-After: 60
```

### Unknown Theme
```
GET /api/stats?username=octocat&theme=invalid
Response: Falls back to 'dark' theme
```

---

## Caching

### Cache Behavior
- **First request**: Fetches from GitHub API (takes ~500-800ms)
- **Cached requests**: Served immediately (<10ms)
- **TTL**: Varies by endpoint
  - Stats, Languages, Repos, Banner, Badge: **6 hours**
  - Typing, Contribution: **3 hours** (more volatile)
  - Dashboard: **1 hour** (multiple sources)

### Cache Invalidation
Cache is invalidated automatically after TTL expires. For manual invalidation, open a GitHub issue.

### Bypass Cache
Add `&cache=false` parameter (development only, respects rate limit):
```
GET /api/stats?username=octocat&cache=false
```

---

## Rate Limiting

### Limits
- **100 requests per minute** per IP address
- **10,000 requests per day** per IP address (soft limit)

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705315845
```

### Exceeding Limits
When rate limit exceeded:
- **HTTP Status**: 429 Too Many Requests
- **Response**: Error SVG with message
- **Retry-After**: Seconds to wait before retry

### Tips to Avoid Rate Limiting
1. Cache responses (browser, CDN, server-side)
2. Batch requests for multiple users
3. Use appropriate cache times (6 hours is reasonable)
4. Implement exponential backoff on retries

---

## Examples

### HTML Embedding
```html
<img src="https://api.octometrics.dev/api/stats?username=octocat&theme=dark" alt="GitHub Stats" />
```

### Markdown
```markdown
![GitHub Stats](https://api.octometrics.dev/api/stats?username=octocat&theme=dark)
```

### React
```jsx
<img 
  src="https://api.octometrics.dev/api/stats?username=octocat&theme=dark" 
  alt="GitHub Stats" 
  loading="lazy"
/>
```

### GitHub README
```markdown
## My GitHub Stats

![Stats](https://api.octometrics.dev/api/stats?username=octocat&theme=dark)
![Languages](https://api.octometrics.dev/api/languages?username=octocat&theme=dark)
![Repos](https://api.octometrics.dev/api/repos?username=octocat&theme=dark)
```

---

## Status Codes

| Code | Meaning | Notes |
|------|---------|-------|
| 200 | OK | Successful request (SVG or JSON) |
| 400 | Bad Request | Invalid parameters |
| 404 | Not Found | GitHub user not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Server error (rendered as error SVG) |
| 503 | Service Unavailable | Server not ready |

---

## Version History

### v1.0.0 (Current)
- Initial release
- 9 main endpoints
- 4 color themes
- Health checks
- Rate limiting
- LRU caching

---

## Support

- **Issues**: [GitHub Issues](https://github.com/username/all-in-one-github-readme-stats/issues)
- **Email**: support@octometrics.dev
- **Documentation**: [Full Docs](https://octometrics.dev/docs)

---

## License

MIT License - See LICENSE file for details

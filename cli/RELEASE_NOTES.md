Shared credentials and improved auth login.

Features:
- Share credentials with the desktop app via `~/.whoami/credentials.json`

Fixes:
- Obfuscate password input during `wai auth login`
- Skip interactive server prompt, default to `localhost:8080`

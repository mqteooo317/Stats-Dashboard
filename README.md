# Player Statistics and Leaderboard System

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github)](https://github.com/mqteooo317)
[![Discord](https://img.shields.io/badge/Discord-User-5865F2?style=for-the-badge&logo=discord)](https://discord.com/users/1279870617197482055)
[![Repository](https://img.shields.io/badge/Repository-Source-0052FF?style=for-the-badge&logo=git)](https://github.com/mqteooo317/Stats-Dashboard)

## Purpose
This system provides a centralized API and web interface for tracking player metrics (kills and deaths). It is specifically designed for integration with Minecraft Bedrock and Java Edition plugins to manage global server leaderboards.

## Authentication
All API interactions require a mandatory security header. Requests without a valid key will be rejected with a `401 Unauthorized` status.

**Required Header:**
`x-api-key: YOUR_SECRET_KEY`

## Deployment
1. Install dependencies: `npm install`
2. Configure the secret key in the source code.
3. Start the service: `npm start`

## Credits
Developed and maintained by:
* **Lead Developer:** mateocollar (mqteooo317)
* **Project Support:** None

## License
Licensed under the MIT License.

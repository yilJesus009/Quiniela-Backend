import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo() {
    return {
      name: 'Quiniela Mundial 2026 API',
      status: 'ok',
      basePath: '/api',
      endpoints: {
        auth: ['/api/register', '/api/login', '/api/logout'],
        profile: ['/api/profile'],
        dashboard: ['/api/dashboard'],
        groups: ['/api/groups'],
        matches: ['/api/matches'],
        predictions: ['/api/predictions/me'],
        stadiums: ['/api/stadiums'],
      },
    };
  }
}

import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global /api en todas las rutas
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  // Validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignora campos no declarados en el DTO
      forbidNonWhitelisted: false,
      transform: true, // convierte tipos automáticamente (string -> number en params)
    }),
  );

  // CORS para el frontend React
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? false : '*',
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

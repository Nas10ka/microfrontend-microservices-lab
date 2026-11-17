import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/common/configure-app';

// Exercise the complete HTTP scaffold without an external database.
describe('Booking service scaffold', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('boots with MongoDB disabled', () => {
    expect(app.get(ConfigService).get('MONGO_ENABLED')).toBe('false');
  });

  it('reports service health', async () => {
    await request(app.getHttpServer())
      .get('/api/bookings/health')
      .expect(200)
      .expect({ status: 'ok', service: 'booking-service', dataSource: 'in-memory-demo' });
  });

  it('returns clearly identified demo events', async () => {
    const response = await request(app.getHttpServer()).get('/api/bookings/events').expect(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'demo-event-1', isDemo: true }),
      expect.objectContaining({ id: 'demo-event-2', isDemo: true }),
    ]));
  });

  it('leaves booking creation unimplemented', async () => {
    await request(app.getHttpServer()).post('/api/bookings').send({}).expect(404);
  });
});

import { Injectable } from '@nestjs/common';

export interface DemoEvent {
  id: string;
  title: string;
  startsAt: string;
  venue: string;
  isDemo: true;
}

@Injectable()
export class EventsService {
  getEvents(): DemoEvent[] {
    // Demo fixtures only. Replace with persistence as a learning exercise.
    return [
      {
        id: 'demo-event-1',
        title: 'Demo — Introduction to NestJS',
        startsAt: '2027-01-15T17:00:00.000Z',
        venue: 'Demo room A',
        isDemo: true,
      },
      {
        id: 'demo-event-2',
        title: 'Demo — TypeScript workshop',
        startsAt: '2027-01-22T17:00:00.000Z',
        venue: 'Demo room B',
        isDemo: true,
      },
    ];
  }
}

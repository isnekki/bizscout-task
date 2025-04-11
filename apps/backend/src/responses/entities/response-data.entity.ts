import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResponseData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  requestPayload: Record<string, any>;

  @Column({ type: 'json' })
  responseBody: Record<string, any>;

  @Column()
  statusCode: number;

  @Column({ type: 'datetime' })
  timestamp: Date;
}

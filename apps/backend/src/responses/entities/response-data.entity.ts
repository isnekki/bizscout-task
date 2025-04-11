import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResponseData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  requestPayload: Record<string, any>;

  @Column({ type: 'jsonb' })
  responseBody: Record<string, any>;

  @Column()
  statusCode: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}

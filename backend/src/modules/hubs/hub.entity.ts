import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hubs')
export class Hub {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ length: 2 })
  province: string;
}

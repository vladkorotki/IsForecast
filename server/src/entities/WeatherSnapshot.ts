import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("weather_snapshots")
@Index(["locationKey", "fetchedAt"])
export class WeatherSnapshot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  locationKey!: string;

  @Column({ type: "varchar", length: 255 })
  locationName!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country!: string | null;

  @Column({ type: "real" })
  latitude!: number;

  @Column({ type: "real" })
  longitude!: number;

  @Column({ type: "text" })
  payload!: string;

  @CreateDateColumn()
  fetchedAt!: Date;
}

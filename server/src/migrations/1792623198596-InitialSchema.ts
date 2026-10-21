import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1792623198596 implements MigrationInterface {
    name = 'InitialSchema1792623198596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "weather_snapshots" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "locationKey" varchar(255) NOT NULL, "locationName" varchar(255) NOT NULL, "country" varchar(100), "latitude" real NOT NULL, "longitude" real NOT NULL, "payload" text NOT NULL, "fetchedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_928ab2c149acc9d96e31263de0" ON "weather_snapshots" ("locationKey", "fetchedAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_928ab2c149acc9d96e31263de0"`);
        await queryRunner.query(`DROP TABLE "weather_snapshots"`);
    }

}

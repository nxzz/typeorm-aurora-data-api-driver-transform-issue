import { DataSource, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm"

@Entity()
export class TestData extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        transformer: {
            from: (from: string) => {
                console.log("transformer from");
                return from.toUpperCase();
            },
            to: (to: string) => {
                console.log("transformer to");
                return to.toLowerCase();
            }
        }
    })
    data: string;
}

const AuroraAppDataSource = new DataSource({
    type: "aurora-mysql",
    database: "testdb",
    secretArn: "SECRET_ARN",
    resourceArn: "RESOURCE_ARN",
    region: "ap-northeast-1",
    entities: [TestData],
    synchronize: false,
    // logging: true,
});
(async () => {
    const testDataRepo = AuroraAppDataSource.getRepository(TestData);
    console.log(await testDataRepo.create({
        data: "SUPER"
    }));
    console.log(await testDataRepo.find());
})();

import { DataSource, Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
class TestData extends BaseEntity {
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
    secretArn: process.env.secretArn,
    resourceArn: process.env.resourceArn,
    region: "ap-northeast-1",
    entities: [TestData],
    synchronize: true,
    // logging: true,
});

(async () => {
    await AuroraAppDataSource.initialize();
    const testDataRepo = AuroraAppDataSource.getRepository(TestData);

    // create
    const testData = new TestData();
    testData.id = 1;
    testData.data = "testdata"
    console.log(await testDataRepo.save(testData));

    // read many
    console.log(await testDataRepo.find({ where: { id: 1 } }));

    // read one
    console.log(await testDataRepo.findOneBy({ id: 1 }));
})();

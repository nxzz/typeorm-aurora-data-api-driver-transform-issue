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

const MysqlAppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: "root",
    password: "root",
    database: "testdb",
    synchronize: true,
    // logging: true,
    entities: [TestData],
    charset: "utf8mb4",
    connectTimeout: 60000
});

(async () => {
    await MysqlAppDataSource.initialize();
    const testDataRepo = MysqlAppDataSource.getRepository(TestData);

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

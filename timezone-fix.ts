import { DateTime, IANAZone, FixedOffsetZone } from 'luxon';
import { ColumnOptions, EntityMetadata, EntitySchema } from "typeorm";

const LOCAL_TZ = 'Asia/Tokyo';

export class OrmOpts {
    static DateTime: ColumnOptions = {
        type: "datetime",
        transformer: {
            // DBから読み込むとき
            from: (from: Date) => {
                if (!from) return from;
                return DateTime.fromJSDate(from, { zone: FixedOffsetZone.utcInstance }).setZone(new IANAZone(LOCAL_TZ));
            },
            // DBへ書き込むとき
            to: (to: DateTime | { _value: any }) => {
                if (!to) return to;
                if (to instanceof DateTime) {
                    return to.setZone(FixedOffsetZone.utcInstance).toJSDate();
                } else {
                    if (Array.isArray(to._value)) {
                        to._value = to._value.map(t => {
                            return t.setZone(FixedOffsetZone.utcInstance).toJSDate();
                        })
                    } else {
                        to._value = to._value.setZone(FixedOffsetZone.utcInstance).toJSDate();
                    }
                    return to;
                }
            }
        }
    };
}
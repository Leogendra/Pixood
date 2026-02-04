import MockDate from "mockdate";
import { getCurrentStreak, getLongestStreak } from "../hooks/useStatistics/Streaks";
import { _generateItem } from './utils';

const testItems = [
    _generateItem({ dateTime: '2021-01-01T12:00:00Z' }),
    _generateItem({ dateTime: '2021-01-02T12:00:00Z' }),
    _generateItem({ dateTime: '2021-01-03T12:00:00Z' }),
    _generateItem({ dateTime: '2021-01-04T12:00:00Z' }),
    _generateItem({ dateTime: '2021-01-05T12:00:00Z' }),

    _generateItem({ dateTime: '2021-01-06T12:00:00Z' }),
    _generateItem({ dateTime: '2021-01-07T12:00:00Z' }),
    _generateItem({ dateTime: '2021-01-08T12:00:00Z' }),

    _generateItem({ dateTime: '2022-01-01T12:00:00Z' }),
    _generateItem({ dateTime: '2022-01-02T12:00:00Z' }),
    _generateItem({ dateTime: '2022-01-03T12:00:00Z' }),

    _generateItem({ dateTime: '2022-01-05T12:00:00Z' }),

    _generateItem({ dateTime: '2022-01-08T12:00:00Z' }),
    _generateItem({ dateTime: '2022-01-09T12:00:00Z' }),
    _generateItem({ dateTime: '2022-01-10T12:00:00Z' }),
    _generateItem({ dateTime: '2022-01-11T12:00:00Z' }),
    _generateItem({ dateTime: '2022-01-12T12:00:00Z' }),
]

describe("utils", () => {
    beforeAll(() => {
        MockDate.set(new Date('2022-01-12'));
    });

    it("getCurrentStreak", () => {
        expect(getCurrentStreak(testItems)).toBe(5)
    });

    it('getLongestStreak', () => {
        expect(getLongestStreak(testItems)).toBe(8)
    });

    it('getCurrentStreak with no data for today', () => {
        expect(getCurrentStreak([
            _generateItem({ date: '2022-01-06' }),
            _generateItem({ date: '2022-01-07' }),
            _generateItem({ date: '2022-01-08' }),
            _generateItem({ date: '2022-01-09' }),
            _generateItem({ date: '2022-01-10' }),
        ])).toBe(0)
    });

    afterAll(() => {
        MockDate.reset();
    })
});
/* globals describe, it */
const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');

describe('searches', () => {
    describe('reportDetailed', () => {
        it('should get detailed report and sum up times', done => {
            const bundle = {
                inputData: {
                    accountId: 1234,
                    startDate: '2021-01-04',
                    endDate:   '2021-01-09'
                },
                authData: {
                    api_token: 'xxxxxxx'
                }
            };

            nock('https://app.tmetric.com')
                .get('/api/reports/detailed')
                .query(bundle.inputData)
                .reply(200, [
                    {
                        "day": "2021-01-01T06:15:00Z",
                        "user": "Peter Pan",
                        "duration": 900000,
                    },
                    {
                        "day": "2021-01-01T08:15:00Z",
                        "user": "Peter Pan",
                        "duration": 1300000,
                    },
                    {
                        "day": "2021-01-02T06:15:00Z",
                        "user": "James Bond",
                        "duration": 900000,
                    },
                ]);

            appTester(App.searches.reportDetailed.operation.perform, bundle)
                .then(results => {
                    console.log(results)
                    expect(results[0]['text']).toBe("Peter Pan 0.61h\nJames Bond 0.25h\n");
                    done();
                })
                .catch(done);
        });
        it('should set the list of client id correctly in the URL', done => {
            const bundle = {
                inputData: {
                    accountId: 1234,
                    startDate: '2021-01-04',
                    endDate:   '2021-01-09',
                    clientList: '111,222,333'
                },
                authData: {
                    api_token: 'xxxxxxx'
                }
            };

            nock('https://app.tmetric.com')
                .get('/api/reports/detailed')
                .query({accountId: 1234,
                    startDate: '2021-01-04',
                    endDate:   '2021-01-09',
                    clientList: ['111','222','333']
                })
                .reply(200, [
                    {
                        "day": "2021-01-01T06:15:00Z",
                        "user": "Peter Pan",
                        "duration": 900000,
                    },
                    {
                        "day": "2021-01-01T08:15:00Z",
                        "user": "Peter Pan",
                        "duration": 1300000,
                    },
                    {
                        "day": "2021-01-02T06:15:00Z",
                        "user": "James Bond",
                        "duration": 900000,
                    },
                ]);
            appTester(App.searches.reportDetailed.operation.perform, bundle)
                .then(results => {
                    console.log(results)
                    expect(results[0]['text']).toBe("Peter Pan 0.61h\nJames Bond 0.25h\n");
                    done();
                })
                .catch(done);
        });
    });
});

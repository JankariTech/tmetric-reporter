module.exports = {
    key: 'reportDetailed',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'detailed Report',
    display: {
        label: 'Get a Detailed Report',
        description: 'get a detailed report for the given time',
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'accountId',
                type: 'integer',
                label: 'account ID',
                helpText:
                    'Your account ID',
            },
            {
                key: 'clientList',
                type: 'string',
                label: 'list of client ids',
                helpText:
                    'comma separated list of clients to filter',
            },
            {
                key: 'startDate',
                type: 'string',
                label: 'start date',
            },
            {
                key: 'endDate',
                type: 'string',
                label: 'end date',
            },
        ],

        perform: (z, bundle) => {
            const url = 'https://app.tmetric.com/api/reports/detailed';
            // Put the search value in a query param. The details of how to build
            // a search URL will depend on how your API works.
            const options = {
                params: {
                    'accountId': bundle.inputData.accountId,
                    'startDate': bundle.inputData.startDate,
                    'endDate': bundle.inputData.endDate,
                },
            };
            if (typeof bundle.inputData.clientList === 'string') {
                options.params.clientList = bundle.inputData.clientList.split(',')
            }

            return z.request(url, options).then((response) => {
                let durations = []
                let output = {}
                output.text = ''
                for(const key in response.data) {
                    if (typeof durations[response.data[key]['user']] === 'undefined') {
                        durations[response.data[key]['user']] = 0
                    }

                    durations[response.data[key]['user']] += parseInt(response.data[key]['duration'])

                }

                for(const user in durations) {
                    durations[user] = parseFloat((durations[user]/3600000).toFixed(2))
                }
                for(const user in durations) {
                    output.text += user + ' ' + durations[user] + 'h\n'
                }
                return [output]
            });
        },

        // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
        // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
        // returned records, and have obviously dummy values that we can show to any user.
        sample:
            {
                text: "Peter Pan 0.61h\nJames Bond 0.25h"
            },
        outputFields: [
            { key: 'text', label: 'formatted text' },
        ],
    },
};

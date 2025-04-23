module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'user',
            password: 'password',
            database: 'calculator_db',
            port: 5432,
        },
        migrations: {
            directory: (__dirname,'src/db/migrations'),
        },
        seeds: {
            directory: (__dirname,'src/db/seeds')
        }
    },
};
module.exports = function (grunt) {
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-simple-mocha');
grunt.loadNpmTasks('grunt-jsdoc');
grunt.initConfig({
    browserify: {
        dist: {
            src: './coordinate-systems.js',
            dest: 'build/coordinate-systems.min.js',
            options: {
                keepalive: true,
                watch: true,
                transform: ['uglifyify']
            },
        }
    },
    simplemocha: {
        options: {
            globals: ['should'],
            timeout: 3000,
            ignoreLeaks: true,
            ui: 'bdd',
            reporter: 'spec'
        },
        all: {
            src: 'test/test.js'
        }
    },
    jsdoc : {
        dist : {
            src: ['*.js'],
            options: {
                destination: 'doc',
                template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
            }
        }
    }
});

grunt.registerTask('test', ['simplemocha']);
grunt.registerTask('doc', ['jsdoc']);
grunt.registerTask('default', ['test', 'browserify', 'jsdoc']);

};